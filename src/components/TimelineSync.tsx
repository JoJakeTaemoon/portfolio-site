"use client";
import { useEffect, useRef, type ReactNode } from "react";

// B4: hovering or focusing a numbered dot highlights the matching rows of the list below, and the other way round.
// Dots carry data-from/data-to, rows are numbered by position. Row focusability is added here, so without JS nothing changes.
export function TimelineSync({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const dots = [...el.querySelectorAll<HTMLElement>(".tband-dot")];
    const rows = [...el.querySelectorAll<HTMLElement>(".vtimeline > li")];
    rows.forEach((n) => (n.tabIndex = 0)); // the rows are the keyboard path; dots only react to hover (and to the row's focus), so they are not tab stops
    const mark = (from: number, to: number, on: boolean) => {
      rows.forEach((r, i) => r.toggleAttribute("data-hl", on && i + 1 >= from && i + 1 <= to));
      dots.forEach((d) => d.toggleAttribute("data-hl", on && Number(d.dataset.from) <= to && Number(d.dataset.to) >= from));
    };
    const range = (t: EventTarget | null): [number, number] | null => {
      const n = t instanceof Element ? t.closest<HTMLElement>(".tband-dot, .vtimeline > li") : null;
      if (!n || !el.contains(n)) return null;
      if (n.classList.contains("tband-dot")) return [Number(n.dataset.from), Number(n.dataset.to)];
      const i = rows.indexOf(n) + 1;
      return [i, i];
    };
    const on = (e: Event) => {
      const r = range(e.target);
      if (r) mark(r[0], r[1], true);
    };
    const off = () => mark(0, 0, false);
    const evs: [string, EventListener][] = [["pointerover", on], ["focusin", on], ["pointerout", off], ["focusout", off]];
    evs.forEach(([t, f]) => el.addEventListener(t, f));
    return () => evs.forEach(([t, f]) => el.removeEventListener(t, f));
  }, []);
  return <div ref={root} className="t-body">{children}</div>;
}
