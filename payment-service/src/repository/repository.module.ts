// src/modules/repository.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/providers/database.module';
import { SequelizeInquiryRepository } from 'src/repository/impl/inquiryinterfaceimpl.repository';
import { SequelizeTicketRepository } from 'src/repository/impl/ticketinterfacelimpl.repository';
import { SequelizeTransactionRepository } from './impl/transactioninterfaceimpl.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'InquiryRepository',
      useClass: SequelizeInquiryRepository,
    },
    {
      provide: 'TicketRepository',
      useClass: SequelizeTicketRepository,
    },
    {
      provide: 'TransactionRepository',
      useClass: SequelizeTransactionRepository,
    },
  ],
  exports: ['InquiryRepository', 'TicketRepository', 'TransactionRepository'], // ✅ EXPORT
})
export class RepositoryModule {}
