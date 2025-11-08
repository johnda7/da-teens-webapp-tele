#!/usr/bin/env bash
set -euo pipefail

LOG="/tmp/da-teens-vite.log"
PID_FILE="/tmp/da-teens-vite.pid"
BASE_PATH="/"

echo "🔧 Restarting Vite dev server…"
pkill -9 -f "node .*bin/vite" 2>/dev/null || true
rm -rf node_modules/.vite 2>/dev/null || true

nohup npm run dev > "$LOG" 2>&1 & echo $! > "$PID_FILE"

# Wait for Vite to print Local URL
URL=""
for i in {1..90}; do
  if grep -q "Local:" "$LOG" 2>/dev/null; then
    URL=$(grep -Eo "http://localhost:[0-9]+" "$LOG" | head -1 || true)
    break
  fi
  sleep 1
done

if [[ -z "$URL" ]]; then
  echo "❌ Не удалось получить Local URL из логов. Вот хвост лога:" >&2
  tail -n 80 "$LOG" || true
  exit 1
fi

INDEX_URL="$URL$BASE_PATH"

# Verify index responds 200
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$INDEX_URL" || true)
if [[ "$HTTP_CODE" != "200" ]]; then
  echo "❌ Сервер не отвечает 200 на $INDEX_URL (код $HTTP_CODE)" >&2
  tail -n 80 "$LOG" || true
  exit 1
fi


echo "✅ Dev готов"
echo "INDEX_URL=$INDEX_URL"
