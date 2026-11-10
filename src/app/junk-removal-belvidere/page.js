import ServiceLanding from "@/components/ServiceLanding";
import { buildServicePageJsonLd } from "@/lib/service-pages";
import { getTownPage } from "@/lib/town-pages";

const SLUG = "junk-removal-belvidere";

export const metadata = (() => {
  const page = getTownPage(SLUG);
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

export default function JunkRemovalBelviderePage() {
  const page = getTownPage(SLUG);
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
