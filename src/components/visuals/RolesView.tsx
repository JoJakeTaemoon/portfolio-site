import { Ids } from "@/components/blocks";
import type { RolesVisual } from "@/content/types";
import { Fig } from "./Fig";

/** The lanes alone (no figure title or claim): the hub shows them beside its own heading (h2), so its lane titles are h3. */
export function RoleLanes({ v, Heading = "h4" }: { v: RolesVisual; Heading?: "h3" | "h4" }) {
  return (
    <div className="roles">
      {v.lanes.map((l) => (
        <section key={l.label} data-who={l.who} className="lane">
          <Heading>{l.label}</Heading>
          {/* the lane's numbers before its lines (R-06): the value first, its label under it */}
          {l.stats && (
            <dl className="lane-stats">
              {l.stats.map((st) => (
                <div key={st.label}>
                  <dt>{st.label}</dt>
                  <dd>{st.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <ul>
            {l.items.map((i) => (
              <li key={i}>
                <Ids t={i} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function RolesView({ v }: { v: RolesVisual }) {
  return (
    <Fig title={v.title} caption={v.caption}>
      <RoleLanes v={v} />
    </Fig>
  );
}
