/** URL path → file under the export dir, or null when it tries to escape. */
export function resolveStatic(urlPath: string): string | null {
  if (urlPath.includes("..")) return null;
  const p = urlPath.replace(/^\/+/, "");
  return p === "" || p.endsWith("/") ? `${p}index.html` : p;
}
