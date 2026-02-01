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
import { ApiKeyGuard } from 'src/guard/api_key.guard';
import { SequelizeMerchantRepository } from 'src/repository/impl/merchantinterfaceimpl.repository';

@Module({
  imports: [DatabaseModule, RepositoryModule],

  providers: [
    PaymentsService,
    InquiriesService,
    RabbitmqClientService,
    CardHandler,
    QRPaymentHandler,
    ApiKeyGuard,

    {
      provide: 'InquiryRepository',
      useClass: SequelizeInquiryRepository,
    },
    {
      provide: 'TicketRepository',
      useClass: SequelizeTicketRepository,
    },
    {
      provide: 'MerchantRepository',
      useClass: SequelizeMerchantRepository,
    },
  ],

  controllers: [InquiryController, PaymentController],
  exports: ['MerchantRepository', 'InquiryRepository', 'TicketRepository'],
})
export class ControllersModule {}
