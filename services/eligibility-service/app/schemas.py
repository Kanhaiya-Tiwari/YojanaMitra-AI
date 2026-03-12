from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl


class Profile(BaseModel):
    name: str | None = None
    age: int | None = Field(default=None, ge=0, le=120)
    gender: str | None = None
    state: str | None = None
    district: str | None = None
    occupation: str | None = None
    income: int | None = Field(default=None, ge=0)
    education: str | None = None
    category: str | None = None

    is_farmer: bool = False
    is_student: bool = False
    is_business_owner: bool = False
    is_job_seeker: bool = False

    land_ownership: bool = False
    land_acres: int | None = Field(default=None, ge=0)
    disability_status: bool = False

    location_rural: bool = False


class EligibilityEvaluateRequest(BaseModel):
    profile: Profile
    limit: int = Field(default=50, ge=1, le=200)


class EligibleScheme(BaseModel):
    id: UUID
    name: str
    ministry: str | None = None
    description: str
    benefits: str | None = None
    application_link: HttpUrl | None = None
    offline_office: str | None = None
    application_steps: list[str] | None = None
    required_documents: list[str] | None = None
    fraud_warnings: list[str] = []
    why: list[str] = []


class EligibilityEvaluateResponse(BaseModel):
    eligible: list[EligibleScheme]
    ineligible_count: int = 0
