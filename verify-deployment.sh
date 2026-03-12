#!/bin/bash

echo "🚀 Verifying YojanaMitra AI Deployment..."
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $service_name... "
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" "$url"); then
        if [ "$response" -eq "$expected_status" ]; then
            echo -e "${GREEN}✅ UP ($response)${NC}"
            return 0
        else
            echo -e "${RED}❌ DOWN ($response)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Check all services
echo "📊 Checking Service Health:"
check_service "Frontend" "http://localhost:3000" 200
check_service "API Gateway" "http://localhost:8000/healthz" 200
check_service "Scheme Service" "http://localhost:8002/healthz" 200
check_service "User Service" "http://localhost:8003/healthz" 200
check_service "Eligibility Service" "http://localhost:8004/healthz" 200
check_service "Chatbot Service" "http://localhost:8005/healthz" 200
check_service "Notification Service" "http://localhost:8006/healthz" 200

echo ""
echo "🔍 Testing API Functionality:"

# Test schemes API
echo -n "Testing Schemes API... "
if schemes_response=$(curl -s "http://localhost:8000/api/v1/schemes" 2>/dev/null); then
    schemes_count=$(echo "$schemes_response" | python3 -c "import sys,json; data=json.load(sys.stdin); print(len(data))" 2>/dev/null)
    if [ "$schemes_count" -gt 0 ]; then
        echo -e "${GREEN}✅ $schemes_count schemes found${NC}"
    else
        echo -e "${RED}❌ No schemes found${NC}"
    fi
else
    echo -e "${RED}❌ API Error${NC}"
fi

# Test chat API
echo -n "Testing Chat API... "
if chat_response=$(curl -s -X POST "http://localhost:8000/api/v1/chat" \
    -H "content-type: application/json" \
    -d '{"message":"Hello, I am a student from Delhi","language":"en","profile":null}' 2>/dev/null); then
    if echo "$chat_response" | python3 -c "import sys,json; json.load(sys.stdin)" 2>/dev/null; then
        echo -e "${GREEN}✅ Chat API working${NC}"
    else
        echo -e "${RED}❌ Invalid response${NC}"
    fi
else
    echo -e "${RED}❌ Chat API Error${NC}"
fi

# Test authentication
echo -n "Testing Authentication... "
if auth_response=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
    -H "content-type: application/json" \
    -d '{"email":"admin@example.com","password":"admin12345"}' 2>/dev/null); then
    if echo "$auth_response" | python3 -c "import sys,json; data=json.load(sys.stdin); print(data.get('access_token', '')[:20])" 2>/dev/null; then
        echo -e "${GREEN}✅ Authentication working${NC}"
    else
        echo -e "${RED}❌ Authentication failed${NC}"
    fi
else
    echo -e "${RED}❌ Auth API Error${NC}"
fi

echo ""
echo "🐳 Docker Container Status:"
docker compose ps

echo ""
echo "📈 Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
echo "🌐 Access URLs:"
echo "Frontend:        http://localhost:3000"
echo "API Gateway:     http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo "Scheme Service:  http://localhost:8002/docs"
echo "User Service:    http://localhost:8003/docs"

echo ""
echo "🎯 Quick Commands:"
echo "View logs:       make logs"
echo "Stop all:        make down"
echo "Restart frontend: make restart-frontend"
echo "Restart API:     make restart-api"
echo "Health check:    make health"

echo ""
echo -e "${GREEN}✅ Deployment verification complete!${NC}"
