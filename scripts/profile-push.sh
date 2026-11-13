#!/bin/bash
# Pushes out/profile-readme.md to the GitHub profile repo. Needs Jake's explicit OK before every run.
set -euo pipefail
cd "$(dirname "$0")/.."
repo=JoJakeTaemoon/JoJakeTaemoon
src="$PWD/out/profile-readme.md"
[ -f "$src" ] || { echo "$src missing: run npm run release first" >&2; exit 1; }
npm run check:public
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
if err=$(gh repo view "$repo" 2>&1 >/dev/null); then :
elif [[ "$err" == *"Could not resolve"* || "$err" == *"not found"* || "$err" == *"404"* ]]; then
  read -r -p "$repo does not exist. Create it as a PUBLIC repo? [y/N] " ans
  [[ "$ans" == y || "$ans" == Y ]] || { echo "aborted" >&2; exit 1; }
  gh repo create "$repo" --public --description "Profile" >/dev/null
else
  echo "$err" >&2; exit 1
fi
gh repo clone "$repo" "$tmp/repo"
cp "$src" "$tmp/repo/README.md"
# the README's drawings (D-058): the banner (light/dark svg) and the work cards (png), replaced whole so none go stale
[ -d out/profile ] || { echo "out/profile missing: run npm run release first" >&2; exit 1; }
rm -rf "$tmp/repo/assets" && mkdir "$tmp/repo/assets" && cp out/profile/* "$tmp/repo/assets/"
cd "$tmp/repo"
git add -A README.md assets
git diff --cached --quiet && { echo "README unchanged"; exit 0; }
git commit -m "docs: update profile README" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -u origin HEAD
