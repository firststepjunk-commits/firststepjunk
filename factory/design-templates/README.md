# Design-template library (full-design swap axis)

Two independent axes for every generated site:

| Axis | Lives in | Changes |
|---|---|---|
| **Theme** | `src/lib/themes.json` | colors/tokens only — runtime-switchable via Settings → Theming |
| **Design** | `factory/design-templates/` | the *entire* look: layout, typography, imagery, structure |

Each design here is a self-contained folder: a **data-driven JSX component**
(all copy/links/sections come from one config object — swap the object,
regenerate the whole page) plus its **corrected stylesheet**. `registry.json`
indexes them; the generator/intake form will offer `design × theme` once a few
more examples land.

Rule honored: nothing in this folder is imported by master `src/` —
firststepjunk.com and the master's original files are untouched.

## ambrosia/ — template #1 (fix log)

Source: user-supplied Jcink board-index HTML + indented Sass. Converted to
SCSS + JSX with these corrections:

**CSS**
1. `@font-face` — the `format('woff')` source pointed at the `.woff2` file →
   now `.woff`; sources reordered woff2 → woff → ttf → otf (browsers use the
   first format they support).
2. `font-family: 'Roboto', sans serif` → `sans-serif`.
3. `$font2: the impressionist, script` → `"the impressionist", cursive`
   (multi-word family names must be quoted; `script` isn't a generic family).
4. `$font-accent: exoduss` — **not a typo**: verified `exodus.css` really
   defines both `Exodus` and `Exoduss`; kept (quoted) as the hover accent face.
5. `.forum-4 .f-inner` — `height: calc(100% - 1.75em)` → `1.75rem`
   (unit mismatch with the matching width rule).
6. `.forum-6 ul` — `grid: "lp-thread lp-poster lp-date" auto / auto` →
   `/ auto auto auto` (3 named columns need 3 column tracks; the 1-track list
   invalidates the whole declaration).
7. `.cf-accent7` — `content: " "` on a real element (not ::before/::after)
   is a no-op → removed.
8. `.banner-img` — `flex-wrap: wrap` is a no-op under `display: grid` → removed.
9. `border-left: 0px!important` → `border-left: 0 !important`.
10. Banner `h2` declared `padding: 0` then `padding: 5px` → consolidated.
11. Indented Sass → SCSS syntax (braces/semicolons) so it drops straight into
    React/Next tooling; `@import` kept first, semicolon added.

**HTML → JSX**
- `<div id="unicorn">` was nested inside a `<p>` (invalid — a div implicitly
  closes the paragraph) → moved out of the paragraph.
- Typos: `resouces` → resources, `adversitement` → advertisement.
- Empty `<a></a>` cover links → `href="#"` placeholders + `aria-label`
  (Jcink swaps real hrefs in at runtime).
- Entire board renders from one `BOARD` object (title, tagline, crumbs,
  categories → forums → subforums/lastPost). CSS class hooks
  (`category-N` / `forum-N`) are preserved so the stylesheet binds unchanged.

## mayqueen/ — template #2 (fix log)

Source: user-supplied Jcink board-index HTML + CSS ("the may queen").
Converted to JSX + SCSS, corrected, and **tokenized for the flip/clamp
layout kit** (Kevin Powell auto-fit/minmax grids, Josh Comeau clamp() fluid
type and flex fractions).

**CSS**
1. `object: fit-cover` → `object-fit: cover` (two places; also added to
   forum-card images so art doesn't stretch when columns flip).
2. Scrollbar track/bar used `background-color: var(--text)` — `--text` is
   the *Poppins font token*, not a color → `var(--bg001)`.
3. Theme block was labeled `html[data-theme="light"]` but held dark values →
   relabeled dark default; real light theme added.
4. `--grey: #888` declared twice in one block → deduped.
5. `.header1name a` matched nothing (element is `.header1aname`) and used
   incomplete shorthand `border-bottom: 1px` → fixed selector + shorthand.
6. Invalid values removed: `margin: px auto`, `margin-top: px`.
7. Empty declarations stripped: `background:;`, `border-radius:;`, `width:;`,
   `height:;`, `font-weight:;`; double semicolons cleaned.
8. `span1` / `ub` element selectors (invalid HTML elements) → `.sub` / `.ub`
   class selectors.
9. `#cat-5.forumhold` relied on **duplicated ids** (`cat-5`, `forum-9/10/11`
   appear twice) → `.forumhold--stack` variant class; ids dropped.
10. `.twisty1` duplicate `margin-left` (20px → 50px) consolidated.
11. `.recent-topics-info a strong` set `text-transform` twice
    (uppercase → lowercase) → kept the winner.
12. `calc(100%)` → `100%`; `@font-face` families quoted +
    `font-display: swap` added.

**HTML → JSX**
- `<span1>` and `<ub>` are not HTML elements → classed `<span>`s.
- `<a><strong>…</a></strong>` mis-nesting in recent topics → corrected.
- `.fuckbrad` icon-row class renamed `.iconbar` (SCSS updated to match).
- Duplicate ids removed (see #9); empty `<a>` get `href="#"`;
  deprecated `<center>` wrapper dropped.
- Entire page renders from one `BOARD` object: site identity, crumbs, icon
  row, hero (kicker/title/sub), link row, categories (feature panel or
  image cards + lastPost), board-stats dashboard (online, spotlight,
  badges, recents, footer links).

**Layout kit (intake-facing tokens)**
- `.forumhold` default: `repeat(auto-fit, minmax(min(var(--card-min), 100%), 1fr))`
  — column count adapts with zero media queries.
- Flip classes set from category data: `forumhold--stack` (1 col),
  `forumhold--split-1-2` (1fr 2fr), `forumhold--split-2-1` (2fr 1fr).
- Fluid type: `--fs-hero/--fs-cat/--fs-forum` via `clamp()` (maxes match the
  source pt sizes); wrapper `width: min(1200px, 100% - 2.5rem)`.
- Imagery as tokens (`--page-bg`, `--hero-bg`); palette/fonts sectioned in
  `:root` blocks so the generator rewrites only tokens.
- Small-screen fallbacks: guidebook panel + stats grid stack ≤850/700px.

## angele/ — template #3 (fix log) — FOR ARTISTS / MUSIC ACTS

Source: Rafaela Lucas "Angèle" Daily-UI page (HTML + compiled CSS + vanilla
JS). Designer attribution kept (corner badge + footer credit — both
swappable via `ARTIST.credits` / `ARTIST.footer.designBy`).

**JS → React (the whole script is replaced by component state)**
1. `window.onscroll` was assigned **twice** (duplicate sticky-menu block;
   second overwrote the first) and clobbered any other scroll handler →
   `useSticky` hook with `addEventListener` + cleanup.
2. Slider: source mutated `img.src`/`data-id` via `querySelector` →
   `HeroSlider` index state; the anime-in/out classes are applied for the
   source's 960ms lifetime via a ref-tracked timeout (spam-clicks during an
   animation are now ignored). Bullets derive from state — the four
   hardcoded `data-id` spans are generated from the slides array.
3. Menu: `menu-open`/`menu-close`/`icon-open` class juggling + three
   setTimeouts → a 3-state machine (closed→open→closing, 900ms), same
   rendered classes. Sticky-icon suppression while open simplified from the
   source's 500ms-delayed class removal.
4. Video modal: iframe `src` swapping → `src` state; the iframe **only
   mounts while open** (source kept an empty `src=""` iframe in the DOM,
   which browsers may treat as a page load). Fixed `width/height 1920×1080`
   attributes dropped — CSS sizes it.
5. `body.no-scroll` → one `useBodyScrollLock` effect (menu OR modal).
6. Dead code dropped: unused `videoOpen` query, commented `ytLink`.

**HTML → JSX**
- `<date>` is not an HTML element → `<time>` (CSS selector updated).
- `<a><button>` (interactive inside interactive — invalid) → `<a class="btn">`
  for "view all" + "buy album"; `.btn` gained `text-align/width/box-sizing`
  to keep the button look on anchors.
- `<a><strong>…</a></strong>`-style controls: `<i>` icons and slider arrows
  got `role="button"`, `tabIndex`, `aria-label`, Enter-key handlers.
- Newsletter input `type="text"` → `type="email"` + aria-label; controlled
  input with an `onSubscribe` hookup point for Netlify Forms later.
- `class=" videos"` stray leading space removed (section is intentionally
  NOT `.module` — the video row is full-bleed).
- Empty slider `<img src="">` placeholders → rendered from state.

**CSS**
1. ~60 hardcoded colors (`#7fb6ca`, `#c6dde2`, `#404145`, `#e7eff5`,
   `#eaeaea`, `#b7b7b7`, `#9c9c9c`) → `:root` tokens (`--primary`,
   `--primary-light`, `--ink`, `--mist`, `--line`, `--muted`, `--muted-2`)
   + `--grad`/`--grad-rev` gradients; Roboto → `--font`. Designer-badge
   brand colors (dribbble/linkedin) intentionally left literal.
2. `.follow` panels: the 1023px media query was **repeated** with a
   conflicting height (280px then 200px) — second block clearly meant for
   phones → 799px.
3. `.tour-list .content a { grid-column: 1/11 }` also matched every
   RSVP/ticket link → scoped to `.view-all`.
4. `.credits a:before` had `grid-column: 2/14` on a non-grid-item → removed.
5. Slider arrows: dropped `position: initial; top: initial; bottom: 0;
   margin-top: 0` — leftover overrides for a slider library (Swiper) that
   isn't used.
6. `.slide-bullets` declared `position: initial` then `absolute` → absolute.
7. `translatey(-200px)` → `translateY`; duplicate `border-radius` in
   `.about .bg_links`, duplicate `display: flex` in `.icon-menu span`,
   duplicate `color`/`position` in `.menu-items .item` → deduped.
8. `.site-title` 144px → `clamp(68px, 4vw + 40px, 144px)` (Comeau fluid
   type; source's desktop/mobile sizes are the clamp bounds).
9. Enhancement: `prefers-reduced-motion` block stops the four decorative
   shape animations.
