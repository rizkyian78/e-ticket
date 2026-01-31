import {
  Transaction,
  TransactionCreationAttributes,
} from 'src/model/transactions.model';

export interface TransactionRepository {
  create(payload: TransactionCreationAttributes): Promise<Transaction>;
  findByIdempotencyKey(key: string): Promise<Transaction>;
  findById(id: string): Promise<Transaction>;
}
