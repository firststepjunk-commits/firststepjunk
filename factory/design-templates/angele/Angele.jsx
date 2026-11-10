/**
 * ANGELE — design template #3 (music-artist landing page)
 * Source: Rafaela Lucas "Daily UI" CodePen (design credit kept in the
 * .about badge — swappable via ARTIST.credits).
 *
 * FOR: artists / music artists — hero slider, tour dates, video grid with
 * modal player, album tracklist, newsletter + socials, footer.
 *
 * Fully data-driven: everything renders from the ARTIST object at the
 * bottom (or an `artist` prop). Swap the object → new act.
 *
 * The source's imperative JS (querySelector src-swapping slider, class
 * toggling menu, video modal) is rewritten as React state:
 *   - HeroSlider: index state + timed animation classes (no DOM mutation)
 *   - Nav: menu state machine "closed"→"open"→"closing" (matches the
 *     source's menu-open/menu-close timing)
 *   - Videos: modal src state; iframe only mounts while open
 *   - body.no-scroll handled in one effect (menu OR modal open)
 *
 * Host page must load: Google font Roboto (imported by angele.scss) +
 * compiled angele.scss. No jQuery, no external JS.
 *
 * Full fix log: ../README.md
 */

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// hooks
// ---------------------------------------------------------------------------

/** Lock body scroll while any overlay is open (source toggled .no-scroll). */
function useBodyScrollLock(locked) {
  useEffect(() => {
    document.body.classList.toggle("no-scroll", locked);
    return () => document.body.classList.remove("no-scroll");
  }, [locked]);
}

/** Sticky menu icon past 90px.
 *  FIX: source assigned window.onscroll twice (2nd overwrote the 1st) and
 *  clobbered any other scroll handler → addEventListener + cleanup. */
