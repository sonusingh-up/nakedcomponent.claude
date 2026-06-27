#!/usr/bin/env node
/* ============================================================
   Brand flagship page generator
   ------------------------------------------------------------
   Emits the rich individual brand pages (the same layout the
   AS-IT-IS / Nakpro pages use, styled by brands/flagship.css)
   from a per-brand "content pack" plus that brand's existing
   BRANDS_DB entry (scores, verdict, flags, testing, since/hq).

   - Content packs live in scripts/brand-content.js (id -> pack).
   - Only ids present in that map are (re)built; hand-written
     pages without a pack are left untouched.
   - The frozen <meta name="published"> date is read from the
     existing file and preserved (CLAUDE.md rule 7).

   Usage:  node scripts/build-brand-pages.js [id ...]
           (no args = build every id in brand-content.js)
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'project');
const BRANDS_DIR = path.join(ROOT, 'brands');
const DOMAIN = 'https://www.nakedcompound.in';
const SLUG_OVERRIDE = { gnc: 'gnc-india' };

// ── Load BRANDS_DB (declared with const, no module.exports) ──────────
const brandsSrc = fs.readFileSync(path.join(ROOT, 'pages', 'brands-data.js'), 'utf8');
const BRANDS_DB = new Function(brandsSrc + '\n;return BRANDS_DB;')();
const CONTENT = require('./brand-content.js');

// ── Helpers ──────────────────────────────────────────────────────────
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const inr = n => '₹' + Number(n).toLocaleString('en-IN');
// entity-aware &-escape; leaves existing entities and intentional <em> alone
const t = s => String(s).replace(/&(?!(?:amp|lt|gt|quot|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
const slugOf = id => SLUG_OVERRIDE[id] || id;

const FLAG_MAP = {
  'prop-blend':              ['Proprietary blend', 'danger'],
  'underdosed':             ['Underdosed actives', 'danger'],
  'generic-extract':        ['Generic extract', 'warn'],
  'no-coa':                 ['No public COA', 'warn'],
  'label-inflation':        ['Label inflation', 'danger'],
  'premium-price':          ['Premium price', 'neutral'],
  'marketing-heavy':        ['Marketing-heavy', 'warn'],
  'legal-issues':           ['Legal / regulatory issues', 'danger'],
  'brand-coa-only':         ['Brand-commissioned COA only', 'warn'],
  'misleading-claims':      ['Misleading claims', 'danger'],
  'historical-test-failure':['Historical test failure', 'danger'],
  'limited-india-testing':  ['Limited India testing', 'warn'],
  'no-fssai-confirmed':     ['FSSAI unconfirmed', 'warn'],
};

const CHECK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

function readPublished(file) {
  try {
    const m = fs.readFileSync(file, 'utf8').match(/<meta name="published" content="([^"]+)"/);
    if (m) return m[1];
  } catch (e) {}
  return new Date().toISOString().slice(0, 10);
}

// ── Section renderers ────────────────────────────────────────────────
function metaChips(c) {
  return c.metaChips.map(ch =>
    `<span class="meta-chip${ch.ok ? ' ok' : ''}"><span class="dot"></span>${t(ch.label)}</span>`
  ).join('\n        ');
}

function dims(b) {
  const rows = [
    ['Label acc.', b.scores.labelAccuracy],
    ['Dosing', b.scores.dosing],
    ['FSSAI', b.scores.fssai],
    ['3P Test', b.scores.thirdParty],
    ['Value ₹', b.scores.value],
  ];
  return rows.map(([label, v]) => `          <div class="bp-dim">
            <span class="bp-dim-label">${label}</span>
            <div class="bp-dim-bar"><div class="bp-dim-fill" style="width:${v * 10}%"></div></div>
            <span class="bp-dim-val">${v}</span>
          </div>`).join('\n');
}

function checks(b) {
  const c = (ok, lbl) =>
    `          <div class="bp-check">
            <div class="bp-check-ico ${ok ? 'yes' : 'no'}">${ok ? '✓' : '✕'}</div>
            <div class="bp-check-lbl">${lbl}</div>
          </div>`;
  return [c(b.fssai, 'FSSAI'), c(b.thirdPartyTested, '3P Tested'), c(b.coaPublic, 'COA Public')].join('\n');
}

function scoreRows(b, c) {
  const rows = [
    ['Label accuracy', b.scores.labelAccuracy, c.scoreWhys.labelAccuracy],
    ['Dosing', b.scores.dosing, c.scoreWhys.dosing],
    ['FSSAI', b.scores.fssai, c.scoreWhys.fssai],
    ['3P testing', b.scores.thirdParty, c.scoreWhys.thirdParty],
    ['Value (₹)', b.scores.value, c.scoreWhys.value],
  ];
  return rows.map(([dim, v, why]) => `          <div class="bf-score-row">
            <span class="dim">${dim}</span><span class="bf-score-chip">${v}</span>
            <span class="why">${t(why)}</span>
          </div>`).join('\n');
}

function flagsBlock(b) {
  if (!b.flags || !b.flags.length) return '';
  const chips = b.flags.map(f => {
    const [label, sev] = FLAG_MAP[f] || [f, 'neutral'];
    return `<span class="bp-flag ${sev}">${t(label)}</span>`;
  }).join('\n          ');
  return `\n        <div class="bp-flags" style="margin-top:var(--s-5)">
          ${chips}
        </div>`;
}

function certChips(c) {
  return c.testing.chips.map(ch => `<span class="bf-cert">${CHECK}${t(ch)}</span>`).join('\n          ');
}

function catalog(b, c) {
  return c.cats.map(cat => {
    const cards = cat.items.map(p => {
      const url = p.url || `https://www.amazon.in/s?k=${p.q}`;
      const tag = `<span class="bf-ptag${p.star ? ' is-star' : ''}">${t(p.tag)}</span>`;
      const pn = p.pn ? `<small>${t(p.pn)}</small>` : '';
      return `            <div class="bf-pcard">
              <div class="bf-pthumb"><img src="#" alt="${t(b.name + ' ' + p.name)}" loading="lazy" onerror="this.style.display='none'"></div>
              <div>
                <div class="bf-pcard-head"><div class="bf-pcard-name">${t(p.name)}</div>${tag}</div>
                <div class="bf-pcard-unit">${t(p.unit)} · Checked May 2026</div>
              </div>
              <div class="bf-pcard-right">
                <div class="bf-pcard-price">${inr(p.price)}${pn}</div>
                <a href="${url}" target="_blank" rel="nofollow noopener sponsored" class="bf-buy">Amazon.in ↗</a>
              </div>
              <p class="bf-pcard-note">${t(p.note)}</p>
            </div>`;
    }).join('\n\n');
    return `          <div class="bf-pcat"><span class="bf-pcat-name">${t(cat.name)}</span><span class="bf-pcat-line"></span><span class="bf-pcat-count">${cat.items.length}</span></div>
          <div class="bf-prods">
${cards}
          </div>`;
  }).join('\n\n');
}

function list(items) { return items.map(li => `              <li>${t(li)}</li>`).join('\n'); }

function compareRows(c) {
  return c.compare.map(r => {
    const name = r.self ? t(r.name) : `<a href="/brands/${r.slug}">${t(r.name)}</a>`;
    return `            <tr${r.self ? ' class="is-self"' : ''}>
              <td class="brand" data-label="Brand">${name}</td>
              <td class="scorecell" data-label="NC score">${r.score}</td>
              <td data-label="Tier">${t(r.tier)}</td>
              <td data-label="Why">${t(r.why)}</td>
            </tr>`;
  }).join('\n');
}

function faqItems(c) {
  return c.faq.map(f => `          <details>
            <summary>${t(f.q)}</summary>
            <div class="bf-faq-body">${t(f.a)}</div>
          </details>`).join('\n');
}

function faqLd(c) {
  return c.faq.map(f => `      {
        "@type": "Question",
        "name": ${JSON.stringify(f.q)},
        "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(f.a)} }
      }`).join(',\n');
}

function alts(c) {
  return c.alternatives.map(a => `          <a class="bf-alt" href="/brands/${a.slug}">
            <div class="bf-alt-top"><span class="bf-alt-name">${t(a.name)}</span><span class="bf-alt-score">${a.score}</span></div>
            <p class="bf-alt-why">${t(a.why)}</p>
          </a>`).join('\n');
}

// ── Page template ────────────────────────────────────────────────────
function renderPage(b, c) {
  const slug = slugOf(b.id);
  const file = path.join(BRANDS_DIR, slug + '.html');
  const published = readPublished(file);
  const verdict = cap(b.verdict);
  const score = b.trustScore;
  const nProducts = c.cats.reduce((n, cat) => n + cat.items.length, 0);
  const title = c.title || `${b.name} Review — Brand Profile | Naked Compound`;
  const testParas = c.testing.paras.map(p => `        <p>${t(p)}</p>`).join('\n\n');

  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1911119578672689" crossorigin="anonymous"></script>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${t(title)}</title>
  <meta name="description" content="${t(c.metaDesc)}" />
  <link rel="canonical" href="${DOMAIN}/brands/${slug}" />
  <meta name="published" content="${published}" />

  <meta property="og:type" content="article" />
  <meta property="og:title" content="${t(b.name)} — Independent Brand Profile" />
  <meta property="og:description" content="${t(c.ogDesc)}" />
  <meta property="og:url" content="${DOMAIN}/brands/${slug}" />
  <meta property="og:image" content="${DOMAIN}/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${t(b.name)} — Independent Brand Profile" />
  <meta name="twitter:image" content="${DOMAIN}/og-image.png" />

  <script async src="https://www.googletagmanager.com/gtag/js?id=G-84Q2LMHPV0"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-84Q2LMHPV0');</script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/style.css?v=1001" />
  <link rel="stylesheet" href="/pages.css?v=6" />
  <link rel="stylesheet" href="/brands/brand-profile.css?v=1" />
  <link rel="stylesheet" href="/brands/flagship.css?v=1" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <script>window.PAGE_KEY = 'brands';</script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Home","item":"${DOMAIN}/"},
      {"@type":"ListItem","position":2,"name":"Verified Brands","item":"${DOMAIN}/pages/verified-brands"},
      {"@type":"ListItem","position":3,"name":${JSON.stringify(b.name)},"item":"${DOMAIN}/brands/${slug}"}
    ]
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": ${JSON.stringify(b.name + ' Supplement Line')},
    "image": "${DOMAIN}/og-image.png",
    "description": ${JSON.stringify(c.ldDesc || ('Independent review, formulation analysis, and lab-transparency assessment of the ' + b.name + ' supplement catalogue.'))},
    "brand": { "@type": "Brand", "name": ${JSON.stringify(b.name)} },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "${score}",
      "reviewCount": "${nProducts}",
      "bestRating": "10",
      "worstRating": "1"
    },
    "review": {
      "@type": "Review",
      "author": { "@type": "Organization", "name": "Naked Compound", "url": "${DOMAIN}" },
      "publisher": { "@type": "Organization", "name": "Naked Compound" },
      "datePublished": "${published}",
      "reviewBody": ${JSON.stringify(c.thesis || b.summary)},
      "reviewRating": { "@type": "Rating", "ratingValue": "${score}", "bestRating": "10", "worstRating": "1" }
    }
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
${faqLd(c)}
    ]
  }
  </script>
</head>
<body>
<div id="site-header"></div>

<main data-verdict="${b.verdict}">

  <!-- ── Hero (site-standard page-head) ───────────────────────── -->
  <section class="page-head">
    <div class="container">
      <div class="crumbs">
        <a href="/">Home</a><span class="sep">/</span>
        <a href="/pages/verified-brands">Brands</a><span class="sep">/</span>
        <span>${t(b.name)}</span>
      </div>

      <div class="brand-hero-strip">
        <div class="brand-mark-lg">${t(b.mark)}</div>
        <div class="brand-hero-info">
          <div class="brand-verdict-hero"><span class="dot"></span> ${verdict} · ${score} / 10</div>
          <h1>${t(b.name)} — <em>what the data says.</em></h1>
        </div>
      </div>

      <p class="kicker">${t(c.kicker)}</p>

      <div class="meta-chips">
        ${metaChips(c)}
      </div>
    </div>
  </section>

  <!-- ── In-page nav ──────────────────────────────────────────── -->
  <nav class="bf-subnav" aria-label="On this page">
    <div class="container bf-subnav-inner">
      <a href="#verdict">Verdict</a>
      <a href="#glance">At a glance</a>
      <a href="#scorecard">Scorecard</a>
      <a href="#testing">Testing</a>
      <a href="#range">Products</a>
      <a href="#proscons">Pros &amp; cons</a>
      <a href="#compare">Compare</a>
      <a href="#faq">FAQ</a>
      <a href="#alternatives">Alternatives</a>
    </div>
  </nav>

  <div class="container">
    <div class="bf-wrap">

      <!-- ── Verdict / TL;DR ────────────────────────────────────── -->
      <section id="verdict" class="bf-tldr">
        <div class="bf-tldr-badge">${verdict} · ${score} / 10</div>
        <h2>The bottom line</h2>
        <p>${t(c.thesis || b.summary)}</p>
        <div class="bf-keyrow">
          <div class="bf-key"><span class="k">${t(c.keyrow[0].k)}</span><span class="v">${t(c.keyrow[0].v)}</span></div>
          <div class="bf-key"><span class="k">${t(c.keyrow[1].k)}</span><span class="v">${t(c.keyrow[1].v)}</span></div>
          <div class="bf-key"><span class="k">${t(c.keyrow[2].k)}</span><span class="v">${t(c.keyrow[2].v)}</span></div>
        </div>
      </section>

      <!-- ── At a glance ────────────────────────────────────────── -->
      <section id="glance" class="bf-section">
        <div class="bp-section-title">At a glance</div>
        <div class="bf-glance">
${c.glance.map(g => `          <div class="bf-fact"><span class="k">${t(g.k)}</span><span class="v">${t(g.v)}</span></div>`).join('\n')}
        </div>
      </section>

      <!-- ── Scorecard ──────────────────────────────────────────── -->
      <section id="scorecard" class="bf-section">
        <div class="bp-section-title">Scorecard — how ${t(b.name)} earns ${score}</div>
        <p class="bf-lead">${t(c.scorecardLead)}</p>

        <div class="bp-dims">
${dims(b)}
        </div>

        <div class="bp-checks">
${checks(b)}
        </div>

        <div class="bf-score-rows">
${scoreRows(b, c)}
        </div>
      </section>

      <!-- ── Testing & certification ────────────────────────────── -->
      <section id="testing" class="bf-section bf-prose">
        <div class="bp-section-title">Testing &amp; certification</div>
${testParas.split('\n\n')[0]}

        <div class="bf-certs">
          ${certChips(c)}
        </div>

        <div class="bp-testing-note">${t(c.testing.note || b.testingBody)}</div>${flagsBlock(b)}

${testParas.split('\n\n').slice(1).join('\n\n')}
      </section>

      <!-- ── Product range ──────────────────────────────────────── -->
      <section id="range" class="bf-section">
        <div class="bp-section-title">The full product range</div>
        <p class="bf-lead">${t(c.rangeLead)}</p>

        <div class="bf-catalog">

${catalog(b, c)}

        </div>

        <!-- Where to buy — dual options -->
        <div class="bf-buybox">
          <p class="bf-buybox-txt">${t(c.buybox.text)}</p>
          <div class="bf-buybox-btns">
            <a href="${c.buybox.amazon}" target="_blank" rel="nofollow noopener sponsored" class="bf-btn primary">Check price on Amazon ↗</a>
            <a href="${c.buybox.directUrl}" target="_blank" rel="nofollow noopener sponsored" class="bf-btn ghost">${t(c.buybox.directLabel)} ↗</a>
          </div>
        </div>
      </section>

      <!-- ── Pros & cons ────────────────────────────────────────── -->
      <section id="proscons" class="bf-section">
        <div class="bp-section-title">Strengths &amp; limitations</div>
        <div class="bf-grid2">
          <div class="bf-pc pros">
            <h3>Strengths</h3>
            <ul>
${list(c.pros)}
            </ul>
          </div>
          <div class="bf-pc cons">
            <h3>Limitations</h3>
            <ul>
${list(c.cons)}
            </ul>
          </div>
        </div>
      </section>

      <!-- ── Audience ───────────────────────────────────────────── -->
      <section class="bf-section">
        <div class="bp-section-title">Is it right for you?</div>
        <div class="bf-aud">
          <div class="bf-aud-card good">
            <h3>Good fit if you…</h3>
            <p>${t(c.audience.good)}</p>
          </div>
          <div class="bf-aud-card bad">
            <h3>Look elsewhere if you…</h3>
            <p>${t(c.audience.bad)}</p>
          </div>
        </div>
      </section>

      <!-- ── Compare ────────────────────────────────────────────── -->
      <section id="compare" class="bf-section">
        <div class="bp-section-title">How ${t(b.name)} compares</div>
        <p class="bf-lead">${t(c.compareLead)}</p>
        <table class="bf-compare">
          <thead>
            <tr><th>Brand</th><th>NC score</th><th>Tier</th><th>Why</th></tr>
          </thead>
          <tbody>
${compareRows(c)}
          </tbody>
        </table>
        <p class="bf-lead" style="margin-top:var(--s-4);">See the full ranking in the <a href="/pages/verified-brands" style="color:var(--accent);">Verified Brands database →</a></p>
      </section>

      <!-- ── FAQ ────────────────────────────────────────────────── -->
      <section id="faq" class="bf-section">
        <div class="bp-section-title">Frequently asked questions</div>
        <div class="bf-faq">
${faqItems(c)}
        </div>
      </section>

      <!-- ── Final verdict / CTA ────────────────────────────────── -->
      <section class="bf-cta">
        <h2>Our verdict</h2>
        <p>${t(c.verdict)}</p>
        <div class="bf-cta-btns">
          <a href="${c.buybox.amazon}" target="_blank" rel="nofollow noopener sponsored" class="bf-btn primary">Shop ${t(b.name)} on Amazon ↗</a>
          <a href="/pages/verified-brands" class="bf-btn ghost">Compare all brands</a>
        </div>
      </section>

      <!-- ── Brand alternatives (retention loop) ────────────────── -->
      <section id="alternatives" class="bf-section">
        <div class="bp-section-title">${t(c.altsTitle || ('If ' + b.name + ' isn’t the one'))}</div>
        <p class="bf-lead">${t(c.altsLead)}</p>
        <div class="bf-alts">
${alts(c)}
        </div>
      </section>

      <p class="bp-disclosure">Affiliate disclosure — some Amazon.in product links earn a small commission at no additional cost to you. Commission does not influence brand scores, tier placement, or flag decisions. Full policy: <a href="/pages/conflicts-policy">conflicts-policy</a>. Prices are last-checked estimates; verify on Amazon before purchasing.</p>

      <a href="/pages/verified-brands" class="bp-back">← Back to Verified Brands Database</a>
    </div>
  </div>

</main>

<div id="site-footer"></div>
<script src="/nc-site.js?v=1001"></script>
<script>
  // Highlight the in-page subnav link for the section in view.
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.bf-subnav a'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (l) { l.classList.remove('active'); });
          map[e.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    ['verdict','glance','scorecard','testing','range','proscons','compare','faq','alternatives'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  })();
</script>
</body>
</html>
`;
}

// ── Main ─────────────────────────────────────────────────────────────
const wanted = process.argv.slice(2);
const ids = (wanted.length ? wanted : Object.keys(CONTENT));
let built = 0;
for (const id of ids) {
  const c = CONTENT[id];
  if (!c) { console.error(`! no content pack for "${id}" — skipping`); continue; }
  const b = BRANDS_DB.find(x => x.id === id);
  if (!b) { console.error(`! no BRANDS_DB entry for "${id}" — skipping`); continue; }
  const slug = slugOf(id);
  fs.writeFileSync(path.join(BRANDS_DIR, slug + '.html'), renderPage(b, c));
  const n = c.cats.reduce((s, cat) => s + cat.items.length, 0);
  console.log(`✓ ${slug}.html  (${b.verdict} ${b.trustScore}, ${n} products)`);
  built++;
}
console.log(`\nBuilt ${built} brand page(s).`);
