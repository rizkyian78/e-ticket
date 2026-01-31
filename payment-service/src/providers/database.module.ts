import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { initModels } from '../model';
import { ConfigService } from '@nestjs/config';

export const SEQUELIZE = Symbol('SEQUELIZE');
export const MODELS = Symbol('MODELS');

@Module({
  providers: [
    {
      provide: SEQUELIZE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const sequelize = new Sequelize(
          config.get<string>('DATABASE_URL', { infer: true }),
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
        return sequelize;
      },
    },
    {
      provide: MODELS,
      inject: [SEQUELIZE],
      useFactory: (sequelize: Sequelize) => {
        return initModels(sequelize);
      },
    },
  ],
  exports: [SEQUELIZE, MODELS],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  async onModuleDestroy() {
    await this.sequelize.close(); // graceful shutdown
  }
}
