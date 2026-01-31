import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface LedgerAccountAttributes {
  id: string;
  code: string;
  name: string;
  type: string;
  currency: string;
  created_at: Date;
  updated_at: Date;
}
export type LedgerAccountCreationAttributes = Optional<
  LedgerAccountAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class LedgerAccount
  extends Model<LedgerAccountAttributes, LedgerAccountCreationAttributes>
  implements LedgerAccountAttributes
{
  public id!: string;
  public code!: string;
  public name!: string;
  public type!: string;
  public currency!: string;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelize: Sequelize) {
    LedgerAccount.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: sequelize.literal('gen_random_uuid()'),
        },
        code: DataTypes.STRING(50),
        name: DataTypes.STRING(150),
        type: DataTypes.STRING(30),
        currency: DataTypes.STRING(10),
        created_at: '',
        updated_at: '',
      },
      {
        sequelize,
        tableName: 'ledger_accounts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    );
  }
}
