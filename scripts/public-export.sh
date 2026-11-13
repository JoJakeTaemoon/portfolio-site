#!/bin/bash
# Publishes the public edition (D-059): HEAD's site code without the private working files, to the public repo below,
# after a leak scan of every exported file. Needs Jake's explicit OK before every run.
set -euo pipefail
cd "$(dirname "$0")/.."
repo=JoJakeTaemoon/portfolio-site
# what goes out: everything else (docs/, .claude/, snippets/, the design kit in public/assets/, CLAUDE.md, ...) stays private
paths=(src public scripts deploy package.json package-lock.json tsconfig.json next.config.ts eslint.config.mjs .gitignore DESIGN.md ':(exclude)public/assets')
[ -z "$(git status --porcelain -- "${paths[@]}" edition)" ] || { echo "commit first: the edition is exported from HEAD" >&2; exit 1; }
sha=$(git rev-parse --short HEAD)
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
if ! gh repo view "$repo" >/dev/null 2>&1; then
  read -r -p "$repo does not exist. Create it as a PUBLIC repo? [y/N] " ans
  [[ "$ans" == y || "$ans" == Y ]] || { echo "aborted" >&2; exit 1; }
  gh repo create "$repo" --public --description "Source of jake-jo-portfolio.vercel.app: a ko/en static portfolio, its PDFs and a GitHub profile README from one typed content source" --homepage "https://jake-jo-portfolio.vercel.app" >/dev/null
fi
gh repo clone "$repo" "$tmp/repo" -- --quiet
find "$tmp/repo" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
git archive HEAD -- "${paths[@]}" | tar -x -C "$tmp/repo"
cp edition/README.md "$tmp/repo/README.md"
node --experimental-strip-types --no-warnings scripts/check-public.ts --dir "$tmp/repo"
cd "$tmp/repo"
git add -A
git diff --cached --quiet && { echo "edition unchanged"; exit 0; }
git commit -q -m "Sync from the private repository ($sha)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q -u origin HEAD
echo "pushed $(git rev-parse --short HEAD) to https://github.com/$repo"
