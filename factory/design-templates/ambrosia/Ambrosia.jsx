/**
 * AMBROSIA — design template #1 (Jcink-style board index, modern-fantasy skin)
 *
 * Fully data-driven: the whole page renders from the BOARD object at the
 * bottom. Swap BOARD (or pass a `board` prop) and the entire design
 * regenerates — same idea as the factory's intake → generate flow, but for
 * a complete layout instead of just color tokens.
 *
 * CSS class hooks (`category-N`, `forum-N`, wrappers, subforum slugs) are
 * preserved exactly so ./ambrosia.scss binds without edits.
 *
 * Host page must load (kept out of the component on purpose):
 *   <script src="https://vvvaporwaves.github.io/jcink-coding/jquery-1.6.js" />
 *   <script src="https://vvvaporwaves.github.io/jcink-coding/music/mediaelement-and-player.min.js" />
 *   <script src="https://vvvaporwaves.github.io/jcink-coding/tooltips/tooltips.js" />
 *   Google fonts (Roboto) + https://vvvaporwaves.github.io/fonts/exodus/exodus.css
 *   + compiled ambrosia.scss
 *
 * FIXES vs. source HTML: #unicorn div moved out of <p> (invalid nesting),
 * "resouces"→resources, "adversitement"→advertisement, empty <a> tags get
 * href="#" + aria-label. Full fix log: ../README.md
 */

import { Fragment } from "react";

// Jcink injects real last-post data at runtime; this is the design's sample.
const LAST_POST = {
  date: "JUN 1 2018, 06:44 PM",
  thread: "VI. Divine intervention",
  threadHref: "#",
  poster: "CREATION",
  posterHref: "#",
};

function LastPost({ post = LAST_POST }) {
  return (
    <ul>
      <li className="lp-date">{post.date}</li>
      <li className="lp-thread">
        <a href={post.threadHref || "#"}>{post.thread}</a>
      </li>
      <li className="lp-poster">
        <a href={post.posterHref || "#"}>{post.poster}</a>
      </li>
    </ul>
  );
}

function Forum({ forum }) {
  return (
    <div className={`forum-${forum.id}`}>
      <div className="f-inner" />
      <h4>
        <a href={forum.href || "#"}>{forum.name}</a>
      </h4>
      {forum.desc != null && (
        // `desc` class only when subforums exist (matches .forum-6 .desc rule)
        <p className={forum.subforums ? "desc" : undefined}>{forum.desc}</p>
      )}
      {/* FIX: source had this div nested inside the <p> — invalid HTML */}
      {forum.decorId && <div id={forum.decorId} />}
      {forum.subforums && (
        <div className="subf-container">
          {forum.subforums.map((sf) => (
            <div key={sf.slug} className={sf.slug}>
              <a href={sf.href || "#"} aria-label={sf.name} />
              <h5>{sf.name}</h5>
            </div>
          ))}
        </div>
      )}
      <LastPost post={forum.lastPost} />
    </div>
  );
}

function Category({ category }) {
  const forums = category.forums.map((f) => <Forum key={f.id} forum={f} />);
  return (
    <div id={`category-${category.id}`}>
      <h3>{category.title}</h3>
      {/* category-7's framed collage decorations */}
      {category.decor === "cat7" && (
        <>
          <div className="cf-accent7" />
          <div className="cf-inner7" />
        </>
      )}
      {category.wrapper ? (
        <div className={category.wrapper}>
          {forums}
          {category.filler === "catfiller7" && (
            <div className="forum-catfiller7">
              <div className="catfiller7-img" />
            </div>
          )}
        </div>
      ) : (
        forums
      )}
    </div>
  );
}

