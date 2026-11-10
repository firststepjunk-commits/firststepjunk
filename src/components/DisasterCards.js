import SiteImage from "./SiteImage";
import { defaultContent } from "@/lib/content-data";

// Fallback for content saved before these photos became editable — a Sheet
// row written back then has cards with copy but no `image`.
const cardImages = defaultContent.disasters.cards.map((c) => ({
  img: c.image,
  alt: c.imageAlt,
}));

export default function DisasterCards({ content }) {
  const d = { ...defaultContent.disasters, ...(content?.disasters || {}) };
  const cards = d.cards || [];

  return (
    <section className="overflow-hidden bg-primary-container/10 py-section-gap">
      <div className="container mx-auto mb-12 px-margin-mobile md:px-margin-desktop" data-aos="fade-up">
        <h2 className="font-headline-lg text-headline-lg text-primary">{d.heading}</h2>
        <p className="text-on-surface-variant">{d.intro}</p>
      </div>
      <div className="custom-scrollbar flex gap-8 overflow-x-auto px-margin-mobile pb-12 md:justify-center md:overflow-x-visible md:px-margin-desktop">
        {cards.map((card, i) => (
          <div
            key={card.title}
            className="group flex w-[360px] flex-shrink-0 flex-col rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            data-aos="fade-left"
            data-aos-delay={i * 150}
          >
            <SiteImage
              alt={card.imageAlt || cardImages[i]?.alt || card.title}
              width={768}
              height={1024}
              className="h-[222px] w-full rounded-t-xl object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
              src={card.image || cardImages[i]?.img || cardImages[0].img}
              data-image-path={`disasters.cards.${i}.image`}
              data-alt-path={`disasters.cards.${i}.imageAlt`}
            />
            <div className="p-8">
              <div className="mb-4 flex items-center gap-2 font-label-sm text-secondary">
                <span className="material-symbols-outlined text-sm">verified</span>
                {card.badge}
              </div>
              <h4 className="mb-2 text-xl font-bold text-primary">{card.title}</h4>
              <p className="mb-4 text-sm text-on-surface-variant">{card.body}</p>
              <p className="text-sm italic text-on-surface-variant">{card.quote}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
