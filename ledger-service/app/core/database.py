import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_db():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        dbname=os.getenv("DB_NAME", "ipg"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "password"),
    )
    try:
        yield conn
    finally:
        conn.close()
