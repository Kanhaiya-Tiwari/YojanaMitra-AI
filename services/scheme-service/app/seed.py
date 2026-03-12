from __future__ import annotations

import json
from pathlib import Path

from sqlalchemy.orm import Session

from .models import Scheme


def seed_from_file(session: Session, path: Path) -> dict:
    raw = json.loads(path.read_text(encoding="utf-8"))
    # Handle both old format (schemes array) and new format (direct array)
    items = raw.get("schemes", raw) if isinstance(raw, dict) else raw
    created = 0
    updated = 0

    for item in items:
        name = (item.get("name") or "").strip()
        if not name:
            continue

        existing = session.query(Scheme).filter(Scheme.name == name).one_or_none()
        if existing is None:
            session.add(Scheme(**item))
            created += 1
        else:
            for k, v in item.items():
                setattr(existing, k, v)
            updated += 1

    return {"created": created, "updated": updated, "total": created + updated}

