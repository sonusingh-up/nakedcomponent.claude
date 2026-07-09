#!/usr/bin/env node
/**
 * build-medicine-pages.js — generates /medicines/<slug>.html profile pages
 * from project/data/otc-medicines.json (one page per OTC medicine).
 *
 * Run: node scripts/build-medicine-pages.js
 * Then: node scripts/update-sitemap.js   (or just commit — the pre-commit hook runs it)
 *
 * Pages share project/medicines/medicine.css and follow the same liquid-glass
 * theme (light/dark via [data-theme]) as /guides/otc-medicines-every-indian-must-know.
 *
 * Brand images: each brand entry in the JSON has an "img" field. Leave it ""
 * to render the built-in SVG illustration; set it to an asset path (e.g.
 * "/assets/medicines/dolo-650.webp") once a licensed pack shot is available.
 */

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://www.nakedcompound.in";
const PROJECT = path.resolve(__dirname, "../project");
const OUT_DIR = path.join(PROJECT, "medicines");
const DATA = JSON.parse(fs.readFileSync(path.join(PROJECT, "data", "otc-medicines.json"), "utf8"));

// Frozen publish date for the whole set — update-sitemap.js reads it as lastmod,
// so re-running this script never bumps dates. Bump per-page only if content changes.
const PUBLISHED = "2026-07-09";

