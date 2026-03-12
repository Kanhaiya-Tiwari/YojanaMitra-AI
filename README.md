# YojanaMitra AI

**Core question:** “Which government schemes am I eligible for and how can I apply?”

YojanaMitra AI is a production-style, microservice-based system that:
- Builds a structured database of schemes (200–500+ target)
- Collects user profiles and computes eligibility via rules
- Provides an AI chatbot (text/voice-ready) to extract profile signals and answer in plain language
- Guides users on documents + step-by-step application process
- Supports integrations like WhatsApp bot and notifications

## Repository layout

- `frontend/` — Next.js (mobile-first UI, Hindi/English toggle)
- `backend/api-gateway/` — FastAPI API Gateway (auth, rate limiting, service aggregation)
- `services/` — FastAPI microservices
  - `services/user-service/` — users, profiles, applications, tracking
  - `services/scheme-service/` — scheme database, search, fraud warnings, seeding
  - `services/eligibility-service/` — eligibility engine + explanations
  - `services/chatbot-service/` — chat orchestration (LLM optional) + voice stubs
  - `services/notification-service/` — WhatsApp webhook + notifications stubs
  - `services/_shared/` — shared Python utilities (config/auth/http/db helpers)
- `devops/` — Dockerfiles, Kubernetes manifests, Terraform placeholders
- `docs/` — architecture + scheme ingestion notes

## Quickstart (local dev)

1. Copy env:
   - `cp .env.example .env`
2. Run stack:
   - `docker compose up --build`
3. (Optional) Run UI:
   - `cd frontend && npm install && npm run dev`
   - Set `NEXT_PUBLIC_API_BASE=http://localhost:8000` if needed
4. Seed schemes (optional):
   - Get an admin token (uses `BOOTSTRAP_ADMIN_*` from `.env`):
     - `TOKEN=$(curl -sS http://localhost:8000/api/v1/auth/login -H 'content-type: application/json' -d '{"email":"admin@example.com","password":"admin12345"}' | python -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')`
   - Seed:
     - `curl -sS -X POST http://localhost:8000/api/v1/admin/seed-schemes -H "Authorization: Bearer $TOKEN"`

## Docs

- `docs/architecture.md`
- `docs/schemes.md`
