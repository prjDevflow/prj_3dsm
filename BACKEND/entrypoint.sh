#!/bin/sh
set -e

echo ">>> Rodando migrations do Prisma..."
npx prisma migrate deploy

echo ">>> Rodando seed (dados de teste)..."
npx prisma db seed

echo ">>> Iniciando servidor..."
exec node dist/src/shared/infra/http/server.js
