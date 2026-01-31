import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqClientService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.connection = await amqp.connect({
      protocol: 'amqp',
      hostname: this.config.get('RABBITMQ_HOST') ?? 'host.docker.internal',
      port: 5672,
      username: this.config.get('RABBITMQ_USER') ?? 'guest',
      password: this.config.get('RABBITMQ_PASS') ?? 'guest',
    });
    this.channel = await this.connection.createChannel();
  }
  async onModuleDestroy() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
  async assertQueue(queue: string) {
    await this.channel.assertQueue(queue, { durable: true });
  }

  async publish(queue: string, payload: unknown) {
    const buffer = Buffer.from(JSON.stringify(payload));
    console.log('SENDING QUEUE');
    this.channel.sendToQueue(queue, buffer, { persistent: true });
  }

  async consume(queue: string, handler: (data: any) => Promise<void>) {
    await this.assertQueue(queue);

    this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        await handler(content);
        this.channel.ack(msg);
      } catch (err) {
        this.channel.nack(msg, false, false); // dead-letter strategy
      }
    });
  }
}
