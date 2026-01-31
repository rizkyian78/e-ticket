import { Inquiry, InquiryCreationAttributes } from 'src/model/inquiries.model';
import { Transaction } from 'sequelize';

export interface InquiryRepository {
  findById(id: string): Promise<Inquiry>;
  findExpired(date: Date): Promise<Inquiry[]>;
  expire(id: string);
  createWithTx(payload: InquiryCreationAttributes, tx: Transaction);
  withTransaction<T>(fn: (tx: Transaction) => Promise<T>);
  markExpired(id: string, tx: Transaction): Promise<void>;
}
