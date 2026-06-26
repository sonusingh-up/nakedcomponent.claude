#!/usr/bin/env node
/**
 * gen-brand-pages.js
 * ------------------------------------------------------------------
 * Generates an individual brand-profile page (project/brands/<slug>.html)
 * for every brand in project/pages/brands-data.js that does not already
 * have one. Existing pages are never overwritten (some are hand-tuned).
 *
 * It mirrors the proven template used by the existing brand pages
 * (nakpro.html, carbamide-forte.html, …) and derives every field from
 * the single source of truth: BRANDS_DB.
 *
 * It also appends a matching <item> to project/feed.xml for each new
 * page, consistent with the existing brand entries.
 *
 * Run:  node scripts/gen-brand-pages.js
 * Then: node scripts/update-sitemap.js   (or just commit — pre-commit hook does it)
 * ------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'project/pages/brands-data.js');
const BRANDS_DIR = path.join(ROOT, 'project/brands');
const FEED_FILE = path.join(ROOT, 'project/feed.xml');

const PUBLISHED = '2026-06-26';
const PUBDATE = 'Thu, 26 Jun 2026 08:00:00 +0530';

// id -> slug overrides where the page filename differs from the brand id
const SLUG_OVERRIDE = { gnc: 'gnc-india' };

const CAT_LABELS = {
  protein: 'Protein', creatine: 'Creatine', preworkout: 'Pre-Workout',
  vitamins: 'Vitamins', minerals: 'Minerals', omega3: 'Omega-3',
  herbs: 'Herbs', amino: 'Amino Acids', fatburner: 'Fat Burners',
};

const DIM_ORDER = [
  ['labelAccuracy', 'Label acc.'],
  ['dosing', 'Dosing'],
  ['fssai', 'FSSAI'],
  ['thirdParty', '3P Test'],
  ['value', 'Value ₹'],
];

const FLAG_META = {
  'prop-blend':              { label: 'Proprietary blend',       cls: 'danger' },
  'underdosed':              { label: 'Underdosed',              cls: 'danger' },
  'generic-extract':         { label: 'Generic extracts',        cls: 'warn'   },
  'no-coa':                  { label: 'No public COA',           cls: 'danger' },
  'label-inflation':         { label: 'Label inflation',         cls: 'danger' },
  'premium-price':           { label: 'Premium-priced',          cls: 'neutral'},
  'marketing-heavy':         { label: 'Marketing > substance',   cls: 'warn'   },
  'legal-issues':            { label: 'Legal issues',            cls: 'danger' },
  'brand-coa-only':          { label: 'Brand-commissioned COA',  cls: 'warn'   },
  'misleading-claims':       { label: 'Misleading claims',       cls: 'danger' },
  'historical-test-failure': { label: 'Historical test failure', cls: 'danger' },
  'limited-india-testing':   { label: 'Limited India testing',   cls: 'warn'   },
  'no-fssai-confirmed':      { label: 'FSSAI unconfirmed',       cls: 'danger' },
};

const COUNTRY_FLAG = { India: '🇮🇳', USA: '🇺🇸', UK: '🇬🇧', Germany: '🇩🇪' };

// ── helpers ──────────────────────────────────────────────────────
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(s) {
  return esc(s).replace(/"/g, '&quot;');
}
function formatINR(n) {
  return '₹' + n.toLocaleString('en-IN');
}
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function slugFor(b) {
  return SLUG_OVERRIDE[b.id] || b.id;
}
function firstSentence(s) {
  const m = String(s).split(/(?<=\.)\s/)[0];
  return m || s;
}
function reviewTitleFromUrl(url) {
  const last = url.split('/').pop().replace(/-review$/, '');
  return last.split('-').map(cap).join(' ') + ' Review';
}

// ── load BRANDS_DB from the data file ────────────────────────────
function loadBrands() {
  const src = fs.readFileSync(DATA_FILE, 'utf8');
  const fn = new Function(src + '\nreturn BRANDS_DB;');
  return fn();
}

// ── page template ────────────────────────────────────────────────
function buildPage(b) {
  const slug = slugFor(b);
  const verdict = b.verdict;
  const Verdict = cap(verdict);
  const flag = COUNTRY_FLAG[b.country] || '🌐';
  const metaCats = b.categories.map(c => CAT_LABELS[c] || cap(c)).join(' · ');

  const circ = 251.3;
  const offset = (circ * (1 - b.trustScore / 10)).toFixed(1);

  const dimsHtml = DIM_ORDER.map(([k, label]) => {
    const v = b.scores[k];
    return `        <div class="bp-dim">
          <span class="bp-dim-label">${label}</span>
          <div class="bp-dim-bar"><div class="bp-dim-fill" style="width:${v * 10}%"></div></div>
          <span class="bp-dim-val">${v}</span>
        </div>`;
  }).join('\n');

  const check = (ok, lbl) => `        <div class="bp-check">
          <div class="bp-check-ico ${ok ? 'yes' : 'no'}">${ok ? '✓' : '✗'}</div>
          <div class="bp-check-lbl">${lbl}</div>
        </div>`;
  const checksHtml = [
    check(b.fssai, 'FSSAI'),
    check(b.thirdPartyTested, '3P Tested'),
    check(b.coaPublic, 'COA Public'),
  ].join('\n');

  const testingNote = esc(`${b.testingBody} ${b.fssaiNote}`.trim());

  const flagsHtml = (b.flags && b.flags.length)
    ? b.flags.map(f => {
        const m = FLAG_META[f] || { label: f, cls: 'neutral' };
        return `        <span class="bp-flag ${m.cls}">${esc(m.label)}</span>`;
      }).join('\n')
    : '        <span class="bp-no-flags">No flags</span>';

  let reviewsBlock = '';
  if (b.reviewUrl) {
    reviewsBlock = `
      <div class="bp-section-title">NC reviews</div>
      <div class="bp-reviews">
        <a href="${b.reviewUrl}" class="bp-review-item">
          <span class="bp-review-name">${esc(reviewTitleFromUrl(b.reviewUrl))}</span>
          <span class="bp-review-arrow">→</span>
        </a>
      </div>
`;
  }

  const prodsHtml = b.products.map(p => `        <div class="bp-prod">
          <div class="bp-prod-left">
            <div class="bp-prod-name">${esc(p.name)}</div>
            <div class="bp-prod-sub">${esc(p.unit)} · Checked ${esc(p.lastChecked)}</div>
          </div>
          <div class="bp-prod-right">
            <span class="bp-prod-price">${formatINR(p.price)}</span>
            <a href="${p.url}" target="_blank" rel="nofollow noopener sponsored" class="bp-prod-link">Amazon.in ↗</a>
          </div>
        </div>`).join('\n');

  let metaDesc = `Independent ${b.name} brand profile. Trust score ${b.trustScore}/10, ${Verdict} tier. ${firstSentence(b.summary)}`;
  if (metaDesc.length > 158) metaDesc = metaDesc.slice(0, 155).trimEnd() + '…';

  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1911119578672689" crossorigin="anonymous"></script>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(b.name)} — Brand Profile | Naked Compound</title>
  <meta name="description" content="${escAttr(metaDesc)}" />
  <link rel="canonical" href="https://www.nakedcompound.in/brands/${slug}" />
  <meta name="published" content="${PUBLISHED}" />

  <script async src="https://www.googletagmanager.com/gtag/js?id=G-84Q2LMHPV0"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-84Q2LMHPV0');</script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/style.css?v=1001" />
  <link rel="stylesheet" href="/pages.css?v=6" />
  <link rel="stylesheet" href="/brands/brand-profile.css?v=1" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <script>window.PAGE_KEY = 'brands';</script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Home","item":"https://www.nakedcompound.in/"},
      {"@type":"ListItem","position":2,"name":"Verified Brands","item":"https://www.nakedcompound.in/pages/verified-brands"},
      {"@type":"ListItem","position":3,"name":"${esc(b.name)}","item":"https://www.nakedcompound.in/brands/${slug}"}
    ]
  }
  </script>
</head>
<body>
<div id="site-header"></div>

<main data-verdict="${verdict}">

  <section class="bp-hero">
    <div class="container">
      <div class="bp-crumbs">
        <a href="/">Home</a><span class="sep">/</span>
        <a href="/pages/verified-brands">Verified Brands</a><span class="sep">/</span>
        <span>${esc(b.name)}</span>
      </div>

      <div class="bp-head">
        <div class="bp-logo is-mono"><span class="mono">${esc(b.mark)}</span></div>
        <div class="bp-name-block">
          <div class="bp-name-row">
            <h1>${esc(b.name)}</h1>
            <span class="bp-verdict-badge">${Verdict}</span>
          </div>
          <div class="bp-meta">${flag} ${esc(b.hq)} · Est. ${b.since} · ${esc(metaCats)}</div>
        </div>
        <div class="bp-gauge" aria-label="Trust score ${b.trustScore} of 10">
          <svg viewBox="0 0 100 100">
            <circle class="track" cx="50" cy="50" r="40"/>
            <circle class="fill" cx="50" cy="50" r="40" stroke-dasharray="251.3" stroke-dashoffset="${offset}"/>
          </svg>
          <div class="bp-gauge-text">
            <span class="num">${b.trustScore}</span>
            <span class="out">/ 10</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="container">
    <div class="bp-content-area">

      <div class="bp-section-title">Score dimensions</div>
      <div class="bp-dims">
${dimsHtml}
      </div>

      <div class="bp-checks">
${checksHtml}
      </div>

      <div class="bp-testing-note">${testingNote}</div>

      <div class="bp-section-title">Flags</div>
      <div class="bp-flags">
${flagsHtml}
      </div>
${reviewsBlock}
      <div class="bp-section-title">Products on Amazon</div>
      <div class="bp-products">
${prodsHtml}
      </div>

      <div class="bp-section-title">Our analysis</div>
      <p class="bp-summary">${esc(b.summary)}</p>

      <p class="bp-disclosure">Affiliate disclosure — some Amazon.in product links earn a small commission at no additional cost to you. Commission does not influence brand scores or tier placement. Full policy: <a href="/pages/conflicts-policy">conflicts-policy</a>.</p>

      <a href="/pages/verified-brands" class="bp-back">← Back to Verified Brands Database</a>
    </div>
  </div>

</main>

<div id="site-footer"></div>
<script src="/nc-site.js?v=1001"></script>
</body>
</html>
`;
}

function buildFeedItem(b) {
  const slug = slugFor(b);
  const Verdict = cap(b.verdict);
  let desc = `Independent ${b.name} brand profile. Trust score ${b.trustScore}/10, ${Verdict} tier. ${firstSentence(b.summary)}`;
  if (desc.length > 158) desc = desc.slice(0, 155).trimEnd() + '…';
  return `    <item>
      <title>${esc(b.name)} — Brand Profile</title>
      <link>https://www.nakedcompound.in/brands/${slug}</link>
      <guid isPermaLink="true">https://www.nakedcompound.in/brands/${slug}</guid>
      <pubDate>${PUBDATE}</pubDate>
      <category>Brands</category>
      <description>${esc(desc)}</description>
    </item>
`;
}

// ── main ─────────────────────────────────────────────────────────
function main() {
  const brands = loadBrands();
  const created = [];
  const feedItems = [];

  for (const b of brands) {
    const slug = slugFor(b);
    const file = path.join(BRANDS_DIR, slug + '.html');
    if (fs.existsSync(file)) continue; // never overwrite existing/hand-tuned pages
    fs.writeFileSync(file, buildPage(b), 'utf8');
    created.push(slug);
    feedItems.push(buildFeedItem(b));
  }

  if (!created.length) {
    console.log('No new brand pages needed — all brands already have pages.');
    return;
  }

  // Insert feed items immediately before the first existing brand <item>.
  let feed = fs.readFileSync(FEED_FILE, 'utf8');
  const anchor = '    <item>\n      <title>Nakpro — Brand Profile</title>';
  if (feed.includes(anchor)) {
    feed = feed.replace(anchor, feedItems.join('\n') + '\n' + anchor);
    fs.writeFileSync(FEED_FILE, feed, 'utf8');
    console.log(`Inserted ${feedItems.length} RSS items into feed.xml`);
  } else {
    console.warn('WARNING: feed anchor not found — RSS items NOT inserted. Add manually.');
  }

  console.log(`Created ${created.length} brand pages:`);
  created.forEach(s => console.log('  /brands/' + s));
}

main();
