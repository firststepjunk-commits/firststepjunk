/**
 * MAY QUEEN — design template #2 (Jcink-style board index, dark grunge-zine skin)
 *
 * Fully data-driven: the entire page renders from the BOARD object at the
 * bottom (or a `board` prop). Every section is atomic — sticky identity bar,
 * hero, link row, categories (feature panel / forum cards), board stats —
 * so intake answers can fill each independently.
 *
 * Layout is token-driven (see ./mayqueen.scss): per-category `split` flips
 * column fractions (1fr 2fr ↔ 2fr 1fr), default card grid is Kevin Powell's
 * repeat(auto-fit, minmax(min(--card-min, 100%), 1fr)).
 *
 * Host page must load (kept out of the component on purpose):
 *   Google font Poppins + flaticon uicons (regular/solid/bold rounded)
 *   + compiled mayqueen.scss
 *
 * FIXES vs. source HTML: invalid <span1>/<ub> elements → classed spans,
 * <a><strong> mis-nesting corrected, duplicate ids (cat-5, forum-9/10/11) →
 * variant class, `.fuckbrad` renamed `.iconbar`, empty <a> get href="#",
 * deprecated <center> dropped. Full fix log: ../README.md
 */

import { Fragment } from "react";

// Tiny rich-text helper so intake data stays a plain serializable object:
// strings render as text, { b: "..." } renders bold.
function Rich({ parts }) {
  if (typeof parts === "string") return parts;
  return parts.map((p, i) =>
    typeof p === "string" ? (
      <Fragment key={i}>{p}</Fragment>
    ) : (
      <b key={i}>{p.b}</b>
    )
  );
}

const LAST_POST = {
  title: "i don't hate that i need you",
  href: "#",
  author: "christina motionless",
};

function LastPostRow({ post = LAST_POST }) {
  return (
    <div className="forumzbottom">
      <div className="header1aimg" />
      <div className="idh">
        <a href={post.href || "#"}>{post.title}</a> by{" "}
        {/* FIX: <ub> is not an HTML element → classed span */}
        <span className="ub">{post.author}</span>
      </div>
    </div>
  );
}

/** Standard forum card: title bar / image / last-post row */
function ForumCard({ forum }) {
  return (
    <div className="forumz">
      <div className="forumztop">{forum.name}</div>
      <div className="forumzmid">
        <img src={forum.image} alt={forum.imageAlt || forum.name} />
      </div>
      <LastPostRow post={forum.lastPost} />
    </div>
  );
}

/** Feature panel (source: "site guidebook"): vertical twisty label /
 *  portrait image / scrolling blurb + stacked links */
