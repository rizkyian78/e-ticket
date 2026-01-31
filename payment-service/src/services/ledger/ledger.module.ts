import { Module } from '@nestjs/common';
import { LedgerStrategyResolver } from './ledger-strategy.resolver';
import { LedgerClient } from 'src/client/ledger.client';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule, // 🔴 REQUIRED
  ],
  providers: [LedgerStrategyResolver, LedgerClient],
  exports: [LedgerStrategyResolver, LedgerClient], // 🔴 REQUIRED
})
export class LedgerStrategyModule {}
