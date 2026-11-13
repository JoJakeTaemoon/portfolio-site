import type { ReactNode } from "react";

// Shared frame: every visual is a <figure> whose words stand above the picture (D-030; task 25, the kit's house
// rule: nothing under a visual). The title, the claim and the source, then the picture.
export function Fig({ title, caption, source, children }: { title: string; caption: string; source?: string; children: ReactNode }) {
  return (
    <figure className="visual">
      <div className="fig-head">
        <h3 className="visual-title">{title}</h3>
        <p className="fig-claim">{caption}</p>
        {source && <p className="visual-src">{source}</p>}
      </div>
      {children}
    </figure>
  );
}
