"use client";
import { useEffect } from "react";

// The taste kit's scripts (public/assets) split words, add classes and move the hero, so they run only
// after React has hydrated the page: a change made before hydration would be a mismatch React throws away.
export function KitScripts({ src }: { src: string[] }) {
  useEffect(() => {
    for (const s of src) {
      const el = document.createElement("script");
      el.type = "module";
      el.src = s;
      el.async = false; // run in the listed order, as the kit's own pages do
      document.body.append(el);
    }
  }, [src]);
  return null;
}
