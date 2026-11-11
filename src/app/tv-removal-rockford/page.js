import ServiceLanding from "@/components/ServiceLanding";
import { getServicePage, buildServicePageJsonLd } from "@/lib/service-pages";

const SLUG = "tv-removal-rockford";

export const metadata = (() => {
  const page = getServicePage(SLUG);
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: page.path,
      images: [page.image],
    },
  };
})();

export default function TvRemovalRockfordPage() {
  const page = getServicePage(SLUG);
  const jsonLd = buildServicePageJsonLd(page);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceLanding page={page} />
    </>
  );
}
