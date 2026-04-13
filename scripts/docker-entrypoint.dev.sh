#!/bin/sh
set -e
cd /app

# The dev compose file mounts a named volume over /app/node_modules, hiding what
# `npm install` did at image build time. We must reinstall when dependencies change.
# Previously we only checked for `next` + `@prisma/client`, so adding packages
# (e.g. next-auth) never triggered `npm install` on an existing volume.
compute_deps_hash() {
	md5sum package.json package-lock.json 2>/dev/null | md5sum | awk '{print $1}'
}

STAMP_FILE=/app/node_modules/.game-platform-lock-hash
CURRENT=$(compute_deps_hash)

SKIP=0
if [ -d node_modules/next ] && [ -f "$STAMP_FILE" ] && [ "$(cat "$STAMP_FILE")" = "$CURRENT" ]; then
	SKIP=1
fi

if [ "$SKIP" -eq 0 ]; then
	echo "game-platform dev: npm install (fresh volume, lockfile change, or missing packages)..."
	npm install
	mkdir -p /app/node_modules
	printf "%s" "$CURRENT" >"$STAMP_FILE"
fi

echo "game-platform dev: applying Prisma migrations (migrate deploy)..."
npx prisma migrate deploy

exec "$@"
