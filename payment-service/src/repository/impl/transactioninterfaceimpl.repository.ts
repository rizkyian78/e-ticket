import { Inject, Injectable } from '@nestjs/common';
import { MODELS } from 'src/providers/database.module';
import { TransactionRepository } from '../transactioninterface.repository';
import {
  Transaction,
  TransactionCreationAttributes,
} from 'src/model/transactions.model';

@Injectable()
export class SequelizeTransactionRepository implements TransactionRepository {
  constructor(
    @Inject(MODELS)
    private readonly models: {
      Transaction: typeof Transaction;
    },
  ) {}
  findById(id: string): Promise<Transaction> {
    return this.models.Transaction.findOne({ where: { id: id } });
  }
  async findByIdempotencyKey(key: string): Promise<Transaction> {
    return this.models.Transaction.findOne({
      where: {
        idempotency_key: key,
      },
    });
  }

  async create(data: TransactionCreationAttributes) {
    return this.models.Transaction.create(data);
  }
}
