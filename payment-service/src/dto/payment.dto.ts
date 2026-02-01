import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsObject,
  IsIn,
} from 'class-validator';

export class PaymentRequest {
  @IsString()
  @IsNotEmpty()
  inquiryId: string;

  /**
   * IMPORTANT:
   * class-validator does NOT support bigint directly.
   * Use number OR string at API boundary.
   */
  @IsString()
  amount: string;

  @IsString()
  @IsIn(['IDR', 'USD', 'AED']) // adjust if needed
  currency: string;

  @IsString()
  @IsNotEmpty()
  paymentSource: string;

  @IsOptional()
  idempotencyKey?: string;

  @IsObject()
  paymentSourceData: Record<string, any>;

  @IsOptional()
  @IsNumber()
  installmentId?: number;

  @IsOptional()
  @IsBoolean()
  saveToken?: boolean;

  @IsOptional()
  @IsBoolean()
  useToken?: boolean;
}
