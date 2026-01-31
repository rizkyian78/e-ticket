import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/providers/database.module';
import { SequelizeInquiryRepository } from 'src/repository/impl/inquiryinterfaceimpl.repository';
import { SequelizeTicketRepository } from 'src/repository/impl/ticketinterfacelimpl.repository';
import { RepositoryModule } from 'src/repository/repository.module';
import { InquiriesService } from './inquiries/inquiries.service';
import { PaymentsService } from './payments/payments.service';
import { MessagingModule } from 'src/utils/messaging/messaging.module';
import { RabbitmqClientService } from 'src/utils/messaging/rabbitmq.client.service';
import { QRPaymentHandler } from 'src/processor/handlers/qr-payment.handler';
import { CardHandler } from 'src/processor/handlers/creditcard.handler';
import { HttpModule } from '@nestjs/axios';
import { LedgerStrategyModule } from './ledger/ledger.module';

@Module({
  imports: [
    DatabaseModule,
    RepositoryModule,
    LedgerStrategyModule,
    MessagingModule,
    HttpModule.register({
      baseURL: 'localhost:9000',
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  exports: [InquiriesService], // exports service

  providers: [
    InquiriesService,
    PaymentsService,
    RabbitmqClientService,
    CardHandler,
    QRPaymentHandler,
    {
      provide: 'InquiryRepository',
      useClass: SequelizeInquiryRepository,
    },
    {
      provide: 'TicketRepository',
      useClass: SequelizeTicketRepository,
    },
  ],
})
export class ServicesModule {}
