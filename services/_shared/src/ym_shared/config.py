from __future__ import annotations

import os
from dataclasses import dataclass


def env_str(name: str, default: str | None = None) -> str | None:
    value = os.environ.get(name)
    if value is None:
        return default
    value = value.strip()
    return value if value != "" else default


def env_int(name: str, default: int) -> int:
    value = env_str(name)
    if value is None:
        return default
    return int(value)


def env_bool(name: str, default: bool = False) -> bool:
    value = env_str(name)
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "y", "on"}


def env_csv(name: str, default: str = "") -> list[str]:
    raw = env_str(name, default=default) or ""
    parts = [p.strip() for p in raw.split(",")]
    return [p for p in parts if p]


@dataclass(frozen=True)
class JwtSettings:
    secret: str
    issuer: str
    audience: str
    expires_minutes: int


@dataclass(frozen=True)
class ServiceSettings:
    service_name: str
    environment: str
    log_level: str
    allowed_origins: list[str]
    database_url: str
    redis_url: str | None
    jwt: JwtSettings

    @staticmethod
    def from_env(service_name: str) -> "ServiceSettings":
        jwt = JwtSettings(
            secret=env_str("JWT_SECRET", "change-me-in-prod") or "change-me-in-prod",
            issuer=env_str("JWT_ISSUER", "yojanamitra-ai") or "yojanamitra-ai",
            audience=env_str("JWT_AUDIENCE", "yojanamitra-users") or "yojanamitra-users",
            expires_minutes=env_int("JWT_EXPIRES_MINUTES", 60),
        )
        return ServiceSettings(
            service_name=service_name,
            environment=env_str("ENVIRONMENT", "dev") or "dev",
            log_level=env_str("LOG_LEVEL", "INFO") or "INFO",
            allowed_origins=env_csv("ALLOWED_ORIGINS", "http://localhost:3000"),
            database_url=env_str(
                "DATABASE_URL",
                "postgresql+psycopg://postgres:postgres@localhost:5432/yojanamitra",
            )
            or "postgresql+psycopg://postgres:postgres@localhost:5432/yojanamitra",
            redis_url=env_str("REDIS_URL"),
            jwt=jwt,
        )

