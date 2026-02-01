import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { Sequelize } from 'sequelize';
import { InquiryRequestDto, OrderDto } from 'src/dto/inquiry.dto';
import { SEQUELIZE } from 'src/providers/database.module';
import { InquiryRepository } from 'src/repository/inquiryinterface.repository';
import { MerchantsRepository } from 'src/repository/merchantsinterface.repository';
import { TicketRepository } from 'src/repository/ticketinterface.repository';

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name); // ✅

  constructor(
    @Inject('InquiryRepository')
    private readonly inquiryRepo: InquiryRepository, // ✅ abstraction

    @Inject('TicketRepository')
    private readonly ticketRepo: TicketRepository,

    @Inject('MerchantRepository')
    private readonly merchantRepo: MerchantsRepository,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,

    private readonly config: ConfigService,
  ) {}
  async createInquiry(body: InquiryRequestDto) {
    this.validateAmount(body);

    try {
      return await this.inquiryRepo.withTransaction(async (tx) => {
        // 🔐 atomic reservation (race-safe)
        for (const order of body.order) {
          const reserved = await this.ticketRepo.reserveAtomic(
            order.ticket_id,
            order.reserving_quota,
            tx, // transaction-scoped
          );

          if (!reserved) {
            throw new BadRequestException('Ticket sold out');
          }
        }

        // 🧾 create inquiry (same transaction)
        const inquiry = await this.inquiryRepo.createWithTx(
          {
            currency: body.currency,
            status: 'PENDING',
            total_amount: BigInt(body.amount),
            locked_amount: BigInt(0),
            reference_id: body.reference_id,
            orders: body.order,
            return_url: body.return_url,
            expired_at: dayjs()
              .add(this.config.get('INQUIRY_EXPIRATION_TIME') ?? 9000, 'second')
              .toDate(),
            customer: {
              email: body.customer.email,
              name: body.customer.name,
              phoneNumber: body.customer.phoneNumber,
            },
          },
          tx,
        );

        return this.mapResponse(inquiry);
      });
    } catch (err: unknown) {
      this.logger.error(err);

      if (err instanceof BadRequestException) {
        throw err;
      }

      throw new InternalServerErrorException('Failed to create inquiry');
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.inquiryRepo.findById(id);
      if (!data) {
        throw new NotFoundException('Inquiries not found');
      }
      return {
        ...data,
        // Masked Email and phone
        paymentSources: ['banktransfer', 'qris', 'creditcard', 'debitcard'],
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new InternalServerErrorException(err?.message ?? 'Database error');
    }
  }

  validateAmount(body: InquiryRequestDto) {
    if (body.order && body.order.length > 0) {
      const sum = this.sumOrderItemAmount(body.order);
      const req = BigInt(body.amount);

      if (req !== sum) {
        throw new BadRequestException('Amount is not match');
      }
    }
  }

  async validateTicket(orders: OrderDto[]) {
    for (const order of orders) {
      const ticket = await this.ticketRepo.findTicketById(order.ticket_id);
      const remaining_quota =
        ticket.quota - ticket.reserved_quota - order.reserving_quota;
      if (remaining_quota <= 0) {
        throw new BadRequestException('Ticket Sold out');
      }
    }
  }

  sumOrderItemAmount(order: OrderDto[]): bigint {
    return order.reduce((total, item) => {
      const amount = BigInt(item.amount);
      const qty = BigInt(item.reserving_quota);
      return total + amount * qty;
    }, 0n);
  }

  mapResponse(inquiry: any) {
    const baseUrl =
      this.config.get('CHECKOUT_BASE_URL') ?? 'http://localhost:3000';
    return {
      id: inquiry.id,
      createdTime: inquiry.created_at,
      referenceId: inquiry.reference_id,
      status: inquiry.status,
      amount: inquiry.total_amount,
      currency: inquiry.currency,
      paymentSources: ['banktransfer', 'qris', 'creditcard', 'debitcard'],
      urls: {
        selections: baseUrl + `checkout/${inquiry.id}`,
        checkout: baseUrl + `checkout/${inquiry.id}`,
      },
    };
  }
}
