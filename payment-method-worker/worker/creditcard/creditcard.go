package creditcard

import (
	"context"
	"encoding/json"
	"eticketing/worker/integrations/creditcard"
	"eticketing/worker/storage"
	"log"
	"time"
)

type CreditCardHandler struct {
	logger *log.Logger
	store  storage.CreditCardStore
}

func NewHandler(
	logger *log.Logger,
	store storage.CreditCardStore,
) *CreditCardHandler {
	return &CreditCardHandler{
		logger: logger,
		store:  store,
	}
}

func (h *CreditCardHandler) Process(
	ctx context.Context,
	payload string,
) (map[string]interface{}, error) {

	var p *PaymentContext
	if err := json.Unmarshal([]byte(payload), &p); err != nil {
		return nil, err
	}

	resp, err := creditcard.PayCreditCard()
	if err != nil {
		return nil, err
	}

	time.Sleep(5 * time.Second)

	if err := h.store.SaveRecordCC(ctx, storage.PaymentRecord{
		InquiryID:     p.InquiryID,
		TransactionID: p.TransactionID,
		ReferenceID:   resp.PaymentReference,
		Amount:        p.Amount,
		Currency:      p.Currency,
		Method:        p.PaymentSource,
		Status:        resp.Status,
	}); err != nil {
		return nil, err
	}

	return map[string]any{
		"inquiryId":     p.InquiryID,
		"transactionId": p.TransactionID,
		"referenceId":   resp.PaymentReference,
		"status":        resp.Status,
		"statusCode":    resp.StatusCode,
		"paymentSource": p.PaymentSource,
	}, nil
}
