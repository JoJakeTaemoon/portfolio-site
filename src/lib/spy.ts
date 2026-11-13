// Pure scroll-spy helper — relative imports only so node can run it directly.

/** The section being read: the one with the greatest top that has passed `line`; at the page bottom, the last one. */
export function activeId(items: { id: string; top: number }[], line: number, atBottom = false): string | null {
  if (items.length === 0) return null;
  const byTop = [...items].sort((a, b) => a.top - b.top); // callers need not pass DOM order
  if (atBottom) return byTop[byTop.length - 1].id;
  let cur: string | null = null;
  for (const it of byTop) if (it.top <= line) cur = it.id;
  return cur;
}