function FeaturePanel({ forum }) {
  return (
    <div className="gb">
      <div className="twisty">
        <div className="twisty1">{forum.name}</div>
      </div>
      <div className="image">
        <img src={forum.image} alt={forum.imageAlt || forum.name} />
      </div>
      <div className="gbcontent">
        <div className="scrolly">
          <div className="scrolly1">{forum.blurb}</div>
        </div>
        <div className="gblinks">
          {forum.links.map((l) => (
            <a key={l.label} href={l.href || "#"}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function Category({ category }) {
  // layout: "auto" (auto-fit card grid, default) | "stack" (single column,
  // was the duplicated id="cat-5") | "split-1-2" | "split-2-1" (fr flips)
  const layoutClass =
    category.layout && category.layout !== "auto"
      ? ` forumhold--${category.layout}`
      : "";
  return (
    <div className="categoryhold">
      <div className="catheader">{category.title}</div>
      <div className={`forumhold${layoutClass}`}>
        {category.forums.map((f) =>
          f.type === "feature" ? (
            <FeaturePanel key={f.name} forum={f} />
          ) : (
            <ForumCard key={f.name} forum={f} />
          )
        )}
      </div>
    </div>
  );
}

function BoardStats({ stats }) {
  return (
    <div className="categoryhold">
      <div className="catheader">{stats.title}</div>
      <div className="forumhold forumhold--stack">
        <div className="stats">
          <div className="stats1">
            <div className="stat1">
              <div className="stat1a">
                <h1>{stats.online.headline}</h1>
                <span>{stats.online.detail}</span>
              </div>
              <div className="stat1b">
                <div className="stat1ba">{stats.online.names}</div>
              </div>
            </div>

            <div className="stat2">
              <div className="stat2a">
                <div className="stat2aa">
                  <a href={stats.spotlight.href || "#"}>{stats.spotlight.name}</a>
                  <span className="sub">{stats.spotlight.note}</span>
                </div>
                <div className="stat2ab">
                  {stats.badges.map((b) => (
                    <span key={b}>{b}</span>
                  ))}
                </div>
              </div>
              <div className="stat2b">
                <div className="stat2ba">{stats.memberNames}</div>
              </div>
            </div>

            <div className="stat3">
              <div className="stat3a">
                {stats.recents.map((r, i) => (
                  <div key={i} className="recents">
                    <div className="recent-topics-info">
                      {/* FIX: source had <a><strong>…</a></strong> */}
                      <a href={r.href || "#"}>
                        <strong>{r.title}</strong>
                      </a>{" "}
                      - {r.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat4">
              {stats.links.map((l, i) => (
                <a key={i} href={l.href || "#"}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MayQueenBoard({ board = BOARD }) {
  return (
    <div id="wrapper">
      <div className="sticky">
        <div className="header1">
          <div className="header1a">
            <div className="header1aimg" />
            <div className="header1aname">
              <a href={board.site.href || "#"}>{board.site.name}</a>
            </div>
          </div>
          <div className="header1b">
            <div className="header1ba">
              <div className="navz">
                {board.crumbs.map((c) => (
                  <a key={c.label} href={c.href || "#"}>
                    {c.label}
                  </a>
                ))}
              </div>
              {/* FIX: renamed from `.fuckbrad` (matching SCSS updated) */}
              <div className="iconbar">
                {board.icons.map((icon, i) => (
                  <i key={i} className={icon} aria-hidden="true" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="header">
        <div className="header2">
          <span>
            <Rich parts={board.hero.kicker} />
          </span>
          <h1>{board.hero.title}</h1>
          {/* FIX: <span1> is not an HTML element → classed span */}
          <span className="sub">{board.hero.sub}</span>
        </div>
      </div>

      <div className="linkz">
        {board.navLinks.map((l, i) => (
          <a key={i} href={l.href || "#"}>
            {l.label}
          </a>
        ))}
      </div>

      <div className="innerwrapper">
        {board.categories.map((cat) => (
          <Category key={cat.title + cat.forums[0]?.name} category={cat} />
        ))}
        <BoardStats stats={board.stats} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BOARD — the entire design's content. Swap this object → new board.
// ---------------------------------------------------------------------------
const NAMES_SAMPLE =
  "winifred langley, jameson davis, cohen hudson, anna grace caldwell, " +
  "renzo aguilar, tristan lee, isaiah beck, drusilla osbourne, sadie lane " +
  "lewis, colton manshack, marley newman, effie aldridge, ";

export const BOARD = {
  site: { name: "the may queen", href: "#" },
  crumbs: [
    { label: "a site name" },
    { label: "a category name" },
    { label: "a forum name" },
    { label: "a topic name" },
  ],
  icons: Array.from({ length: 8 }, () => "fi fi-br-home"),
  hero: {
    kicker: ["listen, it's ", { b: "nothin' personal" }, " but .."],
    title: "we're not in kansas anymore",
    sub: "where all the weirdos collide. a playground for freaks. without the bullshit!",
  },
  navLinks: Array.from({ length: 7 }, () => ({ label: "link" })),
  categories: [
    {
      title: "i am your sin, i am your whore",
      layout: "split-1-2", // feature panel wide-right; flip with split-2-1
      forums: [
        {
          type: "feature",
          name: "site guidebook",
          image: "https://i.postimg.cc/4xhM4Nhw/plzg.png",
          blurb:
            "lorem ipsum fuck your momma lorem ipsum its jonny lorem ipsum i wanna fuck spencer charnas lorem ipsum i love beth lorem ipsum shiny better join the site lorem ipsum fuck your momma lorem ipsum its jonny lorem ipsum i wanna fuck spencer charnas lorem ipsum i love beth lorem ipsum shiny better join the site",
          links: [
            { label: "rules" },
            { label: "groups" },
            { label: "staff" },
            { label: "plots" },
          ],
        },
        {
          name: "site templates",
          image: "https://i.postimg.cc/zGHDgcB7/Untitled-28.png",
        },
      ],
    },
    {
      title: "the death of peace of mind",
      forums: [
        {
          name: "communications",
          image: "https://i.postimg.cc/7L5Cxrfn/yesmm.png",
        },
        {
          name: "development",
          image: "https://i.postimg.cc/zGHDgcB7/Untitled-28.png",
        },
      ],
    },
    {
      title: "a lullaby of shadows",
      forums: [
        { name: "neiflheim", image: "https://i.postimg.cc/fb4Rct81/castle.png" },
        { name: "elsewhere", image: "https://i.postimg.cc/Vk4d8Lgh/evee.png" },
      ],
    },
    {
      title: "a lullaby of shadows",
      forums: [
        { name: "denmark", image: "https://i.postimg.cc/W4jCMsPs/denny.png" },
        { name: "england", image: "https://i.postimg.cc/W1MrBvqF/ENGL.png" },
      ],
    },
    {
      title: "castle harbor",
      layout: "stack", // was id="cat-5" single-column
      forums: [
        {
          name: "north oakdale",
          image: "https://i.postimg.cc/dtnbc4LJ/NORTH.png",
        },
        {
          name: "south oakdale",
          image: "https://i.postimg.cc/tRkRSdtH/southoak.png",
        },
        {
          name: "everywhere else",
          image: "https://i.postimg.cc/vBzJ8z37/EVERY.png",
        },
      ],
    },
    {
      title: "cults, cults, cults!",
      layout: "stack",
      forums: [
        {
          name: "little hope",
          image: "https://i.postimg.cc/sgKyg3xG/widdohope.png",
        },
      ],
    },
  ],
  stats: {
    title: "board stats",
    online: {
      headline: "46 online now",
      detail: "## guests, etc",
      names: NAMES_SAMPLE.repeat(6),
    },
    spotlight: {
      name: "firstname lastname",
      note: "oh no, they did it again...",
    },
    badges: [
      "est 2022",
      "invite only",
      "## total members",
      "## total posts",
      "## online today",
    ],
    memberNames: NAMES_SAMPLE.repeat(3),
    recents: Array.from({ length: 4 }, () => ({
      title: "testing a title name here",
      author: "first last",
    })),
    links: Array.from({ length: 6 }, () => ({ label: "link one", href: "#" })),
  },
};
