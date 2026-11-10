import AboutMichael from "@/components/AboutMichael";
import { buildAboutPageJsonLd, OWNER } from "@/lib/service-pages";
import { BUSINESS } from "@/lib/seo";

export const metadata = {
  title: `About ${OWNER.name} | ${OWNER.jobTitle} — ${BUSINESS.brandName} ${BUSINESS.address.addressLocality}`,
  description: OWNER.description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${OWNER.name} | ${BUSINESS.brandName}`,
    description: OWNER.description,
    url: "/about",
    images: [OWNER.image],
  },
};

export default function AboutPage() {
  const jsonLd = buildAboutPageJsonLd();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutMichael />
    </>
  );
}
