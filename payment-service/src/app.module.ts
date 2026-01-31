import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllersModule } from './controllers/controllers.module';
import { DatabaseModule } from './providers/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { InquiryExpiryService } from './schedulers/inquiry-expiry/inquiry-expiry.service';
import { RepositoryModule } from './repository/repository.module';
import { ProcessorModule } from './processor/processor.module';
import { ServicesModule } from './services/services.module';
import { TransactionConsumerService } from './services/transaction-consumer/transaction.service';
import { MessagingModule } from './utils/messaging/messaging.module';
import { LedgerStrategyModule } from './services/ledger/ledger.module';

@Module({
  imports: [
    ControllersModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    RepositoryModule,
    MessagingModule,
    ProcessorModule,
    ServicesModule,
    LedgerStrategyModule,
  ],
  controllers: [AppController],
  providers: [AppService, InquiryExpiryService, TransactionConsumerService],
})
export class AppModule {}
