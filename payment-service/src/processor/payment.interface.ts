export type PaymentContext = {
  inquiryId: string;
  transactionId: string;
  amount: string; // bigint-safe as string
  currency: string;
  paymentSource: string;
  customer: Record<string, any>;
  metadata?: Record<string, any>;
};

export interface PaymentHandler {
  /** Unique payment method key */
  readonly methods: string[];
  // e.g. "VISA", "MASTERCARD", "QRIS", "GOPAY", "BANK_TRANSFER"

  /** Capability check */
  supports(method: string): boolean;

  /** Payment execution */
  process(ctx: PaymentContext): Promise<void>;
}
