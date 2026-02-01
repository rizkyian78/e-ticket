package postgres

import (
	"context"
	"eticketing/worker/storage"
)

func (p *PostgresStore) SaveRecordQRIS(
	ctx context.Context,
	data storage.PaymentRecord,
) error {

	query := `
	INSERT INTO debitcard_worker (
		inquiry_id,
		transaction_id,
		amount,
		currency,
		method,
		status,
		reference_id
	) VALUES ($1,$2,$3,$4,$5,$6,$7)
	`

	_, err := p.db.ExecContext(
		ctx,
		query,
		data.InquiryID,
		data.TransactionID,
		data.Amount,
		data.Currency,
		data.Method,
		data.Status,
		data.ReferenceID,
	)

	return err
}
