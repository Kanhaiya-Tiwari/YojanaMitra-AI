from __future__ import annotations

from datetime import timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from ym_shared.config import ServiceSettings
from ym_shared.security import create_access_token, hash_password, verify_password

from .auth import Actor, get_actor, require_roles
from .db_session import get_session
from .models import Application, User, UserProfile
from .schemas import (
    ApplicationCreate,
    ApplicationOut,
    ApplicationUpdate,
    LoginRequest,
    ProfileOut,
    ProfileUpsert,
    RegisterRequest,
    TokenResponse,
    UserOut,
)


router = APIRouter()


def get_settings() -> ServiceSettings:
    return ServiceSettings.from_env("user-service")


@router.get("/healthz")
def healthz() -> dict:
    return {"ok": True}


@router.post("/auth/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, session: Session = Depends(get_session)) -> UserOut:
    if not payload.phone and not payload.email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone or email required")

    clauses = []
    if payload.phone:
        clauses.append(User.phone == payload.phone)
    if payload.email:
        clauses.append(User.email == payload.email)
    stmt = select(User).where(or_(*clauses))
    existing = session.execute(stmt).scalars().first()
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")

    user = User(
        phone=payload.phone,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="user",
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return UserOut.model_validate(user)


@router.post("/auth/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    session: Session = Depends(get_session),
    settings: ServiceSettings = Depends(get_settings),
) -> TokenResponse:
    if not payload.phone and not payload.email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone or email required")

    clauses = []
    if payload.phone:
        clauses.append(User.phone == payload.phone)
    if payload.email:
        clauses.append(User.email == payload.email)
    stmt = select(User).where(or_(*clauses))
    user = session.execute(stmt).scalars().first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        secret=settings.jwt.secret,
        algorithm="HS256",
        expires_delta=timedelta(minutes=settings.jwt.expires_minutes),
    )
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserOut)
def me(actor: Actor = Depends(get_actor), session: Session = Depends(get_session)) -> UserOut:
    user = session.get(User, UUID(actor.user_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserOut.model_validate(user)


@router.put("/profile", response_model=ProfileOut)
def upsert_profile(
    payload: ProfileUpsert,
    actor: Actor = Depends(get_actor),
    session: Session = Depends(get_session),
) -> ProfileOut:
    user_id = UUID(actor.user_id)
    profile = session.execute(select(UserProfile).where(UserProfile.user_id == user_id)).scalars().first()
    data = payload.model_dump()
    if profile is None:
        profile = UserProfile(user_id=user_id, **data)
        session.add(profile)
    else:
        for k, v in data.items():
            setattr(profile, k, v)
    session.commit()
    session.refresh(profile)
    return ProfileOut.model_validate(profile)


@router.get("/profile", response_model=ProfileOut)
def get_profile(actor: Actor = Depends(get_actor), session: Session = Depends(get_session)) -> ProfileOut:
    user_id = UUID(actor.user_id)
    profile = session.execute(select(UserProfile).where(UserProfile.user_id == user_id)).scalars().first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return ProfileOut.model_validate(profile)


@router.post("/applications", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: ApplicationCreate,
    actor: Actor = Depends(get_actor),
    session: Session = Depends(get_session),
) -> ApplicationOut:
    application = Application(
        user_id=UUID(actor.user_id),
        scheme_id=payload.scheme_id,
        scheme_name=payload.scheme_name,
        status="pending",
    )
    session.add(application)
    session.commit()
    session.refresh(application)
    return ApplicationOut.model_validate(application)


@router.get("/applications", response_model=list[ApplicationOut])
def list_applications(actor: Actor = Depends(get_actor), session: Session = Depends(get_session)) -> list[ApplicationOut]:
    user_id = UUID(actor.user_id)
    apps = session.execute(select(Application).where(Application.user_id == user_id)).scalars().all()
    return [ApplicationOut.model_validate(a) for a in apps]


@router.patch(
    "/applications/{application_id}",
    response_model=ApplicationOut,
    dependencies=[Depends(require_roles("ngo", "admin"))],
)
def update_application(
    application_id: UUID,
    payload: ApplicationUpdate,
    session: Session = Depends(get_session),
) -> ApplicationOut:
    app_row = session.get(Application, application_id)
    if app_row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    app_row.status = payload.status
    app_row.notes = payload.notes
    session.commit()
    session.refresh(app_row)
    return ApplicationOut.model_validate(app_row)


@router.get("/admin/stats", dependencies=[Depends(require_roles("admin"))])
def admin_stats(session: Session = Depends(get_session)) -> dict:
    users_total = session.execute(select(func.count(User.id))).scalar_one()
    users_by_role = dict(
        session.execute(select(User.role, func.count(User.id)).group_by(User.role)).all(),
    )

    profiles_by_state_rows = session.execute(
        select(UserProfile.state, func.count(UserProfile.id)).group_by(UserProfile.state),
    ).all()
    profiles_by_state = {str(state or "Unknown"): int(count) for state, count in profiles_by_state_rows}

    applications_total = session.execute(select(func.count(Application.id))).scalar_one()
    applications_by_status = dict(
        session.execute(select(Application.status, func.count(Application.id)).group_by(Application.status)).all(),
    )
    top_schemes_rows = session.execute(
        select(Application.scheme_id, Application.scheme_name, func.count(Application.id).label("c"))
        .group_by(Application.scheme_id, Application.scheme_name)
        .order_by(func.count(Application.id).desc())
        .limit(10),
    ).all()
    top_schemes = [
        {"scheme_id": str(scheme_id), "scheme_name": scheme_name, "count": int(c)}
        for scheme_id, scheme_name, c in top_schemes_rows
    ]

    return {
        "users_total": int(users_total),
        "users_by_role": {str(k): int(v) for k, v in users_by_role.items()},
        "profiles_by_state": profiles_by_state,
        "applications_total": int(applications_total),
        "applications_by_status": {str(k): int(v) for k, v in applications_by_status.items()},
        "top_schemes": top_schemes,
    }
