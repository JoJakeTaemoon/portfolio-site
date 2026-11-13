import { processPage, site } from "@/content";
import { bannerData, bannerSvg } from "@/lib/profile-svg";
import { summaryLine } from "@/lib/readme";

// The GitHub profile README's banner (D-058), light and dark, built with the README; scripts/profile-push.sh copies
// out/profile/ into the profile repo's assets/.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ["banner-light.svg", "banner-dark.svg"].map((asset) => ({ asset }));
}

export async function GET(_: Request, { params }: { params: Promise<{ asset: string }> }) {
  const { asset } = await params;
  const svg = bannerSvg(bannerData(site.en, processPage.en, summaryLine(site.en)), asset.includes("dark") ? "dark" : "light");
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } });
}
