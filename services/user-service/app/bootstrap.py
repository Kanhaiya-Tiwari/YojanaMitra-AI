from __future__ import annotations

import os

from sqlalchemy import select
from sqlalchemy.orm import Session

from ym_shared.security import hash_password

from .models import User


def bootstrap_admin(session: Session) -> dict | None:
    """
    Creates an initial admin user in dev/test environments.

    Enable by setting:
      - BOOTSTRAP_ADMIN_EMAIL (or BOOTSTRAP_ADMIN_PHONE)
      - BOOTSTRAP_ADMIN_PASSWORD
    """
    email = (os.environ.get("BOOTSTRAP_ADMIN_EMAIL") or "").strip() or None
    phone = (os.environ.get("BOOTSTRAP_ADMIN_PHONE") or "").strip() or None
    password = os.environ.get("BOOTSTRAP_ADMIN_PASSWORD")
    if not password or not (email or phone):
        return None

    stmt = select(User)
    if email:
        stmt = stmt.where(User.email == email)
    else:
        stmt = stmt.where(User.phone == phone)
    existing = session.execute(stmt).scalars().first()
    if existing is not None:
        if existing.role != "admin":
            existing.role = "admin"
            session.commit()
        return {"created": False, "user_id": str(existing.id)}

    user = User(
        phone=phone,
        email=email,
        password_hash=hash_password(password),
        role="admin",
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"created": True, "user_id": str(user.id)}

