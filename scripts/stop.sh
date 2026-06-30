#!/usr/bin/env bash
# Stop all Patogh Docker services

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Stopping backend services..."
cd "$REPO_ROOT/back/patogh"
docker compose down
echo "    Services stopped."
