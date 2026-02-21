#!/bin/bash
set -e

HF_DIR="$HOME/projects/sorted-backend"
BACKEND_DIR="$(cd "$(dirname "$0")/../services/api" && pwd)"
MSG="${1:-Update backend}"

echo "Deploying from: $BACKEND_DIR"
echo "Deploying to:   $HF_DIR"

# Clean HF dir (keep .git and .gitattributes)
find "$HF_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' ! -name '.gitattributes' -exec rm -rf {} +

# Copy fresh files
cp -r "$BACKEND_DIR"/* "$HF_DIR/"
cp "$BACKEND_DIR/.dockerignore" "$HF_DIR/" 2>/dev/null || true

# Clean dev artifacts
find "$HF_DIR" -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
rm -rf "$HF_DIR/.venv" "$HF_DIR/.env" "$HF_DIR/.env.example" "$HF_DIR/tests"

# Push
cd "$HF_DIR"
git add -A
git diff --cached --quiet && echo "No changes to deploy." && exit 0
git commit -m "$MSG"
git push origin main

echo "Deployed! Check: https://huggingface.co/spaces/HAK-16/sorted-backend"
