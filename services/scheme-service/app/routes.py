from __future__ import annotations

from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .auth import require_admin
from .db_session import get_session
from .fraud import fraud_warnings
from .models import Scheme
from .schemas import SchemeCreate, SchemeOut, SchemeUpdate
from .seed import seed_from_file


router = APIRouter()


@router.get("/healthz")
def healthz() -> dict:
    return {"ok": True}


@router.get("/schemes", response_model=list[SchemeOut])
def list_schemes(
    q: str | None = Query(default=None, description="Search by scheme name/description"),
    state: str | None = Query(default=None, description="State filter (case-insensitive)"),
    limit: int = Query(default=200, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_session),
) -> list[SchemeOut]:
    stmt = select(Scheme)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where((Scheme.name.ilike(like)) | (Scheme.description.ilike(like)))
    stmt = stmt.order_by(Scheme.name).limit(limit).offset(offset)
    schemes = list(session.execute(stmt).scalars().all())

    if state:
        s = state.strip().lower()
        schemes = [
            sc
            for sc in schemes
            if not sc.state_availability
            or any((st or "").strip().lower() == s for st in sc.state_availability)
        ]

    out: list[SchemeOut] = []
    for sc in schemes:
        data = SchemeOut.model_validate(sc)
        data.fraud_warnings = fraud_warnings(sc.application_link)
        out.append(data)
    return out


@router.get("/schemes/{scheme_id}", response_model=SchemeOut)
def get_scheme(scheme_id: UUID, session: Session = Depends(get_session)) -> SchemeOut:
    scheme = session.get(Scheme, scheme_id)
    if scheme is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
    data = SchemeOut.model_validate(scheme)
    data.fraud_warnings = fraud_warnings(scheme.application_link)
    return data


@router.post("/admin/schemes", response_model=SchemeOut, dependencies=[Depends(require_admin)])
def create_scheme(payload: SchemeCreate, session: Session = Depends(get_session)) -> SchemeOut:
    existing = session.query(Scheme).filter(Scheme.name == payload.name).one_or_none()
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Scheme already exists")
    scheme = Scheme(**payload.model_dump(mode="json"))
    session.add(scheme)
    session.commit()
    session.refresh(scheme)
    data = SchemeOut.model_validate(scheme)
    data.fraud_warnings = fraud_warnings(scheme.application_link)
    return data


@router.patch(
    "/admin/schemes/{scheme_id}",
    response_model=SchemeOut,
    dependencies=[Depends(require_admin)],
)
def update_scheme(scheme_id: UUID, payload: SchemeUpdate, session: Session = Depends(get_session)) -> SchemeOut:
    scheme = session.get(Scheme, scheme_id)
    if scheme is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
    for k, v in payload.model_dump(exclude_unset=True, mode="json").items():
        setattr(scheme, k, v)
    session.commit()
    session.refresh(scheme)
    data = SchemeOut.model_validate(scheme)
    data.fraud_warnings = fraud_warnings(scheme.application_link)
    return data


@router.post("/admin/seed", dependencies=[Depends(require_admin)])
def seed_default(session: Session = Depends(get_session)) -> dict:
    seed_path = Path(__file__).resolve().parent.parent / "data" / "comprehensive_schemes_100.json"
    result = seed_from_file(session, seed_path)
    session.commit()
    return {"ok": True, **result}
