import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsPositive,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

/* ---------------- CUSTOMER ---------------- */

export class CustomerDto {
  @ApiProperty()
  @IsString({ message: 'Customer name must be a string' })
  @IsNotEmpty({ message: 'Customer name is required' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;
}

/* ---------------- ORDER ---------------- */

export class OrderDto {
  @ApiProperty()
  @IsString({ message: 'Ticket ID must be a string' })
  @IsNotEmpty({ message: 'Ticket ID is required' })
  ticket_id: string;

  @ApiProperty()
  @IsString({ message: 'Ticket code must be a string' })
  @IsNotEmpty({ message: 'Ticket code is required' })
  ticket_code: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Reserving quota must be a number' })
  @IsPositive({ message: 'Reserving quota must be greater than 0' })
  reserving_quota: number;

  @ApiProperty()
  @IsString({ message: 'Amount must be a string' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: string;
}

/* ---------------- INQUIRY REQUEST ---------------- */

export class InquiryRequestDto {
  @ApiProperty()
  @IsString({ message: 'Reference ID must be a string' })
  @IsNotEmpty({ message: 'Reference ID is required' })
  reference_id: string;

  @ApiProperty()
  @IsString({ message: 'Amount must be a string' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: string;

  @ApiProperty()
  @IsIn(['IDR', 'USD', 'AED'], {
    message: 'Currency must be IDR, USD, or AED',
  })
  currency: string;

  @ApiProperty({ type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ type: [OrderDto] })
  @IsArray({ message: 'Order must be an array' })
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  order: OrderDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Reference URL must be a string' })
  referenceUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Payment source must be a string' })
  paymentSource?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Payment source method must be a string' })
  paymentSourceMethod?: string;

  @ApiProperty()
  @IsString({ message: 'Return URL must be a string' })
  @IsNotEmpty({ message: 'Return URL code is required' })
  return_url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Token must be a string' })
  token?: string;
}
