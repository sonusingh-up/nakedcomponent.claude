#!/usr/bin/env node
/**
 * new-lesson.js — Naked Compound /learn lesson scaffolder
 *
 * Usage:
 *   node scripts/new-lesson.js --path 1 --lesson 4
 *   node scripts/new-lesson.js --path 6 --lesson 1 --date 2026-04-15
 *
 * The curriculum (paths, lesson titles, slugs, minutes) lives in
 * project/data/learn-curriculum.json — the single source of truth shared
 * with /lesson.js, which renders each lesson page's sidebar and prev/next
 * nav client-side. This script:
 *
 *   1. Looks up the lesson in the curriculum by path + lesson number
 *   2. Fills templates/lesson-template.html and writes project/learn/{slug}.html
 *   3. Flips the lesson's "published" flag in the curriculum JSON
 *      (this is what makes it appear as a link, not "soon", site-wide)
 *   4. Adds an item to project/feed.xml (category: Learn)
 *   5. Regenerates project/sitemap.xml via update-sitemap.js
 *
 * After scaffolding: fill in the TODO content, meta description, and the
 * TODO description in feed.xml.
 */

const fs   = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BASE_URL   = "https://www.nakedcompound.in";
const ROOT       = path.resolve(__dirname, "..");
const PROJECT    = path.join(ROOT, "project");
const TEMPLATE   = path.join(ROOT, "templates", "lesson-template.html");
const CURRICULUM = path.join(PROJECT, "data", "learn-curriculum.json");

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function todayRFC822() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    timeZone: "Asia/Kolkata", hour12: false,
  }).formatToParts(new Date()).reduce((acc, p) => (acc[p.type] = p.value, acc), {});
  return `${parts.weekday}, ${parts.day} ${parts.month} ${parts.year} ` +
         `${parts.hour}:${parts.minute}:${parts.second} +0530`;
}

function humanMonth(iso) {
  const [y, m] = iso.split("-").map(Number);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[m - 1]} ${y}`;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

// Strip typographic quotes/dashes for the plain-text contexts (<title>, JSON-LD)
function plainText(title) {
  return title.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
}

// Wrap the last word in <em> for the display headline; the author can move it.
function titleHTML(title) {
  return title.replace(/(\S+)\s*$/, "<em>$1</em>");
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith("--")) { args[argv[i].slice(2)] = argv[i + 1]; i++; }
  }
  return args;
}

// ── Feed updater ──────────────────────────────────────────────────────────────

function updateFeed(title, canonicalUrl) {
  const feedPath = path.join(PROJECT, "feed.xml");
  let xml = fs.readFileSync(feedPath, "utf8");

  const item = `
    <item>
      <title>${plainText(title)}</title>
      <link>${canonicalUrl}</link>
      <guid isPermaLink="true">${canonicalUrl}</guid>
      <pubDate>${todayRFC822()}</pubDate>
      <category>Learn</category>
      <description>TODO: Write a 140–160 character description for this lesson.</description>
    </item>`;

  xml = xml.replace(/(<item>)/, item + "\n\n    $1");
  xml = xml.replace(
    /<lastBuildDate>[^<]*<\/lastBuildDate>/,
    `<lastBuildDate>${todayRFC822()}</lastBuildDate>`
  );
  fs.writeFileSync(feedPath, xml, "utf8");
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv);
  const pathNum   = parseInt(args.path, 10);
  const lessonNum = parseInt(args.lesson, 10);

  if (!pathNum || !lessonNum) {
    console.error('Usage: node scripts/new-lesson.js --path <1-6> --lesson <n> [--date YYYY-MM-DD]');
    process.exit(1);
  }

  const publishDate = args.date
    ? ((/^\d{4}-\d{2}-\d{2}$/.test(args.date))
        ? args.date
        : (() => { console.error("--date must be YYYY-MM-DD"); process.exit(1); })())
    : todayISO();

  const curriculum = JSON.parse(fs.readFileSync(CURRICULUM, "utf8"));
  const p = curriculum.paths.find(x => x.num === pathNum);
  if (!p) {
    console.error(`No path ${pathNum}. Paths: ${curriculum.paths.map(x => x.num).join(", ")}`);
    process.exit(1);
  }
  const lesson = p.lessons[lessonNum - 1];
  if (!lesson) {
    console.error(`Path ${pathNum} has ${p.lessons.length} lessons; no lesson ${lessonNum}.`);
    process.exit(1);
  }

  const filePath = path.join(PROJECT, "learn", `${lesson.slug}.html`);
  if (lesson.published || fs.existsSync(filePath)) {
    console.error(`\n⚠  Lesson already exists: ${filePath}`);
    console.error(`   URL: ${BASE_URL}/learn/${lesson.slug}`);
    process.exit(1);
  }

  const canonicalUrl = `${BASE_URL}/learn/${lesson.slug}`;
  const title = lesson.title;

  // <title> must stay under 60 chars including " — Naked Compound"
  const suffix = " — Naked Compound";
  const maxTitle = 60 - suffix.length;
  const plain = plainText(title);
  const titleTag = plain.length > maxTitle ? plain.slice(0, maxTitle - 1) + "…" : plain;

  const tokens = {
    SLUG:            lesson.slug,
    TITLE_TAG:       titleTag,
    TITLE_PLAIN:     plain,
    TITLE_HTML:      titleHTML(title),
    KICKER:          "TODO: One or two sentences setting up this lesson.",
    DESCRIPTION:     "TODO: Write a 140–160 character description for this lesson.",
    PUBLISHED:       publishDate,
    UPDATED_HUMAN:   humanMonth(publishDate),
    PATH_NUM:        pad2(pathNum),
    PATH_NUM_RAW:    String(pathNum),
    PATH_NAME:       p.name,
    PATH_NAME_SHORT: p.name.split(" — ")[0],
    LESSON_NUM:      pad2(lessonNum),
    LESSON_TOTAL:    String(p.lessons.length),
    MINUTES:         String(lesson.minutes),
    LEVEL:           p.level,
  };

  let html = fs.readFileSync(TEMPLATE, "utf8");
  // Drop the template's do-not-deploy banner comment
  html = html.replace(/<!--\n  LESSON PAGE TEMPLATE[\s\S]*?-->\n/, "");
  for (const [key, value] of Object.entries(tokens)) {
    html = html.split(`{{${key}}}`).join(value);
  }

  const leftover = html.match(/{{[A-Z_]+}}/g);
  if (leftover) {
    console.error(`Template tokens left unfilled: ${[...new Set(leftover)].join(", ")}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, "utf8");

  // Mark published in the curriculum so /lesson.js links it site-wide
  lesson.published = true;
  fs.writeFileSync(CURRICULUM, JSON.stringify(curriculum, null, 2) + "\n", "utf8");

  updateFeed(title, canonicalUrl);
  execSync("node scripts/update-sitemap.js", { cwd: ROOT, stdio: "inherit" });

  console.log(`
✓ Lesson created
  File:      ${path.relative(process.cwd(), filePath)}
  URL:       ${canonicalUrl}
  Path:      ${pad2(pathNum)} · ${p.name}
  Lesson:    ${pad2(lessonNum)} of ${p.lessons.length} — ${plain}
  Published: ${publishDate}

Next steps:
  1. Write the lesson content (search for TODO in the file)
  2. Replace the TODO meta description + kicker in <head>/<body>
  3. Replace the TODO description in project/feed.xml
  4. git add -A && git commit -m "feat: add learn lesson — ${lesson.slug}"
`);
}

main();
