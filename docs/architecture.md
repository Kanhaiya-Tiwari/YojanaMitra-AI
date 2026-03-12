# Architecture — YojanaMitra AI

## Goal

Answer one core question:
> “Which government schemes am I eligible for and how can I apply?”

Everything in the system is designed to (1) collect a profile, (2) store structured schemes, (3) evaluate eligibility, and (4) guide application + documents.

## High-level services

- **API Gateway (`backend/api-gateway`)**
  - JWT auth + RBAC (user / ngo / admin)
  - Rate limiting
  - Aggregates calls to microservices under `/api/v1/*`

- **User Service (`services/user-service`)**
  - Registration/login
  - User profile (age, state, occupation, income, etc.)
  - Application tracking (pending/approved/rejected)

- **Scheme Service (`services/scheme-service`)**
  - Scheme DB (structured fields + eligibility rules)
  - Search/filter (state-aware suggestions)
  - Fraud warnings for non-official links
  - Seed/import pipeline

- **Eligibility Service (`services/eligibility-service`)**
  - Rule evaluation engine
  - Returns eligible schemes + explanations (“why eligible / why not”)

- **Chatbot Service (`services/chatbot-service`)**
  - Chat endpoint that extracts profile signals from user text (LLM optional)
  - Calls eligibility service and formats a helpful answer
  - Voice-ready endpoints (STT + chat stub)

- **Notification Service (`services/notification-service`)**
  - WhatsApp webhook + reply stub
  - Future: SMS/Email push, reminders, status updates

## Data model (core)

- `schemes`
  - `name`, `ministry`, `description`, `target_group`
  - `income_limit`, `age_min`, `age_max`
  - `state_availability[]`
  - `required_documents[]`
  - `application_link`, `last_date`, `benefits`
  - `eligibility_rules` (JSON rule expression)

- `users`
  - `phone/email`, `password_hash`, `role`

- `user_profiles`
  - name, age, gender, state, district, occupation, income, education, category, land, disability, etc.

- `applications`
  - user_id, scheme_id, status, submitted_at, last_updated_at

## Eligibility rules DSL

Schemes store rules as JSON so they can be evaluated consistently.

Example:

```json
{
  "all": [
    {"field": "occupation", "op": "eq", "value": "farmer"},
    {"field": "income", "op": "lt", "value": 200000},
    {"field": "land_ownership", "op": "truthy"}
  ]
}
```

Supported groups:
- `all`: all conditions must pass
- `any`: at least one passes
- `not`: negate a rule

Supported ops (initial set):
- `eq`, `ne`
- `lt`, `lte`, `gt`, `gte`
- `in` (value in list)
- `contains` (list contains value)
- `exists`, `truthy`, `falsy`

## Security

- JWT authentication
- Role-based access control (RBAC)
- API rate limiting in gateway
- Input validation with Pydantic models

## DevOps (starter)

- Dockerfiles for each service
- Docker Compose for local development
- Kubernetes manifests (Deployment/Service/Ingress skeleton)
- GitHub Actions pipeline for lint/tests + docker build

