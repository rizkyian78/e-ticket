import { Module } from '@nestjs/common';
import { InquiryController } from './inquiry/inquiry.controller';
import { PaymentController } from './payment/payment.controller';
import { DatabaseModule } from 'src/providers/database.module';
import { InquiriesService } from 'src/services/inquiries/inquiries.service';
import { SequelizeTicketRepository } from 'src/repository/impl/ticketinterfacelimpl.repository';
import { SequelizeInquiryRepository } from 'src/repository/impl/inquiryinterfaceimpl.repository';
import { RepositoryModule } from 'src/repository/repository.module';
import { PaymentsService } from 'src/services/payments/payments.service';
import { RabbitmqClientService } from 'src/utils/messaging/rabbitmq.client.service';
import { QRPaymentHandler } from 'src/processor/handlers/qr-payment.handler';
import { CardHandler } from 'src/processor/handlers/creditcard.handler';

@Module({
  imports: [DatabaseModule, RepositoryModule],

  providers: [
    PaymentsService,
    InquiriesService,
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

  controllers: [InquiryController, PaymentController],
})
export class ControllersModule {}
