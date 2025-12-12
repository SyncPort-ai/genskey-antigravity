#!/bin/bash

# Genskey Platform Startup Script
# 基因康平台启动脚本

set -e

echo "🧬 Starting Genskey Enterprise Platform..."
echo "基因康企业平台启动中..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please review and update with your configuration."
fi

# Start services based on mode
MODE=${1:-docker}

case $MODE in
  docker)
    echo "🐳 Starting with Docker Compose..."
    docker compose up -d
    echo ""
    echo "✅ Services starting..."
    echo ""
    echo "📊 Access points:"
    echo "  Frontend:     http://localhost:3000"
    echo "  Backend API:  http://localhost:8000"
    echo "  API Docs:     http://localhost:8000/api/docs"
    echo "  Neo4j:        http://localhost:7474"
    echo "  MinIO:        http://localhost:9001"
    echo ""
    echo "📝 View logs:"
    echo "  docker compose logs -f"
    ;;
    
  dev)
    echo "💻 Starting in development mode..."
    echo ""
    echo "Starting backend..."
    cd backend
    python -m venv venv 2>/dev/null || true
    source venv/bin/activate
    pip install -r ../requirements.txt -q
    uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
    
    echo "Starting frontend..."
    cd frontend
    npm install -q
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo "✅ Development servers started"
    echo "  Backend PID: $BACKEND_PID"
    echo "  Frontend PID: $FRONTEND_PID"
    echo ""
    echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
    ;;
    
  stop)
    echo "🛑 Stopping Genskey Platform..."
    docker compose down
    echo "✅ Stopped"
    ;;
    
  *)
    echo "Usage: ./start.sh [docker|dev|stop]"
    echo ""
    echo "  docker  - Start with Docker Compose (default)"
    echo "  dev     - Start in development mode (local)"
    echo "  stop    - Stop Docker services"
    exit 1
    ;;
esac