const HUB_URL = "/guides/otc-medicines-every-indian-must-know";

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = s => esc(s).replace(/"/g, "&quot;");

const SVG_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <symbol id="sv-tablet" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="41" fill="var(--ill-a,#f8f0df)"/>
      <path d="M27 48a37 37 0 0 1 66 0" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="6" stroke-linecap="round"/>
      <rect x="27" y="57" width="66" height="6" rx="3" fill="var(--ill-b,#c98f3d)" opacity=".5"/>
      <circle cx="60" cy="60" r="41" fill="none" stroke="rgba(58,42,22,.15)" stroke-width="2.5"/>
    </symbol>
    <symbol id="sv-capsule" viewBox="0 0 120 120">
      <g transform="rotate(-28 60 60)">
        <rect x="16" y="41" width="88" height="38" rx="19" fill="var(--ill-a,#f6ead1)"/>
        <path d="M60 41h25a19 19 0 0 1 0 38H60z" fill="var(--ill-b,#c96442)"/>
        <rect x="24" y="47" width="72" height="6" rx="3" fill="rgba(255,255,255,.45)"/>
        <rect x="16" y="41" width="88" height="38" rx="19" fill="none" stroke="rgba(58,42,22,.14)" stroke-width="2.5"/>
      </g>
    </symbol>
    <symbol id="sv-strip" viewBox="0 0 120 120">
      <g transform="rotate(7 60 60)">
        <rect x="20" y="26" width="80" height="68" rx="9" fill="var(--ill-b,#b8865a)"/>
        <rect x="20" y="26" width="80" height="68" rx="9" fill="none" stroke="rgba(58,42,22,.2)" stroke-width="2.5"/>
        <line x1="60" y1="30" x2="60" y2="90" stroke="rgba(58,42,22,.22)" stroke-width="1.5" stroke-dasharray="4 4"/>
        <circle cx="41" cy="46" r="9" fill="var(--ill-a,#f8f0df)"/><circle cx="79" cy="46" r="9" fill="var(--ill-a,#f8f0df)"/>
        <circle cx="41" cy="72" r="9" fill="var(--ill-a,#f8f0df)"/><circle cx="79" cy="72" r="9" fill="var(--ill-a,#f8f0df)"/>
        <circle cx="38" cy="43" r="3" fill="rgba(255,255,255,.8)"/><circle cx="76" cy="43" r="3" fill="rgba(255,255,255,.8)"/>
        <circle cx="38" cy="69" r="3" fill="rgba(255,255,255,.8)"/><circle cx="76" cy="69" r="3" fill="rgba(255,255,255,.8)"/>
      </g>
    </symbol>
    <symbol id="sv-sachet" viewBox="0 0 120 120">
      <g transform="rotate(-6 60 60)">
        <rect x="31" y="18" width="58" height="86" rx="6" fill="var(--ill-a,#f2e6cd)"/>
        <rect x="31" y="18" width="58" height="86" rx="6" fill="none" stroke="rgba(58,42,22,.16)" stroke-width="2.5"/>
        <rect x="31" y="18" width="58" height="11" rx="5" fill="var(--ill-b,#c96442)"/>
        <rect x="40" y="42" width="40" height="34" rx="5" fill="var(--ill-b,#c96442)" opacity=".18"/>
        <rect x="46" y="50" width="28" height="5" rx="2.5" fill="var(--ill-b,#c96442)"/>
        <rect x="46" y="60" width="20" height="4" rx="2" fill="var(--ill-c,#8a6a42)" opacity=".7"/>
        <line x1="31" y1="94" x2="89" y2="94" stroke="rgba(58,42,22,.2)" stroke-width="1.5" stroke-dasharray="3 4"/>
      </g>
    </symbol>
    <symbol id="sv-bottle" viewBox="0 0 120 120">
      <g transform="rotate(4 60 60)">
        <rect x="46" y="12" width="28" height="15" rx="4" fill="var(--ill-c,#6e4a2a)"/>
        <rect x="50" y="26" width="20" height="12" fill="var(--ill-a,#e8c188)"/>
        <rect x="33" y="36" width="54" height="70" rx="15" fill="var(--ill-a,#e8c188)"/>
        <rect x="33" y="36" width="54" height="70" rx="15" fill="none" stroke="rgba(58,42,22,.16)" stroke-width="2.5"/>
        <rect x="40" y="56" width="40" height="32" rx="5" fill="#fdf8ee"/>
        <rect x="46" y="63" width="28" height="5" rx="2.5" fill="var(--ill-b,#c96442)"/>
        <rect x="46" y="73" width="19" height="4" rx="2" fill="var(--ill-c,#8a6a42)" opacity=".7"/>
      </g>
    </symbol>
    <symbol id="sv-tube" viewBox="0 0 120 120">
      <g transform="rotate(-30 60 60)">
        <rect x="13" y="45" width="13" height="30" rx="4" fill="var(--ill-c,#8a6a42)"/>
        <rect x="27" y="41" width="62" height="38" rx="9" fill="var(--ill-a,#f2e6cd)"/>
        <path d="M88 43l14 3v28l-14 3z" fill="var(--ill-a,#f2e6cd)"/>
        <line x1="97" y1="46" x2="97" y2="74" stroke="rgba(58,42,22,.25)" stroke-width="2"/>
        <line x1="101" y1="47" x2="101" y2="73" stroke="rgba(58,42,22,.25)" stroke-width="2"/>
        <rect x="27" y="41" width="62" height="38" rx="9" fill="none" stroke="rgba(58,42,22,.16)" stroke-width="2.5"/>
        <rect x="36" y="52" width="34" height="6" rx="3" fill="var(--ill-b,#c96442)"/>
        <rect x="36" y="63" width="24" height="5" rx="2.5" fill="var(--ill-c,#8a6a42)" opacity=".65"/>
      </g>
    </symbol>
    <symbol id="sv-tin" viewBox="0 0 120 120">
      <ellipse cx="60" cy="76" rx="41" ry="13" fill="var(--ill-c,#173f38)"/>
      <rect x="19" y="54" width="82" height="22" fill="var(--ill-b,#215a4f)"/>
      <ellipse cx="60" cy="54" rx="41" ry="14" fill="var(--ill-a,#2f7c6b)"/>
      <ellipse cx="60" cy="54" rx="27" ry="9" fill="rgba(255,255,255,.22)"/>
      <ellipse cx="60" cy="54" rx="41" ry="14" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
    </symbol>
    <symbol id="sv-glass" viewBox="0 0 120 120">
      <path d="M34 24 L44 100 a7 7 0 0 0 7 6 h18 a7 7 0 0 0 7 -6 L86 24 z" fill="rgba(255,255,255,.35)"/>
      <path d="M38 42 L46 98 a5 5 0 0 0 5 4 h18 a5 5 0 0 0 5 -4 L82 42 z" fill="var(--ill-a,#f2e6cd)" opacity=".9"/>
      <path d="M34 24 L44 100 a7 7 0 0 0 7 6 h18 a7 7 0 0 0 7 -6 L86 24 z" fill="none" stroke="rgba(58,42,22,.18)" stroke-width="2.5"/>
      <circle cx="52" cy="34" r="3.5" fill="rgba(255,255,255,.85)"/>
      <circle cx="66" cy="28" r="2.5" fill="rgba(255,255,255,.85)"/>
      <circle cx="60" cy="18" r="3" fill="rgba(255,255,255,.7)"/>
      <circle cx="72" cy="14" r="2" fill="rgba(255,255,255,.6)"/>
    </symbol>
  </defs>
</svg>`;

const BUY_SITES = [
  { label: "Tata 1mg", url: q => `https://www.1mg.com/search/all?name=${encodeURIComponent(q)}` },
  { label: "Apollo Pharmacy", url: q => `https://www.apollopharmacy.in/search-medicines/${encodeURIComponent(q)}` },
  { label: "PharmEasy", url: q => `https://pharmeasy.in/search/all?name=${encodeURIComponent(q)}` },
];

