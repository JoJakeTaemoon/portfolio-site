import type { NextConfig } from "next";

// Static export: `out/` is plain HTML, deployable to Vercel or any static host,
// and convertible to other formats. trailingSlash → /ko/index.html, works on any server.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
