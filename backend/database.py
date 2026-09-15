import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker

from models import Base

load_dotenv(".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL não foi definida no ambiente.")

#normalizacao do URL para forcar o uso do driver psycopg3
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

#the engine manages the connection to the database and handles query execution.
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    Base.metadata.create_all(bind=engine)

    columns = {column["name"] for column in inspect(engine).get_columns("tentativas")}
    with engine.begin() as connection:
        if "code" not in columns:
            connection.execute(
                text("ALTER TABLE tentativas ADD COLUMN code TEXT NOT NULL DEFAULT ''")
            )
        if "workspace_json" not in columns:
            connection.execute(
                text("ALTER TABLE tentativas ADD COLUMN workspace_json JSON")
            )

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()