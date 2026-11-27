#!/usr/bin/env bash
# Rebuild and restart the production preview server on a fresh port.
# Usage: bash scripts/dev-restart.sh [PORT]
set -euo pipefail
cd "$(dirname "$0")/.."
PORT_TO_USE="${1:-3214}"

OLD_PID=$(netstat -ano 2>/dev/null | grep ":${PORT_TO_USE}" | grep LISTENING | awk '{print $5}' | head -1 || true)
if [ -n "${OLD_PID}" ]; then
  taskkill //PID "${OLD_PID}" //T //F >/dev/null 2>&1 || true
  sleep 2
fi

npx tsc --noEmit
npm run build 2>&1 | grep -E "Compiled successfully|Error|error" | head -3
PORT="${PORT_TO_USE}" npm start > "/tmp/flyriise-${PORT_TO_USE}.log" 2>&1 &
sleep 9
grep -E "Local:|Ready|EADDRINUSE" "/tmp/flyriise-${PORT_TO_USE}.log" | head -3
curl -s -o /dev/null -w "probe http://localhost:${PORT_TO_USE}/ -> %{http_code}\n" "http://localhost:${PORT_TO_USE}/"