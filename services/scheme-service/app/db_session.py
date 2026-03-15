from __future__ import annotations

import time
from collections.abc import Generator

from fastapi import Request
from sqlalchemy import text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from ym_shared.config import ServiceSettings
from ym_shared.db import make_engine, make_session_factory

from .db import Base


def init_engine_with_retry(database_url: str, *, attempts: int = 30, delay_seconds: float = 1.0) -> Engine:
    last_exc: Exception | None = None
    for _ in range(attempts):
        try:
            engine = make_engine(database_url)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return engine
        except Exception as exc:  # noqa: BLE001
            last_exc = exc
            time.sleep(delay_seconds)
    raise RuntimeError("Database not ready") from last_exc


def init_db(app, settings: ServiceSettings) -> None:  # FastAPI app type is runtime-only
    engine = init_engine_with_retry(settings.database_url)
    Base.metadata.create_all(engine)
    app.state.engine = engine
    app.state.session_factory = make_session_factory(engine)
    
    # Auto-seed database if empty
    from pathlib import Path
    from .seed import seed_from_file
    from .models import Scheme
    
    session_factory = app.state.session_factory
    session = session_factory()
    try:
        existing_count = session.query(Scheme).count()
        if existing_count == 0:
            print("Database is empty, seeding default schemes...")
            seed_path = Path(__file__).resolve().parent.parent / "data" / "comprehensive_schemes_100.json"
            result = seed_from_file(session, seed_path)
            session.commit()
            print(f"Seeded {result['total']} schemes ({result['created']} created, {result['updated']} updated)")
        else:
            print(f"Database already has {existing_count} schemes, skipping seed")
    except Exception as e:
        print(f"Error during seeding: {e}")
        session.rollback()
    finally:
        session.close()


def get_session(request: Request) -> Generator[Session, None, None]:
    session_factory: sessionmaker[Session] = request.app.state.session_factory
    session = session_factory()
    try:
        yield session
    finally:
        session.close()

