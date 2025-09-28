#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/apps/is-lab1}"

mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Распаковать/обновить бандл, который пришёл из CI
tar -xzf bundle.tar.gz
rm -f bundle.tar.gz

# Сборка и запуск
docker compose -f docker-compose.yml -f compose.helios.yml pull || true
docker compose -f docker-compose.yml -f compose.helios.yml up -d --build

# Показать статус
docker compose ps
