from __future__ import annotations

from pydantic import BaseModel, Field


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

