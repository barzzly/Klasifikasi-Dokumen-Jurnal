FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first for better layer caching.
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code and the trained model.
COPY app ./app
COPY artifacts ./artifacts

ENV MODEL_PATH=artifacts/linearsvc_model.joblib \
    CORS_ORIGINS=http://localhost:5173 \
    MAX_UPLOAD_SIZE_MB=15 \
    MIN_TEXT_LENGTH=300 \
    LOG_LEVEL=INFO

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
