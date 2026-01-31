export class PaymentRequest {
  inquiryId: string;
  amount: bigint;
  currency: string;
  paymentSource: string;
  idempotencyKey?: string;
  paymentSourceData: Record<string, any>;
  installmentId?: number;
  saveToken?: boolean;
  useToken?: boolean;
}
