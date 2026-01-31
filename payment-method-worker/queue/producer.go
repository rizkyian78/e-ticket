package queue

import (
	"encoding/json"
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Producer struct {
	ch       *amqp.Channel
	queue    string
	confirms <-chan amqp.Confirmation
}

func NewProducer(ch *amqp.Channel, queue string) (*Producer, error) {
	if err := ch.Confirm(false); err != nil {
		return nil, fmt.Errorf("publisher confirms not supported: %w", err)
	}

	confirms := ch.NotifyPublish(make(chan amqp.Confirmation, 1))

	return &Producer{
		ch:       ch,
		confirms: confirms,
		queue:    queue,
	}, nil
}

func (p *Producer) PublishMessage(body any) error {
	b, err := json.Marshal(body)
	if err != nil {
		return err
	}

	err = p.ch.Publish(
		"", // ✅ topic exchange
		p.queue,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Headers: amqp.Table{
				"pattern": "payment.executed", // 🔥 REQUIRED
			},
			DeliveryMode: amqp.Persistent,
			Body:         b,
		},
	)

	if err != nil {
		return err
	}

	confirm := <-p.confirms
	if confirm.Ack {
		fmt.Printf(
			"[RMQ][CONFIRMED] routingKey=%s deliveryTag=%d\n",
			p.queue,
			confirm.DeliveryTag,
		)
	} else {
		return fmt.Errorf("message NOT acknowledged by broker")
	}

	return nil
}
