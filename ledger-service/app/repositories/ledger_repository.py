from uuid import uuid4
from psycopg2.extras import RealDictCursor


class LedgerRepository:
    def __init__(self, db):
        self.db = db

    def insert_entries(
        self,
        transaction_id: str,
        entries: list,
        currency: str,
    ):
        cursor = self.db.cursor(cursor_factory=RealDictCursor)

        for entry in entries:
            # resolve account
            cursor.execute(
                "SELECT id FROM ledger_accounts WHERE code = %s",
                (entry["account"],),
            )
            account = cursor.fetchone()
            if not account:
                raise ValueError(f"Unknown account {entry['account']}")

            if entry["type"] == "DEBIT":
                from_account_id = account["id"]
                to_account_id = None
            elif entry["type"] == "CREDIT":
                from_account_id = None
                to_account_id = account["id"]
            else:
                raise ValueError(f"Invalid entry type {entry['type']}")

            cursor.execute(
                """
                INSERT INTO ledger_entries (
                    id,
                    transaction_id,
                    from_account_id,
                    to_account_id,
                    entry_type,
                    amount,
                    currency
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING

                """,
                (
                    str(uuid4()),
                    transaction_id,
                    from_account_id,
                    to_account_id,
                    entry["type"],
                    entry["amount"],
                    currency,
                ),
            )

        self.db.commit()
