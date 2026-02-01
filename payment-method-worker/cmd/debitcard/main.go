package main

import (
	"context"
	"eticketing/worker/queue"
	"eticketing/worker/storage/postgres"
	"eticketing/worker/worker/debitcard"
	"log"
	"os"
	"os/signal"

	"github.com/joho/godotenv"
	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	logger := log.New(os.Stdout, "[PAYMENT-WORKER] ", log.LstdFlags)

	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, using environment")
	}

	rabbitHost := os.Getenv("AMQP_URL")
	if rabbitHost == "" {
		log.Fatal("AMQP_URL is required")
	}

	dbHost := os.Getenv("DATABASE_URL")
	if dbHost == "" {
		log.Fatal("DATABASE_URL is required")
	}

	// postgres
	store, err := postgres.NewPostgresStore(dbHost)
	if err != nil {
		logger.Fatal(err)
	}

	// rabbitmq
	conn, err := amqp.Dial(rabbitHost)
	if err != nil {
		logger.Fatal(err)
	}
	ch, _ := conn.Channel()

	// wiring
	handler := debitcard.NewHandler(logger, store)
	consumer := queue.NewConsumer(ch)
	producer, err := queue.NewProducer(ch, "payment.executed")
	if err != nil {
		logger.Fatal(err)
	}
	// consume
	err = consumer.Consume("payment.debitcard.transaction", func(body []byte) error {
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
