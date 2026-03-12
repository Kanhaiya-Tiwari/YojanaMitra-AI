from __future__ import annotations

from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ym_shared.security import decode_access_token

from .settings import settings


_bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class Actor:
    user_id: str
    role: str


def get_actor(creds: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> Actor | None:
    if creds is None:
        return None
    s = settings()
    try:
        claims = decode_access_token(
            creds.credentials,
            secret=s.jwt.secret,
        )
        if claims and "sub" in claims and "role" in claims:
            return Actor(user_id=claims["sub"], role=claims["role"])
        return None
    except Exception:  # noqa: BLE001
        return None


def require_auth(actor: Actor | None = Depends(get_actor)) -> Actor:
    if actor is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return actor


def require_admin(actor: Actor = Depends(require_auth)) -> Actor:
    if actor.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return actor

