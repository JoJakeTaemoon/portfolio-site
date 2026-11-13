"use client";
import { Fragment, useRef, useState, type CSSProperties } from "react";
import type { Diagram, DiagramNode } from "@/content/types";
import { splitIds } from "@/lib/template";

const CW = 200; // grid cell
const CH = 100;
const NW = 164; // node box
const NH = 60;
// Node sub-lines are set at 13.5 units (13px floor on phones, D1). One that cannot fit the box is squeezed to it, not allowed to spill.
const SUB_MAX = NW - 12;
const textWidth = (t: string, size: number) => [...t].reduce((w, c) => w + (c.charCodeAt(0) > 0x2e80 ? 1 : 0.52), 0) * size;
const squeeze = (t: string, size: number) => (textWidth(t, size) > SUB_MAX ? { textLength: SUB_MAX, lengthAdjust: "spacingAndGlyphs" as const } : {});

const center = (n: DiagramNode) => ({ x: n.col * CW + CW / 2, y: n.row * CH + CH / 2 });

/** Point where the line from a's center towards b leaves a's box. */
function exit(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.min(dx ? NW / 2 / Math.abs(dx) : Infinity, dy ? NH / 2 / Math.abs(dy) : Infinity);
  return { x: a.x + dx * t, y: a.y + dy * t };
}

type Labels = { hint: string; dashed: string; human: string; client: string; me: string; idle: string; scrollHint: string; notes?: string }; // notes = fold the notes under this summary

// Click/Enter on a node highlights its note. All notes are always in the HTML (<dl>, folded or not; print opens it).
export function DiagramView({ diagram, title, caption, labels }: { diagram: Diagram; title: string; caption?: string; labels: Labels }) {
  const [active, setActive] = useState<string | null>(null);
  const notesRef = useRef<HTMLDListElement>(null);
  const foldRef = useRef<HTMLDetailsElement>(null);
  const byId = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]));
  const human = diagram.nodes.some((n) => n.group === "human");
  const me = diagram.nodes.some((n) => n.group === "me" && !n.idle); // M-02: only then explain the filled boxes
  const idle = diagram.nodes.some((n) => n.idle);
  const external = diagram.nodes.some((n) => n.group === "external"); // M-17: only then explain the dashed boxes

  const pick = (id: string) => {
    setActive(id);
    if (foldRef.current) foldRef.current.open = true;
    notesRef.current?.querySelector(`[data-node="${id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const notes = (
    <dl className="notes" ref={notesRef}>
      {diagram.nodes
        .filter((n) => diagram.notes[n.id])
        .map((n) => (
          <div key={n.id} data-node={n.id} data-active={active === n.id || undefined}>
            <dt>
              <button type="button" onClick={() => pick(n.id)}>
                {n.label}
              </button>
            </dt>
            <dd>
              {splitIds(diagram.notes[n.id]).map((s, i) =>
                i % 2 ? <span key={i} className="nowrap">{s}</span> : <Fragment key={i}>{s}</Fragment>,
              )}
            </dd>
          </div>
        ))}
    </dl>
  );

  return (
    <figure className="diagram">
      {/* the words above the picture (task 25: nothing under a visual), the hint with them */}
      <div className="fig-head">
        {caption && (
          <>
            <h3 className="visual-title">{title}</h3>
            <p className="fig-claim">{caption}</p>
          </>
        )}
        <p className="hint">
          {labels.hint}
          {external && ` ${labels.dashed}`}
          {human && ` ${diagram.nodes.some((n) => n.group === "me") ? labels.client : labels.human}`}
          {me && ` ${labels.me}`}
          {idle && ` ${labels.idle}`}
        </p>
      </div>
      <p className="scroll-hint" aria-hidden="true">
        {labels.scrollHint}
      </p>
      <div className="diagram-scroll">
        <svg viewBox={`0 0 ${diagram.cols * CW} ${diagram.rows * CH}`} style={{ "--vbw": `${Math.round(diagram.cols * CW * 0.97)}px` } as CSSProperties} role="group" aria-label={title}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="arrowhead" />
            </marker>
          </defs>
          {diagram.edges.map((e) => {
            const a = center(byId[e.from]);
            const b = center(byId[e.to]);
            const p = exit(a, b);
            const q = exit(b, a);
            const flat = Math.abs(a.y - b.y) < 1; // horizontal link: label sits in the gap above the boxes
            const upright = Math.abs(a.x - b.x) < 1; // vertical link: label beside the line, not across it
            const lit = active === e.from || active === e.to;
            return (
              <g key={`${e.from}-${e.to}`} className="edge" data-lit={lit || undefined}>
                <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} markerEnd="url(#arrow)" />
                {e.label && (
                  <text
                    x={upright ? p.x + 6 : (p.x + q.x) / 2}
                    y={flat ? a.y - NH / 2 - 6 : (p.y + q.y) / 2 + (upright ? 4 : -6)}
                    textAnchor={upright ? "start" : "middle"}
                    className="edge-label"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
          {diagram.nodes.map((n) => {
            const c = center(n);
            return (
              <g
                key={n.id}
                className="node"
                data-group={n.group ?? "core"}
                data-idle={n.idle || undefined}
                data-active={active === n.id || undefined}
                role="button"
                tabIndex={0}
                aria-pressed={active === n.id}
                aria-label={n.label}
                onClick={() => pick(n.id)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    pick(n.id);
                  }
                }}
              >
                <rect x={c.x - NW / 2} y={c.y - NH / 2} width={NW} height={NH} rx={n.group === "human" || n.group === "me" ? 30 : 10} />
                <text x={c.x} y={n.sub ? c.y - 4 : c.y + 5} textAnchor="middle" className="node-label" {...squeeze(n.label, 16)}>
                  {n.label}
                </text>
                {n.sub && (
                  <text x={c.x} y={c.y + 15} textAnchor="middle" className="node-sub" {...squeeze(n.sub, 13.5)}>
                    {n.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <ul className="sr-only">
        {diagram.edges.map((e) => (
          <li key={`${e.from}-${e.to}`}>
            {byId[e.from].label} → {byId[e.to].label}
            {e.label ? `: ${e.label}` : ""}
          </li>
        ))}
      </ul>
      {labels.notes ? (
        <details className="fold" ref={foldRef}>
          <summary>{labels.notes}</summary>
          {notes}
        </details>
      ) : (
        notes
      )}
    </figure>
  );
}
