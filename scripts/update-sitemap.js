#!/usr/bin/env node
/**
 * update-sitemap.js — Naked Compound sitemap auto-builder
 *
 * Scans every HTML file in project/, derives its clean URL, and
 * rebuilds project/sitemap.xml from scratch.
 *
 * Run manually:   node scripts/update-sitemap.js
 * Run on commit:  automatic via .githooks/pre-commit
 * Run on deploy:  automatic via vercel.json buildCommand
 *
 * Priority & changefreq are assigned by URL pattern — edit
 * ROUTE_RULES below to change them.
 */

const fs   = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_URL = "https://nakedcompound.in";
const PROJECT  = path.resolve(__dirname, "../project");
const SITEMAP  = path.resolve(__dirname, "../project/sitemap.xml");

/**
 * Route rules — matched top-to-bottom, first match wins.
 * pattern: string prefix of the clean URL path (after the domain).
 */
const ROUTE_RULES = [
  // Root
  { pattern: "/",                  exact: true,  changefreq: "daily",   priority: "1.0" },

  // Content hubs (index pages)
  { pattern: "/research",          exact: true,  changefreq: "daily",   priority: "0.9" },
  { pattern: "/guides",            exact: true,  changefreq: "weekly",  priority: "0.8" },
  { pattern: "/reviews",           exact: true,  changefreq: "weekly",  priority: "0.8" },
  { pattern: "/protocols",         exact: true,  changefreq: "weekly",  priority: "0.8" },
  { pattern: "/ingredients",       exact: true,  changefreq: "weekly",  priority: "0.8" },
  { pattern: "/blog",              exact: true,  changefreq: "weekly",  priority: "0.7" },
  { pattern: "/pages/research",    exact: true,  changefreq: "daily",   priority: "0.9" },
  { pattern: "/pages/guides",      exact: true,  changefreq: "weekly",  priority: "0.8" },
  { pattern: "/pages/reviews",     exact: true,  changefreq: "weekly",  priority: "0.8" },
  { pattern: "/pages/protocols",   exact: true,  changefreq: "weekly",  priority: "0.8" },
  { pattern: "/pages/ingredients", exact: true,  changefreq: "weekly",  priority: "0.8" },
  { pattern: "/pages/blog",        exact: true,  changefreq: "weekly",  priority: "0.7" },
  { pattern: "/pages/categories",  exact: true,  changefreq: "weekly",  priority: "0.7" },
  { pattern: "/pages/verified-brands", exact: true, changefreq: "monthly", priority: "0.7" },
  { pattern: "/pages/learn",       exact: true,  changefreq: "monthly", priority: "0.7" },
  { pattern: "/pages/changelog",   exact: true,  changefreq: "daily",   priority: "0.6" },

  // Content deep-dives (prefix matches — any URL starting with this)
  { pattern: "/ingredients/",      exact: false, changefreq: "monthly", priority: "0.8" },
  { pattern: "/research/",         exact: false, changefreq: "monthly", priority: "0.8" },
  { pattern: "/guides/",           exact: false, changefreq: "weekly",  priority: "0.8" },
  { pattern: "/reviews/",          exact: false, changefreq: "weekly",  priority: "0.8" },
  { pattern: "/protocols/",        exact: false, changefreq: "weekly",  priority: "0.7" },
  { pattern: "/blog/",             exact: false, changefreq: "weekly",  priority: "0.7" },
  { pattern: "/pages/ingredients/",exact: false, changefreq: "monthly", priority: "0.8" },

  // Company / transparency
  { pattern: "/pages/about",       exact: true,  changefreq: "monthly", priority: "0.6" },
  { pattern: "/pages/authors",     exact: true,  changefreq: "monthly", priority: "0.6" },
  { pattern: "/pages/methodology", exact: true,  changefreq: "monthly", priority: "0.6" },
  { pattern: "/pages/scoring-rubric", exact: true, changefreq: "monthly", priority: "0.6" },
  { pattern: "/pages/conflicts-policy", exact: true, changefreq: "monthly", priority: "0.5" },
  { pattern: "/pages/contact",     exact: true,  changefreq: "yearly",  priority: "0.4" },

  // Legal / utility
  { pattern: "/pages/privacy",     exact: true,  changefreq: "yearly",  priority: "0.3" },
  { pattern: "/pages/terms",       exact: true,  changefreq: "yearly",  priority: "0.3" },
  { pattern: "/pages/rss",         exact: true,  changefreq: "monthly", priority: "0.3" },

  // Fallback
  { pattern: "/",                  exact: false, changefreq: "monthly", priority: "0.5" },
];

/**
 * Files/folders to skip — never add these to the sitemap.
 * Matched against the file path relative to project/.
 */
