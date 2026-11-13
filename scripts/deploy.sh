#!/bin/bash
# Usage: scripts/deploy.sh preview|prod. Needs Jake's explicit OK before every run.
set -euo pipefail
cd "$(dirname "$0")/.."
mode=${1:-}
[[ "$mode" == preview || "$mode" == prod ]] || { echo "usage: $0 preview|prod" >&2; exit 1; }
[ -f out/pdf-targets.json ] && [ -d out/pdf ] || { echo "out/ is incomplete: run npm run release first" >&2; exit 1; }
npm run check:public
[ -f .vercel/project.json ] || { echo "Run 'vercel link --project jake-jo-portfolio' first (needs Jake's OK)." >&2; exit 1; }
[ -z "$(find src public -newer out/index.html -type f -print -quit)" ] || echo "warning: out/ may be stale - run npm run release" >&2
cp deploy/vercel.json out/
rm -rf out/.vercel && mkdir out/.vercel && cp .vercel/project.json out/.vercel/
if [ "$mode" == prod ]; then vercel deploy out --prod; else vercel deploy out; fi
