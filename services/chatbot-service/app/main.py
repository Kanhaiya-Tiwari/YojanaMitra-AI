from __future__ import annotations

import os
from typing import Any

import httpx
from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware

from ym_shared.config import ServiceSettings
from ym_shared.http import make_async_client

from .extract import extract_profile
from .llm import maybe_llm_extract_profile
from .schemas import ChatRequest, ChatResponse, SchemeCard
from .voice import transcribe_with_openai


def _eligibility_service_url() -> str:
    return os.environ.get("ELIGIBILITY_SERVICE_URL", "http://eligibility-service:8000").rstrip("/")


def _render_reply(language: str, extracted: dict, schemes: list[SchemeCard]) -> str:
    lang = (language or "en").lower()
    if not schemes:
        if lang.startswith("hi"):
            return "मुझे अभी आपके लिए कोई पक्का मैच नहीं मिला। कृपया अपनी उम्र, आय, राज्य, और आप किसान/छात्र/व्यवसायी हैं या नहीं—यह जानकारी भेजें।"
        return "I couldn’t find a strong match yet. Please share your age, income, state, and whether you are a farmer/student/business owner/job seeker."

    top = schemes[:5]
    if lang.startswith("hi"):
        lines = ["आपके प्रोफाइल के आधार पर ये योजनाएँ उपयुक्त लगती हैं:"]
        for sc in top:
            lines.append(f"- {sc.name} — {sc.benefits or ''}".rstrip())
        lines.append("अगर आप चाहें तो मैं दस्तावेज़ों की चेकलिस्ट और आवेदन के स्टेप्स भी बता दूँ।")
        return "\n".join(lines)

    lines = ["Based on your details, you may be eligible for:"]
    for sc in top:
        benefit = f" — {sc.benefits}" if sc.benefits else ""
        lines.append(f"- {sc.name}{benefit}")
    lines.append("Tell me if you want a document checklist and step-by-step application guide for any scheme.")
    return "\n".join(lines)


def create_app() -> FastAPI:
    settings = ServiceSettings.from_env("chatbot-service")
    app = FastAPI(title="Chatbot Service", version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/healthz")
    def healthz() -> dict:
        return {"ok": True}

    @app.post("/chat", response_model=ChatResponse)
    async def chat(payload: ChatRequest) -> ChatResponse:
        base_profile = payload.profile.model_dump() if payload.profile else {}
        llm_profile = await maybe_llm_extract_profile(payload.message, language=payload.language)
        merged_base = dict(base_profile)
        if isinstance(llm_profile, dict):
            merged_base.update({k: v for k, v in llm_profile.items() if v is not None})
        extracted = extract_profile(payload.message, base=merged_base)

        req = {"profile": extracted, "limit": 50}
        async with make_async_client() as client:
            resp = await client.post(f"{_eligibility_service_url()}/eligibility/evaluate", json=req)
            resp.raise_for_status()
            data: dict[str, Any] = resp.json()

        eligible_raw = data.get("eligible") or []
        schemes = [
            SchemeCard(
                id=str(sc.get("id")),
                name=str(sc.get("name")),
                benefits=sc.get("benefits"),
                application_link=sc.get("application_link"),
                offline_office=sc.get("offline_office"),
                application_steps=sc.get("application_steps"),
                required_documents=sc.get("required_documents"),
                fraud_warnings=sc.get("fraud_warnings") or [],
            )
            for sc in eligible_raw
        ]

        reply = _render_reply(payload.language, extracted, schemes)
        return ChatResponse(reply_text=reply, extracted_profile=extracted, eligible_schemes=schemes)

    @app.post("/voice/transcribe")
    async def voice_transcribe(file: UploadFile = File(...)) -> dict:
        try:
            data = await file.read()
            text = await transcribe_with_openai(
                filename=file.filename or "audio",
                content_type=file.content_type or "application/octet-stream",
                data=data,
            )
            return {"text": text}
        except RuntimeError as exc:
            raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=str(exc)) from exc
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Transcription provider error") from exc

    @app.post("/voice/chat", response_model=ChatResponse)
    async def voice_chat(file: UploadFile = File(...), language: str = "hi") -> ChatResponse:
        if not os.environ.get("OPENAI_API_KEY"):
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Voice is not configured. Set OPENAI_API_KEY or wire another STT provider.",
            )
        data = await file.read()
        text = await transcribe_with_openai(
            filename=file.filename or "audio",
            content_type=file.content_type or "application/octet-stream",
            data=data,
        )
        return await chat(ChatRequest(message=text, profile=None, language=language))

    return app


app = create_app()
