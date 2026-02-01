package qris

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"time"

	"github.com/google/uuid"
)

func PayQRIS() (QRISResponse, error) {
	//  TODO need to make real payment
	response := map[string]any{
		"status":           "SUCCESS",
		"statusCode":       "00",
		"transactionId":    uuid.NewString(),
		"paymentReference": fmt.Sprintf("PAYQRIS-%s-%06d", time.Now().Format("20060102"), rand.Intn(1_000_000)),
		"timestamp":        time.Now().Format(time.RFC3339),
	}
	b, err := json.Marshal(response)
	if err != nil {
		return QRISResponse{}, err
	}

	var simResp QRISResponse

	if err := json.Unmarshal(b, &simResp); err != nil {
		return QRISResponse{}, err
	}

	time.Sleep(15 * time.Second)

	return simResp, nil
}

// TODO QRIS
