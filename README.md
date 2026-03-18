# YojanaMitra AI

**Core question:** "Which government schemes am I eligible for and how can I apply?"

YojanaMitra AI is a production-style, microservice-based system that:
- Builds a structured database of schemes (25+ comprehensive Indian government schemes)
- Collects user profiles and computes eligibility via rules
- Provides an AI chatbot (text/voice-ready) to extract profile signals and answer in plain language
- Guides users on documents + step-by-step application process
- Supports integrations like WhatsApp bot and notifications
- Features beautiful animated UI with Hindi/English support

## 🏗️ Microservices Architecture

### Services Overview
- **Frontend** (Next.js) - Mobile-first UI with animations, Hindi/English toggle
- **API Gateway** (FastAPI) - Authentication, rate limiting, service aggregation
- **User Service** - User management, profiles, applications, tracking
- **Scheme Service** - Scheme database, search, fraud warnings, seeding
- **Eligibility Service** - Eligibility engine with explanations
- **Chatbot Service** - Chat orchestration with AI-powered responses
- **Notification Service** - WhatsApp webhook + notifications
- **Shared Library** - Common utilities (config/auth/http/db helpers)

### Database & Infrastructure
- **PostgreSQL** - Primary database for all services
- **Redis** - Caching and session management
- **Docker Compose** - Container orchestration

## 🚀 Quickstart

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Git

### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/Kanhaiya-Tiwari/YojanaMitra-AI.git
cd YojanaMitra-AI

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. Development Deployment
```bash
# Start all services in development mode
make dev

# Or run in background
make dev-d

# View logs
make dev-logs

# Check service health
make health
```

### 3. Production Deployment
```bash
# Deploy to production
make deploy

# View production logs
make prod-logs
```

### 4. Manual Docker Commands
```bash
# Development with docker-compose.dev.yml
docker compose -f docker-compose.dev.yml up --build

# Production with docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up --build -d

# Stop all services
docker compose down -v

# View logs
docker compose logs -f --tail=200
```

## 📊 Available Services & Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js UI with animations |
| API Gateway | 8000 | Main API endpoint |
| Scheme Service | 8002 | Scheme database & search |
| User Service | 8003 | User management |
| Eligibility Service | 8004 | Eligibility engine |
| Chatbot Service | 8005 | AI chatbot |
| Notification Service | 8006 | Notifications |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache & sessions |

## 🌐 Access Points

### Frontend Application
- **Development**: http://localhost:3000
- **Features**: Beautiful animated UI, Hindi/English support, scheme search, comparison

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **API Base**: http://localhost:8000/api/v1

### Key API Endpoints
- `GET /api/v1/schemes` - List all schemes
- `POST /api/v1/chat` - Chat with AI assistant
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/admin/seed-schemes` - Seed database (admin only)

## 🎯 Make Commands

```bash
# Development
make dev          # Start development stack
make dev-d        # Start in background
make dev-logs     # View dev logs

# Production
make prod         # Deploy to production
make prod-logs    # View prod logs

# General
make up           # Start with docker-compose.yml
make down         # Stop all services
make logs         # View all logs
make health       # Check service health
make test         # Run API tests

# Database
make seed         # Seed schemes database
make db-reset     # Reset database
make db-backup    # Backup database

# Maintenance
make clean        # Clean up Docker resources
make fmt          # Format code
make ps           # Show running containers
```

## 🗄️ Database Seeding

The system comes with 25+ pre-configured Indian government schemes:

```bash
# Seed the database (automatic with make deploy)
make seed

# Manual seeding
TOKEN=$(curl -sS http://localhost:8000/api/v1/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"admin@example.com","password":"admin12345"}' | \
  python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')

curl -sS -X POST http://localhost:8000/api/v1/admin/seed-schemes \
  -H "Authorization: Bearer $TOKEN"
```

## 🎨 Features

### Frontend Features
- ✅ Beautiful animated UI with micro-interactions
- ✅ Hindi/English bilingual support
- ✅ Mobile-first responsive design
- ✅ Dark mode support
- ✅ Scheme search with advanced filters
- ✅ Scheme comparison (up to 3 schemes)
- ✅ Real-time chat with AI assistant
- ✅ Voice input support (ready for implementation)

### Backend Features
- ✅ Microservices architecture
- ✅ JWT-based authentication
- ✅ Rate limiting and security
- ✅ Comprehensive scheme database
- ✅ AI-powered eligibility matching
- ✅ Profile extraction from natural language
- ✅ Fraud warnings and safety features
- ✅ RESTful API with OpenAPI documentation

## 🔧 Development Workflow

### Adding New Schemes
1. Update `services/scheme-service/data/comprehensive_schemes.json`
2. Run `make seed` to update database

### Adding New Services
1. Create service directory under `services/`
2. Create Dockerfile in `devops/dockerfiles/`
3. Update `docker-compose.yml` and `docker-compose.dev.yml`
4. Add health checks and dependencies

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## 📁 Repository Structure

```
YojanaMitra-AI/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   └── components/     # React components
│   └── package.json
├── backend/
│   └── api-gateway/        # FastAPI gateway
├── services/               # Microservices
│   ├── user-service/
│   ├── scheme-service/
│   ├── eligibility-service/
│   ├── chatbot-service/
│   ├── notification-service/
│   └── _shared/           # Shared utilities
├── devops/
│   └── dockerfiles/       # Docker configurations
├── docker-compose.yml      # Main compose file
├── docker-compose.dev.yml  # Development config
├── docker-compose.prod.yml # Production config
├── Makefile               # Helper commands
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS ready (configure in production)
- Fraud warnings for schemes
- Secure password hashing

## 📈 Monitoring & Health Checks

All services include health check endpoints:
- `GET /healthz` - Basic health check
- Docker health checks configured
- Service dependency management
- Automatic restart on failure

## 🚀 Production Deployment

For production deployment:

1. **Environment Configuration**:
   - Update `.env` with production values
   - Set strong passwords and secrets
   - Configure domain and SSL certificates

2. **Deploy**:
   ```bash
   make deploy
   ```

3. **Monitor**:
   ```bash
   make health
   make prod-logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs`
- Review the architecture documentation in `docs/`

---

**YojanaMitra AI** - Making government schemes accessible to every Indian citizen 🇮🇳
