"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollSpy } from "./useScrollSpy";

type Item = { href: string; label: string; spy?: string[] };

// B1: on the hub, the link of the section being read gets aria-current. Without JS the links render as plain links.
// `spy` = hub section ids that light the link (the "how I lead" section belongs to the process link).
export function MainNav({ items, home }: { items: Item[]; home: string }) {
  const onHub = usePathname() === home;
  const ids = onHub ? items.flatMap((i) => i.spy ?? []) : [];
  const active = useScrollSpy(ids);
  return (
    <nav aria-label="Main" className="nav">
      {items.map((i) => (
        <Link key={i.href} href={i.href} aria-current={active && i.spy?.includes(active) ? "true" : undefined}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
