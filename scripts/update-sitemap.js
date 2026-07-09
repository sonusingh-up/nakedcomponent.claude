#!/usr/bin/env node
/**
 * Naked Compound — sitemap auto-generator
 * Run: node scripts/update-sitemap.js
 * Called by Vercel buildCommand before each deployment.
 *
 * Rules:
 *  - Authoritative domain: https://www.nakedcompound.in  (www-canonical)
 *  - cleanUrls: true  → strip .html from paths
 *  - Exclude: /data/, /uploads/, /assets/, feed.xml, google*.html
 *  - Reads <link rel="canonical"> for URL override
 *  - Reads <meta name="published"> for lastmod, falls back to git log, then mtime
 */

const fs            = require('fs');
const path          = require('path');
const { execSync }  = require('child_process');

const BASE_URL    = 'https://www.nakedcompound.in';
const OUTPUT_DIR  = path.join(__dirname, '..', 'project');
const SITEMAP_OUT = path.join(OUTPUT_DIR, 'sitemap.xml');
const TODAY       = new Date().toISOString().slice(0, 10);

// ── Priority / changefreq matrix ─────────────────────────────────
const RULES = [
  // path-prefix                       priority  changefreq
  { prefix: '/',                       p: '1.0', cf: 'daily',   exact: true },
  { prefix: '/pages/ingredients/',     p: '0.9', cf: 'weekly' },
  { prefix: '/compare/',               p: '0.8', cf: 'weekly' },
  { prefix: '/pages/best/',            p: '0.8', cf: 'weekly' },
  { prefix: '/research/',              p: '0.8', cf: 'monthly' },
  { prefix: '/reviews/',               p: '0.8', cf: 'monthly' },
  { prefix: '/pages/research',         p: '0.9', cf: 'weekly',  exact: true },
  { prefix: '/pages/ingredients',      p: '0.9', cf: 'daily',   exact: true },
  { prefix: '/pages/compare',          p: '0.9', cf: 'weekly',  exact: true },
  { prefix: '/pages/blog',             p: '0.8', cf: 'weekly',  exact: true },
  { prefix: '/pages/reviews',          p: '0.8', cf: 'weekly',  exact: true },
  { prefix: '/pages/protocols',        p: '0.8', cf: 'weekly',  exact: true },
  { prefix: '/pages/guides',           p: '0.8', cf: 'weekly',  exact: true },
  { prefix: '/pages/best',             p: '0.8', cf: 'weekly',  exact: true },
  { prefix: '/pages/verified-brands',  p: '0.7', cf: 'monthly', exact: true },
  { prefix: '/pages/learn',            p: '0.7', cf: 'monthly', exact: true },
  { prefix: '/pages/scoring-rubric',   p: '0.7', cf: 'monthly', exact: true },
  { prefix: '/pages/categories',       p: '0.7', cf: 'weekly',  exact: true },
  { prefix: '/learn/',                 p: '0.7', cf: 'monthly' },
  { prefix: '/brands/',                 p: '0.7', cf: 'monthly' },
  { prefix: '/protocols/',             p: '0.7', cf: 'monthly' },
  { prefix: '/blog/',                  p: '0.7', cf: 'monthly' },
  { prefix: '/ingredients/',           p: '0.8', cf: 'monthly' },
  { prefix: '/pages/methodology',      p: '0.6', cf: 'monthly', exact: true },
  { prefix: '/pages/about',            p: '0.6', cf: 'monthly', exact: true },
  { prefix: '/pages/authors',          p: '0.6', cf: 'monthly', exact: true },
  { prefix: '/pages/changelog',        p: '0.5', cf: 'weekly',  exact: true },
  { prefix: '/pages/conflicts-policy', p: '0.5', cf: 'monthly', exact: true },
  { prefix: '/pages/contact',          p: '0.4', cf: 'yearly',  exact: true },
  { prefix: '/pages/privacy',          p: '0.2', cf: 'yearly',  exact: true },
  { prefix: '/pages/terms',            p: '0.2', cf: 'yearly',  exact: true },
];

