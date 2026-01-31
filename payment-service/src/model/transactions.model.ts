import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// =============================
// Transactions
// =============================
export interface TransactionAttributes {
  id: string;
  inquiry_id?: string | null;
  transaction_type: string;
  payment_method: string;
  payment_reference: string;
  amount: string;
  currency: string;
  status: string;
  idempotency_key: string;
  customer?: object | null;
  paid_at?: Date | null;
  status_data: Record<string, any> | null;
  status_code: string;
  inquiry_amount: string;
  created_at: Date;
  updated_at: Date;
}
export type TransactionCreationAttributes = Optional<
  TransactionAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: string;
  public inquiry_id!: string | null;
  public transaction_type!: string;
  public payment_method!: string;
  public payment_reference!: string;
  public amount!: string;
  public currency!: string;
  public status!: string;
  public idempotency_key!: string;
  public customer!: object | null;
  public paid_at!: Date | null;
  public created_at!: Date;
  public updated_at!: Date;
  public status_data: Record<string, any> | null;
  public status_code: string;
  public inquiry_amount: string;

  static initModel(sequelize: Sequelize) {
    Transaction.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: sequelize.literal('gen_random_uuid()'),
        },
        inquiry_id: DataTypes.UUID,
        transaction_type: DataTypes.STRING(50),
        payment_method: DataTypes.STRING(50),
        payment_reference: DataTypes.STRING(150),
        amount: DataTypes.DECIMAL(18, 2),
        currency: DataTypes.STRING(10),
        status: DataTypes.STRING(30),
        idempotency_key: DataTypes.STRING(150),
        customer: DataTypes.JSONB,
        paid_at: DataTypes.DATE(3),
        status_data: DataTypes.JSONB,
        status_code: DataTypes.STRING(),
        inquiry_amount: DataTypes.DECIMAL(18, 2),
        created_at: '',
        updated_at: '',
      },
      {
        sequelize,
        tableName: 'transactions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    );
  }
}