function brandThumb(brand, med) {
  if (brand.img) {
    return `<div class="brand-thumb"><img src="${escAttr(brand.img)}" alt="${escAttr(brand.brand)} pack" loading="lazy" /></div>`;
  }
  return `<div class="brand-thumb" style="${escAttr(med.illVars)}"><svg aria-hidden="true"><use href="#${med.ill}"/></svg></div>`;
}

function renderPage(med, i, all) {
  const catLabel = DATA.categories[med.category];
  const url = `${BASE_URL}/medicines/${med.slug}`;
  const prev = all[i - 1];
  const next = all[i + 1];
  const related = all.filter(m => m.category === med.category && m.slug !== med.slug).slice(0, 4);

  const quickCells = Object.entries(med.quick)
    .map(([k, v]) => `<div class="qf glass"><b>${esc(k)}</b><span>${esc(v)}</span></div>`)
    .join("\n        ");

  const brandCards = med.brands.map(b => `
        <div class="brand-card glass">
          ${brandThumb(b, med)}
          <b>${esc(b.brand)}</b>
          <span class="brand-maker">${esc(b.maker)}</span>
          <span class="brand-pack">${esc(b.pack)}</span>
          <span class="brand-mrp">${esc(b.mrp)}<small>indicative MRP — verify current price</small></span>
        </div>`).join("");

  const buyBtns = BUY_SITES.map(s =>
    `<a class="buy-btn glass" href="${escAttr(s.url(med.buyQuery))}" target="_blank" rel="nofollow sponsored noopener">Find on ${esc(s.label)} <span class="arrow">↗</span></a>`
  ).join("\n        ");

  const pager = [
    prev ? `<a class="pager-link glass" href="/medicines/${prev.slug}"><b>← Previous</b>${esc(prev.name)}</a>` : "",
    next ? `<a class="pager-link glass next" href="/medicines/${next.slug}"><b>Next →</b>${esc(next.name)}</a>` : "",
  ].filter(Boolean).join("\n        ");

  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1911119578672689"
     crossorigin="anonymous"></script>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(med.title)} — Naked Compound</title>
  <meta name="description" content="${escAttr(med.metaDescription)}" />
  <link rel="canonical" href="${url}" />
  <!--
    published: authoritative publish date read by update-sitemap.js.
    DO NOT edit this — it controls the lastmod in sitemap.xml.
  -->
  <meta name="published" content="${PUBLISHED}" />
  <meta name="modified"  content="${PUBLISHED}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Naked Compound" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${escAttr(med.title)} — Naked Compound" />
  <meta property="og:description" content="${escAttr(med.metaDescription)}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@nakedcompound" />
  <meta name="twitter:title" content="${escAttr(med.title)} — Naked Compound" />
  <meta name="twitter:description" content="${escAttr(med.metaDescription)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/style.css?v=3" />
  <link rel="stylesheet" href="/pages.css" />
  <link rel="stylesheet" href="/medicines/medicine.css" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <script>window.PAGE_KEY = 'guide';</script>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-84Q2LMHPV0"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-84Q2LMHPV0',{'anonymize_ip':true});</script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Home","item":"${BASE_URL}/"},
    {"@type":"ListItem","position":2,"name":"OTC Medicines","item":"${BASE_URL}${HUB_URL}"},
    {"@type":"ListItem","position":3,"name":"${escAttr(med.name)}","item":"${url}"}
  ]}
  </script>
