import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv(".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL não foi definida no ambiente.")

# SQLAlchemy 2.x will try to use psycopg2 by default for postgresql:// URLs.
# Since the project uses psycopg3, normalize the URL to the psycopg driver.

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

#the engine manages the connection to the database and handles query execution.

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#database dependency for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()