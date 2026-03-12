from __future__ import annotations

from dataclasses import dataclass

import httpx


@dataclass(frozen=True)
class ServiceUrls:
    user_service_url: str
    scheme_service_url: str
    eligibility_service_url: str
    chatbot_service_url: str
    notification_service_url: str


def make_async_client() -> httpx.AsyncClient:
    return httpx.AsyncClient(timeout=httpx.Timeout(10.0))

