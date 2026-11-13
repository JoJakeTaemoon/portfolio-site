"use client";
import { usePathname } from "next/navigation";
import { locales, swapLang, type Locale } from "@/lib/i18n";

const names: Record<Locale, string> = { ko: "한국어", en: "EN" };

// Plain <a>: switching locale swaps the root layout (<html lang>), so a full load is simplest.
export function LangToggle({ current }: { current: Locale }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Language" className="seg">
      {locales.map((l) => (
        <a
          key={l}
          href={swapLang(pathname, l)}
          hrefLang={l}
          lang={l}
          aria-current={l === current ? "page" : undefined}
        >
          {names[l]}
        </a>
      ))}
    </nav>
  );
}
