import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface LedgerEntryAttributes {
  id: string;
  transaction_id: string;
  from_account_id: string;
  to_account_id: string;
  entry_type: string;
  amount: string;
  currency: string;
  created_at: Date;
  updated_at: Date;
}
export type LedgerEntryCreationAttributes = Optional<
  LedgerEntryAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class LedgerEntry
  extends Model<LedgerEntryAttributes, LedgerEntryCreationAttributes>
  implements LedgerEntryAttributes
{
  public id!: string;
  public transaction_id!: string;
  public from_account_id!: string;
  public to_account_id!: string;
  public entry_type!: string;
  public amount!: string;
  public currency!: string;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelize: Sequelize) {
    LedgerEntry.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: sequelize.literal('gen_random_uuid()'),
        },
        transaction_id: DataTypes.UUID,
        from_account_id: DataTypes.UUID,
        to_account_id: DataTypes.UUID,
        entry_type: DataTypes.STRING(10),
        amount: DataTypes.DECIMAL(18, 2),
        currency: DataTypes.STRING(10),
        created_at: '',
        updated_at: '',
      },
      {
        sequelize,
        tableName: 'ledger_entries',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    );
  }
}
