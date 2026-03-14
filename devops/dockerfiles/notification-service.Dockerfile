FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app/services/notification-service

COPY requirements.txt /app/requirements.txt
COPY services/_shared /app/services/_shared
COPY services/notification-service /app/services/notification-service

RUN pip install --no-cache-dir --timeout=120 --retries=5 -r /app/requirements.txt

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

