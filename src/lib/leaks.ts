// Pure helpers — mirror .claude/hooks/block-leaks.sh. Relative .ts imports only.
export type Terms = { patterns: RegExp[]; allowed: string[] };

export function parseTerms(text: string): Terms {
  const patterns: RegExp[] = [];
  const allowed: string[] = [];
  for (const line of text.split("\n")) {
    if (line === "" || line.startsWith("#")) continue;
    if (line.startsWith("!")) allowed.push(line.slice(1));
    else patterns.push(new RegExp(line.split("\t")[0], "g"));
  }
  return { patterns, allowed };
}

/** Allowed literals are removed first, then every pattern is matched; unique + sorted. */
export function findLeaks(text: string, terms: Terms): string[] {
  const clean = terms.allowed.reduce((t, ok) => t.split(ok).join(""), text);
  return [...new Set(terms.patterns.flatMap((p) => clean.match(p) ?? []))].sort();
}
