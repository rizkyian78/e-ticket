package debitcard

type DebitCardResponse struct {
	Status           string `json:"status"`
	StatusCode       string `json:"statusCode"`
	TransactionID    string `json:"transactionId"`
	PaymentReference string `json:"paymentReference"`
	Timestamp        string `json:"timestamp"`
}
