from fastapi import APIRouter, Depends
from app.schemas.ledger import LedgerCreateRequest
from app.core.database import get_db
from app.services.ledger_service import LedgerService

router = APIRouter()

@router.post("/ledger/entries")
def create_ledger(
    req: LedgerCreateRequest,
    db=Depends(get_db),
):
    service = LedgerService(db)
    return service.post_entries(req)
