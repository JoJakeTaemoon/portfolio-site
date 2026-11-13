"use client";
import { useEffect } from "react";

// Before printing (Ctrl+P), open every <details> so nothing is cut; restore afterwards.
// `name` is dropped first: exclusive accordions (<details name>) would close each other.
export function PrintExpand() {
  useEffect(() => {
    let touched: { el: HTMLDetailsElement; name: string }[] = [];
    const before = () => {
      document.querySelectorAll<HTMLDetailsElement>("details:not([open])").forEach((el) => {
        touched.push({ el, name: el.name });
        el.removeAttribute("name");
        el.open = true;
      });
    };
    const after = () => {
      touched.forEach(({ el, name }) => {
        el.open = false;
        if (name) el.name = name;
      });
      touched = [];
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);
  return null;
}
