/**
 * generate.js — Naked Compound ingredient page generator
 *
 * Reads next N ingredients from queue.json, calls the Anthropic API to
 * generate structured JSON content data, assembles full HTML pages using
 * the site template, writes files to project/pages/ingredients/, and
 * updates both queue.json and ingredients-data.js (url fields).
 *
 * Usage:
 *   node generate.js              # generate 3 pages (default)
 *   node generate.js --count 5    # generate 5 pages
 *   node generate.js --slug ashwagandha-ksm66  # specific slug
 *   node generate.js --dry-run    # show what would be built, don't write
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const QUEUE_FILE      = path.join(__dirname, 'queue.json');
const PROGRESS_FILE   = path.join(__dirname, 'progress.json');
const SKILL_FILE      = path.join(__dirname, 'SKILL.md');
const INGREDIENTS_JS  = path.join(ROOT, 'pages', 'ingredients.html');
const OUTPUT_DIR      = path.join(ROOT, 'pages', 'ingredients');
const API_URL         = 'https://api.anthropic.com/v1/messages';
const MODEL           = 'claude-sonnet-4-6';
const MAX_TOKENS      = 8000;

// ── ARGS ──────────────────────────────────────────────────────────────────────
const args     = process.argv.slice(2);
const COUNT    = parseInt(args[args.indexOf('--count')  + 1] || '3', 10);
const SLUG_ARG = args[args.indexOf('--slug') + 1] || null;
const DRY_RUN  = args.includes('--dry-run');

// ── HELPERS ───────────────────────────────────────────────────────────────────
function log(msg) { console.log(`[${new Date().toISOString()}] ${msg}`); }
function err(msg) { console.error(`[ERROR] ${msg}`); }

function readQueue() {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

function readProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return { built: [], failed: [] };
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function readSkill() {
  if (!fs.existsSync(SKILL_FILE)) {
    err('SKILL.md not found — copy it from /mnt/skills/user/nakedcompound-ingredient/SKILL.md');
    process.exit(1);
  }
  return fs.readFileSync(SKILL_FILE, 'utf8');
}

// Update url:'#' to url:'/pages/ingredients/{slug}' in ingredients.html
function updateIngredientUrl(slug) {
  if (!fs.existsSync(INGREDIENTS_JS)) {
    log(`  ⚠ ingredients.html not found — skipping URL update`);
    return;
  }
  let content = fs.readFileSync(INGREDIENTS_JS, 'utf8');
  const before = `slug:'${slug}',url:'#'`;
  const after  = `slug:'${slug}',url:'/pages/ingredients/${slug}'`;
  if (content.includes(before)) {
    content = content.replace(before, after);
    fs.writeFileSync(INGREDIENTS_JS, content);
    log(`  ✓ Updated url in ingredients.html for ${slug}`);
  } else {
    log(`  ⚠ Could not find slug '${slug}' with url:'#' in ingredients.html`);
  }
}

// ── SYSTEM PROMPT ─────────────────────────────────────────────────────────────
function buildSystemPrompt(skill) {
  return `You are an expert supplement researcher writing for Naked Compound (nakedcompound.in) — an evidence-driven Indian supplement research site. 

${skill}

CRITICAL OUTPUT RULES:
1. Respond with ONLY valid JSON — no markdown, no backticks, no explanation text.
2. The JSON must match the schema exactly as described in the user message.
3. All prose content should be detailed, clinical, and India-specific.
4. Every claim must reference a real, cited study.
5. All prices in ₹ (INR) from Amazon.in.
6. FSSAI regulatory status must be addressed.
7. India-specific context (diet, deficiency prevalence, brand availability) throughout.
8. Evidence tier labels: "strong" | "moderate" | "limited" for each claim type.`;
}

// ── USER PROMPT ───────────────────────────────────────────────────────────────
function buildUserPrompt(ingredient) {
  return `Generate a complete ingredient deep-dive page for: ${ingredient.name} (slug: ${ingredient.slug}, category: ${ingredient.cat})

Return ONLY a JSON object with this EXACT structure (no other text):

{
  "title": "Page title",
  "meta_description": "160 char max SEO description",
  "h1_main": "Display name",
  "h1_em": "subtitle/form name in italic",
  "lede": "2-3 sentence hero paragraph",
  "tags": [{"text": "tag text", "cls": "green|amber|red|default"}],
  "score": 7.6,
  "score_verdict": "2-3 sentence bottom line verdict",
  "rubric": [
    {"label": "Evidence quality", "score": 8.5, "reasoning": "2-3 sentences"},
    {"label": "Dosage confidence", "score": 7.0, "reasoning": "2-3 sentences"},
    {"label": "India market fit", "score": 8.0, "reasoning": "2-3 sentences"},
    {"label": "Safety profile", "score": 7.5, "reasoning": "2-3 sentences"},
    {"label": "Label accuracy (tested)", "score": 5.5, "reasoning": "2-3 sentences"}
  ],
  "stats": [
    {"num": "~80", "span": "%", "label": "stat description"}
  ],
  "what_is_it": "<p>HTML prose paragraphs 300-400 words with inline citation refs like [<a href='#ref-1'>1</a>]</p>",
  "callout_box": {"icon": "emoji", "title": "Callout title", "body": "<p>HTML prose</p>"},
  "mechanism_prose": "<p>HTML prose 300-400 words explaining the mechanism with pathway detail</p>",
  "svg_pathway": "Complete inline <svg viewBox='0 0 700 260' ... style='width:100%;height:auto;display:block;'>...</svg> showing the mechanism pathway with 4-5 labelled steps and arrows",
  "svg_caption": "Fig. 1 — one sentence description",
  "evidence_grade_label": "Evidence grade: A = large RCT/meta, low bias; B = small RCT/moderate bias; C = mechanistic/observational",
  "evidence_rows": [
    {
      "study": "Author et al. (Year) — Journal",
      "doi": "https://doi.org/...",
      "design": "Study design",
      "n": "sample size",
      "finding": "Key finding in 1-2 sentences",
      "grade": "a|b|c"
    }
  ],
  "evidence_summary": "<p>1-2 paragraph summary of the evidence body</p>",
  "dosage_callout": {"protocol": "Specific evidence-based protocol in bold", "detail": "<p>HTML prose</p>"},
  "dosage_prose": "<p>Additional dosage context and population-specific notes</p>",
  "compare_cards": [
    {
      "label": "This ingredient|Alternative name",
      "name": "Display name",
      "highlighted": true,
      "rows": [{"left": "metric", "right": "value"}]
    }
  ],
  "india_box": {
    "title": "Box headline",
    "stats": [
      {"val": "₹XXX", "label": "stat description"},
      {"val": "XX%", "label": "stat description"},
      {"val": "FSSAI ✓|✗", "label": "FSSAI regulatory context"}
    ],
    "prose": "<p>2-3 paragraphs India-specific context</p>"
  },
  "lab_cards": [
    {
      "source": "Lab/org name",
      "brand": "Product/category tested",
      "result": "Top-line result",
      "rows": [{"left": "metric", "right": "value"}],
      "note": "Additional context"
    }
  ],
  "brand_rows": [
    {
      "name": "Brand & Product",
      "price": "₹XXX/month",
      "spec": "Key spec value",
      "spec_cls": "val-good|val-ok|val-bad",
      "coa": "COA status",
      "coa_cls": "val-good|val-ok|val-bad",
      "take": "1-sentence verdict. <strong>Top pick.</strong> if applicable"
    }
  ],
  "condition_cards": [
    {
      "label": "Category label",
      "title": "Condition name",
      "body": "<p>2-3 sentences with citation</p>"
    }
  ],
  "together_cards": [
    {
      "name": "Ingredient name",
      "synergy": "High synergy|Moderate synergy",
      "synergy_cls": "synergy-high|synergy-mod",
      "body": "<p>2-3 sentences explaining the combination rationale with citation</p>"
    }
  ],
  "refs": [
    {
      "num": 1,
      "citation": "Author et al. Title. Journal. Year;vol:pages.",
      "doi": "https://doi.org/...",
      "doi_text": "doi:..."
    }
  ],
  "faq": [
    {"question": "FAQ question?", "answer": "2-3 sentence answer"},
    {"question": "FAQ question?", "answer": "2-3 sentence answer"},
    {"question": "FAQ question?", "answer": "2-3 sentence answer"}
  ]
}

Generate for: ${ingredient.name}
Category: ${ingredient.cat}
Slug: ${ingredient.slug}

Requirements:
- Minimum 8 evidence_rows (real studies with real DOIs)
- Minimum 4 brand_rows (Indian market brands, ₹ prices)
- Minimum 4 condition_cards
- Minimum 4 together_cards
- Minimum 3 compare_cards (this ingredient + 2 alternatives)
- Minimum 15 refs with DOIs
- Score is unweighted average of 5 rubric scores (1 decimal)
- All India-specific: ₹ prices, FSSAI status, local brands, Indian dietary context`;
}

// ── HTML ASSEMBLER ────────────────────────────────────────────────────────────
function assembleHTML(data, ingredient) {
  const { slug, cat }   = ingredient;
  const category_slug   = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const category_label  = cat;
  const canonical_url   = `https://www.nakedcompound.in/pages/ingredients/${slug}`;
  const amazon_url      = `https://www.amazon.in/s?k=${encodeURIComponent(data.h1_main)}&tag=nakedcompound-21`;

  const tagsHTML = (data.tags || []).map(t =>
    `<span class="meta-tag ${t.cls || ''}">${t.text}</span>`
  ).join('\n          ');

  const rubricMiniHTML = (data.rubric || []).map(r => {
    const pct = Math.round(r.score * 10);
    return `<div class="rubric-mini-row"><span class="rlabel">${r.label}</span><span class="rval">${r.score}/10</span></div>
          <div class="rbar-wrap"><div class="rbar-bg"><div class="rbar-fill" style="width:${pct}%"></div></div></div>`;
  }).join('\n          ');

  const statsHTML = (data.stats || []).map(s =>
    `<div class="stat-bignum"><div class="bnum">${s.num}<span>${s.span}</span></div><div class="blabel">${s.label}</div></div>`
  ).join('\n      ');

  const tocItems = [
    ['what-is-it', 'What is it?'],
    ['mechanism',  'How it works'],
    ['evidence',   'Clinical evidence'],
    ['dosage',     'Dosage & protocol'],
    ['vs-alternatives', 'Comparison'],
    ['india',      'India context'],
    ['lab-data',   'Lab data'],
    ['brands',     'Brand comparison'],
    ['conditions', 'Related conditions'],
    ['together',   'Taken together'],
    ['rubric',     'Scoring rubric'],
    ['refs',       'References'],
  ].map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('\n    ');

  const compareHTML = (data.compare_cards || []).map(c => {
    const rowsHTML = (c.rows || []).map(r =>
      `<div class="cc-row"><span>${r.left}</span><span>${r.right}</span></div>`
    ).join('\n      ');
    return `<div class="compare-card${c.highlighted ? ' highlighted' : ''}">
      <div class="cc-label">${c.label}</div>
      <div class="cc-name">${c.name}</div>
      ${rowsHTML}
    </div>`;
  }).join('\n    ');

  const indiaStatsHTML = (data.india_box?.stats || []).map(s =>
    `<div class="india-stat"><div class="stat-val">${s.val}</div><div class="stat-label">${s.label}</div></div>`
  ).join('\n          ');

  const labCardsHTML = (data.lab_cards || []).map(c => {
    const rowsHTML = (c.rows || []).map(r =>
      `<div class="lab-stat-row"><span>${r.left}</span><span>${r.right}</span></div>`
    ).join('\n      ');
    return `<div class="lab-card">
      <div class="lab-source">${c.source}</div>
      <div class="lab-brand">${c.brand}</div>
      <div class="lab-result">${c.result}</div>
      ${rowsHTML}
      <div class="lab-note" style="margin-top:10px;">${c.note || ''}</div>
    </div>`;
  }).join('\n    ');

  const brandRowsHTML = (data.brand_rows || []).map(r => `<tr>
      <td class="brand-name">${r.name}</td>
      <td>${r.price}</td>
      <td class="${r.spec_cls || ''}">${r.spec}</td>
      <td class="${r.coa_cls  || ''}">${r.coa}</td>
      <td>${r.take}</td>
    </tr>`).join('\n    ');

  const conditionsHTML = (data.condition_cards || []).map(c => `<div class="condition-card">
      <div class="cond-label">${c.label}</div>
      <h4>${c.title}</h4>
      ${c.body}
    </div>`).join('\n    ');

  const togetherHTML = (data.together_cards || []).map(c => `<div class="together-card">
      <div class="tc-head">
        <h4>${c.name}</h4>
        <span class="synergy-tag ${c.synergy_cls}">${c.synergy}</span>
      </div>
      ${c.body}
    </div>`).join('\n    ');

  const rubricFullHTML = (data.rubric || []).map((r, i) => {
    const pct = Math.round(r.score * 10);
    return `<div class="rubric-item">
      <div class="rubric-item-head">
        <h4>${i+1}. ${r.label}</h4>
        <div class="rubric-score-big">${r.score}<sub>/10</sub></div>
      </div>
      <div class="rubric-bar-wrap"><div class="rubric-bar-fill" style="width:${pct}%"></div></div>
      <p>${r.reasoning}</p>
    </div>`;
  }).join('\n    ');

  const evidenceRowsHTML = (data.evidence_rows || []).map(r => `<tr>
      <td class="study-name">${r.study}<br><a class="doi-link" href="${r.doi}" target="_blank" rel="noopener">${r.doi.replace('https://','')}</a></td>
      <td>${r.design}</td>
      <td>${r.n}</td>
      <td>${r.finding}</td>
      <td style="text-align:center;"><span class="grade-badge grade-${r.grade}">${r.grade.toUpperCase()}</span></td>
    </tr>`).join('\n    ');

  const refsHTML = (data.refs || []).map(r => `<li id="ref-${r.num}">
    <span class="ref-num">${r.num}</span>
    <div>${r.citation}${r.doi ? `<a class="doi" href="${r.doi}" target="_blank" rel="noopener">${r.doi_text || r.doi}</a>` : ''}</div>
  </li>`).join('\n  ');

  const faqSchema = (data.faq || []).map(f => `{
        "@type": "Question",
        "name": ${JSON.stringify(f.question)},
        "acceptedAnswer": {"@type": "Answer", "text": ${JSON.stringify(f.answer)}}
      }`).join(',\n      ');

  const schemaJSON = `{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": ${JSON.stringify(data.title)},
        "description": ${JSON.stringify(data.meta_description)},
        "url": ${JSON.stringify(canonical_url)},
        "datePublished": "${new Date().toISOString().slice(0,10)}",
        "dateModified": "${new Date().toISOString().slice(0,10)}",
        "author": {"@type": "Organization", "name": "Naked Compound Research Team", "url": "https://www.nakedcompound.in/pages/authors"},
        "publisher": {"@type": "Organization", "name": "Naked Compound", "url": "https://www.nakedcompound.in"}
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nakedcompound.in/"},
          {"@type": "ListItem", "position": 2, "name": "Ingredients", "item": "https://www.nakedcompound.in/pages/ingredients"},
          {"@type": "ListItem", "position": 3, "name": ${JSON.stringify(category_label)}, "item": "https://www.nakedcompound.in/pages/ingredients#cat-${category_slug}"},
          {"@type": "ListItem", "position": 4, "name": ${JSON.stringify(data.h1_main)}, "item": ${JSON.stringify(canonical_url)}}
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [${faqSchema}]
      }
    ]
  }`;

  // Callout box
  const calloutHTML = data.callout_box ? `<div class="callout">
      <div class="ico">${data.callout_box.icon}</div>
      <div><h4>${data.callout_box.title}</h4>${data.callout_box.body}</div>
    </div>` : '';

  // Dosage callout
  const dosageCalloutHTML = data.dosage_callout ? `<div class="callout">
      <div class="ico" style="background:var(--mint);color:#3a6040;">✓</div>
      <div><h4>Evidence-based protocol</h4><p><strong>${data.dosage_callout.protocol}</strong></p>${data.dosage_callout.detail}</div>
    </div>` : '';

  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${data.title} | Naked Compound</title>
  <meta name="description" content="${data.meta_description}" />
  <link rel="canonical" href="${canonical_url}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../style.css?v=3" />
  <link rel="stylesheet" href="../../pages.css" />
  <link rel="stylesheet" href="ingredient-shared.css" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23c96442'/%3E%3C/svg%3E" />
  <script>window.PAGE_KEY = 'ingredients';</script>
  <script type="application/ld+json">${schemaJSON}</script>
  <style>
    .author-byline{display:inline-flex;align-items:center;gap:10px;padding:10px 16px;background:var(--bg-elev);border:1px solid var(--line);border-radius:var(--r-pill);font-size:13.5px;color:var(--ink-soft);margin-top:var(--s-4);text-decoration:none;transition:border-color .15s,color .15s;}
    .author-byline:hover{border-color:var(--ink);color:var(--ink);}
    .ab-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--accent-soft),var(--butter));display:flex;align-items:center;justify-content:center;font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:15px;color:var(--accent-deep);flex:0 0 auto;}
    .ab-text span{display:block;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-muted);margin-top:1px;}
    .mobile-toc{display:none;margin-bottom:var(--s-5);}
    .mobile-toc summary{font-family:var(--font-mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft);cursor:pointer;padding:12px 16px;background:var(--bg-elev);border:1px solid var(--line);border-radius:var(--r-md);display:flex;align-items:center;justify-content:space-between;list-style:none;user-select:none;}
    .mobile-toc summary::-webkit-details-marker{display:none;}
    .mobile-toc summary::after{content:'↓';color:var(--ink-muted);font-size:13px;transition:transform .2s;}
    .mobile-toc[open] summary::after{transform:rotate(180deg);}
    .mobile-toc ul{margin:0;padding:8px 0;background:var(--bg-elev);border:1px solid var(--line);border-top:0;border-radius:0 0 var(--r-md) var(--r-md);list-style:none;}
    .mobile-toc ul li a{display:block;padding:9px 20px;font-size:13.5px;color:var(--ink-soft);text-decoration:none;border-left:2px solid transparent;transition:color .12s,border-color .12s;}
    .mobile-toc ul li a:hover{color:var(--accent);border-left-color:var(--accent);}
    .table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--line);border-radius:var(--r-lg);margin:var(--s-5) 0;}
    .table-scroll table{min-width:560px;}
    .compare-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s-4);margin:var(--s-5) 0;}
    .compare-card{border:1px solid var(--line);border-radius:var(--r-lg);padding:var(--s-5);background:var(--bg-elev);min-width:0;}
    .compare-card.highlighted{border-color:var(--accent);background:color-mix(in oklab,var(--accent-soft) 60%,var(--bg-elev));}
    .compare-card .cc-label{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:var(--s-2);}
    .compare-card .cc-name{font-family:var(--font-display);font-size:18px;font-weight:500;letter-spacing:-.02em;color:var(--ink);margin-bottom:var(--s-4);}
    .compare-card .cc-row{display:flex;justify-content:space-between;font-size:12px;padding:6px 0;border-bottom:1px solid var(--line);color:var(--ink-soft);gap:var(--s-2);}
    .compare-card .cc-row:last-child{border-bottom:0;}
    .compare-card .cc-row span:last-child{font-family:var(--font-mono);font-size:11.5px;color:var(--ink);font-weight:500;text-align:right;flex-shrink:0;}
    .together-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--s-4);margin:var(--s-5) 0;}
    .together-card{border:1px solid var(--line);border-radius:var(--r-lg);padding:var(--s-5);background:var(--bg-elev);display:flex;flex-direction:column;gap:var(--s-3);min-width:0;}
    .together-card .tc-head{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--s-2);flex-wrap:wrap;}
    .together-card h4{font-size:15px;font-weight:500;letter-spacing:-.01em;color:var(--ink);margin:0;}
    .synergy-tag{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;padding:3px 9px;border-radius:var(--r-pill);white-space:nowrap;flex-shrink:0;}
    .synergy-high{background:var(--mint);color:#3a6040;}
    .synergy-mod{background:var(--butter);color:#7a5c15;}
    .together-card p{font-size:13.5px;color:var(--ink-soft);line-height:1.55;margin:0;}
    .conditions-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--s-4);margin:var(--s-5) 0;}
    .condition-card{border:1px solid var(--line);border-radius:var(--r-lg);padding:var(--s-5);background:var(--bg-elev);min-width:0;}
    .condition-card .cond-label{font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:var(--s-2);}
    .condition-card h4{font-size:15px;font-weight:500;letter-spacing:-.01em;color:var(--ink);margin:0 0 var(--s-2);}
    .condition-card p{font-size:13px;color:var(--ink-soft);line-height:1.55;margin:0;}
    @media(max-width:700px){.mobile-toc{display:block;}.compare-grid,.together-grid,.conditions-grid{grid-template-columns:1fr;}}
  </style>
</head>
<body>
<div id="site-header"></div>
<main>

<section class="ing-hero">
  <div class="container">
    <div class="crumbs"><a href="/">Home</a><span class="sep">/</span><a href="/pages/ingredients">Ingredients</a><span class="sep">/</span><a href="/pages/ingredients#cat-${category_slug}">${category_label}</a><span class="sep">/</span><span>${data.h1_main}</span></div>
    <div class="ing-hero-grid">
      <div class="ing-hero-left">
        <div class="meta-row">${tagsHTML}</div>
        <h1>${data.h1_main}<br><em>${data.h1_em}</em></h1>
        <p class="lede">${data.lede}</p>
        <div class="meta-row" style="margin-bottom:var(--s-3);">
          <span class="meta-tag">Updated: ${new Date().toLocaleDateString('en-IN', {month:'long', year:'numeric'})}</span>
          <span class="meta-tag">${data.refs?.length || 15}+ citations</span>
        </div>
        <a href="/pages/authors" class="author-byline">
          <div class="ab-avatar">N</div>
          <div class="ab-text">Naked Compound Research Team<span>Reviewed by the full team · Authors page →</span></div>
        </a>
      </div>
      <aside class="score-card">
        <div class="score-label">Naked Compound Score</div>
        <div class="big-score">${data.score}</div>
        <div class="score-sub">out of 10 — across 5 rubric dimensions</div>
        <div class="rubric-mini">${rubricMiniHTML}</div>
        <p class="verdict"><strong>Bottom line:</strong> ${data.score_verdict}</p>
        <div class="score-cta">
          <a href="${amazon_url}" target="_blank" rel="nofollow noopener" class="btn btn-accent">View on Amazon.in →</a>
          <a href="/pages/protocols" class="btn btn-secondary">See supplement protocol</a>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="container" style="padding-top:var(--s-7);">
  <div class="stat-bignum-row reveal">${statsHTML}</div>
</section>

<div class="container">
<div class="article-layout">
  <aside class="article-toc">
    <div class="toc-label">On this page</div>
    <ul>${tocItems}</ul>
  </aside>
  <article class="prose" style="max-width:72ch;min-width:0;">

    <details class="mobile-toc">
      <summary>On this page</summary>
      <ul>${tocItems}</ul>
    </details>

    <h2 id="what-is-it">What is ${data.h1_main}?</h2>
    ${data.what_is_it}
    ${calloutHTML}

    <h2 id="mechanism">How ${data.h1_main} works</h2>
    ${data.mechanism_prose}
    <figure class="mechanism-wrap">
      ${data.svg_pathway}
      <figcaption>${data.svg_caption}</figcaption>
    </figure>

    <h2 id="evidence">Clinical evidence</h2>
    <p>${data.evidence_grade_label}</p>
    <div class="table-scroll">
      <table class="evidence-table" style="border-radius:0;">
        <thead><tr><th>Study</th><th>Design</th><th>n</th><th>Key finding</th><th style="text-align:center;">Grade</th></tr></thead>
        <tbody>${evidenceRowsHTML}</tbody>
      </table>
    </div>
    ${data.evidence_summary}

    <h2 id="dosage">Dosage and protocol</h2>
    ${dosageCalloutHTML}
    ${data.dosage_prose}

    <h2 id="vs-alternatives">Comparison</h2>
    <div class="compare-grid">${compareHTML}</div>

    <h2 id="india">India-specific context</h2>
    <div class="india-box">
      <div class="india-label">🇮🇳 India market data</div>
      <h3>${data.india_box?.title || 'India market context'}</h3>
      <div class="india-grid">${indiaStatsHTML}</div>
    </div>
    ${data.india_box?.prose || ''}

    <h2 id="lab-data">Third-party lab test data</h2>
    <div class="lab-grid">${labCardsHTML}</div>

    <h2 id="brands">Indian brand comparison</h2>
    <div class="table-scroll">
      <table class="brand-compare-table" style="min-width:640px;border-radius:0;">
        <thead><tr><th>Brand &amp; product</th><th>₹/month</th><th>Key spec</th><th>COA / purity</th><th>Our take</th></tr></thead>
        <tbody>${brandRowsHTML}</tbody>
      </table>
    </div>

    <h2 id="conditions">Related conditions</h2>
    <div class="conditions-grid">${conditionsHTML}</div>

    <h2 id="together">Commonly taken together</h2>
    <div class="together-grid">${togetherHTML}</div>

    <h2 id="rubric">Our scoring rubric — full breakdown</h2>
    <div class="rubric-full">${rubricFullHTML}</div>

    <h2 id="refs">References</h2>
    <ol class="ref-list">${refsHTML}</ol>

    <p style="font-size:13px;color:var(--ink-muted);border-top:1px solid var(--line);padding-top:var(--s-4);margin-top:var(--s-6);">
      <strong>Affiliate disclosure.</strong> Naked Compound participates in the Amazon Associates India affiliate programme. Some product links earn a small commission at no additional cost to you. Commission does not influence our scores, rankings, or conclusions.
      Full policy: <a href="/pages/conflicts-policy" style="color:var(--accent);">conflicts-policy</a>
    </p>

  </article>
</div>
</div>

<section class="newsletter"><div class="container newsletter-inner"><div>
  <h2>One email a week — new research, no sponsors.</h2>
  <p>New guides, updated ingredient reviews, and the single most interesting supplement study we read that week. No ads. Unsubscribe in one click.</p>
</div><div>
  <form class="newsletter-form" novalidate>
    <input type="email" placeholder="you@domain.in" aria-label="Email address" required />
    <button type="submit" class="btn btn-accent">Subscribe</button>
  </form>
  <p class="newsletter-meta">~12,800 Indian readers. Unsubscribe from every email in one click.</p>
</div></div></section>

</main>
<div id="site-footer"></div>
<script src="../../nc-site.js"></script>
<script>
  const tocSections=document.querySelectorAll('h2[id],h3[id]');
  const tocLinks=document.querySelectorAll('.article-toc a');
  const onScroll=()=>{let c='';tocSections.forEach(s=>{if(window.scrollY>=s.offsetTop-120)c=s.id;});tocLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+c));};
  window.addEventListener('scroll',onScroll,{passive:true});
  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){const obs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');obs.unobserve(x.target);}});},{threshold:0.1});reveals.forEach(r=>obs.observe(r));}
</script>
</body>
</html>`;
}

// ── API CALL ──────────────────────────────────────────────────────────────────
async function generateIngredientData(ingredient, skill) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY environment variable not set');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildSystemPrompt(skill),
      messages: [{ role: 'user', content: buildUserPrompt(ingredient) }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  const result = await response.json();
  const rawText = result.content[0]?.text || '';

  // Strip any accidental markdown fences
  const cleaned = rawText.replace(/^```json\s*/,'').replace(/```\s*$/,'').trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try to extract JSON from within the text
    const jsonMatch = cleaned.match(/\{[\s\S]+\}/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); }
      catch { /* fall through */ }
    }
    throw new Error(`JSON parse failed. Raw output length: ${rawText.length}. First 200 chars: ${rawText.slice(0,200)}`);
  }
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  log('=== Naked Compound Ingredient Generator ===');

  const skill    = readSkill();
  const queue    = readQueue();
  const progress = readProgress();

  if (queue.length === 0) {
    log('Queue is empty — all ingredient pages have been built!');
    return;
  }

  // Pick items to process
  let toProcess;
  if (SLUG_ARG) {
    const item = queue.find(i => i.slug === SLUG_ARG);
    if (!item) { err(`Slug '${SLUG_ARG}' not found in queue`); process.exit(1); }
    toProcess = [item];
  } else {
    toProcess = queue.slice(0, COUNT);
  }

  log(`Processing ${toProcess.length} ingredient(s): ${toProcess.map(i => i.slug).join(', ')}`);
  if (DRY_RUN) { log('DRY RUN — no files will be written'); return; }

  const results = { built: [], failed: [] };

  for (const ingredient of toProcess) {
    log(`\n→ Generating: ${ingredient.name} (${ingredient.slug})`);
    const startMs = Date.now();

    try {
      // Call Claude API
      log(`  Calling Claude API...`);
      const data = await generateIngredientData(ingredient, skill);
      log(`  ✓ Data received (${((Date.now()-startMs)/1000).toFixed(1)}s)`);

      // Assemble HTML
      const html = assembleHTML(data, ingredient);

      // Write file
      const outPath = path.join(OUTPUT_DIR, `${ingredient.slug}.html`);
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      fs.writeFileSync(outPath, html);
      log(`  ✓ Written: ${outPath} (${(html.length/1024).toFixed(1)} KB)`);

      // Update URL in ingredients.html
      updateIngredientUrl(ingredient.slug);

      results.built.push(ingredient.slug);
      progress.built.push({ slug: ingredient.slug, ts: new Date().toISOString() });

    } catch (e) {
      err(`Failed: ${ingredient.slug} — ${e.message}`);
      results.failed.push({ slug: ingredient.slug, error: e.message });
      progress.failed.push({ slug: ingredient.slug, error: e.message, ts: new Date().toISOString() });
    }

    // Rate limit: 2s between calls
    if (toProcess.indexOf(ingredient) < toProcess.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Remove successfully built items from queue
  const remaining = queue.filter(i => !results.built.includes(i.slug));
  saveQueue(remaining);
  saveProgress(progress);

  log(`\n=== Summary ===`);
  log(`Built:  ${results.built.length} pages — ${results.built.join(', ')}`);
  log(`Failed: ${results.failed.length} — ${results.failed.map(f => f.slug).join(', ')}`);
  log(`Queue remaining: ${remaining.length} of 312`);
}

main().catch(e => { err(e.message); process.exit(1); });
