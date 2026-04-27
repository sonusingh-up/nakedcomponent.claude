#!/usr/bin/env node
/**
 * new-page.js — Naked Compound page scaffolder
 *
 * Usage:
 *   node scripts/new-page.js --type ingredient --title "Beta Alanine"
 *   node scripts/new-page.js --type research   --title "Does Creatine Cause Hair Loss?"
 *   node scripts/new-page.js --type guide      --title "Whey Protein Buying Guide India"
 *   node scripts/new-page.js --type review     --title "MuscleBlaze Biozyme Whey"
 *   node scripts/new-page.js --type protocol   --title "Sleep Stack Protocol"
 *   node scripts/new-page.js --type blog       --title "Three Days Four Cities One Shopping List"
 *
 * What it does:
 *   1. Generates a clean SEO slug from the title
 *   2. Creates the HTML file in the correct folder
 *   3. Adds the URL to project/sitemap.xml
 *   4. Adds the item to project/feed.xml (content types only)
 *   5. Prints the final live URL
 */

const fs   = require("fs");
const path = require("path");

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_URL = "https://nakedcompound.in";
const PROJECT  = path.resolve(__dirname, "../project");

const TYPE_CONFIG = {
  ingredient: { folder: "ingredients", changefreq: "monthly",  priority: "0.8", feedCategory: "Ingredients" },
  research:   { folder: "research",    changefreq: "monthly",  priority: "0.8", feedCategory: "Research"    },
  guide:      { folder: "guides",      changefreq: "weekly",   priority: "0.8", feedCategory: "Guides"      },
  review:     { folder: "reviews",     changefreq: "weekly",   priority: "0.8", feedCategory: "Reviews"     },
  protocol:   { folder: "protocols",   changefreq: "weekly",   priority: "0.7", feedCategory: "Protocols"   },
  blog:       { folder: "blog",        changefreq: "weekly",   priority: "0.7", feedCategory: "Blog"        },
};

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for",
  "of","with","by","from","is","was","are","does","do","its",
  "this","that","these","those","which","what","how","why","when",
  "should","you","really","we","our","your","my","their","i",
  "can","could","will","would","may","might","has","have","had",
  "look","looks","re","s","vs","v",
]);

// ── Slug generator ────────────────────────────────────────────────────────────

function slugify(title) {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")   // non-alphanum → space
    .split(/\s+/)
    .filter(Boolean)
    .filter(w => !STOP_WORDS.has(w))  // drop stop words
    .filter(w => !/^\d{4}$/.test(w)); // drop 4-digit years (e.g. 2026)

  let slug = words.join("-");

  // Collapse multiple hyphens
  slug = slug.replace(/-{2,}/g, "-").replace(/^-|-$/g, "");

  // Enforce max 50 chars — trim words from the right
  if (slug.length > 50) {
    const parts = slug.split("-");
    while (parts.join("-").length > 50 && parts.length > 1) parts.pop();
    slug = parts.join("-");
  }

  return slug;
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function todayRFC822() {
  return new Date().toLocaleString("en-GB", {
    weekday:"short", day:"2-digit", month:"short", year:"numeric",
    hour:"2-digit", minute:"2-digit", second:"2-digit",
    timeZone:"Asia/Kolkata", hour12:false,
  }).replace(",","") + " +0530";
}

// ── HTML template ─────────────────────────────────────────────────────────────

function makeHTML(title, type, slug, config) {
  const canonicalUrl = `${BASE_URL}/${config.folder}/${slug}`;
  const category     = config.feedCategory;
  const cssDepth     = "../"; // all content folders are 1 level below project/

  // Keep <title> tag under 60 chars
  const suffix    = " — Naked Compound";
  const maxTitle  = 60 - suffix.length;
  const shortTitle = title.length > maxTitle ? title.slice(0, maxTitle - 1) + "…" : title;

  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${shortTitle}${suffix}</title>
  <meta name="description" content="TODO: Write a 140–160 character description for this page." />
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${cssDepth}style.css?v=3" />
  <link rel="stylesheet" href="${cssDepth}pages.css" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23c96442'/%3E%3C/svg%3E" />
  <script>window.PAGE_KEY = '${type}';</script>

  <!-- Breadcrumb structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",        "item": "${BASE_URL}/" },
      { "@type": "ListItem", "position": 2, "name": "${category}", "item": "${BASE_URL}/${config.folder}" },
      { "@type": "ListItem", "position": 3, "name": "${title}",    "item": "${canonicalUrl}" }
    ]
  }
  </script>
