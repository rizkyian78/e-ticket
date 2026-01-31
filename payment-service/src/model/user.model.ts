import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
export interface UserAttributes {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public email!: string;
  public password_hash!: string;
  public role!: string;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: sequelize.literal('gen_random_uuid()'),
        },
        email: DataTypes.STRING(150),
        password_hash: DataTypes.STRING(255),
        role: DataTypes.STRING(30),
        created_at: '',
        updated_at: '',
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    );
  }
}
