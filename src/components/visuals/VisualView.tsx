import { DiagramView } from "@/components/DiagramView";
import type { Site, Visual } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { count } from "@/lib/template";
import { BarsView } from "./BarsView";
import { FlowView } from "./FlowView";
import { RolesView } from "./RolesView";
import { TimelineView } from "./TimelineView";

export const diagramLabels = (ui: Site["ui"]) => ({ hint: ui.diagramHint, dashed: ui.diagramDashed, human: ui.diagramHuman, client: ui.diagramClient, me: ui.diagramMe, idle: ui.diagramIdle, scrollHint: ui.visual.scrollHint });

export function VisualView({ v, lang, ui, rows, rowsTab }: { v: Visual; lang: Locale; ui: Site["ui"]; rows?: number; rowsTab?: number }) {
  switch (v.kind) {
    case "architecture":
      return <DiagramView diagram={v} title={v.title} caption={v.caption} labels={{ ...diagramLabels(ui), notes: ui.visual.notes }} />;
    case "flow":
      return <FlowView v={v} ui={ui.visual} />;
    case "timeline":
      return <TimelineView v={v} lang={lang} ui={ui.visual} rows={rows} rowsTab={rowsTab} />;
    case "bars":
      return <BarsView v={v} lang={lang} ui={ui.visual} />;
    case "roles":
      return <RolesView v={v} />;
  }
}

/** `phoneFold`: the figures from this index on fold behind one disclosure on a phone (task 25: a section holds two
 *  screens there); from 640px the disclosure is open by CSS alone and its summary hidden. `foldAll`: closed at every
 *  width (task 25b, a case whose section would run past its screen). */
export function Visuals({ items, lang, ui, phoneFold, rows, foldAll, tabFold, rowsTab }: { items: Visual[]; lang: Locale; ui: Site["ui"]; phoneFold?: number; rows?: number; foldAll?: boolean; tabFold?: number; rowsTab?: number }) {
  if (!items.length) return null;
  const view = (v: Visual) => <VisualView key={v.kind + v.title} v={v} lang={lang} ui={ui} rows={rows} rowsTab={rowsTab} />;
  // `tabFold` (task 27, no more than phoneFold): the figures from this index fold under 1280px, open from 1280px
  const tab = tabFold !== undefined && tabFold <= (phoneFold ?? items.length);
  const cut = tab ? (tabFold as number) : (phoneFold ?? items.length);
  return (
    <div className="visuals">
      {items.slice(0, cut).map(view)}
      {items.length > cut && (
        <details className={foldAll ? "fold" : tab ? "fold wide-fold" : "fold fig-fold"}>
          <summary>{count(ui.figsMore, items.length - cut)}</summary>
          <div className="visuals">{items.slice(cut).map(view)}</div>
        </details>
      )}
    </div>
  );
}
