// queue/consumer.go
package queue

import (
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Consumer struct {
	ch *amqp.Channel
}

func NewConsumer(ch *amqp.Channel) *Consumer {
	return &Consumer{ch: ch}
}

func (c *Consumer) Consume(queue string, handler func([]byte) error) error {
	_, err := c.ch.QueueDeclare(queue, true, false, false, false, nil)
	if err != nil {
		return err
	}

	msgs, err := c.ch.Consume(queue, "", false, false, false, false, nil)
	if err != nil {
		return err
	}

	go func() {
		for msg := range msgs {
			if err := handler(msg.Body); err != nil {
				log.Println("handler error:", err)
				msg.Nack(false, false)
				continue
			}
			msg.Ack(false)
		}
	}()

	return nil
}
