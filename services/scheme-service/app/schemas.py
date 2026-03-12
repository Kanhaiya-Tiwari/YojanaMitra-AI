from __future__ import annotations

from datetime import date
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl


class SchemeBase(BaseModel):
    name: str = Field(..., max_length=256)
    ministry: str | None = Field(default=None, max_length=256)
    description: str
    target_group: str | None = Field(default=None, max_length=256)

    income_limit: int | None = None
    age_min: int | None = None
    age_max: int | None = None

    state_availability: list[str] | None = None
    required_documents: list[str] | None = None
    application_link: HttpUrl | None = None
    offline_office: str | None = None
    application_steps: list[str] | None = None
    last_date: date | None = None
    benefits: str | None = None

    eligibility_rules: dict | None = None


class SchemeCreate(SchemeBase):
    pass


class SchemeUpdate(BaseModel):
    ministry: str | None = Field(default=None, max_length=256)
    description: str | None = None
    target_group: str | None = Field(default=None, max_length=256)
    income_limit: int | None = None
    age_min: int | None = None
    age_max: int | None = None
    state_availability: list[str] | None = None
    required_documents: list[str] | None = None
    application_link: HttpUrl | None = None
    last_date: date | None = None
    benefits: str | None = None
    eligibility_rules: dict | None = None


class SchemeOut(SchemeBase):
    id: UUID
    fraud_warnings: list[str] = []

    model_config = {"from_attributes": True}
