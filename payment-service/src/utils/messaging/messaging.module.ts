import { Module } from '@nestjs/common';
import { RabbitmqClientService } from './rabbitmq.client.service';

@Module({
  providers: [RabbitmqClientService],
  exports: [RabbitmqClientService],
})
export class MessagingModule {}
