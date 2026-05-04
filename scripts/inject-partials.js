#!/usr/bin/env node
/**
 * inject-partials.js — Naked Compound static header/footer injector
 *
 * Replaces every <div id="site-header"></div> and <div id="site-footer"></div>
 * across all HTML files in project/ with real, crawlable static HTML.
 *
 * WHY THIS EXISTS:
 *   nc-site.js previously injected the header and footer via innerHTML at
 *   runtime. Google's crawler reads raw HTML first — it saw empty divs, no
 *   nav links, no footer links. All internal navigation was invisible to
 *   Googlebot on first crawl pass.
 *
 *   This script bakes the header and footer into every HTML file at build time.
 *   nc-site.js still loads for UX behaviors (theme toggle, mobile nav, sticky
 *   shadow, animations) — but its getElementById('site-header') check finds
 *   null (the div is gone), so it skips the innerHTML injection silently.
 *
 * ACTIVE NAV ITEM:
 *   Each page sets window.PAGE_KEY = 'xxx' in a <script> tag.
 *   This script reads that value and hardcodes aria-current="page" class="current"
 *   on the matching nav item — no JS needed for active state.
 *
 * USAGE:
 *   node scripts/inject-partials.js           (normal run)
 *   node scripts/inject-partials.js --dry-run (preview only, no writes)
 *
 * ADDING NEW NAV ITEMS:
 *   Edit NAV_ITEMS below and re-run. All pages update in one command.
 *
 * ADDING NEW FOOTER LINKS:
 *   Edit buildFooter() below and re-run.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────────────────

const PROJECT_DIR = path.resolve(__dirname, '../project');
const DRY_RUN     = process.argv.includes('--dry-run');

// Matches nc-site.js navItems exactly — edit both places if you add a new route
const NAV_ITEMS = [
  { key: 'research',    label: 'Research',        href: '/pages/research'        },
  { key: 'protocols',   label: 'Protocols',        href: '/pages/protocols'       },
  { key: 'reviews',     label: 'Reviews',          href: '/pages/reviews'         },
  { key: 'ingredients', label: 'Ingredients',      href: '/pages/ingredients'     },
  { key: 'brands',      label: 'Verified brands',  href: '/pages/verified-brands' },
  { key: 'learn',       label: 'Learn',            href: '/pages/learn'           },
  { key: 'about',       label: 'About',            href: '/pages/about'           },
];

// HTML files to skip entirely (uploads dir, any build artifacts)
const SKIP_DIRS = ['uploads'];

// ── HTML builders ─────────────────────────────────────────────────────────────

function buildHeader(pageKey) {
  const navLinks = NAV_ITEMS.map(n => {
    const isCurrent = n.key === pageKey;
    const attrs     = isCurrent ? ' aria-current="page" class="current"' : '';
    return `        <li><a href="${n.href}"${attrs}>${n.label}</a></li>`;
  }).join('\n');

  const mobileLinks = NAV_ITEMS.map(n =>
    `      <a href="${n.href}">${n.label}</a>`
  ).join('\n');

  return `<header class="site-header">
  <div class="container nav">
    <a class="brand" href="/" aria-label="Naked Compound home">
      <span class="mark" aria-hidden="true"></span>
      <span class="brand-name">Naked<em>·</em>Compound</span>
    </a>

    <nav aria-label="Primary">
      <ul class="nav-links">
${navLinks}
      </ul>
    </nav>

    <div class="nav-actions">
      <label class="search" aria-label="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="search" placeholder="Search ingredients…" />
        <span class="kbd">⌘K</span>
      </label>

      <button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">
        <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
        <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      </button>

      <a href="/pages/research" class="btn btn-primary">Explore research</a>

      <button class="menu-toggle" data-menu-toggle aria-label="Open menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
</header>

<div class="mobile-nav" aria-hidden="true">
  <label class="search">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    <input type="search" placeholder="Search 312 ingredients…" />
  </label>
${mobileLinks}
</div>`;
}

function buildFooter() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">

      <div class="footer-brand">
        <a class="brand" href="/">
          <span class="mark" aria-hidden="true"></span>
          <span class="brand-name">Naked<em>·</em>Compound</span>
        </a>
        <p>Independent supplement research for India. Strip the label. See the science.</p>
      </div>

      <div class="footer-col">
        <h4>Research</h4>
        <ul>
          <li><a href="/pages/research">Research hub</a></li>
          <li><a href="/pages/guides">Guides</a></li>
          <li><a href="/pages/protocols">Protocols</a></li>
          <li><a href="/pages/reviews">Reviews</a></li>
          <li><a href="/pages/ingredients">Ingredients</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Library</h4>
        <ul>
          <li><a href="/pages/categories">Categories</a></li>
          <li><a href="/pages/blog">Blog</a></li>
          <li><a href="/pages/learn">Learn</a></li>
          <li><a href="/pages/verified-brands">Verified brands</a></li>
          <li><a href="/pages/changelog">Database changelog</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="/pages/about">About</a></li>
          <li><a href="/pages/authors">Authors</a></li>
          <li><a href="/pages/methodology">Methodology</a></li>
          <li><a href="/pages/scoring-rubric">Scoring rubric</a></li>
          <li><a href="/pages/conflicts-policy">Conflicts policy</a></li>
          <li><a href="/pages/contact">Contact</a></li>
        </ul>
      </div>

    </div>

    <div class="footer-disclaimer">
      <strong>Not medical advice.</strong> Content on Naked Compound is educational and reflects our reading of published research. Nothing here replaces a licensed physician, dietician, or pharmacist. Consult a qualified professional before starting, stopping, or combining any supplement — especially if you are pregnant, on medication, or managing a chronic condition.
      <br><br>
      <strong>AI-assisted analysis.</strong> Product evaluations, scores, and summaries on this site are produced with the assistance of AI tools applied to our structured scoring inputs and editorial criteria. AI can make errors of omission or interpretation. Always verify label claims, ingredient dosages, and current pricing directly with the brand before making a purchase decision.
      <br><br>
      <strong>Affiliate disclosure.</strong> Naked Compound is a participant in the Amazon Associates Programme. Some product links on this site are affiliate links — if you click and buy, we earn a small commission at no extra cost to you. This never influences our scores, rankings, or recommendations.
    </div>

    <div class="footer-bottom">
      <span>© 2026 Naked Compound · Made in Bengaluru</span>
      <div style="display:flex; gap:20px;">
        <a href="/pages/privacy">Privacy</a>
        <a href="/pages/terms">Terms</a>
        <a href="/pages/rss">RSS</a>
      </div>
    </div>

  </div>
</footer>`;
}

// ── File walker ───────────────────────────────────────────────────────────────

function walkHtml(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      walkHtml(fullPath, results);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Page key extractor ────────────────────────────────────────────────────────

function extractPageKey(html) {
  // Matches: window.PAGE_KEY = 'research';  or  window.PAGE_KEY = "reviews";
  const match = html.match(/window\.PAGE_KEY\s*=\s*['"]([^'"]+)['"]/);
  return match ? match[1].toLowerCase() : '';
}

// ── Placeholder replacer ──────────────────────────────────────────────────────

// Matches the empty div placeholder — handles optional whitespace inside
const HEADER_PLACEHOLDER = /<div\s+id="site-header"\s*>\s*<\/div>/;
const FOOTER_PLACEHOLDER = /<div\s+id="site-footer"\s*>\s*<\/div>/;

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  const hasHeader = HEADER_PLACEHOLDER.test(html);
  const hasFooter = FOOTER_PLACEHOLDER.test(html);

  // Skip files that don't use the placeholder pattern
  if (!hasHeader && !hasFooter) return { skipped: true };

  const pageKey    = extractPageKey(html);
  const headerHtml = buildHeader(pageKey);
  const footerHtml = buildFooter();

  if (hasHeader) html = html.replace(HEADER_PLACEHOLDER, headerHtml);
  if (hasFooter) html = html.replace(FOOTER_PLACEHOLDER, footerHtml);

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, html, 'utf8');
  }

  return { skipped: false, pageKey, hasHeader, hasFooter };
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log(`\n🔧 inject-partials.js${DRY_RUN ? ' [DRY RUN — no files written]' : ''}`);
  console.log(`   Project dir: ${PROJECT_DIR}\n`);

  const files = walkHtml(PROJECT_DIR);

  let processed = 0;
  let skipped   = 0;
  let errors    = 0;

  for (const filePath of files) {
    const rel = path.relative(PROJECT_DIR, filePath);
    try {
      const result = processFile(filePath);
      if (result.skipped) {
        skipped++;
        console.log(`   ⊘  skipped  ${rel}`);
      } else {
        processed++;
        const key = result.pageKey ? `[${result.pageKey}]` : '[no PAGE_KEY]';
        console.log(`   ✓  injected ${rel} ${key}`);
      }
    } catch (err) {
      errors++;
      console.error(`   ✗  ERROR    ${rel}: ${err.message}`);
    }
  }

  console.log(`\n   Done. ${processed} injected · ${skipped} skipped · ${errors} errors.\n`);

  if (errors > 0) process.exit(1);
}

main();
