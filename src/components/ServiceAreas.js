import { SERVICE_PAGES } from "@/lib/service-pages";
import { TOWN_PAGES } from "@/lib/town-pages";

const linkCls =
  "block border-b border-outline-variant/40 py-3 font-semibold text-primary transition-colors hover:text-secondary";

/** Crawlable internal links to every service page and town page. */
export default function ServiceAreas({ excludeSlug }) {
  const services = SERVICE_PAGES.filter((p) => p.slug !== excludeSlug);
  const towns = TOWN_PAGES.filter((p) => p.slug !== excludeSlug);
  return (
    <section className="border-t border-outline-variant/30 bg-surface-container-low py-section-gap">
      <div className="container mx-auto grid gap-12 px-margin-mobile md:grid-cols-2 md:px-margin-desktop">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Our junk removal services</h2>
          <ul className="mt-6">
            {services.map((p) => (
              <li key={p.slug}>
                <a href={p.path} className={linkCls}>
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Towns we serve</h2>
          <ul className="mt-6">
            {towns.map((p) => (
              <li key={p.slug}>
                <a href={p.path} className={linkCls}>
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
