#!/bin/sh
set -e

echo "🔧 Installing frontend dependencies into volume..."
npm install --include=dev
echo "✅ Dependencies ready — starting dev server"

exec "$@"
