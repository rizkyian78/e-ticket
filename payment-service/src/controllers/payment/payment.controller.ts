import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentRequest } from 'src/dto/payment.dto';
import { PaymentsService } from 'src/services/payments/payments.service';

@Controller('api/inquiry/transaction')
export class PaymentController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Post('pay')
  async submitPayment(@Body() body: PaymentRequest) {
    return this.paymentService.transactionSubmitted(body);
  }

  @Get(':id')
  async retrieveTransaction(@Param('id') id: string) {
    return this.paymentService.retrieveTransaction(id);
  }
}