function getPriority(urlPath) {
  // Exact matches first
  for (const r of RULES) {
    if (r.exact && urlPath === r.prefix) return { priority: r.p, changefreq: r.cf };
  }
  // Prefix matches
  for (const r of RULES) {
    if (!r.exact && urlPath.startsWith(r.prefix)) return { priority: r.p, changefreq: r.cf };
  }
  return { priority: '0.5', changefreq: 'monthly' };
}

// ── Read published date and canonical URL from HTML ───────────────
function readHtmlMeta(absPath) {
  let content;
  try {
    content = fs.readFileSync(absPath, 'utf8');
  } catch {
    return { published: null, canonicalPath: null };
  }

  // Extract <meta name="published" content="YYYY-MM-DD">
  const publishedMatch = content.match(/<meta\s[^>]*name=["']published["'][^>]*content=["']([0-9]{4}-[0-9]{2}-[0-9]{2})["']/i)
    || content.match(/<meta\s[^>]*content=["']([0-9]{4}-[0-9]{2}-[0-9]{2})["'][^>]*name=["']published["']/i);
  const published = publishedMatch ? publishedMatch[1] : null;

  // Extract <link rel="canonical" href="...">
  const canonicalMatch = content.match(/<link\s[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
    || content.match(/<link\s[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  let canonicalPath = null;
  if (canonicalMatch) {
    try {
      const url = new URL(canonicalMatch[1]);
      canonicalPath = url.pathname;
    } catch {
      // If it's already a path (no domain), use as-is
      canonicalPath = canonicalMatch[1];
    }
  }

  return { published, canonicalPath };
}

// ── Get lastmod date for a file ───────────────────────────────────
function getLastmod(absPath, published) {
  // 1. Use <meta name="published"> if present (authoritative, never changes)
  if (published) return published;

  // 2. Try git log for last commit date
  try {
    const gitDate = execSync(`git log -1 --format=%ai -- "${absPath}"`, {
      cwd: path.join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe'],
    }).toString().trim();
    if (gitDate) return gitDate.slice(0, 10);
  } catch {
    // git not available or not a repo
  }

  // 3. Fallback to file mtime
  try {
    const stat = fs.statSync(absPath);
    return stat.mtime.toISOString().slice(0, 10);
  } catch {
    return TODAY;
  }
}

// ── File discovery ────────────────────────────────────────────────
const EXCLUDE_DIRS  = ['assets', 'data', 'uploads'];
const EXCLUDE_FILES = [
  /^google[a-z0-9]+\.html$/,
  /^feed\.xml$/,
  /^rss\.html$/,
  /^404\.html$/,
];
// Absolute paths to exclude entirely
const EXCLUDE_ABS = [
  path.join(OUTPUT_DIR, 'uploads', 'index.html'),
  path.join(OUTPUT_DIR, 'pages', 'rss.html'),
];

function walkDir(dir, base) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = entry.name;
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.includes(name)) continue;
      results.push(...walkDir(path.join(dir, name), base));
    } else if (entry.isFile() && name.endsWith('.html')) {
      if (EXCLUDE_FILES.some(re => re.test(name))) continue;
      const abs = path.join(dir, name);
      if (EXCLUDE_ABS.includes(abs)) continue;
      results.push(abs);
    }
  }
  return results;
}

// ── Build URL entries ─────────────────────────────────────────────
const absPaths = walkDir(OUTPUT_DIR, OUTPUT_DIR);

const entries = absPaths.map(abs => {
  const { published, canonicalPath } = readHtmlMeta(abs);

  // Derive URL path from file path as fallback
  let urlPath = abs.slice(OUTPUT_DIR.length).replace(/\\/g, '/');
  urlPath = urlPath.replace(/\.html$/, '').replace(/\/index$/, '');
  if (!urlPath) urlPath = '/';

  // Override with canonical if present
  if (canonicalPath) urlPath = canonicalPath;

  const lastmod = getLastmod(abs, published);
  return { urlPath, lastmod };
});

// Deduplicate by urlPath, keeping first occurrence
const seen = new Set();
const deduped = entries.filter(e => {
  if (seen.has(e.urlPath)) return false;
  seen.add(e.urlPath);
  return true;
});

const sorted = deduped.sort((a, b) => {
  if (a.urlPath === '/') return -1;
  if (b.urlPath === '/') return 1;
  const da = (a.urlPath.match(/\//g) || []).length;
  const db = (b.urlPath.match(/\//g) || []).length;
  return da - db || a.urlPath.localeCompare(b.urlPath);
});

const urlEntries = sorted.map(({ urlPath, lastmod }) => {
  const { priority, changefreq } = getPriority(urlPath);
  const loc = BASE_URL + urlPath;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urlEntries}

</urlset>
`;

fs.writeFileSync(SITEMAP_OUT, xml, 'utf8');
console.log(`✓ sitemap.xml written — ${sorted.length} URLs — domain: ${BASE_URL}`);

// ── RSS sub-feed generator ────────────────────────────────────────
function generateSubFeeds() {
  const feedInPath = path.join(OUTPUT_DIR, 'feed.xml');
  const guidesOutPath = path.join(OUTPUT_DIR, 'feed-guides.xml');
  const reviewsOutPath = path.join(OUTPUT_DIR, 'feed-reviews.xml');

  if (!fs.existsSync(feedInPath)) {
    console.warn('⚠ feed.xml not found, skipping sub-feed generation');
    return;
  }

  const feedContent = fs.readFileSync(feedInPath, 'utf8');

  // Extract items
  const itemRegex = /<item>[\s\S]*?<\/item>/g;
  const items = feedContent.match(itemRegex) || [];

  const headerIndex = feedContent.indexOf('<item>');
  const footerIndex = feedContent.lastIndexOf('</item>');

  if (headerIndex === -1 || footerIndex === -1) {
    console.warn('⚠ No items found in feed.xml, skipping sub-feed generation');
    return;
  }

  const header = feedContent.slice(0, headerIndex);
  const footer = feedContent.slice(footerIndex + '</item>'.length);

  // Filter items
  const guidesAndProtocolsItems = [];
  const reviewsItems = [];

  items.forEach(item => {
    const catMatch = item.match(/<category>([^<]+)<\/category>/);
    const category = catMatch ? catMatch[1].trim() : '';

    if (category === 'Guides' || category === 'Protocols' || category === 'Research') {
      guidesAndProtocolsItems.push(item);
    } else if (category === 'Reviews') {
      reviewsItems.push(item);
    }
  });

  // Helper to format/build sub-feed file content
  function buildFeedContent(subItems, selfUrl, subTitle) {
    const joinedItems = subItems.join('\n\n    ');
    
    let subHeader = header
      // Update self link
      .replace(
        /<atom:link\s+href="[^"]+"\s+rel="self"\s+type="application\/rss\+xml"\s*\/?>/,
        `<atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>`
      )
      // Update title
      .replace(
        /<title>Naked Compound<\/title>/,
        `<title>${subTitle}</title>`
      );

    return subHeader + joinedItems + '\n\n  ' + footer.trim() + '\n';
  }

  // Generate feed-guides.xml
  const guidesFeed = buildFeedContent(
    guidesAndProtocolsItems,
    'https://nakedcompound.in/feed-guides.xml',
    'Naked Compound — Guides &amp; Protocols'
  );
  fs.writeFileSync(guidesOutPath, guidesFeed, 'utf8');
  console.log(`✓ feed-guides.xml written — ${guidesAndProtocolsItems.length} items`);

  // Generate feed-reviews.xml
  const reviewsFeed = buildFeedContent(
    reviewsItems,
    'https://nakedcompound.in/feed-reviews.xml',
    'Naked Compound — Reviews'
  );
  fs.writeFileSync(reviewsOutPath, reviewsFeed, 'utf8');
  console.log(`✓ feed-reviews.xml written — ${reviewsItems.length} items`);
}

generateSubFeeds();

