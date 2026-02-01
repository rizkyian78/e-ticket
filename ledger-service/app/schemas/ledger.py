from pydantic import BaseModel
from typing import List, Literal
from uuid import UUID


class LedgerEntryInput(BaseModel):
    account: str
    type: Literal["DEBIT", "CREDIT"]
    amount: float


class LedgerCreateRequest(BaseModel):
    idempotency_key: UUID
    reference_type: str
    reference_id: UUID
    currency: str
    entries: List[LedgerEntryInput]