function useSticky(threshold = 90) {
  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setSticky(window.pageYOffset >= threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return sticky;
}

// ---------------------------------------------------------------------------
// sections
// ---------------------------------------------------------------------------

/** Designer-credit corner badge (attribution — swap or omit via data). */
function CreditsBadge({ credits }) {
  if (!credits) return null;
  return (
    <div className="about">
      {credits.links.map((l) => (
        <a
          key={l.kind}
          className={`bg_links social ${l.kind}`}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          aria-label={l.kind}
        >
          <span className="icon" />
        </a>
      ))}
      <a className="bg_links logo" aria-hidden="true" />
    </div>
  );
}

function Nav({ items }) {
  // "closed" | "open" | "closing" — mirrors source menu-open/menu-close classes
  const [menu, setMenu] = useState("closed");
  const timers = useRef([]);
  const sticky = useSticky(90);
  useBodyScrollLock(menu === "open");
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function toggle() {
    if (menu === "open") {
      setMenu("closing");
      // source: menu-open off after 800ms, menu-close off after 900ms
      timers.current.push(setTimeout(() => setMenu("closed"), 900));
    } else if (menu === "closed") {
      setMenu("open");
    }
  }

  const navClass = [
    "main-nav",
    menu !== "closed" ? "menu-open" : "",
    menu === "closing" ? "menu-close" : "",
  ]
    .join(" ")
    .trim();

  return (
    <nav>
      {/* FIX: <i> as a control → keyboard/AT support added */}
      <i
        className={`icon-menu${menu === "open" ? " icon-open" : ""}${
          sticky && menu === "closed" ? " sticky" : ""
        }`}
        onClick={toggle}
        onKeyDown={(e) => e.key === "Enter" && toggle()}
        role="button"
        tabIndex={0}
        aria-label="menu"
        aria-expanded={menu === "open"}
      >
        <span />
      </i>

      <div className={navClass}>
        <div className="menu">
          <div className="menu-items">
            {items.map((it) => (
              <a
                key={it.label}
                href={it.href}
                className="item"
                target="_blank"
                rel="noreferrer"
              >
                {it.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSlider({ title, slides }) {
  const n = slides.length;
  const [active, setActive] = useState(0);
  const [anim, setAnim] = useState(null); // "in" | "out" | null
  const timer = useRef(null);
  const next = (active + 1) % n;

  function go(dir) {
    if (timer.current) return; // one animation at a time (source allowed spam-clicks)
    setActive((a) => (dir === "in" ? (a + 1) % n : (a - 1 + n) % n));
    setAnim(dir);
    timer.current = setTimeout(() => {
      setAnim(null);
      timer.current = null;
    }, 960); // source's anime class lifetime
  }
  useEffect(() => () => clearTimeout(timer.current), []);

  const activeClass =
    anim === "in" ? " anime-in" : anim === "out" ? " anime-out" : "";
  const nextClass =
    anim === "in" ? " anime-next-in" : anim === "out" ? " anime-next-out" : "";

  return (
    <header>
      <div className="main-heading">
        <article>
          <h1 className="site-title">{title}</h1>
        </article>

        <div className="slide-container">
          <div className="slide-wrapper">
            <div className={`slide active${activeClass}`}>
              <img src={slides[active].image} alt={slides[active].alt || ""} />
            </div>
            <div className={`slide next${nextClass}`}>
              <img src={slides[next].image} alt={slides[next].alt || ""} />
            </div>
          </div>
          <div className="slide-arrows">
            <div
              className="button-prev"
              onClick={() => go("out")}
              role="button"
              tabIndex={0}
              aria-label="previous slide"
              onKeyDown={(e) => e.key === "Enter" && go("out")}
            />
            <div
              className="button-next"
              onClick={() => go("in")}
              role="button"
              tabIndex={0}
              aria-label="next slide"
              onKeyDown={(e) => e.key === "Enter" && go("in")}
            />
          </div>
          <div className="slide-bullets">
            {slides.map((s, i) => (
              <span
                key={i}
                className={`bullet${i === active ? " selected" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function TourList({ tour }) {
  return (
    <section className="module tour-list">
      <h3 className="section-title">
        <b>{tour.titleBold}</b>
        <span>{tour.titleOutline}</span>
      </h3>
      <div className="content">
        <ul className="shows">
          {tour.shows.map((show, i) => (
            <li key={i}>
              {/* FIX: <date> is not an HTML element → <time> */}
              <time>{show.date}</time>
              <p className="place">{show.place}</p>
              <p className="country">{show.country}</p>
              <div className="button-container">
                <a
                  className="btn-rsvp"
                  href={show.rsvp}
                  target="_blank"
                  rel="noreferrer"
                >
                  RSVP
                </a>
                <a
                  className="btn-buy"
                  href={show.tickets}
                  target="_blank"
                  rel="noreferrer"
                >
                  Buy tickets
                </a>
              </div>
            </li>
          ))}
        </ul>
        {/* FIX: <a><button> (interactive-in-interactive, invalid) → link.btn */}
        <a
          className="btn view-all"
          href={tour.allHref}
          target="_blank"
          rel="noreferrer"
        >
          view all
        </a>
      </div>
    </section>
  );
}

function Videos({ videos }) {
  const [src, setSrc] = useState(null);
  useBodyScrollLock(!!src);

  return (
    <section className="videos">
      <h3 className="section-title">
        <span>{videos.titleOutline}</span>
        <b>{videos.titleBold}</b>
      </h3>
      <div className="content">
        {videos.items.map((v) => (
          <a
            key={v.title}
            className="video-item"
            onClick={(e) => {
              e.preventDefault();
              setSrc(v.embed);
            }}
            href={v.url}
            role="button"
          >
            <p className="video-title">{v.title}</p>
            <span className="video-icon" />
            <img src={v.thumb} alt={v.title} />
          </a>
        ))}
      </div>

      <div className={`modal-video${src ? " video-open" : ""}`}>
        <div className="wrapper-video">
          <i
            className="close-video"
            onClick={() => setSrc(null)}
            role="button"
            tabIndex={0}
            aria-label="close video"
            onKeyDown={(e) => e.key === "Enter" && setSrc(null)}
          />
          <div className="video-container">
            <div className="video-code">
              {/* FIX: iframe only mounts while open (source left an empty
                  src="" iframe in the DOM); fixed width/height attrs dropped
                  — CSS sizes it */}
              {src && (
                <iframe
                  src={src}
                  title="video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Album({ album }) {
  return (
    <section className="module album">
      <h3 className="section-title">
        <b>{album.titleBold}</b>
        <span>{album.titleOutline}</span>
      </h3>
      <div className="content">
        <div className="cover">
          <div className="cover-img">
            <img src={album.cover} alt={`${album.titleBold} album cover`} />
          </div>
        </div>
        <div className="tracks">
          <ul className="tracklist">
            {album.tracks.map((t, i) => (
              <li key={t.name}>
                <article>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <p>{t.name}</p>
                  {t.feat && <small>ft. {t.feat}</small>}
                </article>
                <div className="icons">
                  <i className="like" role="button" tabIndex={0} aria-label={`like ${t.name}`} />
                  <i className="play" role="button" tabIndex={0} aria-label={`play ${t.name}`} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="button-container">
          {/* FIX: <a><button> → link.btn */}
          <a className="btn" href={album.buyHref} target="_blank" rel="noreferrer">
            buy album
          </a>
        </div>
      </div>
    </section>
  );
}

function Follow({ follow, artistName }) {
  const [email, setEmail] = useState("");

  function send() {
    // Factory hookup point: wire to Netlify Forms / CRM intake later.
    if (follow.onSubscribe) follow.onSubscribe(email);
    setEmail("");
  }

  return (
    <section className="module follow">
      <h3 className="section-title">
        <span>Follow</span>
        <b>{artistName}</b>
      </h3>
      <div className="content">
        <div className="newsletter">
          <p className="social-title">Newsletter</p>
          <img src={follow.newsletterImage} alt="" />
          <div className="form">
            {/* FIX: type="text" for an email field → type="email" + label */}
            <input
              type="email"
              placeholder="email"
              aria-label="email for newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <i
              className="send"
              onClick={send}
              role="button"
              tabIndex={0}
              aria-label="subscribe"
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
          </div>
        </div>
        <div className="social">
          <p className="social-title">Social</p>
          <div className="social-icons">
            {follow.networks.map((s) => (
              <a
                key={s.name}
                className="network"
                href={s.href}
                target="_blank"
                rel="noreferrer"
              >
                <img src={s.icon} alt="" />
                <p className="social-name">{s.name}</p>
              </a>
            ))}
          </div>
          <img src={follow.socialImage} alt="" />
        </div>
      </div>
    </section>
  );
}

function Footer({ footer }) {
  return (
    <footer>
      <div className="content">
        <article>
          <p className="text">{footer.text}</p>
          {footer.designBy && (
            <p className="credits">
              design by{" "}
              <a href={footer.designBy.href} target="_blank" rel="noreferrer">
                <span>{footer.designBy.name}</span>
              </a>
            </p>
          )}
        </article>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// page
// ---------------------------------------------------------------------------

export default function AngeleArtistPage({ artist = ARTIST }) {
  return (
    <>
      <CreditsBadge credits={artist.credits} />
      <Nav items={artist.nav} />
      <HeroSlider title={artist.name} slides={artist.slides} />
      <div className="wrapper">
        <TourList tour={artist.tour} />
        <Videos videos={artist.videos} />
        <Album album={artist.album} />
        <Follow follow={artist.follow} artistName={artist.name} />
      </div>
      <Footer footer={artist.footer} />
    </>
  );
}

// ---------------------------------------------------------------------------
// ARTIST — the entire page's content. Swap this object → new act.
// ---------------------------------------------------------------------------
const FB = "https://www.facebook.com/pg/angeleouenpoudre";
const ASSETS = "https://rafaelalucas.com/dailyui/3/assets";

export const ARTIST = {
  name: "Angèle",
  credits: {
    links: [
      { kind: "portfolio", href: "https://www.rafaelalucas.com/dailyui" },
      { kind: "dribbble", href: "https://dribbble.com/rafaelalucas" },
      { kind: "linkedin", href: "https://www.linkedin.com/in/rafaelalucas/" },
    ],
  },
  nav: [
    { label: "about", href: `${FB}/about` },
    { label: "tour", href: `${FB}/events` },
    { label: "shop", href: `${FB}/shop` },
    { label: "contacts", href: `${FB}/about` },
  ],
  slides: [
    { image: `${ASSETS}/angele-03.jpg` },
    { image: `${ASSETS}/angele-10.jpg` },
    { image: `${ASSETS}/angele-11.jpg` },
    { image: `${ASSETS}/angele-12.jpg` },
  ],
  tour: {
    titleBold: "Tour",
    titleOutline: "Dates",
    allHref: `${FB}/events/`,
    shows: [
      { date: "06 Nov 2019", place: "Le Millesium", country: "Epernay, France", rsvp: `${FB}/events/`, tickets: `${FB}/events/` },
      { date: "10 Nov 2019", place: "Lotto Arena", country: "Antwerp, Belgium", rsvp: `${FB}/events/`, tickets: `${FB}/events/` },
      { date: "13 Nov 2019", place: "ZENITH TOULOUSE METROPOLE", country: "Toulouse, France", rsvp: `${FB}/events/`, tickets: `${FB}/events/` },
      { date: "14 Nov 2019", place: "Arkea Arena", country: "Floirac, France", rsvp: `${FB}/events/`, tickets: `${FB}/events/` },
      { date: "15 Nov 2019", place: "ZENITH NANTES METROPOLE", country: "Nantes, France", rsvp: `${FB}/events/`, tickets: `${FB}/events/` },
      { date: "19 Nov 2019", place: "Palais 12", country: "Brussels, Belgium", rsvp: `${FB}/events/`, tickets: `${FB}/events/` },
    ],
  },
  videos: {
    titleOutline: "latest",
    titleBold: "videos",
    items: [
      {
        title: "Flou",
        embed: "https://www.youtube.com/embed/D6Wi3SmmnAE",
        url: "https://www.youtube.com/watch?v=D6Wi3SmmnAE",
        thumb: `${ASSETS}/angele-05.jpg`,
      },
      {
        title: "balance ton quoi",
        embed: "https://www.youtube.com/embed/Hi7Rx3En7-k",
        url: "https://www.youtube.com/watch?v=Hi7Rx3En7-k",
        thumb: `${ASSETS}/angele-04.jpg`,
      },
      {
        title: "tout oublier",
        embed: "https://www.youtube.com/embed/Fy1xQSiLx8U",
        url: "https://www.youtube.com/watch?v=Fy1xQSiLx8U",
        thumb: `${ASSETS}/angele-15.jpeg`,
      },
    ],
  },
  album: {
    titleBold: "Brol",
    titleOutline: "Album",
    cover: `${ASSETS}/angele-09.jpg`,
    buyHref: `${FB}/shop/`,
    tracks: [
      { name: "la thune" },
      { name: "Balance ton quoi" },
      { name: "jalousie" },
      { name: "tout oublier", feat: "Roméo Elvis" },
      { name: "la loi de murphy" },
      { name: "nombreux" },
      { name: "victime des réseaux" },
      { name: "les matins" },
      { name: "je veux tes yeux" },
      { name: "ta reine" },
      { name: "flemme" },
      { name: "flou" },
    ],
  },
  follow: {
    newsletterImage: `${ASSETS}/angele-14.jpg`,
    socialImage: `${ASSETS}/angele-08.jpg`,
    networks: [
      { name: "facebook", icon: `${ASSETS}/facebook.svg`, href: `${FB}/` },
      { name: "youtube", icon: `${ASSETS}/youtube.svg`, href: "https://www.youtube.com/user/AngeleAmbre" },
      { name: "instagram", icon: `${ASSETS}/instagram.svg`, href: "https://www.instagram.com/angele_vl" },
      { name: "twitter", icon: `${ASSETS}/twitter.svg`, href: "https://twitter.com/angele_vl" },
    ],
  },
  footer: {
    text: "Angèle @ 2019 — all rights reserved",
    designBy: { name: "rafaela lucas", href: "https://rafaelalucas.com" },
  },
};
