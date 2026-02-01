import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface InquiryAttributes {
  id: string;
  user_id?: string | null;
  ticket_id?: string | null;
  reference_id: string;
  locked_amount: bigint;
  currency: string;
  total_amount: bigint;
  status: string;
  return_url: string;
  customer?: object | null;
  orders?: object | null;
  created_at: Date;
  updated_at: Date;
  expired_at: Date;
}

export type InquiryCreationAttributes = Optional<
  InquiryAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class Inquiry
  extends Model<InquiryAttributes, InquiryCreationAttributes>
  implements InquiryAttributes
{
  public id!: string;
  public user_id!: string | null;
  public ticket_id!: string | null;
  public reference_id!: string;
  public locked_amount!: bigint;
  public currency!: string;
  public total_amount!: bigint;
  public status!: string;
  public return_url!: string;
  public customer!: object | null;
  public orders!: Record<string, any>[] | null;
  public expired_at: Date;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelize: Sequelize) {
    Inquiry.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: sequelize.literal('gen_random_uuid()'),
        },
        user_id: DataTypes.UUID,
        ticket_id: DataTypes.UUID,
        reference_id: DataTypes.STRING(20),
        locked_amount: DataTypes.DECIMAL(18, 2),
        currency: DataTypes.STRING(10),
        total_amount: DataTypes.DECIMAL(18, 2),
        return_url: DataTypes.STRING(150),
        status: DataTypes.STRING(30),
        customer: DataTypes.JSONB,
        orders: DataTypes.JSONB,
        created_at: '',
        expired_at: '',
        updated_at: '',
      },
      {
        sequelize,
        tableName: 'inquiries',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    );
  }
}
