from __future__ import annotations

from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class Scheme(Base):
    __tablename__ = "schemes"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)

    name: Mapped[str] = mapped_column(String(256), unique=True, index=True)
    ministry: Mapped[str | None] = mapped_column(String(256), nullable=True)
    description: Mapped[str] = mapped_column(Text)
    target_group: Mapped[str | None] = mapped_column(String(256), nullable=True)

    income_limit: Mapped[int | None] = mapped_column(Integer, nullable=True)
    age_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    age_max: Mapped[int | None] = mapped_column(Integer, nullable=True)

    state_availability: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)
    required_documents: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)
    application_link: Mapped[str | None] = mapped_column(Text, nullable=True)
    offline_office: Mapped[str | None] = mapped_column(Text, nullable=True)
    application_steps: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)
    last_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    benefits: Mapped[str | None] = mapped_column(Text, nullable=True)

    eligibility_rules: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
