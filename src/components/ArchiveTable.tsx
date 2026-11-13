"use client";
import { useState, type ReactNode } from "react";
import type { Tag } from "@/content/types";
import { chipTags } from "@/lib/template";

type Row = { key: string; tags: Tag[]; cells: ReactNode };

// Hidden rows stay in the HTML (hidden attr), so print/convert still sees them all.
export function ArchiveTable({
  rows,
  head,
  labels,
  allLabel,
  filterLabel,
  countLabel,
}: {
  rows: Row[];
  head: string[];
  labels: Record<Tag, string>;
  allLabel: string;
  filterLabel: string;
  countLabel: string;
}) {
  const [active, setActive] = useState<Tag | null>(null);
  const [touched, setTouched] = useState(false); // fade only after the first filter change, not on load
  const pick = (t: Tag | null) => {
    setTouched(true);
    setActive(t);
  };
  const count = (t: Tag | null) => rows.filter((r) => t === null || r.tags.includes(t)).length;
  const tags = chipTags(rows.map((r) => r.tags)); // M-06: only tags 2+ rows share
  return (
    <>
      {tags.length > 0 && (
        <div role="group" aria-label={filterLabel} className="chips">
          <button type="button" aria-pressed={active === null} onClick={() => pick(null)}>
            {allLabel} <span className="chip-n">{rows.length}</span>
          </button>
          {tags.map((t) => (
            <button key={t} type="button" aria-pressed={active === t} onClick={() => pick(active === t ? null : t)}>
              {labels[t]} <span className="chip-n">{count(t)}</span>
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite" role="status">
        {touched && countLabel.replace("{n}", String(count(active)))}
      </p>
      <div className="table-scroll">
        <table className="archive">
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody key={active ?? "all"} className={touched ? "rows" : undefined}>
            {rows.map((r) => (
              <tr key={r.key} hidden={active !== null && !r.tags.includes(active)}>
                {r.cells}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
