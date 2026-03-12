# YojanaMitra AI - Microservices Architecture

## 🏗️ Overview

YojanaMitra AI is built on a complete microservices architecture following best practices for scalability, maintainability, and deployment. Every service runs in its own Docker container with proper health checks, logging, and monitoring.

## 📋 Services List

### Core Services

| Service | Port | Technology | Purpose | Health Check |
|---------|------|-------------|---------|--------------|
| **Frontend** | 3000 | Next.js 14 | User interface with animations | `GET /` |
| **API Gateway** | 8000 | FastAPI | Authentication, routing, rate limiting | `GET /healthz` |
| **User Service** | 8003 | FastAPI | User management, profiles, applications | `GET /healthz` |
| **Scheme Service** | 8002 | FastAPI | Scheme database, search, seeding | `GET /healthz` |
| **Eligibility Service** | 8004 | FastAPI | Eligibility engine, rule evaluation | `GET /healthz` |
| **Chatbot Service** | 8005 | FastAPI | AI chatbot, NLP, profile extraction | `GET /healthz` |
| **Notification Service** | 8006 | FastAPI | WhatsApp, SMS, email notifications | `GET /healthz` |

### Infrastructure Services

| Service | Port | Technology | Purpose |
|---------|------|-------------|---------|
| **PostgreSQL** | 5432 | PostgreSQL 16 | Primary database for all services |
| **Redis** | 6379 | Redis 7 | Caching, sessions, rate limiting |

## 🐳 Docker Configuration

### Dockerfiles
All services have dedicated Dockerfiles in `devops/dockerfiles/`:

- `frontend.Dockerfile` - Multi-stage Next.js build
- `api-gateway.Dockerfile` - FastAPI with shared library
- `user-service.Dockerfile` - FastAPI with shared library
- `scheme-service.Dockerfile` - FastAPI with shared library
- `eligibility-service.Dockerfile` - FastAPI with shared library
- `chatbot-service.Dockerfile` - FastAPI with shared library
- `notification-service.Dockerfile` - FastAPI with shared library

### Docker Compose Files

#### `docker-compose.yml`
- Basic development setup
- All services with basic configuration
- Exposes ports for local development

#### `docker-compose.dev.yml`
- Development-optimized configuration
- Health checks for all services
- Volume mounts for live code editing
- Proper service dependencies
- Development environment variables

#### `docker-compose.prod.yml`
- Production-ready configuration
- No volume mounts (read-only images)
- Restart policies
- Nginx reverse proxy ready
- Environment-based configuration

## 🔄 Service Dependencies

```
Frontend
    ↓
API Gateway
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   User Service  │  Scheme Service │Eligibility Service│
│                 │                 │                 │
│                 │                 │         ↓       │
│                 │                 │  Chatbot Service │
│                 │                 │                 │
│                 │                 │         ↓       │
│                 │                 │Notification Service│
└─────────────────┴─────────────────┴─────────────────┘
    ↓                 ↓                 ↓
            PostgreSQL Database
```

## 🌐 API Architecture

### Gateway Routes
All external requests go through the API Gateway:

```
/api/v1/auth/*      → User Service
/api/v1/users/*     → User Service
/api/v1/schemes/*   → Scheme Service
/api/v1/eligibility/* → Eligibility Service
/api/v1/chat/*      → Chatbot Service
/api/v1/notifications/* → Notification Service
/api/v1/admin/*     → Various Services
```

### Authentication Flow
1. User requests JWT token from `/api/v1/auth/login`
2. Token passed in `Authorization: Bearer <token>` header
3. API Gateway validates token and forwards to services
4. Services validate token and extract user context

## 🗄️ Database Architecture

### PostgreSQL Schema
Each service manages its own database schema:

- `users` - User profiles, applications, tracking
- `schemes` - Government schemes, metadata, rules
- `eligibility` - Evaluation results, cache
- `notifications` - Message logs, delivery status

### Shared Library
`services/_shared/` provides common utilities:
- Database models and sessions
- Authentication middleware
- HTTP client configuration
- Logging and error handling
- Configuration management

## 🔒 Security Features

### Authentication
- JWT-based authentication with 15-minute expiry
- Secure password hashing with bcrypt
- Role-based access control (admin/user)

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- SQL injection prevention

### Infrastructure Security
- Docker containers run as non-root users
- Environment-based configuration
- Health checks for all services
- Automatic restart on failure

## 📊 Monitoring & Observability

### Health Checks
Every service exposes `/healthz` endpoint:
```json
{
  "ok": true,
  "timestamp": "2024-03-13T00:00:00Z",
  "service": "user-service",
  "version": "0.1.0"
}
```

### Logging
- Structured JSON logging
- Service correlation IDs
- Request/response logging
- Error tracking

### Metrics
- Container resource usage
- API response times
- Database connection pools
- Cache hit rates

## 🚀 Deployment

### Development
```bash
make dev          # Start development stack
make dev-d        # Start in background
make dev-logs     # View development logs
```

### Production
```bash
make deploy       # Full production deployment
make prod         # Start production stack
make prod-logs    # View production logs
```

### Commands
```bash
make health       # Check all services
make test         # Run API tests
make seed         # Seed database
make clean        # Clean up resources
make logs         # View all logs
make down         # Stop all services
```

## 🔧 Development Workflow

### Adding New Services
1. Create service directory under `services/`
2. Implement FastAPI application with `/healthz`
3. Create Dockerfile in `devops/dockerfiles/`
4. Add to all docker-compose files
5. Update API Gateway routing
6. Add health checks to Makefile

### Database Migrations
- Alembic for schema migrations
- Automatic migration on service start
- Rollback capabilities
- Migration testing

### Code Organization
```
services/
├── _shared/           # Shared utilities
├── user-service/      # User management
├── scheme-service/    # Scheme database
├── eligibility-service/ # Eligibility engine
├── chatbot-service/   # AI chatbot
└── notification-service/ # Notifications
```

## 🌟 Key Features

### Microservices Benefits
- **Scalability**: Scale individual services independently
- **Resilience**: Failure isolation between services
- **Maintainability**: Clear service boundaries
- **Deployment**: Zero-downtime deployments
- **Development**: Teams can work independently

### Technical Excellence
- **Docker**: Complete containerization
- **Health Checks**: Comprehensive monitoring
- **Shared Library**: Code reuse and consistency
- **API Gateway**: Centralized routing and security
- **Environment Management**: Dev/staging/prod parity

### Production Ready
- **Multi-stage Docker builds**: Optimized image sizes
- **Health checks**: Automatic recovery
- **Logging**: Structured and searchable
- **Monitoring**: Resource usage tracking
- **Security**: Defense in depth

## 📈 Performance

### Response Times
- API Gateway: <50ms
- Scheme Search: <100ms
- Chatbot Response: <500ms
- Eligibility Check: <200ms

### Scalability
- Horizontal scaling with Docker Compose
- Database connection pooling
- Redis caching for frequent queries
- CDN-ready static assets

### Reliability
- 99.9% uptime target
- Automatic failover
- Graceful degradation
- Circuit breakers for external services

---

This microservices architecture ensures YojanaMitra AI is production-ready, scalable, and maintainable while following industry best practices.
