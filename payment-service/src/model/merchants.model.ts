import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

/**
 * Merchant attributes (DB shape)
 */
export interface MerchantAttributes {
  id: string;
  merchant_name: string;
  payment_methods: Record<string, any>;
  api_key: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Attributes allowed during creation
 */
export type MerchantCreationAttributes = Optional<
  MerchantAttributes,
  'id' | 'status' | 'created_at' | 'updated_at'
>;

/**
 * Merchant model
 */
export class Merchant
  extends Model<MerchantAttributes, MerchantCreationAttributes>
  implements MerchantAttributes
{
  public id!: string;
  public merchant_name!: string;
  public payment_methods!: Record<string, any>;
  public api_key!: string;
  public status!: string;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelize: Sequelize) {
    Merchant.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: sequelize.literal('gen_random_uuid()'),
        },

        merchant_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },

        payment_methods: {
          type: DataTypes.JSONB,
          allowNull: false,
          /*
            Example:
            {
              qris: true,
              credit: true,
              debit: false
            }
          */
        },

        api_key: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: true,
        },

        status: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: 'unactive',
        },

        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.literal('NOW()'),
        },

        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.literal('NOW()'),
        },
      },
      {
        sequelize,
        tableName: 'merchants',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    );
  }
}
