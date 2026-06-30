#!/usr/bin/env bash
# Tail logs from Patogh Docker services

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SERVICE="${1:-api}"

cd "$REPO_ROOT/back/patogh"
echo "==> Tailing logs for service: $SERVICE (Ctrl+C to stop)"
docker compose logs -f "$SERVICE"