export default function AmbrosiaBoard({ board = BOARD }) {
  return (
    <>
      <header>
        <div className="banner-img">
          <h1>{board.title}</h1>
          <h2>{board.tagline}</h2>
        </div>
      </header>

      <main>
        <div className="wrapper">
          <div className="innerwrapper">
            <div id="nav">
              {board.crumbs.map((c, i) => (
                <Fragment key={c.label}>
                  {i > 0 && " > "}
                  <a href={c.href || "#"}>{c.label}</a>
                </Fragment>
              ))}
            </div>

            {board.categories.map((cat) => (
              <Category key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </main>

      <footer />
    </>
  );
}

// ---------------------------------------------------------------------------
// BOARD — the entire design's content. Swap this object → new board.
// ---------------------------------------------------------------------------
export const BOARD = {
  title: "ambrosia",
  tagline: "a modern fantasy",
  crumbs: [{ label: "AMBROSIA" }, { label: "registry" }, { label: "registration" }],
  categories: [
    {
      id: 3,
      title: "information",
      forums: [
        {
          id: 3,
          name: "guidebook",
          desc: "Welcome to AMBROSIA! Please make sure to read over the necessary information located in this thread such as things like the rules, plots, etc. They are definitely important to look over if you intend on joining. The information located here is prone to changing as we see required",
          decorId: "unicorn",
        },
        {
          id: 4,
          name: "announcements",
          desc: "Check here periodically for updates on the site and the overall plot. It's recommended to check frequently. Activity checks are also posted here.",
        },
      ],
    },
    {
      id: 4,
      title: "registry",
      forums: [
        {
          id: 5,
          name: "registration",
          desc: "After checking through the guidebook, you can find the application to register here. Please post in the appropriate sub board, and bump incomplete applications once finished.",
        },
        {
          id: 6,
          name: "database",
          desc: "After checking through the guidebook, you can find the application to register here. Please post in the appropriate sub board, and bump incomplete applications once finished.",
          subforums: [
            { slug: "wakewalker", name: "wakewalker" },
            { slug: "dreamers", name: "dreamers" },
            { slug: "arisen", name: "arisen" },
            { slug: "sleepwalker", name: "sleepwalkers" },
          ],
        },
        {
          id: 9,
          name: "resources", // FIX: "resouces"
          desc: "Here's face claim, member directory, member services, etc.",
        },
      ],
    },
    {
      id: 7,
      title: "development",
      wrapper: "f-container",
      decor: "cat7",
      filler: "catfiller7",
      forums: [
        {
          id: 10,
          name: "plotting",
          desc: "Here's to post your characters plot pages, or one thread for multiple characters.",
        },
        {
          id: 11,
          name: "development",
          desc: "Here’s a place for any development, thread trackers, etc.",
        },
        {
          id: 12,
          name: "requests",
          desc: "Wanted advertisements broken up by sub board, please post in the appropriate one.",
        },
      ],
    },
    {
      id: 5,
      title: "roleplaying",
      wrapper: "forum-container",
      forums: [
        { id: 68, name: "communications", desc: "anything that isn't irl - text and other messaging threads" },
        { id: 16, name: "north nova atlantis", desc: "anything that isn't irl - text and other messaging threads" },
        { id: 17, name: "east nova atlantis", desc: "anything that isn't irl - text and other messaging threads" },
        { id: 18, name: "west nova atlantis", desc: "anything that isn't irl - text and other messaging threads" },
        { id: 19, name: "south nova atlantis", desc: "anything that isn't irl - text and other messaging threads" },
        { id: 79, name: "event", desc: "anything that isn't irl - text and other messaging threads" },
        { id: 20, name: "elsewhere", desc: "anything that isn't irl - text and other messaging threads" },
      ],
    },
    {
      id: 6,
      title: "connections",
      wrapper: "forum-container",
      forums: [
        { id: 38, name: "olympus b*tch", desc: "staff board b*tch" },
        { id: 39, name: "out of character", desc: "staff board b*tch" },
        { id: 40, name: "archives", desc: "funeral dirge" },
        { id: 69, name: "advertisement" }, // FIX: "adversitement"; source <p> was empty
      ],
    },
  ],
};
