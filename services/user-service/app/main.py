from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ym_shared.config import ServiceSettings

from .bootstrap import bootstrap_admin
from .db_session import init_db
from .routes import router


def create_app() -> FastAPI:
    settings = ServiceSettings.from_env("user-service")
    app = FastAPI(title="User Service", version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router)

    @app.on_event("startup")
    def _startup() -> None:
        init_db(app, settings)
        session = app.state.session_factory()
        try:
            bootstrap_admin(session)
        finally:
            session.close()

    return app


app = create_app()
