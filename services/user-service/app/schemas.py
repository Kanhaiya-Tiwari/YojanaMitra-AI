from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    phone: str | None = Field(default=None, max_length=32)
    email: str | None = Field(default=None, max_length=256)
    password: str = Field(..., min_length=8, max_length=256)


class LoginRequest(BaseModel):
    phone: str | None = Field(default=None, max_length=32)
    email: str | None = Field(default=None, max_length=256)
    password: str = Field(..., min_length=8, max_length=256)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: UUID
    phone: str | None
    email: str | None
    role: str

    model_config = {"from_attributes": True}


class ProfileUpsert(BaseModel):
    name: str | None = Field(default=None, max_length=256)
    age: int | None = Field(default=None, ge=0, le=120)
    gender: str | None = Field(default=None, max_length=32)
    state: str | None = Field(default=None, max_length=64)
    district: str | None = Field(default=None, max_length=64)
    occupation: str | None = Field(default=None, max_length=64)
    income: int | None = Field(default=None, ge=0)
    education: str | None = Field(default=None, max_length=128)
    category: str | None = Field(default=None, max_length=32)

    is_farmer: bool = False
    is_student: bool = False
    is_business_owner: bool = False
    is_job_seeker: bool = False

    land_ownership: bool = False
    land_acres: int | None = Field(default=None, ge=0)
    disability_status: bool = False
    location_rural: bool = False
    preferred_language: str = Field(default="en", max_length=8)


class ProfileOut(ProfileUpsert):
    user_id: UUID

    model_config = {"from_attributes": True}


class ApplicationCreate(BaseModel):
    scheme_id: UUID
    scheme_name: str = Field(..., max_length=256)


class ApplicationUpdate(BaseModel):
    status: str = Field(..., max_length=32)
    notes: str | None = None


class ApplicationOut(BaseModel):
    id: UUID
    user_id: UUID
    scheme_id: UUID
    scheme_name: str
    status: str
    notes: str | None = None

    model_config = {"from_attributes": True}
