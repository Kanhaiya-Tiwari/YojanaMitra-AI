from __future__ import annotations

from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ym_shared.config import ServiceSettings
from ym_shared.security import decode_access_token


_bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class Actor:
    user_id: str
    role: str


def get_settings() -> ServiceSettings:
    return ServiceSettings.from_env("scheme-service")


def get_actor(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    settings: ServiceSettings = Depends(get_settings),
) -> Actor:
    # Temporarily bypass auth for seeding
    if creds is None:
        return Actor(user_id="temp-admin", role="admin")
    try:
        claims = decode_access_token(
            creds.credentials,
            secret=settings.jwt.secret,
        )
        if claims and "sub" in claims and "role" in claims:
            return Actor(user_id=claims["sub"], role=claims["role"])
        return Actor(user_id="temp-admin", role="admin")
    except Exception as exc:  # noqa: BLE001
        # For development, allow any token
        return Actor(user_id="temp-admin", role="admin")


def require_admin(actor: Actor = Depends(get_actor)) -> Actor:
    if actor.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return actor

