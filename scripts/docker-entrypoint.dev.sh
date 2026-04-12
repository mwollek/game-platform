#!/bin/sh
set -e
cd /app

if [ ! -d node_modules/next ]; then
	echo "game-platform dev: installing dependencies (first run or empty volume)..."
	npm ci
fi

exec "$@"
