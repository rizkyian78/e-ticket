package ticketworker


type PaymentContext struct {
	InquiryId     string                 `json:"inquiryId"`
	TransactionId string                 `json:"transactionId"`
	Amount        string                 `json:"amount"`
	Currency      string                 `json:"currency"`
	PaymentSource string                 `json:"paymentSource"`
	Customer      map[string]interface{} `json:"customer"`
	Metadata      map[string]interface{} `json:"metadata"`
}