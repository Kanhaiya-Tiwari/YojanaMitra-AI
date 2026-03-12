from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ym_shared.config import ServiceSettings
from ym_shared.http import make_async_client

from .rules import evaluate
from .schemas import EligibilityEvaluateRequest, EligibilityEvaluateResponse, EligibleScheme


def _scheme_service_url() -> str:
    return os.environ.get("SCHEME_SERVICE_URL", "http://scheme-service:8000").rstrip("/")


def _profile_to_context(profile: dict[str, Any]) -> dict[str, Any]:
    state = profile.get("state")
    occupation = profile.get("occupation")

    context = dict(profile)
    context["location"] = {"rural": bool(profile.get("location_rural", False))}

    if not occupation:
        if profile.get("is_farmer"):
            context["occupation"] = "farmer"
        elif profile.get("is_student"):
            context["occupation"] = "student"
        elif profile.get("is_business_owner"):
            context["occupation"] = "business_owner"
        elif profile.get("is_job_seeker"):
            context["occupation"] = "job_seeker"

    if state:
        context["state"] = str(state).strip()

    return context


def create_app() -> FastAPI:
    settings = ServiceSettings.from_env("eligibility-service")
    app = FastAPI(title="Eligibility Service", version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/healthz")
    def healthz() -> dict:
        return {"ok": True}

    @app.post("/eligibility/evaluate", response_model=EligibilityEvaluateResponse)
    async def evaluate_eligibility(payload: EligibilityEvaluateRequest) -> EligibilityEvaluateResponse:
        context = _profile_to_context(payload.profile.model_dump())

        eligible: list[EligibleScheme] = []
        ineligible = 0

        page_size = 200
        offset = 0
        safety_max = 5000

        async with make_async_client() as client:
            while True:
                params = {"limit": page_size, "offset": offset}
                if context.get("state"):
                    params["state"] = context["state"]
                resp = await client.get(f"{_scheme_service_url()}/schemes", params=params)
                resp.raise_for_status()
                schemes: list[dict[str, Any]] = resp.json()
                if not schemes:
                    break

                for sc in schemes:
                    why: list[str] = []

                    age = context.get("age")
                    income = context.get("income")
                    age_min = sc.get("age_min")
                    age_max = sc.get("age_max")
                    income_limit = sc.get("income_limit")

                    if age is not None and age_min is not None and age < age_min:
                        ineligible += 1
                        continue
                    if age is not None and age_max is not None and age > age_max:
                        ineligible += 1
                        continue
                    if income is not None and income_limit is not None and income > income_limit:
                        ineligible += 1
                        continue

                    rules = sc.get("eligibility_rules")
                    res = evaluate(rules, context)
                    if not res.passed:
                        ineligible += 1
                        continue
                    why.extend(res.reasons)

                    eligible.append(EligibleScheme(**sc, why=why))
                    if len(eligible) >= payload.limit:
                        break

                if len(eligible) >= payload.limit:
                    break

                offset += page_size
                if offset > safety_max:
                    break

        return EligibilityEvaluateResponse(eligible=eligible, ineligible_count=ineligible)

    return app


app = create_app()
