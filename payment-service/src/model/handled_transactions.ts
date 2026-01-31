import { Model, Sequelize, Optional } from 'sequelize';
export interface HandledTransctionsAttributes {
  transactionId: string;
  created_at: Date;
}
export type HandledTransctionsCreationAttributes = Optional<
  HandledTransctionsAttributes,
  'created_at'
>;

export class HandledTransctions
  extends Model<
    HandledTransctionsAttributes,
    HandledTransctionsCreationAttributes
  >
  implements HandledTransctionsAttributes
{
  public transactionId!: string;
  public created_at!: Date;

  static initModel(sequelize: Sequelize) {
    HandledTransctions.init(
      {
        transactionId: '',
        created_at: '',
      },
      {
        sequelize,
        tableName: 'handled_transactions',
        timestamps: true,
        createdAt: 'created_at',
      },
    );
  }
}
