from __future__ import annotations

from pydantic import BaseModel, Field

from .types import Profile


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    profile: Profile | None = None
    language: str = Field(default="en", max_length=8, description="en or hi")


class SchemeCard(BaseModel):
    id: str
    name: str
    benefits: str | None = None
    application_link: str | None = None
    offline_office: str | None = None
    application_steps: list[str] | None = None
    required_documents: list[str] | None = None
    fraud_warnings: list[str] = []


class ChatResponse(BaseModel):
    reply_text: str
    extracted_profile: dict
    eligible_schemes: list[SchemeCard] = []

