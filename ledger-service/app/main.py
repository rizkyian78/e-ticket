from fastapi import FastAPI
from app.api.v1.ledger import router as ledger_router

app = FastAPI(title="Ledger Service")

app.include_router(ledger_router, prefix="/v1")

@app.get("/health")
def health():
    return {"status": "ok"}