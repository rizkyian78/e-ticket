import { Injectable } from '@nestjs/common';
import { PaymentHandler, PaymentContext } from '../payment.interface';
import { RabbitmqClientService } from 'src/utils/messaging/rabbitmq.client.service';

@Injectable()
export class CardHandler implements PaymentHandler {
  constructor(private readonly rabbitmq: RabbitmqClientService) {}

  async process(ctx: PaymentContext): Promise<void> {
    await this.rabbitmq.publish(`payment.${ctx.paymentSource}.transaction`, {
      ...ctx,
    });
  }
  readonly methods = ['creditcard', 'debitcard'];

  supports(method: string): boolean {
    return this.methods.includes(method);
  }
}
