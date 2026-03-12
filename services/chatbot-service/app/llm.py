from __future__ import annotations

import json
import os

import httpx


_PROFILE_KEYS = [
    "age",
    "gender",
    "state",
    "district",
    "occupation",
    "income",
    "education",
    "category",
    "is_farmer",
    "is_student",
    "is_business_owner",
    "is_job_seeker",
    "land_ownership",
    "land_acres",
    "disability_status",
    "location_rural",
]


def _provider() -> str:
    return (os.environ.get("LLM_PROVIDER") or "").strip().lower()


async def maybe_llm_extract_profile(message: str, *, language: str = "en") -> dict | None:
    provider = _provider()
    if provider != "openai":
        return None

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None

    base_url = (os.environ.get("OPENAI_BASE_URL") or "https://api.openai.com/v1").rstrip("/")
    model = os.environ.get("OPENAI_CHAT_MODEL") or "gpt-4o-mini"

    system = (
        "You extract structured fields from a user message about government scheme eligibility in India.\n"
        "Return ONLY valid JSON (no markdown) with a single object containing keys:\n"
        f"{', '.join(_PROFILE_KEYS)}\n"
        "Use null if unknown. Use booleans for yes/no fields. Income is integer INR/year.\n"
        "If the user mentions land, set land_ownership=true and land_acres if available.\n"
        "Language hint: " + language
    )

    payload = {
        "model": model,
        "temperature": 0,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": message},
        ],
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=httpx.Timeout(20.0)) as client:
        resp = await client.post(f"{base_url}/chat/completions", headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()

    try:
        content = data["choices"][0]["message"]["content"]
        parsed = json.loads(content)
        if isinstance(parsed, dict):
            return parsed
    except Exception:  # noqa: BLE001
        return None

    return None

