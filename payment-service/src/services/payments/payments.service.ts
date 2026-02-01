import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  PreconditionFailedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PaymentRequest } from 'src/dto/payment.dto';
import { QRPaymentHandler } from 'src/processor/handlers/qr-payment.handler';
import { CardHandler } from 'src/processor/handlers/creditcard.handler';
import { PaymentHandler } from 'src/processor/payment.interface';
import { InquiryRepository } from 'src/repository/inquiryinterface.repository';
import { TicketRepository } from 'src/repository/ticketinterface.repository';
import { TransactionRepository } from 'src/repository/transactioninterface.repository';
import { Transaction } from 'src/model/transactions.model';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name); // ✅
  private readonly handlers: PaymentHandler[];

  constructor(
    @Inject('InquiryRepository')
    private readonly inquiryRepo: InquiryRepository, // ✅ abstraction

    @Inject('TicketRepository')
    private readonly ticketRepo: TicketRepository,

    @Inject('TransactionRepository')
    private readonly transactionRepo: TransactionRepository,

    private readonly cardHandler: CardHandler,
    private readonly qrHandler: QRPaymentHandler,
  ) {
    this.handlers = [this.cardHandler, this.qrHandler];
  }
  async transactionSubmitted(body: PaymentRequest) {
    this.logger.log('STARTING Pay: ' + PaymentsService.name);
    const existingTransaction = await this.transactionRepo.findByIdempotencyKey(
      body.idempotencyKey,
    );
    if (existingTransaction) {
      throw new BadRequestException('Too Many Request');
    }

    const inquiry = await this.inquiryRepo.findById(body.inquiryId);
    if (!inquiry) {
      throw new NotAcceptableException('Order is not available');
    }
    if (inquiry.status === 'EXPIRED') {
      throw new NotAcceptableException('Order Is Expired Please try again');
    }

    if (body.currency !== inquiry.currency) {
      throw new PreconditionFailedException(
        'Require payment locale to use the inquiry original currency',
      );
    }

    console.log(
      body.amount,
      this.decimalToMinorUnits(inquiry.total_amount.toString()),
      this.decimalToMinorUnits(inquiry.locked_amount.toString()),
    );
    if (
      Number(body.amount) >
      this.decimalToMinorUnits(inquiry.total_amount.toString()) -
        this.decimalToMinorUnits(inquiry.locked_amount.toString())
    ) {
      throw new UnprocessableEntityException(`inquiry amount doesn't match`);
    }

    const transaction = await this.transactionRepo
      .create({
        amount: body.amount.toString(),
        currency: body.currency,
        status: 'SUBMITTED',
        inquiry_id: inquiry.id,
        transaction_type: 'PURCHASE',
        customer: inquiry.customer,
        payment_method: body.paymentSource,
        payment_reference: inquiry.reference_id,
        idempotency_key: body.idempotencyKey,
        status_data: {},
        status_code: '-1',
        inquiry_amount: inquiry.total_amount.toString(),
      })
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException(err.message);
      });
    const handler = this.getHandler(body.paymentSource);
    // await inquiry.update({ locked_amount: inquiry.total_amount });

    await handler.process({
      inquiryId: inquiry.id,
      amount: body.amount.toString(),
      currency: body.currency,
      customer: inquiry.customer,
      metadata: body.paymentSourceData,
      transactionId: transaction.id,
      paymentSource: body.paymentSource,
    });

    return this.map(transaction);
  }

  public retrieveTransaction(id: string) {
    return this.transactionRepo.findById(id);
  }

  public getHandler(method: string): PaymentHandler {
    const handler = this.handlers.find((h) => h.supports(method));

    if (!handler) {
      throw new NotAcceptableException(
        `Payment method ${method} is not supported`,
      );
    }

    return handler;
  }

  public map(transaction: Transaction) {
    return {
      idempotent: transaction.idempotency_key,
      status: transaction.status,
      transaction_id: transaction.id,
      inquiry_id: transaction.inquiry_id,
      amount: transaction.amount,
      currency: transaction.currency,
    };
  }

  public decimalToMinorUnits(value: string): number {
    // "300000.00" → "30000000"
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [whole, _] = value.split('.');

    return Number(whole);
  }
}
