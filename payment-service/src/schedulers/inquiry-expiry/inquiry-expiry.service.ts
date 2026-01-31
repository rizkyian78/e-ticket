import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Sequelize, Transaction } from 'sequelize';
import { SEQUELIZE } from 'src/providers/database.module';
import { InquiryRepository } from 'src/repository/inquiryinterface.repository';
import { TicketRepository } from 'src/repository/ticketinterface.repository';
@Injectable()
export class InquiryExpiryService {
  private readonly logger = new Logger(InquiryExpiryService.name);

  constructor(
    @Inject('InquiryRepository')
    private readonly inquiryRepo: InquiryRepository, // ✅ abstraction

    @Inject('TicketRepository')
    private readonly ticketRepo: TicketRepository,

    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}
  @Cron(CronExpression.EVERY_YEAR)
  async handleExpiry() {
    this.logger.log('Running inquiry expiry job...');

    const now = new Date();
    const expired = await this.inquiryRepo.findExpired(now);

    if (expired.length === 0) return;

    for (const inquiry of expired) {
      await this.sequelize.transaction(async (tx: Transaction) => {
        // release all ticket reservations
        for (const order of inquiry.orders) {
          await this.ticketRepo.release(
            order.ticket_id,
            order.reserving_quota,
            tx,
          );
        }

        // mark inquiry expired
        await this.inquiryRepo.markExpired(inquiry.id, tx);
      });

      this.logger.log(`Expired inquiry ${inquiry.id}`);
    }
  }
}
