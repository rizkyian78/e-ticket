import { Inject, Injectable } from '@nestjs/common';
import { MODELS, SEQUELIZE } from 'src/providers/database.module';
import { Inquiry, InquiryCreationAttributes } from 'src/model/inquiries.model';
import { InquiryRepository } from '../inquiryinterface.repository';
import { QueryTypes, Sequelize, Transaction } from 'sequelize';

@Injectable()
export class SequelizeInquiryRepository implements InquiryRepository {
  constructor(
    @Inject(MODELS)
    private readonly models: {
      Inquiry: typeof Inquiry;
    },
    @Inject(SEQUELIZE) // ✅ TOKEN-BASED INJECTION
    private readonly sequelize: Sequelize,
  ) {}
  async markExpired(id: string, tx: Transaction): Promise<void> {
    await this.sequelize.query(
      `
      UPDATE inquiries
      SET status = 'EXPIRED'
      WHERE id = :id
      `,
      {
        replacements: { id },
        transaction: tx,
      },
    );
  }
  expire(id: string) {
    throw new Error('Method not implemented.' + id);
  }
  async findExpired(date: Date): Promise<Inquiry[]> {
    const rows = await this.sequelize.query<Inquiry>(
      `
      SELECT *
      FROM inquiries
      WHERE status = 'PENDING'
        AND expired_at <= :now
      `,
      {
        replacements: { now: date },
        type: QueryTypes.SELECT,
      },
    );

    return rows;
  }

  findById(id: string): Promise<Inquiry> {
    return this.models.Inquiry.findByPk(id);
  }

  async create(data: any) {
    return this.models.Inquiry.create(data);
  }
  async withTransaction<T>(fn: (tx: Transaction) => Promise<T>) {
    return this.sequelize.transaction(fn);
  }
  async createWithTx(data: InquiryCreationAttributes, tx: Transaction) {
    const inquiry = await Inquiry.create(data, { transaction: tx });
    return inquiry.toJSON() as Inquiry;
  }
}
