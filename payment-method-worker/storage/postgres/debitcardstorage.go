package postgres

import (
	"context"
	"eticketing/worker/storage"
)

func (p *PostgresStore) SaveRecordDC(
	ctx context.Context,
	data storage.PaymentRecord,
) error {

	query := `
	INSERT INTO qris_worker (
		inquiry_id,
		transaction_id,
		amount,
		currency,
		method,
		status,
		reference_id
	) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
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
		data.RecordLog,
		data.ReferenceID,
	)

	return err
}
