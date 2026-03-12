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
    """Render a helpful reply with ChatGPT-style formatting and detailed information."""
    lang = (language or "en").lower()
    is_hindi = lang.startswith("hi")
    
    # Personalized greeting based on extracted profile
    greeting = ""
    if extracted:
        if extracted.get("state"):
            greeting = f"नमस्ते! I see you're from {extracted['state']}. " if is_hindi else f"Hello! I see you're from {extracted['state']}. "
        elif extracted.get("occupation"):
            greeting = f"नमस्ते! As a {extracted['occupation']}, " if is_hindi else f"Hello! As a {extracted['occupation']}, "
        else:
            greeting = "नमस्ते! " if is_hindi else "Hello! "
    else:
        greeting = "नमस्ते! " if is_hindi else "Hello! "
    
    if schemes:
        # Create engaging introduction
        if is_hindi:
            intro = f"{greeting}आपके लिए **{len(schemes)} महत्वपूर्ण सरकारी योजनाएं** मिली हैं जिनका लाभ आप उठा सकते हैं! 🇮🇳\n\n"
        else:
            intro = f"{greeting}I found **{len(schemes)} amazing government schemes** that you're eligible for! 🇮🇳\n\n"
        
        # Format each scheme with rich details
        scheme_details = []
        for idx, scheme in enumerate(schemes, 1):
            scheme_name = scheme.name
            benefits = scheme.benefits or "Excellent benefits available"
            
            if is_hindi:
                detail = f"### 🎯 {idx}. {scheme_name}\n\n"
                detail += f"**💰 लाभ:** {benefits}\n\n"
                if scheme.application_link:
                    detail += f"**🌐 ऑनलाइन आवेदन:** [यहां क्लिक करें]({scheme.application_link})\n\n"
                if scheme.offline_office:
                    detail += f"**🏢 ऑफलाइन:** {scheme.offline_office}\n\n"
                detail += f"**📋 आवश्यक दस्तावेज:** {', '.join(scheme.required_documents or ['Aadhaar', 'Bank Details'])}\n\n"
                detail += "---\n\n"
            else:
                detail = f"### 🎯 {idx}. {scheme_name}\n\n"
                detail += f"**💰 Benefits:** {benefits}\n\n"
                if scheme.application_link:
                    detail += f"**🌐 Apply Online:** [Click Here]({scheme.application_link})\n\n"
                if scheme.offline_office:
                    detail += f"**🏢 Offline Office:** {scheme.offline_office}\n\n"
                detail += f"**📋 Required Documents:** {', '.join(scheme.required_documents or ['Aadhaar', 'Bank Details'])}\n\n"
                detail += "---\n\n"
            
            scheme_details.append(detail)
        
        # Add helpful conclusion
        if is_hindi:
            conclusion = (
                "### 📝 आगे क्या करें?\n\n"
                "1. **जल्दी करें:** कई योजनाओं की समय सीमा सीमित है\n"
                "2. **दस्तावेज तैयार रखें:** सभी आवश्यक कागजात पहले से तैयार करें\n"
                "3. **सहायता लें:** CSC केंद्र या संबंधित कार्यालय से मदद ले सकते हैं\n\n"
                "क्या आप किसी विशेष योजना के बारे में और जानना चाहते हैं? मैं विस्तृत जानकारी दे सकता हूं! 😊"
            )
        else:
            conclusion = (
                "### 📝 What's Next?\n\n"
                "1. **Act Fast:** Many schemes have limited time windows\n"
                "2. **Prepare Documents:** Keep all required documents ready\n"
                "3. **Get Help:** Visit CSC centers or concerned offices for assistance\n\n"
                "Would you like detailed information about any specific scheme? I can provide step-by-step guidance! 😊"
            )
        
        return intro + "".join(scheme_details) + conclusion
    
    else:
        # No schemes found - provide helpful guidance
        if is_hindi:
            return (
                f"{greeting}"
                "मैंने आपकी जानकारी के आधार पर योजनाएं खोजने का प्रयास किया, लेकिन अभी कोई मेल खाने वाली योजना नहीं मिली। 😔\n\n"
                "### 💡 सुझाव:\n"
                "• अपने बारे में अधिक जानकारी दें - उम्र, आय, राज्य, व्यवसाय\n"
                "• कुछ योजनाओं के लिए विशिष्ट पात्रता मानदंड होते हैं\n"
                "• मैं आपकी प्रोफाइल के अनुसार सबसे उपयुक्त योजनाएं ढूंढ सकता हूं\n\n"
                "कृपया अपनी जानकारी विस्तार से बताएं ताकि मैं आपकी सहायता बेहतर ढंग से कर सकूं! 🌟"
            )
        else:
            return (
                f"{greeting}"
                "I searched for schemes based on your information, but didn't find any exact matches at the moment. 😔\n\n"
                "### 💡 Suggestions:\n"
                "• Provide more details about yourself - age, income, state, occupation\n"
                "• Some schemes have very specific eligibility criteria\n"
                "• I can find the most suitable schemes based on your complete profile\n\n"
                "Please share more information about yourself so I can assist you better! 🌟"
            )


def create_app() -> FastAPI:
    settings = ServiceSettings.from_env("chatbot-ser-vice")
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
