import { Body, Controller, Post } from '@nestjs/common';
import { PaymentRequest } from 'src/dto/payment.dto';
import { PaymentsService } from 'src/services/payments/payments.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Post('submit')
  async submitPayment(@Body() body: PaymentRequest) {
    return this.paymentService.transactionSubmitted(body);
  }
}
