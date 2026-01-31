// qr-ledger.strategy.ts
import { LedgerStrategy } from './ledger.strategy';

export class QrLedgerStrategy implements LedgerStrategy {
  supports(paymentSource: string): boolean {
    return ['qris'].includes(paymentSource);
  }

  buildLedgerPayload(input: {
    transactionId: string;
    amount: string;
    currency: string;
    customerId: string;
  }) {
    return {
      idempotency_key: input.transactionId,
      reference_type: 'PAYMENT',
      reference_id: input.transactionId,
      currency: input.currency,
      entries: [
        {
          account: 'CASH:QR_GATEWAY',
          type: 'DEBIT',
          amount: input.amount,
        },
        {
          account: 'REVENUE:TICKET',
          type: 'CREDIT',
          amount: input.amount,
        },
      ],
      metadata: {
        payment_source: 'qr',
      },
    };
  }
}
