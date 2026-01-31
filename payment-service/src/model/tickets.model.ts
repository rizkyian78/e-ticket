import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface TicketAttributes {
  id: string;
  code: string;
  name: string;
  amount: string;
  currency: string;
  quota: number;
  reserved_quota: number;
  sold_quota: number;
  created_at: Date;
  updated_at: Date;
}
export type TicketCreationAttributes = Optional<
  TicketAttributes,
  'id' | 'created_at' | 'updated_at' | 'reserved_quota'
>;

export class Ticket
  extends Model<TicketAttributes, TicketCreationAttributes>
  implements TicketAttributes
{
  public id!: string;
  public code!: string;
  public name!: string;
  public amount!: string;
  public currency!: string;
  public quota!: number;
  public reserved_quota!: number;
  public sold_quota!: number;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelize: Sequelize) {
    Ticket.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: sequelize.literal('gen_random_uuid()'),
        },
        code: DataTypes.STRING(20),
        name: DataTypes.STRING(100),
        amount: DataTypes.DECIMAL(18, 2),
        sold_quota: DataTypes.INTEGER,
        currency: DataTypes.STRING(10),
        quota: DataTypes.INTEGER,
        reserved_quota: { type: DataTypes.INTEGER, defaultValue: 0 },
        created_at: '',
        updated_at: '',
      },
      {
        sequelize,
        tableName: 'tickets',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    );
  }
}
