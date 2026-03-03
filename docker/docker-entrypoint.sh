#!/bin/sh
set -e

# Docker 컨테이너 시작 시 런타임 환경변수를 env-config.js에 주입
# 새로운 환경변수 추가 시 이 파일과 src/config/env.ts에 함께 추가

cat > /app/public/env-config.js << EOF
window.__ENV__ = {
  "NEXT_PUBLIC_API_BASE_URL": "${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8080}"
};
EOF

exec "$@"
