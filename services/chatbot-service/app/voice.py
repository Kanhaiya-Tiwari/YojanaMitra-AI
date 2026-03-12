from __future__ import annotations

import os

import httpx


async def transcribe_with_openai(*, filename: str, content_type: str, data: bytes) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not configured")

    # Best-effort, OpenAI-compatible transcription endpoint.
    base_url = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.environ.get("OPENAI_WHISPER_MODEL", "gpt-4o-mini-transcribe")

    headers = {"Authorization": f"Bearer {api_key}"}
    files = {"file": (filename, data, content_type)}
    form = {"model": model}

    async with httpx.AsyncClient(timeout=httpx.Timeout(30.0)) as client:
        resp = await client.post(f"{base_url}/audio/transcriptions", headers=headers, data=form, files=files)
        resp.raise_for_status()
        out = resp.json()
        text = out.get("text")
        if not text:
            raise RuntimeError("Transcription returned no text")
        return str(text)

