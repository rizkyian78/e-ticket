export interface LedgerStrategy {
  supports(paymentSource: string): boolean;

  buildLedgerPayload(input: {
    transactionId: string;
    amount: string;
    currency: string;
  }): any;
}
