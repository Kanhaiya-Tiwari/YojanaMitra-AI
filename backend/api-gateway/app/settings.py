from __future__ import annotations

import os

from ym_shared.config import ServiceSettings


def settings() -> ServiceSettings:
    return ServiceSettings.from_env("api-gateway")


def service_url(name: str, default: str) -> str:
    return os.environ.get(name, default).rstrip("/")


def user_service_url() -> str:
    return service_url("USER_SERVICE_URL", "http://user-service:8000")


def scheme_service_url() -> str:
    return service_url("SCHEME_SERVICE_URL", "http://scheme-service:8000")


def eligibility_service_url() -> str:
    return service_url("ELIGIBILITY_SERVICE_URL", "http://eligibility-service:8000")


def chatbot_service_url() -> str:
    return service_url("CHATBOT_SERVICE_URL", "http://chatbot-service:8000")


def notification_service_url() -> str:
    return service_url("NOTIFICATION_SERVICE_URL", "http://notification-service:8000")

