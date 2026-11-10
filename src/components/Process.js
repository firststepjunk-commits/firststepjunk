/** Four steps, no surprises — the whole job in one glance. */
const STEPS = [
  {
    n: "1",
    title: "Send a photo",
    body: "Text or upload a photo of your pile through the quote form.",
  },
  {
    n: "2",
    title: "Get your flat price",
    body: "We confirm your price before we start — from $75, a full load $425 flat.",
  },
  {
    n: "3",
    title: "We load & haul",
    body: "Our crew lifts, loads, and sweeps the area clean.",
  },
  {
    n: "4",
    title: "Done",
    body: "We dispose of it responsibly. You enjoy the space back.",
  },
];

export default function Process() {
  return (
    <section className="bg-surface-container-lowest py-section-gap" id="process">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-14 max-w-2xl" data-aos="fade-up">
          <p className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-secondary">
            How it works
          </p>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Four steps. No surprises.
          </h2>
        </div>
        <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.n} className="relative" data-aos="fade-up" data-aos-delay={i * 100}>
              <p className="font-display-lg text-6xl font-extrabold leading-none text-primary/15">
                {s.n}
              </p>
              <h3 className="mt-4 text-xl font-bold text-primary">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