</head>
<body>
<div id="site-header"></div>

${SVG_DEFS}

<main class="otc">

  <div class="otc-orbs" aria-hidden="true">
    <span class="orb orb-1"></span>
    <span class="orb orb-2"></span>
  </div>

  <nav class="med-crumbs" aria-label="Breadcrumb">
    <div class="wrap"><div class="inner">
      <a href="/">Home</a><span class="sep">/</span>
      <a href="${HUB_URL}">OTC Medicines</a><span class="sep">/</span>
      <span>${esc(med.name)}</span>
    </div></div>
  </nav>

  <!-- Hero -->
  <section class="med-hero">
    <div class="wrap">
      <div class="grid">
        <div>
          <div class="med-chips">
            <span class="med-chip gold">OTC</span>
            <span class="med-chip">${esc(catLabel)}</span>
          </div>
          <h1>${esc(med.name)}</h1>
          <p class="med-salt">${esc(med.salt)}</p>
          <p class="med-tagline">${esc(med.tagline)}</p>
        </div>
        <div class="med-visual" style="${escAttr(med.illVars)}">
          <svg aria-hidden="true"><use href="#${med.ill}"/></svg>
        </div>
      </div>
      <div class="quick-grid">
        ${quickCells}
      </div>
    </div>
  </section>

  <!-- Disclaimer notice -->
  <section class="otc-notice" aria-label="Important medical disclaimer">
    <div class="wrap">
      <div class="notice-band glass">
        <span class="nb-icon" aria-hidden="true">!</span>
        <p><strong>Educational reference only — not medical advice.</strong> *Doses shown are typical adult label doses. Read the pack, and confirm with a doctor or pharmacist — especially for children, pregnancy, the elderly, or any chronic condition.</p>
      </div>
    </div>
  </section>

  <!-- Uses -->
  <section class="med-section">
    <div class="wrap">
      <p class="otc-kicker" style="margin-bottom:8px;">What it's for</p>
      <h2>Uses</h2>
      <div class="use-grid rv-group">
        ${med.uses.map(u => `<span class="use-chip glass">${esc(u)}</span>`).join("\n        ")}
      </div>
    </div>
  </section>

  <!-- Benefits -->
  <section class="med-section">
    <div class="wrap">
      <p class="otc-kicker" style="margin-bottom:8px;">Why it earns its place</p>
      <h2>Benefits</h2>
      <ul class="benefit-list">
        ${med.benefits.map(b => `<li>${esc(b)}</li>`).join("\n        ")}
      </ul>
    </div>
  </section>

  <!-- Side effects -->
  <section class="med-section">
    <div class="wrap">
      <p class="otc-kicker" style="margin-bottom:8px;">The honest column</p>
      <h2>Side effects</h2>
      <div class="side-grid">
        <div class="side-box glass common">
          <h3>Common — usually settle</h3>
          <ul>${med.sideCommon.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
        </div>
        <div class="side-box glass serious">
          <h3>Stop &amp; see a doctor</h3>
          <ul>${med.sideSerious.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Cautions -->
  <section class="med-section">
    <div class="wrap">
      <p class="otc-kicker" style="margin-bottom:8px;">Before you take it</p>
      <h2>Cautions &amp; interactions</h2>
      <ul class="caution-list">
        ${med.cautions.map(c => `<li class="glass">${esc(c)}</li>`).join("\n        ")}
      </ul>
    </div>
  </section>

  <!-- Brands & buy -->
  <section class="med-section">
    <div class="wrap">
      <p class="otc-kicker" style="margin-bottom:8px;">On the shelf</p>
      <h2>Brands in India <span class="otc-serif">&amp; where to buy</span></h2>
      <div class="brand-grid">${brandCards}
      </div>
      <div class="buy-row">
        ${buyBtns}
      </div>
      <p class="buy-fine">Prices are indicative MRPs for the listed pack sizes and change often — always verify on the pharmacy listing or pack. Links open marketplace searches; Naked Compound has no sponsorship or affiliate arrangement with any brand listed. Brand names are examples of what's commonly stocked, not endorsements.</p>
    </div>
  </section>

  <!-- Doctor band -->
  <section class="med-section">
    <div class="wrap">
      <div class="doctor-band glass">
        <h3>When to skip self-medication</h3>
        <p>Fever beyond 3 days, blood anywhere it shouldn't be, chest pain or breathlessness, severe abdominal pain, a child under 6, pregnancy, or symptoms bouncing back within a week — any of these means see a doctor the same day instead of reaching for this pack.</p>
      </div>
    </div>
  </section>

  <!-- Related + pager -->
  <section class="med-section">
    <div class="wrap">
      <p class="otc-kicker" style="margin-bottom:8px;">${esc(catLabel)}</p>
      <h2>Related medicines</h2>
      <div class="rel-grid">
        ${related.map(r => `<a class="rel-chip glass" href="/medicines/${r.slug}">${esc(r.name)} →</a>`).join("\n        ")}
      </div>
      <div class="med-pager">
        ${pager}
      </div>
      <a class="back-hub" href="${HUB_URL}">← All 14 OTC medicines</a>
    </div>
  </section>

  <!-- Disclaimer -->
  <section class="med-section">
    <div class="wrap">
      <div class="disc-box glass">
        <h4>Read this before you reach for anything</h4>
        <p>This page is an educational reference, not medical advice, a diagnosis, or a prescription. Doses shown are typical adult label doses for short-term self-care. Children, pregnant or breastfeeding women, the elderly, and anyone with chronic conditions or on regular medication should check with a doctor or pharmacist first. If symptoms are severe, unusual, or match any red flag above, skip the self-medication and see a doctor. Read how we work in our <a href="/pages/methodology">methodology</a>.</p>
      </div>
    </div>
  </section>

</main>

<div id="site-footer"></div>
<!-- nc-site.js only: script.js duplicates its theme-toggle handler, and
     loading both makes one click flip the theme twice (net no-op) -->
<script src="/nc-site.js"></script>
<script>
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var targets = document.querySelectorAll('.notice-band,.med-section h2,.use-chip,.benefit-list li,.side-box,.caution-list li,.brand-card,.buy-btn,.doctor-band,.rel-chip,.pager-link,.disc-box');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('in');
      io.unobserve(el);
      setTimeout(function(){ el.classList.remove('rv','in'); el.style.removeProperty('--d'); }, 900);
    });
  }, { threshold: 0.1 });
  var perParent = new Map();
  targets.forEach(function(el){
    var p = el.parentNode;
    var n = perParent.get(p) || 0;
    perParent.set(p, n + 1);
    el.classList.add('rv');
    el.style.setProperty('--d', Math.min(n, 6) * 0.07 + 's');
    io.observe(el);
  });
})();
</script>
</body>
</html>
`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const meds = DATA.medicines;
meds.forEach((med, i) => {
  const html = renderPage(med, i, meds);
  fs.writeFileSync(path.join(OUT_DIR, `${med.slug}.html`), html, "utf8");
  console.log(`✓ /medicines/${med.slug}`);
});
console.log(`\n${meds.length} medicine pages written to project/medicines/`);
console.log("Run: node scripts/update-sitemap.js (or just commit — pre-commit hook handles it)");