const SKIP_PATTERNS = [
  /^google[a-z0-9]+\.html$/,        // Google site verification
  /^uploads\//,                      // Upload scratch folder
  /ingredient-shared\.css/,          // Not an HTML page
  /^uploads\//,
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert a project-relative file path to a clean URL path. */
function fileToUrlPath(relPath) {
  // Strip .html
  let p = relPath.replace(/\.html$/, "");

  // Root index.html → "/"
  if (p === "index") return "/";

  // Folder index.html → "/folder"
  if (p.endsWith("/index")) p = p.slice(0, -6) || "/";

  return "/" + p;
}

/** Get the rule that applies to this URL path. */
function getRuleFor(urlPath) {
  for (const rule of ROUTE_RULES) {
    if (rule.exact) {
      if (urlPath === rule.pattern) return rule;
    } else {
      if (urlPath.startsWith(rule.pattern)) return rule;
    }
  }
  return { changefreq: "monthly", priority: "0.5" };
}

/** Get the last-modified date for a file.
 *  Tries git log first (accurate), falls back to fs.stat mtime. */
function getLastMod(absPath) {
  try {
    const relToRepo = path.relative(path.resolve(__dirname, ".."), absPath);
    const out = execSync(
      `git log -1 --format="%ai" -- "${relToRepo}" 2>/dev/null`,
      { encoding: "utf8", stdio: ["pipe","pipe","pipe"] }
    ).trim();
    if (out) return out.slice(0, 10); // YYYY-MM-DD
  } catch (_) {}

  // Fallback: fs mtime
  const mtime = fs.statSync(absPath).mtime;
  return mtime.toISOString().slice(0, 10);
}

/** Read the canonical URL from an HTML file if present. */
function readCanonical(absPath) {
  try {
    const html = fs.readFileSync(absPath, "utf8");
    const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
           || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
    if (m) return m[1].trim();
  } catch (_) {}
  return null;
}

/** Walk a directory recursively, yielding absolute paths to .html files. */
function* walkHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkHtml(abs);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      yield abs;
    }
  }
}

// ── Group URLs by section for organised comments ──────────────────────────────

function sectionLabel(urlPath) {
  if (urlPath === "/")                        return "Home";
  if (urlPath.startsWith("/ingredients"))     return "Ingredients";
  if (urlPath.startsWith("/research"))        return "Research";
  if (urlPath.startsWith("/guides"))          return "Guides";
  if (urlPath.startsWith("/reviews"))         return "Reviews";
  if (urlPath.startsWith("/protocols"))       return "Protocols";
  if (urlPath.startsWith("/blog"))            return "Blog";
  if (urlPath.startsWith("/pages/ingredients")) return "Ingredients (legacy)";
  if (urlPath.startsWith("/pages/research"))  return "Research hub";
  if (urlPath.startsWith("/pages/guides") || urlPath.startsWith("/pages/protocols") ||
      urlPath.startsWith("/pages/reviews") || urlPath.startsWith("/pages/ingredients") ||
      urlPath.startsWith("/pages/categories") || urlPath.startsWith("/pages/verified-brands") ||
      urlPath.startsWith("/pages/blog") || urlPath.startsWith("/pages/learn"))
                                              return "Content hubs";
  if (urlPath.startsWith("/pages/about") || urlPath.startsWith("/pages/authors") ||
      urlPath.startsWith("/pages/methodology") || urlPath.startsWith("/pages/scoring") ||
      urlPath.startsWith("/pages/conflicts") || urlPath.startsWith("/pages/changelog") ||
      urlPath.startsWith("/pages/contact"))   return "Company";
  if (urlPath.startsWith("/pages/privacy") || urlPath.startsWith("/pages/terms") ||
      urlPath.startsWith("/pages/rss"))       return "Legal / utility";
  return "Other";
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const entries = [];

  for (const absPath of walkHtml(PROJECT)) {
    const relPath = path.relative(PROJECT, absPath).replace(/\\/g, "/");

    // Skip non-page files
    if (SKIP_PATTERNS.some(p => p.test(relPath))) continue;

    // Derive URL
    let urlPath;
    const canonical = readCanonical(absPath);
    if (canonical && canonical.startsWith(BASE_URL)) {
      // Trust the canonical tag if it exists and points to our domain
      urlPath = canonical.slice(BASE_URL.length) || "/";
    } else {
      urlPath = fileToUrlPath(relPath);
    }

    const fullUrl  = BASE_URL + urlPath;
    const lastMod  = getLastMod(absPath);
    const rule     = getRuleFor(urlPath);
    const section  = sectionLabel(urlPath);

    entries.push({ urlPath, fullUrl, lastMod, rule, section, relPath });
  }

  // Sort: root first, then alphabetically within each section
  const SECTION_ORDER = [
    "Home","Research hub","Content hubs","Ingredients","Research",
    "Guides","Reviews","Protocols","Blog","Ingredients (legacy)","Company",
    "Legal / utility","Other",
  ];
  entries.sort((a, b) => {
    const si = SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section);
    if (si !== 0) return si;
    return a.urlPath.localeCompare(b.urlPath);
  });

  // Build XML
  const today = new Date().toISOString().slice(0, 10);
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml    += `<!-- Auto-generated by scripts/update-sitemap.js on ${today} -->\n`;
  xml    += `<!-- Do not edit manually — run: node scripts/update-sitemap.js -->\n`;
  xml    += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  let currentSection = null;
  for (const e of entries) {
    if (e.section !== currentSection) {
      xml += `\n  <!-- ${e.section} -->\n`;
      currentSection = e.section;
    }
    xml += `  <url>\n`;
    xml += `    <loc>${e.fullUrl}</loc>\n`;
    xml += `    <lastmod>${e.lastMod}</lastmod>\n`;
    xml += `    <changefreq>${e.rule.changefreq}</changefreq>\n`;
    xml += `    <priority>${e.rule.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `\n</urlset>\n`;

  fs.writeFileSync(SITEMAP, xml, "utf8");

  const count = entries.length;
  console.log(`✓ sitemap.xml rebuilt — ${count} URL${count !== 1 ? "s" : ""} (${today})`);
  entries.forEach(e =>
    console.log(`  ${e.rule.priority}  ${e.fullUrl}`)
  );
}

main();
