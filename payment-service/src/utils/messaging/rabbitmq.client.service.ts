import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqClientService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  async onModuleInit() {
    this.connection = await amqp.connect({
      protocol: 'amqp',
      hostname: process.env.RABBITMQ_HOST ?? 'localhost',
      port: 5672,
      username: process.env.RABBITMQ_USER ?? 'guest',
      password: process.env.RABBITMQ_PASS ?? 'guest',
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
