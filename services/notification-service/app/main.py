from __future__ import annotations

import os
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware

from ym_shared.config import ServiceSettings
from ym_shared.http import make_async_client


def _chatbot_service_url() -> str:
    return os.environ.get("CHATBOT_SERVICE_URL", "http://chatbot-service:8000").rstrip("/")


def _whatsapp_verify_token() -> str | None:
    return os.environ.get("WHATSAPP_VERIFY_TOKEN")


def _whatsapp_access_token() -> str | None:
    return os.environ.get("WHATSAPP_ACCESS_TOKEN")


def _whatsapp_phone_number_id() -> str | None:
    return os.environ.get("WHATSAPP_PHONE_NUMBER_ID")


async def _send_whatsapp_text(to_phone: str, text: str) -> None:
    token = _whatsapp_access_token()
    phone_number_id = _whatsapp_phone_number_id()
    if not token or not phone_number_id:
        # Not configured; noop in dev.
        return

    url = f"https://graph.facebook.com/v18.0/{phone_number_id}/messages"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "text",
        "text": {"body": text[:4096]},
    }

    async with httpx.AsyncClient(timeout=httpx.Timeout(10.0)) as client:
        resp = await client.post(url, headers=headers, json=payload)
        resp.raise_for_status()


def create_app() -> FastAPI:
    settings = ServiceSettings.from_env("notification-service")
    app = FastAPI(title="Notification Service", version="0.1.0")
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

    @app.get("/whatsapp/webhook")
    def whatsapp_verify(
        mode: str | None = Query(default=None, alias="hub.mode"),
        verify_token: str | None = Query(default=None, alias="hub.verify_token"),
        challenge: str | None = Query(default=None, alias="hub.challenge"),
    ):
        expected = _whatsapp_verify_token()
        if mode == "subscribe" and expected and verify_token == expected and challenge:
            return int(challenge)
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Verification failed")

    @app.post("/whatsapp/webhook")
    async def whatsapp_webhook(request: Request) -> dict:
        body: dict[str, Any] = await request.json()

        # Best-effort parse of WhatsApp Cloud webhook message payload
        try:
            entry = (body.get("entry") or [])[0]
            changes = (entry.get("changes") or [])[0]
            value = changes.get("value") or {}
            messages = value.get("messages") or []
            if not messages:
                return {"ok": True}
            msg = messages[0]
            from_phone = msg.get("from")
            text = (msg.get("text") or {}).get("body") or ""
        except Exception:  # noqa: BLE001
            return {"ok": True}

        if not from_phone or not text:
            return {"ok": True}

        async with make_async_client() as client:
            resp = await client.post(f"{_chatbot_service_url()}/chat", json={"message": text, "language": "hi"})
            resp.raise_for_status()
            chat = resp.json()
            reply_text = str(chat.get("reply_text") or "")

        try:
            await _send_whatsapp_text(from_phone, reply_text)
        except httpx.HTTPError:
            # Swallow provider errors in webhook handler; log in real deployments.
            pass

        return {"ok": True}

    return app


app = create_app()

