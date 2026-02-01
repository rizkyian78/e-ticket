from fastapi import HTTPException
from app.repositories.ledger_repository import LedgerRepository


class LedgerService:
    def __init__(self, db):
        self.repo = LedgerRepository(db)

    def post_entries(self, req):
        if len(req.entries) < 2:
            raise HTTPException(
                status_code=400,
                detail="At least one DEBIT and one CREDIT entry required",
            )

        debit_total = sum(e.amount for e in req.entries if e.type == "DEBIT")
        credit_total = sum(e.amount for e in req.entries if e.type == "CREDIT")

        if debit_total != credit_total:
            raise HTTPException(
                status_code=400,
                detail="Total DEBIT must equal total CREDIT",
            )

        entries = [
            {
                "account": e.account,
                "type": e.type,
                "amount": e.amount,
            }
            for e in req.entries
        ]

        self.repo.insert_entries(
            transaction_id=str(req.reference_id),
            entries=entries,
            currency=req.currency,
        )

        return {
            "status": "POSTED",
            "transaction_id": req.reference_id,
        }
