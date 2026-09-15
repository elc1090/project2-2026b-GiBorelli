from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass


class Tentativa(Base):
    __tablename__ = "tentativas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String, nullable=False, index=True)
    id_questao = Column(String, nullable=False, index=True)
    n_tentativas = Column(Integer, nullable=False, default=1)
    criado_em = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )


