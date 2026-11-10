/** Trust bar directly under the hero — the four facts a visitor checks first. */
const ITEMS = [
  {
    stars: true,
    title: "5.0 · 14 Google reviews",
    sub: "Every review five stars",
  },
  {
    title: "Most jobs $75–$425",
    sub: "Flat rates, no surprise fees",
  },
  {
    title: "Free quotes",
    sub: "Send a photo, get a price",
  },
  {
    title: "Licensed & Fully Insured",
    sub: "Residential & commercial",
  },
];

export default function TrustBar() {
  return (
    <div className="border-t border-outline-variant/30 bg-white">
      <div className="container mx-auto grid grid-cols-2 gap-6 px-margin-mobile py-6 md:grid-cols-4 md:px-margin-desktop">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex flex-col gap-1">
            {item.stars ? (
              <span
                className="text-lg leading-none tracking-[0.15em] text-amber-500"
                aria-label="5 out of 5 stars"
              >
                ★★★★★
              </span>
            ) : null}
            <p className="font-bold text-primary">{item.title}</p>
            <p className="text-sm text-on-surface-variant">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
