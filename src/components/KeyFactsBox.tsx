import type { KeyFacts, Site } from "@/content/types";

// `stack` (short project pages, D-032) sits before the full-width context row.
export function KeyFactsBox({ facts, labels, stack }: { facts: KeyFacts; labels: Site["ui"]["keyFacts"]; stack?: string[] }) {
  const rows: [keyof Site["ui"]["keyFacts"], string][] = [
    ["period", facts.period],
    ["role", facts.role],
    ["team", facts.team],
    ["platforms", facts.platforms],
    ...(stack ? [["stack", stack.join(" · ")] as ["stack", string]] : []),
    ["context", facts.context],
  ];
  return (
    <dl className="keyfacts">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{labels[k]}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
