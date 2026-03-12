.PHONY: up down logs seed fmt

up:
\tdocker compose up --build

down:
\tdocker compose down -v

logs:
\tdocker compose logs -f --tail=200

seed:
\t@TOKEN=$$(curl -sS http://localhost:8000/api/v1/auth/login -H 'content-type: application/json' -d '{"email":"admin@example.com","password":"admin12345"}' | python -c 'import sys,json;print(json.load(sys.stdin)["access_token"])'); \\\n+\tcurl -sS -X POST http://localhost:8000/api/v1/admin/seed-schemes -H "Authorization: Bearer $$TOKEN" | python -m json.tool
