#!/usr/bin/env node
/**
 * Naked Compound — Sitemap Generator (v2)
 * Run: node scripts/update-sitemap.js
 * Called by Vercel buildCommand before each deployment.
 *
 * What's new vs v1:
 *  - Generates a sitemap INDEX + per-section sitemaps (reviews, research, …)
 *  - Reads datePublished from JSON-LD schema for accurate lastmod dates
 *  - Adds <image:image> tags to review pages so Google indexes product photos
 *  - Pings Google & Bing automatically after writing the files
 */

const fs           = require('fs');
const path         = require('path');
const https        = require('https');
const { execSync } = require('child_process');

const BASE_URL   = 'https://www.nakedcompound.in';
const OUTPUT_DIR = path.join(__dirname, '..', 'project');
const TODAY      = new Date().toISOString().slice(0, 10);

// ── Priority / changefreq matrix ──────────────────────────────────
const RULES = [
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
  for (const r of RULES) {
    if (r.exact && urlPath === r.prefix) return { priority: r.p, changefreq: r.cf };
  }
  for (const r of RULES) {
    if (!r.exact && urlPath.startsWith(r.prefix)) return { priority: r.p, changefreq: r.cf };
  }
  return { priority: '0.5', changefreq: 'monthly' };
}

// ── Which sub-sitemap does this URL belong to? ────────────────────
function getSitemapSection(urlPath) {
  if (urlPath.startsWith('/reviews/'))    return 'reviews';
  if (urlPath.startsWith('/research/'))   return 'research';
  if (urlPath.startsWith('/protocols/'))  return 'protocols';
  if (urlPath.startsWith('/compare/'))    return 'compare';
  if (urlPath.startsWith('/blog/'))       return 'blog';
  if (urlPath.startsWith('/ingredients/')) return 'ingredients';
  return 'core'; // homepage, /pages/*, everything else
}

