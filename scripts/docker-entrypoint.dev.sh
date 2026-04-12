#!/bin/sh
set -e
cd /app

if [ ! -d node_modules/next ] || [ ! -d node_modules/@prisma/client ]; then
	echo "game-platform dev: installing dependencies (first run, empty volume, or new packages)..."
	# Match Dockerfile.dev: npm install (not ci) so Linux optional deps match the lockfile from Windows.
	npm install
fi

echo "game-platform dev: applying Prisma migrations (migrate deploy)..."
npx prisma migrate deploy

exec "$@"
