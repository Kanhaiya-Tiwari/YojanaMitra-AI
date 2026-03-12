FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app/services/scheme-service

COPY services/_shared /app/services/_shared
COPY services/scheme-service /app/services/scheme-service
COPY services/scheme-service/data /app/services/scheme-service/data

RUN pip install --no-cache-dir --timeout=120 --retries=5 httpx>=0.27.0 PyJWT>=2.8.0 bcrypt>=4.0.0 SQLAlchemy>=2.0.30 fastapi>=0.115.0 uvicorn[standard]>=0.30.0 pydantic>=2.7.0 python-multipart>=0.0.9 psycopg[binary]>=3.2.1
RUN pip install --no-cache-dir --timeout=120 --retries=5 -e /app/services/_shared

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

