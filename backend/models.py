from datetime import datetime, timezone
from sqlalchemy import DateTime, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from typing import Any

class Base(DeclarativeBase):
    pass


class Tentativa(Base):
    __tablename__ = "tentativas"
    __table_args__ = (UniqueConstraint("nome", "id_questao", name="uq_tentativa_nome_questao"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String, nullable=False, index=True)
    id_questao: Mapped[str] = mapped_column(String, nullable=False, index=True)
    n_tentativas: Mapped[int] = mapped_column(nullable=False, default=1)
    code: Mapped[str] = mapped_column(Text, nullable=False, default="")
    workspace_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )


class Gabarito(Base):
    __tablename__ = "gabaritos"
    __table_args__ = (UniqueConstraint("id_questao", name="uq_gabarito_id_questao"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    id_questao: Mapped[str] = mapped_column(String, nullable=False, index=True)
    code: Mapped[str] = mapped_column(Text, nullable=False)
    workspace_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )


