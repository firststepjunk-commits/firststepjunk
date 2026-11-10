import SiteImage from "./SiteImage";
import { defaultContent } from "@/lib/content-data";
import { BUSINESS } from "@/lib/seo";

export default function Footer({ content }) {
  const f = { ...defaultContent.footer, ...(content?.footer || {}) };
  const contact = { ...defaultContent.contact, ...(content?.contact || {}) };
  const serviceLinks = f.serviceLinks || [];

  return (
    <footer className="bg-primary py-section-gap text-on-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-gutter px-margin-mobile md:grid-cols-3 md:px-margin-desktop">
        <div className="space-y-6" data-aos="fade-up">
          <SiteImage
            alt={`${BUSINESS.brandName} Logo`}
            width={112}
            height={112}
            className="h-14 w-auto object-contain brightness-0 invert"
            src={content?.siteImages?.logo || defaultContent.siteImages.logo}
            data-image-path="siteImages.logo"
          />
          <p className="max-w-xs text-on-primary/80">{f.tagline}</p>
          <div className="flex gap-4">
            <a
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:-translate-y-1 hover:bg-secondary"
              href={BUSINESS.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${BUSINESS.brandName} on Facebook`}
            >
              <span className="material-symbols-outlined">face_nod</span>
            </a>
            <a
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:-translate-y-1 hover:bg-secondary"
              href={BUSINESS.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${BUSINESS.brandName} on Instagram`}
            >
              <span className="material-symbols-outlined">camera</span>
            </a>
          </div>
        </div>
        <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
          <h4 className="mb-6 text-xl font-bold">{f.servicesHeading}</h4>
          <ul className="space-y-3 font-body-md">
            {serviceLinks.map((item) => {
              const label = typeof item === "string" ? item : item.label;
              const href = typeof item === "string" ? "#services" : item.href;
              return (
                <li key={label}>
                  <a className="text-on-primary/80 transition-colors hover:text-secondary-fixed" href={href}>
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
          <h4 className="mb-6 text-xl font-bold">{f.contactHeading}</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-fixed">phone</span>
              <a className="transition-colors hover:text-secondary-fixed" href={contact.phoneHref}>
                {contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-fixed">mail</span>
              <a className="transition-colors hover:text-secondary-fixed" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-fixed">location_on</span>
              <span>{f.location}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-20 max-w-7xl border-t border-white/10 px-margin-mobile pt-8 text-center text-sm text-on-primary/60 md:px-margin-desktop">
        {f.copyright}
      </div>
    </footer>
  );
}
