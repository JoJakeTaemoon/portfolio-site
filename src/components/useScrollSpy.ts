"use client";
import { useEffect, useState } from "react";
import { activeId } from "@/lib/spy";

/** Id of the section being read (null before the first one, or without JS). `line` = px from the viewport top. */
export function useScrollSpy(ids: string[], line = 120): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");
  useEffect(() => {
    const list = key ? key.split("|") : [];
    let raf = 0;
    const update = () => {
      raf = 0;
      const items = list.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top }] : [];
      });
      const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
      setActive(activeId(items, line, atBottom));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [key, line]);
  return active;
}
