import { ApiProperty } from '@nestjs/swagger';

export class Customer {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;
}

export class Order {
  @ApiProperty()
  ticket_id: string;
  @ApiProperty()
  ticket_code: string;
  @ApiProperty()
  reserving_quota: number;
  @ApiProperty()
  amount: string;
}

export class InquiryRequest {
  @ApiProperty()
  amount: string;
  @ApiProperty()
  ticket_id: string;
  @ApiProperty()
  reference_id: string;
  @ApiProperty()
  currency: string;
  @ApiProperty({ type: Customer })
  customer: Customer;
  @ApiProperty({ type: [Order] })
  order: Order[];
  @ApiProperty({ required: false })
  referenceUrl?: string;
  @ApiProperty({ required: false })
  paymentSource?: string;
  @ApiProperty({ required: false })
  paymentSourceMethod?: string;
  @ApiProperty({ required: false })
  token?: string;
}