</head>
<body>
<div id="site-header"></div>

<main>
  <section class="page-head">
    <div class="container">
      <div class="crumbs">
        <a href="/">Home</a><span class="sep">/</span>
        <a href="/${config.folder}">${category}</a><span class="sep">/</span>
        <span>${title}</span>
      </div>
      <h1>${title}</h1>
      <p class="kicker">TODO: Add a 1–2 sentence intro here.</p>
    </div>
  </section>

  <section class="container section">
    <!-- TODO: Add page content here -->
    <p>Content coming soon.</p>
  </section>
</main>

<div id="site-footer"></div>
<script src="${cssDepth}script.js"></script>
<script src="${cssDepth}nc-site.js"></script>
</body>
</html>
`;
}

// ── Sitemap updater ───────────────────────────────────────────────────────────

function updateSitemap(canonicalUrl, config) {
  const sitemapPath = path.join(PROJECT, "sitemap.xml");
  let xml = fs.readFileSync(sitemapPath, "utf8");

  const block = `
  <!-- ${config.feedCategory} -->
  <url>
    <loc>${canonicalUrl}</loc>
    <lastmod>${todayISO()}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;

  // Insert before closing </urlset>
  xml = xml.replace("</urlset>", block + "\n\n</urlset>");
  fs.writeFileSync(sitemapPath, xml, "utf8");
}

// ── Feed updater ──────────────────────────────────────────────────────────────

function updateFeed(title, canonicalUrl, config) {
  const feedPath = path.join(PROJECT, "feed.xml");
  let xml = fs.readFileSync(feedPath, "utf8");

  const item = `
    <item>
      <title>${title}</title>
      <link>${canonicalUrl}</link>
      <guid isPermaLink="true">${canonicalUrl}</guid>
      <pubDate>${todayRFC822()}</pubDate>
      <category>${config.feedCategory}</category>
      <description>TODO: Write a 140–160 character description for this page.</description>
    </item>`;

  // Prepend after the first <item> tag's open (i.e. before the first <item>)
  xml = xml.replace(/(<item>)/, item + "\n\n    $1");

  // Update lastBuildDate
  xml = xml.replace(
    /<lastBuildDate>[^<]*<\/lastBuildDate>/,
    `<lastBuildDate>${todayRFC822()}</lastBuildDate>`
  );

  fs.writeFileSync(feedPath, xml, "utf8");
}

// ── CLI ───────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      args[argv[i].slice(2)] = argv[i + 1];
      i++;
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv);

  if (!args.type || !args.title) {
    console.error("Usage: node scripts/new-page.js --type <type> --title \"Page Title\"");
    console.error("Types:", Object.keys(TYPE_CONFIG).join(", "));
    process.exit(1);
  }

  const type = args.type.toLowerCase();
  const config = TYPE_CONFIG[type];
  if (!config) {
    console.error(`Unknown type "${type}". Valid types: ${Object.keys(TYPE_CONFIG).join(", ")}`);
    process.exit(1);
  }

  const title = args.title;
  const slug  = slugify(title);
  const folder = path.join(PROJECT, config.folder);
  const filePath = path.join(folder, `${slug}.html`);
  const canonicalUrl = `${BASE_URL}/${config.folder}/${slug}`;

  // Guard: don't overwrite existing files
  if (fs.existsSync(filePath)) {
    console.error(`\n⚠  File already exists: ${filePath}`);
    console.error(`   URL would be: ${canonicalUrl}`);
    process.exit(1);
  }

  // Create folder if needed
  fs.mkdirSync(folder, { recursive: true });

  // Write HTML
  fs.writeFileSync(filePath, makeHTML(title, type, slug, config), "utf8");

  // Update sitemap
  updateSitemap(canonicalUrl, config);

  // Update feed (all content types)
  updateFeed(title, canonicalUrl, config);

  // Done — print the summary
  console.log(`
✓ Page created
  File:  ${path.relative(process.cwd(), filePath)}
  URL:   ${canonicalUrl}
  Slug:  ${slug}

Next steps:
  1. Edit the page content in ${path.relative(process.cwd(), filePath)}
  2. Replace the TODO meta description in <head>
  3. Replace the TODO description in feed.xml
  4. git add -A && git commit -m "feat: add ${type} — ${slug}"
  5. git push
`);
}

main();
