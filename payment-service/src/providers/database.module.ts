import { Module, OnModuleDestroy } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { initModels } from '../model';

export const SEQUELIZE = Symbol('SEQUELIZE');
export const MODELS = Symbol('MODELS');

const sequelize = new Sequelize(
  'postgresql://postgres:password@localhost:5432/ipg',
  {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

const models = initModels(sequelize);

@Module({
  providers: [
    {
      provide: SEQUELIZE,
      useValue: sequelize,
    },
    {
      provide: MODELS,
      useValue: models,
    },
  ],
  exports: [SEQUELIZE, MODELS],
})
export class DatabaseModule implements OnModuleDestroy {
  async onModuleDestroy() {
    await sequelize.close(); // graceful shutdown
  }
}
