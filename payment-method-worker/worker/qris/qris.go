package qris

import (
	"context"
	"encoding/json"
	"eticketing/worker/integrations/qris"
	"eticketing/worker/storage"
	"log"
	"time"
)

type QRISHandler struct {
	logger *log.Logger
	store  storage.QRISStore
}

func NewHandler(
	logger *log.Logger,
	store storage.QRISStore,
) *QRISHandler {
	return &QRISHandler{
		logger: logger,
		store:  store,
	}
}

func (h *QRISHandler) Process(
	ctx context.Context,
	payload string,
) (map[string]interface{}, error) {

	var p *PaymentContext
	if err := json.Unmarshal([]byte(payload), &p); err != nil {
		return nil, err
	}

	resp, err := qris.PayQRIS()
	if err != nil {
		return nil, err
	}

	time.Sleep(5 * time.Second)

	if err := h.store.SaveRecordQRIS(ctx, storage.PaymentRecord{
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
