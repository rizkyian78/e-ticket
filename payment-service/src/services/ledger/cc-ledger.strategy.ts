import { LedgerStrategy } from './ledger.strategy';

export class CreditCardLedgerStrategy implements LedgerStrategy {
  supports(paymentSource: string): boolean {
    return ['creditcard', 'debitcard'].includes(paymentSource);
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
          account: 'CASH:CC_GATEWAY',
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
        payment_source: 'creditcard',
      },
    };
  }
}
