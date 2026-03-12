.PHONY: up down dev prod logs seed fmt clean health test

# Development commands
dev:
	docker compose -f docker-compose.dev.yml up --build

dev-d:
	docker compose -f docker-compose.dev.yml up --build -d

# Production commands
prod:
	docker compose -f docker-compose.prod.yml up --build -d

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f --tail=200

# General commands
up:
	docker compose up --build

up-d:
	docker compose up --build -d

down:
	docker compose down -v

logs:
	docker compose logs -f --tail=200

seed:
	@TOKEN=$$(curl -sS http://localhost:8000/api/v1/auth/login -H 'content-type: application/json' -d '{"email":"admin@example.com","password":"admin12345"}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])'); \
	curl -sS -X POST http://localhost:8000/api/v1/admin/seed-schemes -H "Authorization: Bearer $$TOKEN" | python3 -m json.tool

# Health checks
health:
	@echo "Checking service health..."
	@curl -s http://localhost:8000/healthz || echo "API Gateway: DOWN"
	@curl -s http://localhost:8002/healthz || echo "Scheme Service: DOWN"
	@curl -s http://localhost:8003/healthz || echo "User Service: DOWN"
	@curl -s http://localhost:8004/healthz || echo "Eligibility Service: DOWN"
	@curl -s http://localhost:8005/healthz || echo "Chatbot Service: DOWN"
	@curl -s http://localhost:8006/healthz || echo "Notification Service: DOWN"
	@curl -s http://localhost:3000 || echo "Frontend: DOWN"

# Testing
test:
	@echo "Running API tests..."
	@curl -s http://localhost:8000/api/v1/schemes | python3 -c "import sys,json; data=json.load(sys.stdin); print(f' Schemes API: {len(data)} schemes')"
	@curl -s http://localhost:8000/api/v1/chat -H 'content-type: application/json' -d '{"message":"test","language":"en","profile":null}' | python3 -c "import sys,json; data=json.load(sys.stdin); print(' Chat API: Working')"

# Cleanup
clean:
	docker compose down -v --remove-orphans
	docker system prune -f
	docker volume prune -f

# Code formatting
fmt:
	@echo "Formatting Python code..."
	@find services -name "*.py" -exec black {} \;
	@echo "Formatting TypeScript code..."
	@cd frontend && npm run format

# Database operations
db-reset:
	docker compose exec postgres psql -U postgres -d yojanamitra -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	$(MAKE) seed

db-backup:
	docker compose exec postgres pg_dump -U postgres yojanamitra > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Service restart
restart-api:
	docker compose restart api-gateway

restart-frontend:
	docker compose restart frontend

# Development helpers
dev-logs:
	docker compose logs -f api-gateway chatbot-service frontend

ps:
	docker compose ps

# Production deployment
deploy:
	$(MAKE) clean
	$(MAKE) prod
	$(MAKE) seed
	$(MAKE) health
