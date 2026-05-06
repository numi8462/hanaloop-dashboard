#!/bin/sh
set -e

echo "▶ Prisma 마이그레이션 실행..."
./node_modules/.bin/prisma migrate deploy

echo "▶ 시드 데이터 삽입..."
node prisma/dist/prisma/seed.js || echo "시드 스킵 (이미 존재하거나 실패)"

echo "▶ Next.js 앱 시작..."
exec node server.js