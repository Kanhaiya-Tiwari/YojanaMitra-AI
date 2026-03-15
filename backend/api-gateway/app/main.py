from __future__ import annotations

from typing import Any

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from starlette.responses import JSONResponse

from .auth import require_admin, require_auth
from .proxy import proxy_request
from .settings import (
    chatbot_service_url,
    eligibility_service_url,
    scheme_service_url,
    settings,
    user_service_url,
)


limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])


def create_app() -> FastAPI:
    s = settings()
    app = FastAPI(title="API Gateway", version="0.1.0")
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, lambda _req, _exc: JSONResponse({"detail": "Rate limit exceeded"}, 429))
    app.add_middleware(SlowAPIMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=s.allowed_origins or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/healthz")
    def healthz() -> dict:
        return {"ok": True}

    # User/auth
    @app.post("/api/v1/auth/register")
    @limiter.limit("20/minute")
    async def register(request: Request) -> Any:
        body = await request.json()
        return await proxy_request(
            request=request,
            upstream_base_url=user_service_url(),
            upstream_path="/auth/register",
            method="POST",
            json_body=body,
        )

    @app.post("/api/v1/auth/login")
    @limiter.limit("20/minute")
    async def login(request: Request) -> Any:
        body = await request.json()
        return await proxy_request(
            request=request,
            upstream_base_url=user_service_url(),
            upstream_path="/auth/login",
            method="POST",
            json_body=body,
        )

    @app.get("/api/v1/me", dependencies=[Depends(require_auth)])
    async def me(request: Request):
        return await proxy_request(
            request=request,
            upstream_base_url=user_service_url(),
            upstream_path="/me",
            method="GET",
        )

    @app.put("/api/v1/profile", dependencies=[Depends(require_auth)])
    async def upsert_profile(request: Request):
        body = await request.json()
        return await proxy_request(
            request=request,
            upstream_base_url=user_service_url(),
            upstream_path="/profile",
            method="PUT",
            json_body=body,
        )

    @app.get("/api/v1/profile", dependencies=[Depends(require_auth)])
    async def get_profile(request: Request):
        return await proxy_request(
            request=request,
            upstream_base_url=user_service_url(),
            upstream_path="/profile",
            method="GET",
        )

    @app.post("/api/v1/applications", dependencies=[Depends(require_auth)])
    async def create_application(request: Request):
        body = await request.json()
        return await proxy_request(
            request=request,
            upstream_base_url=user_service_url(),
            upstream_path="/applications",
            method="POST",
            json_body=body,
        )

    @app.get("/api/v1/applications", dependencies=[Depends(require_auth)])
    async def list_applications(request: Request):
        return await proxy_request(
            request=request,
            upstream_base_url=user_service_url(),
            upstream_path="/applications",
            method="GET",
        )

    # Schemes
    @app.get("/api/v1/schemes")
    @limiter.limit("120/minute")
    async def list_schemes(request: Request):
        return await proxy_request(
            request=request,
            upstream_base_url=scheme_service_url(),
            upstream_path="/schemes",
            method="GET",
        )

    @app.get("/api/v1/schemes/{scheme_id}")
    @limiter.limit("120/minute")
    async def get_scheme(request: Request, scheme_id: str):
        return await proxy_request(
            request=request,
            upstream_base_url=scheme_service_url(),
            upstream_path=f"/schemes/{scheme_id}",
            method="GET",
        )

    @app.get("/api/v1/debug/schemes")
    @limiter.limit("60/minute")
    async def debug_schemes(request: Request):
        return await proxy_request(
            request=request,
            upstream_base_url=scheme_service_url(),
            upstream_path="/debug/schemes",
            method="GET",
        )

    # Eligibility
    @app.post("/api/v1/eligibility/evaluate")
    @limiter.limit("60/minute")
    async def eligibility_evaluate(request: Request):
        body = await request.json()
        return await proxy_request(
            request=request,
            upstream_base_url=eligibility_service_url(),
            upstream_path="/eligibility/evaluate",
            method="POST",
            json_body=body,
        )

    # Chatbot
    @app.post("/api/v1/chat")
    @limiter.limit("60/minute")
    async def chat(request: Request):
        body = await request.json()
        return await proxy_request(
            request=request,
            upstream_base_url=chatbot_service_url(),
            upstream_path="/chat",
            method="POST",
            json_body=body,
        )

    # Admin
    @app.post("/api/v1/admin/seed-schemes")  # Temporarily removed auth dependency
    async def seed_schemes(request: Request):
        return await proxy_request(
            request=request,
            upstream_base_url=scheme_service_url(),
            upstream_path="/admin/seed",
            method="POST",
        )

    @app.get("/api/v1/admin/stats", dependencies=[Depends(require_admin)])
    async def admin_stats(request: Request):
        return await proxy_request(
            request=request,
            upstream_base_url=user_service_url(),
            upstream_path="/admin/stats",
            method="GET",
        )

    return app


app = create_app()
