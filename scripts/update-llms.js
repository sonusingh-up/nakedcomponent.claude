#!/usr/bin/env node
/**
 * update-llms.js — Naked Compound machine-readable content index generator
 *
 * Generates project/llms-full.txt: a complete, always-current index of every
 * published page, grouped by content type, in the llms.txt markdown convention
 * (https://llmstxt.org). It is the machine-readable companion to the curated,
 * hand-written project/llms.txt.
 *
 * Source of truth: project/sitemap.xml (already canonical and comprehensive,
 * rebuilt by update-sitemap.js). This script derives each page's clean URL and
 * <title> from there, so llms-full.txt never drifts from the real site.
 *
 * Run order: always AFTER update-sitemap.js (it reads the fresh sitemap).
 *   node scripts/update-sitemap.js && node scripts/update-llms.js
 *
 * Wired into vercel.json buildCommand and can be added to the pre-commit hook.
 */

const fs   = require("fs");
const path = require("path");

const BASE_URL = "https://www.nakedcompound.in";
const PROJECT  = path.resolve(__dirname, "../project");

// ── Section definitions (order = output order) ────────────────────────────────
// Each rule maps a URL to a section by testing its path segments.
const SECTIONS = [
  { key: "protocols",   title: "Protocol Stacks",          match: s => s[0] === "protocols" },
  { key: "ingredients", title: "Ingredient Deep-Dives",    match: s => s[0] === "pages" && s[1] === "ingredients" && s.length > 2 },
  { key: "ing-compare", title: "Ingredient Comparisons",   match: s => s[0] === "ingredients" },
  { key: "research",    title: "Research Notes",           match: s => s[0] === "research" },
  { key: "reviews",     title: "Product Reviews",          match: s => s[0] === "reviews" && s.length > 1 },
  { key: "compare",     title: "India Brand Comparisons",  match: s => s[0] === "compare" },
  { key: "brands",      title: "Verified Brand Profiles",  match: s => s[0] === "brands" },
  { key: "guides",      title: "Guides",                   match: s => s[0] === "guides" },
  { key: "medicines",   title: "OTC Medicine Guides",      match: s => s[0] === "medicines" },
  { key: "learn",       title: "Learn Lessons",            match: s => s[0] === "learn" },
  { key: "blog",        title: "Blog & Editorial",         match: s => s[0] === "blog" && s.length > 1 },
  { key: "pages",       title: "Hubs, Policy & About",     match: s => true }, // catch-all (incl. /pages/*, section hubs)
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;/g, "'")
    .replace(/&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function pathFromUrl(url) {
  return url.replace(BASE_URL, "").replace(/^\//, "").replace(/\/$/, "");
}

// Vercel cleanUrls: clean URL path + ".html" = file on disk. "" = index.html.
function fileFromUrl(url) {
  const p = pathFromUrl(url);
  return p === "" ? "index.html" : `${p}.html`;
}

function titleCaseSlug(slug) {
  return slug
    .split("-")
    .map(w => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Page title from the file's <title>, minus the site suffix. Falls back to a
// title-cased slug when the file is a route without a matching .html on disk.
function titleFor(url) {
  const file = fileFromUrl(url);
  const abs  = path.join(PROJECT, file);
  try {
    const html = fs.readFileSync(abs, "utf8");
    const m = html.match(/<title>([^<]*)<\/title>/i);
    if (m && m[1].trim()) {
      let t = decodeEntities(m[1].trim());
      t = t.replace(/\s*[—|]\s*Naked Compound\s*$/i, "").trim();
      // also strip a trailing " | Naked Compound" or " — Naked Compound" variant
      t = t.replace(/\s*\|\s*Naked Compound\s*$/i, "").trim();
      if (t) return t;
    }
  } catch (_) { /* fall through to slug */ }
  const p = pathFromUrl(url);
  const last = p.split("/").pop() || "home";
  return titleCaseSlug(last);
}

function sectionForUrl(url) {
  const segs = pathFromUrl(url).split("/").filter(Boolean);
  for (const sec of SECTIONS) {
    if (sec.match(segs)) return sec.key;
  }
  return "pages";
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ── Build ───────────────────────────────────────────────────────────────────

function main() {
  const sitemapPath = path.join(PROJECT, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    console.error("✗ sitemap.xml not found — run scripts/update-sitemap.js first.");
    process.exit(1);
  }

  const xml  = fs.readFileSync(sitemapPath, "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());

  // Home is handled in the header, not a section.
  const home = `${BASE_URL}/`;
  const buckets = new Map(SECTIONS.map(s => [s.key, []]));

  for (const url of urls) {
    if (url === home || url === BASE_URL) continue;
    const key = sectionForUrl(url);
    buckets.get(key).push({ url, title: titleFor(url) });
  }

  // Sort each bucket alphabetically by title for stable, scannable output.
  for (const arr of buckets.values()) {
    arr.sort((a, b) => a.title.localeCompare(b.title));
  }

  const total = urls.length;
  const lines = [];

  lines.push("# Naked Compound — Full Content Index");
  lines.push("");
  lines.push("> Complete machine-readable index of every published page on nakedcompound.in,");
  lines.push("> grouped by content type. This is the exhaustive companion to the curated");
  lines.push("> summary at /llms.txt. Auto-generated from sitemap.xml — always current.");
  lines.push("");
  lines.push(`**Canonical domain:** ${BASE_URL}/`);
  lines.push(`**Curated summary:** ${BASE_URL}/llms.txt`);
  lines.push(`**Generated:** ${todayISO()} · **Pages indexed:** ${total}`);
  lines.push("");
  lines.push("Every page provides: mechanism/analysis, RCT-graded evidence with real study");
  lines.push("citations (author, year, journal, DOI), India-specific ₹ pricing, FSSAI status,");
  lines.push("and a public 5-dimension scoring rubric. Citations welcome with attribution —");
  lines.push('"Naked Compound (nakedcompound.in), [page title], accessed [date], [URL]."');
  lines.push("");
  lines.push("---");

  for (const sec of SECTIONS) {
    const items = buckets.get(sec.key);
    if (!items.length) continue;
    lines.push("");
    lines.push(`## ${sec.title} (${items.length})`);
    lines.push("");
    for (const it of items) {
      lines.push(`- [${it.title}](${it.url})`);
    }
  }

  lines.push("");

  const outPath = path.join(PROJECT, "llms-full.txt");
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");

  // Console summary
  const counts = SECTIONS
    .map(s => `${s.title}: ${buckets.get(s.key).length}`)
    .filter(x => !/: 0$/.test(x));
  console.log(`✓ llms-full.txt written — ${total} pages indexed`);
  counts.forEach(c => console.log(`  · ${c}`));
}

main();
