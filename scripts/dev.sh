#!/usr/bin/env bash
# Start all Patogh services: backend (Docker) + frontend dev server

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Starting backend (Docker Compose)..."
cd "$REPO_ROOT/back/patogh"

if [ ! -f .env ]; then
  echo "ERROR: back/patogh/.env not found."
  echo "       Copy back/patogh/.env.example to back/patogh/.env and fill in passwords."
  exit 1
fi

docker compose up -d
echo "    Backend started. API at http://localhost:8080"
echo "    Swagger UI at http://localhost:8080/swagger"

echo ""
echo "==> Starting frontend dev server..."
cd "$REPO_ROOT/front"

if [ ! -f .env.local ]; then
  echo "    Hint: copy front/.env.example to front/.env.local (using defaults)"
  cp .env.example .env.local
fi

if [ ! -d node_modules ]; then
  echo "    Installing frontend dependencies..."
  npm install
fi

echo "    Frontend starting at http://localhost:5173"
npm run dev
