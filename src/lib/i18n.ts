// Pure helpers — no imports, so `node --experimental-strip-types --test` can run them.

export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];

export const hasLocale = (s: string): s is Locale =>
  (locales as readonly string[]).includes(s);

/** `/ko/work/ewa/` → `/en/work/ewa/`. Paths without a locale prefix get one. */
export function swapLang(pathname: string, to: Locale): string {
  const parts = pathname.split("/");
  if (hasLocale(parts[1] ?? "")) parts[1] = to;
  else parts.splice(1, 0, to);
  const out = parts.join("/");
  return out.endsWith("/") ? out : out + "/";
}
