import type { FlowVisual, Site } from "@/content/types";
import { Fig } from "./Fig";

const SHAPE = { human: "○", system: "□", external: "▢", agent: "◇" } as const;
const num = (i: number) => String.fromCodePoint(0x2460 + i); // ①②…

export function FlowView({ v, ui }: { v: FlowVisual; ui: Site["ui"]["visual"] }) {
  const idx = Object.fromEntries(v.steps.map((s, i) => [s.id, i]));
  return (
    <Fig title={v.title} caption={v.caption}>
      <ol className="flow">
        {v.steps.map((s, i) => (
          <li key={s.id} data-actor={s.actor}>
            <span className="flow-n" aria-hidden="true">{num(i)}</span>
            <div>
              <strong>{s.label}</strong>
              {s.actor && (
                <span className="badge" data-actor={s.actor}>
                  <span aria-hidden="true">{SHAPE[s.actor]} </span>
                  {ui.actors[s.actor]}
                </span>
              )}
              {s.sub && <p className="muted small">{s.sub}</p>}
            </div>
          </li>
        ))}
      </ol>
      {v.loops && v.loops.length > 0 && (
        <div className="flow-loops">
          <h4>{ui.loops}</h4>
          <ul>
            {v.loops.map((l) => (
              <li key={`${l.from}-${l.to}`}>
                ↺ {num(idx[l.from])} {v.steps[idx[l.from]].label} → {num(idx[l.to])} {v.steps[idx[l.to]].label}: {l.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Fig>
  );
}
