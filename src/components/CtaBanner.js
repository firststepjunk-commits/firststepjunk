import SiteImage from "./SiteImage";
import { defaultContent } from "@/lib/content-data";
import { BUSINESS } from "@/lib/seo";

export default function CtaBanner({ content }) {
  const c = { ...defaultContent.ctaBanner, ...(content?.ctaBanner || {}) };
  const contact = { ...defaultContent.contact, ...(content?.contact || {}) };

  return (
    <section className="bg-surface py-section-gap">
      <div className="container mx-auto px-margin-mobile text-center md:px-margin-desktop">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="mb-8 flex justify-center" data-aos="zoom-in">
            <SiteImage
              alt={`${BUSINESS.brandName} Brand Logo`}
              width={512}
              height={512}
              className="h-32 w-auto animate-float-slow object-contain md:h-48"
              src={content?.siteImages?.logo || defaultContent.siteImages.logo}
              data-image-path="siteImages.logo"
            />
          </div>
          <h2 className="font-display-lg text-display-lg text-primary" data-aos="fade-up">
            {c.heading}
          </h2>
          <p className="text-xl text-on-surface-variant" data-aos="fade-up" data-aos-delay="100">
            {c.intro}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4" data-aos="fade-up" data-aos-delay="200">
            <a
              href="#quote"
              className="inline-block rounded-xl bg-primary px-12 py-5 text-xl font-bold text-on-primary shadow-lg transition-all hover:scale-105 hover:shadow-primary/20 active:scale-95"
            >
              {c.primaryCta}
            </a>
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-3 rounded-xl border-2 border-primary px-10 py-5 text-xl font-bold text-primary transition-all hover:scale-105 hover:bg-primary hover:text-on-primary active:scale-95"
            >
              <span className="material-symbols-outlined">call</span>
              {c.secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
