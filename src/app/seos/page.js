import SeosGuide from "@/components/SeosGuide";

export const dynamic = "force-dynamic";

// Back-office SEO/AI operator guide — not linked from public nav or sitemap.
export const metadata = {
  title: "SEO & AI guide",
  robots: { index: false, follow: false, nocache: true },
};

export default function SeosPage() {
  return <SeosGuide />;
}
