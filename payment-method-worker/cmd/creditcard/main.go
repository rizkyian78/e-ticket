package main

import (
	"context"
	"eticketing/worker/queue"
	"eticketing/worker/storage/postgres"
	"eticketing/worker/worker/creditcard"
	"log"
	"os"
	"os/signal"

	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	logger := log.New(os.Stdout, "[PAYMENT-WORKER] ", log.LstdFlags)

	amqpURL := "amqp://guest:guest@localhost:5672/"
	dbURL := "postgresql://postgres:password@localhost:5432/worker?sslmode=disable"

	// postgres
	store, err := postgres.NewPostgresStore(dbURL)
	if err != nil {
		logger.Fatal(err)
	}

	// rabbitmq
	conn, err := amqp.Dial(amqpURL)
	if err != nil {
		logger.Fatal(err)
	}
	ch, _ := conn.Channel()

	// wiring
	handler := creditcard.NewHandler(logger, store)
	consumer := queue.NewConsumer(ch)
	producer, err := queue.NewProducer(ch, "payment.executed")
	if err != nil {
		logger.Fatal(err)
	}
	// consume
	err = consumer.Consume("payment.creditcard.transaction", func(body []byte) error {
		resp, err := handler.Process(context.Background(), string(body))
		if err != nil {
			return err
		}
		if resp != nil {
			return producer.PublishMessage(resp)
		}
		return nil
	})
	if err != nil {
		logger.Fatal(err)
	}

	// graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop

	logger.Println("worker stopped")

}
