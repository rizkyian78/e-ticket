import { Injectable } from '@nestjs/common';
import { LedgerStrategy } from './ledger.strategy';
import { CreditCardLedgerStrategy } from './cc-ledger.strategy';
import { QrLedgerStrategy } from './qr-ledger.strategy';

@Injectable()
export class LedgerStrategyResolver {
  private readonly strategies: LedgerStrategy[] = [
    new CreditCardLedgerStrategy(),
    new QrLedgerStrategy(),
  ];

  resolve(paymentSource: string): LedgerStrategy {
    const strategy = this.strategies.find((s) => s.supports(paymentSource));

    if (!strategy) {
      throw new Error(`Unsupported payment source: ${paymentSource}`);
    }

    return strategy;
  }
}
