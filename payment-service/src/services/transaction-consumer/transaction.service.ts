import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import dayjs from 'dayjs';
import { LedgerClient } from 'src/client/ledger.client';
import { InquiryRepository } from 'src/repository/inquiryinterface.repository';
import { TicketRepository } from 'src/repository/ticketinterface.repository';
import { TransactionRepository } from 'src/repository/transactioninterface.repository';
import { RabbitmqClientService } from 'src/utils/messaging/rabbitmq.client.service';
import { LedgerStrategyResolver } from '../ledger/ledger-strategy.resolver';
import { Transaction } from 'src/model/transactions.model';

export interface PaymentExecutedEvent {
  inquiryId: string;
  paymentSource: string;
  referenceId: string;
  transactionId: string;
  statusCode: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}
@Injectable()
export class TransactionConsumerService implements OnModuleInit {
  private readonly logger = new Logger(TransactionConsumerService.name); // ✅

  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepo: TransactionRepository,
    @Inject('InquiryRepository')
    private readonly inquiryRepo: InquiryRepository, // ✅ abstraction

    @Inject('TicketRepository')
    private readonly ticketRepo: TicketRepository,

    private readonly ledgerResolver: LedgerStrategyResolver,
    private readonly ledgerClient: LedgerClient,

    private readonly rmq: RabbitmqClientService,
  ) {}

  async onModuleInit() {
    await this.rmq.consume(
      'payment.executed',
      async (data: PaymentExecutedEvent) => {
        this.logger.log('✅Recieved payment.executed:', data);
        const inquiry = await this.inquiryRepo.findById(data.inquiryId);
        await inquiry
          .update({
            status: data.status,
            locked_amount: inquiry.total_amount,
          })
          .catch((e) => console.log(e));
        const transaction = await this.transactionRepo.findById(
          data.transactionId,
        );
        await transaction
          .update({
            status_code: data.statusCode,
            status: data.status,
            status_data: data,
            paid_at: dayjs().toDate(),
          })
          .catch((e) => console.log(e));
        this.ledgerSendTransaction(transaction);

        await this.ticketUpdater(data.status, inquiry.orders);
      },
    );
  }

  public async ledgerSendTransaction(transaction: Transaction) {
    const strategy = this.ledgerResolver.resolve(transaction.payment_method);
    const payload = strategy.buildLedgerPayload({
      transactionId: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      payment_source: transaction.payment_method,
    });
    await this.ledgerClient.postLedger(payload);
  }

  public async ticketUpdater(
    status: 'SUCCESS' | 'FAILED' | 'PENDING',
    orders: Record<string, any>[],
  ) {
    if (status === 'FAILED') {
      for (const order of orders) {
        const ticket = await this.ticketRepo.findTicketById(order.ticket_id);
        ticket.update({
          reserved_quota: ticket.reserved_quota - order.reserving_quota,
        });
      }
      return;
    }

    if (status === 'SUCCESS') {
      for (const order of orders) {
        const ticket = await this.ticketRepo.findTicketById(order.ticket_id);
        ticket.update({
          reserved_quota: ticket.reserved_quota - order.reserving_quota,
          sold_quota: ticket.sold_quota + order.reserving_quota,
        });
      }
      return;
    }
  }
}
