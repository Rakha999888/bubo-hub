#!/bin/bash
set -e

cd /root/bubo-hub-repo

# Rebuild dist
npm run build

# Setup GitHub Pages requirements
cp dist/index.html dist/404.html
cp public/ws-config.json dist/ws-config.json
touch dist/.nojekyll

# Create temporary workdir for gh-pages branch
TEMP_DIR=$(mktemp -d)
cp -r dist/* "$TEMP_DIR/"

cd "$TEMP_DIR"
git init
git config user.name "Bubo Building"
git config user.email "developer@smlone.com"
git checkout -b gh-pages
git add -A
git commit -m "deploy: update bubo-hub single permanent link"

REMOTE_URL=$(git -C /root/bubo-hub-repo remote get-url origin)
git push --force "$REMOTE_URL" gh-pages

rm -rf "$TEMP_DIR"
echo "✅ Deployed successfully to permanent link: https://rakha999888.github.io/bubo-hub/"
