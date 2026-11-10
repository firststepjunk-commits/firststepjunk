import { defaultContent } from "@/lib/content-data";
import TeamPhoto from "./TeamPhoto";

// Old team JPG placeholders → current gallery shots (covers stale Sheet content)
const PHOTO_UPGRADE = {
  Michael: "/images/gallery/g09.webp",
  Ben: "/images/gallery/g11.webp",
  Josh: "/images/gallery/g08.webp",
  Mercedes: "/images/garden-path-lift.jpg",
};

function resolvePhoto(member) {
  const src = member?.photo || "";
  if (!src || src.startsWith("/images/team/")) {
    return PHOTO_UPGRADE[member?.name] || src;
  }
  return src;
}

export default function Team({ content }) {
  const t = { ...defaultContent.team, ...(content?.team || {}) };
  // `index` is the position in the saved content, kept through the filter so
  // the Site Editor can write an edit back to the right member.
  const members = (t.members || [])
    .map((m, index) => (m ? { ...m, index } : null))
    .filter((m) => m && m.published !== false);

  return (
    <section className="bg-surface py-section-gap" id="about">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-12 text-center" data-aos="fade-up">
          <p className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-secondary">
            {t.eyebrow}
          </p>
          <h2 className="font-headline-lg text-headline-lg text-primary">{t.heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-on-surface-variant">{t.intro}</p>
        </div>

        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m, i) => (
            <article
              key={m.name + i}
              className="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="overflow-hidden">
                <TeamPhoto
                  src={resolvePhoto(m)}
                  alt={`${m.name}, ${m.role}`}
                  name={m.name}
                  imagePath={`team.members.${m.index}.photo`}
                />
              </div>
              <div className="flex flex-grow flex-col p-6">
                <h3 className="font-headline-lg text-2xl text-primary">
                  {m.name === "Michael" ? (
                    <a href="/about" className="transition-colors hover:text-secondary">
                      {m.name}
                    </a>
                  ) : (
                    m.name
                  )}
                </h3>
                <p className="mb-3 font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  {m.role}
                </p>
                <p className="text-sm leading-relaxed text-on-surface-variant">{m.bio}</p>
                {m.name === "Michael" ? (
                  <a
                    href="/about"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-secondary hover:underline"
                  >
                    Full bio & credentials
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
