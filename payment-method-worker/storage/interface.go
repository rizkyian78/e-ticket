package storage

import (
	"context"
	"encoding/json"
)

type CreditCardStore interface {
	SaveRecordCC(ctx context.Context, data PaymentRecord) error
}
type DebitCardStore interface {
	SaveRecordDC(ctx context.Context, data PaymentRecord) error
}
type QRISStore interface {
	SaveRecordQRIS(ctx context.Context, data PaymentRecord) error
}

type PaymentRecord struct {
	InquiryID     string
	TransactionID string
	ReferenceID string
	Amount        string
	Currency      string
	Method        string
	Status        string
	RecordLog 	json.RawMessage
}