#!/bin/sh
set -e

echo ">>> Rodando seed (dados de teste)..."
npx prisma db seed

echo ">>> Iniciando servidor..."
exec node dist/src/shared/infra/http/server.js
