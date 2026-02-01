package debitcard

import "encoding/json"

type PaymentContext struct {
	InquiryID     string `json:"inquiryId"`
	TransactionID string `json:"transactionId"`
	Amount        string `json:"amount"`
	Currency      string `json:"currency"`
	PaymentSource string `json:"paymentSource"`

	// Raw JSON blobs — safe for any shape
	Customer json.RawMessage `json:"customer"`
	Metadata json.RawMessage `json:"metadata,omitempty"`
}