// ── Read meta from HTML ───────────────────────────────────────────
function readHtmlMeta(absPath) {
  let content;
  try { content = fs.readFileSync(absPath, 'utf8'); }
  catch { return { published: null, canonicalPath: null, image: null, imageTitle: null }; }

  // 1. <meta name="published"> (explicit override)
  const pubMatch = content.match(/<meta\s[^>]*name=["']published["'][^>]*content=["']([0-9]{4}-[0-9]{2}-[0-9]{2})["']/i)
    || content.match(/<meta\s[^>]*content=["']([0-9]{4}-[0-9]{2}-[0-9]{2})["'][^>]*name=["']published["']/i);
  let published = pubMatch ? pubMatch[1] : null;

  // 2. datePublished in JSON-LD (already in all review/research/blog pages)
  if (!published) {
    const ldMatch = content.match(/"datePublished"\s*:\s*"([0-9]{4}-[0-9]{2}-[0-9]{2})"/);
    if (ldMatch) published = ldMatch[1];
  }

  // 3. dateModified in JSON-LD (use as fallback if no datePublished)
  if (!published) {
    const modMatch = content.match(/"dateModified"\s*:\s*"([0-9]{4}-[0-9]{2}-[0-9]{2})"/);
    if (modMatch) published = modMatch[1];
  }

  // Canonical URL
  const canonMatch = content.match(/<link\s[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
    || content.match(/<link\s[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  let canonicalPath = null;
  if (canonMatch) {
    try {
      const url = new URL(canonMatch[1]);
      canonicalPath = url.pathname;
    } catch {
      canonicalPath = canonMatch[1];
    }
  }

  // Product image — look for the .product-hero img first (reviews),
  // then fall back to og:image (compare, blog, protocols)
  let image = null;
  let imageTitle = null;

  // product-hero img (reviews)
  const heroImgMatch = content.match(/class="product-hero"[\s\S]{0,400}?<img\s[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/);
  if (heroImgMatch) {
    image = heroImgMatch[1];
    imageTitle = heroImgMatch[2] || null;
  }

  // og:image fallback (compare, blog)
  if (!image) {
    const ogMatch = content.match(/<meta\s[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || content.match(/<meta\s[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (ogMatch) image = ogMatch[1];
  }

  // og:image:alt
  if (image && !imageTitle) {
    const altMatch = content.match(/<meta\s[^>]*property=["']og:image:alt["'][^>]*content=["']([^"']+)["']/i);
    if (altMatch) imageTitle = altMatch[1];
  }

  return { published, canonicalPath, image, imageTitle };
}

// ── Get lastmod ───────────────────────────────────────────────────
function getLastmod(absPath, published) {
  if (published) return published;
  try {
    const gitDate = execSync(`git log -1 --format=%ai -- "${absPath}"`, {
      cwd: path.join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe'],
    }).toString().trim();
    if (gitDate) return gitDate.slice(0, 10);
  } catch {}
  try {
    return fs.statSync(absPath).mtime.toISOString().slice(0, 10);
  } catch {
    return TODAY;
  }
}

// ── File discovery ────────────────────────────────────────────────
const EXCLUDE_DIRS  = ['assets', 'data', 'uploads', 'pagefind'];
const EXCLUDE_FILES = [/^google[a-z0-9]+\.html$/, /^feed\.xml$/, /^rss\.html$/];
const EXCLUDE_ABS   = [
  path.join(OUTPUT_DIR, 'uploads', 'index.html'),
  path.join(OUTPUT_DIR, 'pages', 'rss.html'),
];

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = entry.name;
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.includes(name)) continue;
      results.push(...walkDir(path.join(dir, name)));
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
const absPaths = walkDir(OUTPUT_DIR);

const allEntries = absPaths.map(abs => {
  const { published, canonicalPath, image, imageTitle } = readHtmlMeta(abs);

  let urlPath = abs.slice(OUTPUT_DIR.length).replace(/\\/g, '/');
  urlPath = urlPath.replace(/\.html$/, '').replace(/\/index$/, '');
  if (!urlPath) urlPath = '/';
  if (canonicalPath) urlPath = canonicalPath;

  const lastmod = getLastmod(abs, published);
  return { urlPath, lastmod, image, imageTitle };
});

// Deduplicate
const seen = new Set();
const entries = allEntries.filter(e => {
  if (seen.has(e.urlPath)) return false;
  seen.add(e.urlPath);
  return true;
});

// Sort: homepage first, then by depth, then alphabetically
entries.sort((a, b) => {
  if (a.urlPath === '/') return -1;
  if (b.urlPath === '/') return 1;
  const da = (a.urlPath.match(/\//g) || []).length;
  const db = (b.urlPath.match(/\//g) || []).length;
  return da - db || a.urlPath.localeCompare(b.urlPath);
});

// ── Group into sections ───────────────────────────────────────────
const sections = { core: [], reviews: [], research: [], protocols: [], compare: [], blog: [], ingredients: [] };
for (const entry of entries) {
  sections[getSitemapSection(entry.urlPath)].push(entry);
}

// ── XML helpers ───────────────────────────────────────────────────
const IMAGE_NS = 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';

function escXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildUrlEntry(entry) {
  const { urlPath, lastmod, image, imageTitle } = entry;
  const { priority, changefreq } = getPriority(urlPath);
  const loc = BASE_URL + urlPath;

  let imageTag = '';
  if (image) {
    imageTag = `\n    <image:image>
      <image:loc>${escXml(image)}</image:loc>${imageTitle ? `\n      <image:title>${escXml(imageTitle)}</image:title>` : ''}
    </image:image>`;
  }

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageTag}
  </url>`;
}

function buildSitemapXml(sectionEntries, includeImageNs = false) {
  const ns = includeImageNs ? ` ${IMAGE_NS}` : '';
  const body = sectionEntries.map(buildUrlEntry).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${ns}>

${body}

</urlset>`;
}

// ── Write per-section sitemaps ────────────────────────────────────
const writtenSitemaps = [];

for (const [section, sectionEntries] of Object.entries(sections)) {
  if (sectionEntries.length === 0) continue;

  const filename   = `sitemap-${section}.xml`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  const hasImages  = sectionEntries.some(e => e.image);
  const xml        = buildSitemapXml(sectionEntries, hasImages);

  fs.writeFileSync(outputPath, xml, 'utf8');

  // Sitemap index needs the lastmod of the most-recently-updated entry
  const latestLastmod = sectionEntries.reduce((max, e) => e.lastmod > max ? e.lastmod : max, '1970-01-01');

  writtenSitemaps.push({ filename, count: sectionEntries.length, lastmod: latestLastmod });
  console.log(`  ✓ ${filename} — ${sectionEntries.length} URLs — latest: ${latestLastmod}`);
}

// ── Write sitemap index ───────────────────────────────────────────
const indexEntries = writtenSitemaps.map(({ filename, lastmod }) => `  <sitemap>
    <loc>${BASE_URL}/${filename}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n');

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${indexEntries}

</sitemapindex>`;

const indexPath = path.join(OUTPUT_DIR, 'sitemap-index.xml');
fs.writeFileSync(indexPath, indexXml, 'utf8');
console.log(`  ✓ sitemap-index.xml — ${writtenSitemaps.length} sections — ${entries.length} total URLs`);

// ── Also keep a flat sitemap.xml for compatibility ────────────────
// (Google Search Console may already have sitemap.xml submitted)
const flatHasImages = entries.some(e => e.image);
const flatXml = buildSitemapXml(entries, flatHasImages);
fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), flatXml, 'utf8');
console.log(`  ✓ sitemap.xml (flat, for backwards compat) — ${entries.length} URLs`);

// ── Ping Google & Bing ────────────────────────────────────────────
const sitemapIndexUrl = encodeURIComponent(`${BASE_URL}/sitemap-index.xml`);

function ping(label, urlStr) {
  return new Promise(resolve => {
    https.get(urlStr, res => {
      console.log(`  ✓ Pinged ${label} — HTTP ${res.statusCode}`);
      resolve();
    }).on('error', err => {
      console.warn(`  ⚠ Ping to ${label} failed: ${err.message}`);
      resolve();
    });
  });
}

Promise.all([
  ping('Google', `https://www.google.com/ping?sitemap=${sitemapIndexUrl}`),
  ping('Bing',   `https://www.bing.com/ping?sitemap=${sitemapIndexUrl}`),
]).then(() => {
  console.log(`\n✓ Sitemap build complete — ${entries.length} URLs across ${writtenSitemaps.length} sections`);
});
