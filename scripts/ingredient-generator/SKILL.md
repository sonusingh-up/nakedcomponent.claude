---
name: nakedcompound-ingredient
description: Build individual ingredient deep-dive pages for nakedcompound.in. Use this skill whenever the user asks to write, build, or create an ingredient page, ingredient review, ingredient deep-dive, or individual ingredient post for Naked Compound. Also triggers when the user says things like "write the ashwagandha page", "build the ingredient for X", "create a page for Y ingredient", or "next ingredient page". This skill encodes every site-specific rule that has been corrected in past sessions — always read it before writing a single line of HTML for any ingredient page.
---

# Naked Compound — Ingredient Page Skill

Builds a fully production-ready individual ingredient HTML page for nakedcompound.in, matching the site's exact design system, component patterns, and editorial standards. Every rule here was learned from real corrections — do not skip any of them.

---

## File location and path structure

The finished file goes into:
```
project/pages/ingredients/{slug}.html
```

All asset paths from that location:
```html
<link rel="stylesheet" href="../../style.css?v=3" />
<link rel="stylesheet" href="../../pages.css" />
<link rel="stylesheet" href="ingredient-shared.css" />
<script src="../../nc-site.js"></script>
```

`ingredient-shared.css` lives in the same directory as the ingredient HTML files (`project/pages/ingredients/`). It already defines all core ingredient-page components — do not redefine them inline.

---

## Required `<head>` elements (in this order)

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{Ingredient Name} — Evidence Deep-Dive | Naked Compound</title>
<meta name="description" content="..." />
<link rel="canonical" href="https://www.nakedcompound.in/pages/ingredients/{slug}" />
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<!-- Stylesheets -->
<link rel="stylesheet" href="../../style.css?v=3" />
<link rel="stylesheet" href="../../pages.css" />
<link rel="stylesheet" href="ingredient-shared.css" />
<link rel="icon" href="data:image/svg+xml,..." />
<script>window.PAGE_KEY = 'ingredients';</script>
<!-- JSON-LD (see Schema section below) -->
<!-- Page-specific <style> block (see CSS section below) -->
```

**Canonical tag is mandatory on every page.** Never omit it.

---

## Author component — exact markup, no variation

Every ingredient page uses this exact author byline, placed inside `.ing-hero-left`, after the meta-row chips:

```html
<a href="/pages/authors" class="author-byline">
  <div class="ab-avatar">N</div>
  <div class="ab-text">
    Naked Compound Research Team
    <span>Reviewed by the full team · Authors page →</span>
  </div>
</a>
```

The CSS for this component must be in the page `<style>` block:

```css
.author-byline {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 10px 16px;
  background: var(--bg-elev); border: 1px solid var(--line);
  border-radius: var(--r-pill);
  font-size: 13.5px; color: var(--ink-soft);
  margin-top: var(--s-4); text-decoration: none;
  transition: border-color .15s, color .15s;
}
.author-byline:hover { border-color: var(--ink); color: var(--ink); }
.ab-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-soft), var(--butter));
  display: flex; align-items: center; justify-content: center;
  font-family: "Instrument Serif", Georgia, serif;
  font-style: italic; font-size: 15px;
  color: var(--accent-deep); flex: 0 0 auto;
}
.ab-text span {
  display: block; font-family: var(--font-mono);
  font-size: 10.5px; letter-spacing: .08em;
  text-transform: uppercase; color: var(--ink-muted); margin-top: 1px;
}
```

**Never use a custom author box, author bio section, or any other author component.** This is the only one on the site.

---

## Disclaimer — do NOT add one

The site footer already contains the disclaimer. Do not add any standalone disclaimer box, disclaimer section, or disclaimer callout to ingredient pages. The only disclaimer-adjacent text allowed is a one-line affiliate disclosure at the very bottom of the article prose:

```html
<p style="font-size:13px;color:var(--ink-muted);border-top:1px solid var(--line);padding-top:var(--s-4);margin-top:var(--s-6);">
  <strong>Affiliate disclosure.</strong> Naked Compound participates in the Amazon Associates India affiliate programme. Some product links earn a small commission at no additional cost to you. Commission does not influence our scores, rankings, or conclusions. Full policy: <a href="/pages/conflicts-policy" style="color:var(--accent);">conflicts-policy</a>
</p>
```

---

## Mobile — mandatory rules (learned from corrections)

### 1. Collapsible mobile TOC

The desktop sidebar TOC (`article-toc`) is already hidden on mobile by `ingredient-shared.css`. You must also add a collapsible TOC using native `<details>` placed as the **FIRST element inside `<article>`** — before any prose, before any `<h2>`, before everything:

```html
<details class="mobile-toc">
  <summary>On this page</summary>
  <ul>
    <li><a href="#section-id">Section name</a></li>
    <!-- repeat for all h2 sections -->
  </ul>
</details>
```

CSS (in page `<style>` block):

```css
.mobile-toc { display: none; margin-bottom: var(--s-5); }
.mobile-toc summary {
  font-family: var(--font-mono); font-size: 12px;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ink-soft); cursor: pointer;
  padding: 12px 16px;
  background: var(--bg-elev); border: 1px solid var(--line);
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: space-between;
  list-style: none; user-select: none;
}
.mobile-toc summary::-webkit-details-marker { display: none; }
.mobile-toc summary::after { content: '↓'; color: var(--ink-muted); font-size: 13px; transition: transform .2s; }
.mobile-toc[open] summary::after { transform: rotate(180deg); }
.mobile-toc ul {
  margin: 0; padding: 8px 0;
  background: var(--bg-elev);
  border: 1px solid var(--line); border-top: 0;
  border-radius: 0 0 var(--r-md) var(--r-md);
  list-style: none;
}
.mobile-toc ul li a {
  display: block; padding: 9px 20px;
  font-size: 13.5px; color: var(--ink-soft);
  text-decoration: none; border-left: 2px solid transparent;
  transition: color .12s, border-color .12s;
}
.mobile-toc ul li a:hover { color: var(--accent); border-left-color: var(--accent); }
@media (max-width: 700px) { .mobile-toc { display: block; } }
```

### 2. Tables — always wrapped for horizontal scroll

Every `<table>` must be inside a `.table-scroll` wrapper:

```html
<div class="table-scroll">
  <table class="evidence-table" style="border-radius:0;">
    ...
  </table>
</div>
```

```css
.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  margin: var(--s-5) 0;
}
.table-scroll table { min-width: 560px; }
```

Also add `style="border-radius:0;"` to any table inside `.table-scroll` to avoid double-rounded corners.

### 3. SVG diagrams — prevent overflow

Every inline SVG must have:

```html
<svg viewBox="0 0 700 260" style="width:100%;height:auto;display:block;">
```

Never use `width="700"` or `height="260"` as fixed attributes on inline SVGs.

### 4. Prevent CSS grid blowout

Add `min-width:0` to:
- The `<article>` element: `style="max-width:72ch; min-width:0;"`
- Every custom grid card class (`.compare-card`, `.together-card`, `.condition-card`, etc.)

### 5. Grid collapse breakpoints

All custom multi-column grids collapse to 1 column at 700px:

```css
@media (max-width: 700px) {
  .compare-grid    { grid-template-columns: 1fr; }
  .together-grid   { grid-template-columns: 1fr; }
  .conditions-grid { grid-template-columns: 1fr; }
  /* add any other custom grids here */
}
```

---

## JSON-LD Schema — required on every page

Include all three types in a single `<script type="application/ld+json">` block:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "{Ingredient Name} — Evidence Deep-Dive",
      "description": "...",
      "url": "https://www.nakedcompound.in/pages/ingredients/{slug}",
      "datePublished": "YYYY-MM-DD",
      "dateModified": "YYYY-MM-DD",
      "author": {
        "@type": "Organization",
        "name": "Naked Compound Research Team",
        "url": "https://www.nakedcompound.in/pages/authors"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Naked Compound",
        "url": "https://www.nakedcompound.in"
      },
      "mainEntityOfPage": "https://www.nakedcompound.in/pages/ingredients/{slug}"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nakedcompound.in/" },
        { "@type": "ListItem", "position": 2, "name": "Ingredients", "item": "https://www.nakedcompound.in/pages/ingredients" },
        { "@type": "ListItem", "position": 3, "name": "{Category}", "item": "https://www.nakedcompound.in/pages/ingredients#cat-{category-slug}" },
        { "@type": "ListItem", "position": 4, "name": "{Ingredient Name}", "item": "https://www.nakedcompound.in/pages/ingredients/{slug}" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "...",
          "acceptedAnswer": { "@type": "Answer", "text": "..." }
        }
        // 4–5 FAQs covering: what it is, how much to take, India-specific context, safety, and one product/quality question
      ]
    }
  ]
}
```

---

## Page structure (exact order)

```
<div id="site-header"></div>
<main>
  1. <section class="ing-hero"> — hero with score card
  2. <section> — stat-bignum-row (4 key numbers)
  3. <div class="container">
       <div class="article-layout">  ← desktop TOC sidebar + article
         <aside class="article-toc"> ← desktop only (hidden on mobile by ingredient-shared.css)
         <article class="prose" style="max-width:72ch; min-width:0;">
           <details class="mobile-toc"> ← FIRST element in article
           [all article sections]
           [affiliate disclosure one-liner]
         </article>
       </div>
  4. <section class="newsletter">
</main>
<div id="site-footer"></div>
<script src="../../nc-site.js"></script>
<script> [TOC scroll highlight + reveal observer] </script>
```

---

## Hero section components

### Meta tags (`.meta-tag` pills)
Use the correct colour class for each:
- `green` → evidence grade A, FSSAI Permitted, high availability
- `amber` → moderate caution, moderate availability, evidence grade B
- `red` → flagged safety concern, low availability, banned status

### Score card
Always sticky on desktop (already in `ingredient-shared.css`). Five rubric bars. Verdict paragraph. Two CTAs: Amazon.in affiliate link + internal protocol/research link.

Amazon affiliate link format:
```
https://www.amazon.in/s?k={url-encoded-ingredient-name}&tag=nakedcompound-21
```

---

## Required article sections (all mandatory)

| Section | id | Notes |
|---|---|---|
| What is it? | `#what-is-it` | Definition, manufacturing/sourcing, India market context |
| How it works | `#mechanism` | Full mTORC1/pathway detail + inline SVG diagram |
| Clinical evidence | `#evidence` | Table with Grade A/B/C badges, DOI links |
| Dosage & protocol | `#dosage` | Callout box with exact protocol, population-specific notes |
| Comparison | `#vs-[alternatives]` | Compare-grid cards against 2–3 alternatives |
| India context | `#india` | `india-box` component + FSSAI status + price per unit + adulteration/quality notes |
| Lab test data | `#lab-data` | `lab-grid` (3 cards): Labdoor/international + Informed Sport + India-specific |
| Brand comparison | `#brands` | Brand table with ₹ pricing, COA status, our take |
| Related conditions | `#conditions` | `conditions-grid` (2-col, 4 cards minimum) |
| Commonly taken together | `#together` | `together-grid` (2-col, 4 cards) with synergy tags |
| Scoring rubric | `#rubric` | `rubric-full` — all 5 dimensions with scores and reasoning |
| References | `#refs` | `ref-list` with inline `<span class="ref-num">` and DOI links |

---

## Evidence table — grades and format

```html
<div class="table-scroll">
  <table class="evidence-table" style="border-radius:0;">
    <thead>
      <tr>
        <th>Study</th><th>Design</th><th>n</th><th>Key finding</th>
        <th style="text-align:center;">Grade</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="study-name">
          Author et al. (Year)<br>
          <a class="doi-link" href="https://doi.org/..." target="_blank" rel="noopener">doi:...</a>
        </td>
        <td>Meta-analysis, N RCTs</td>
        <td>n=X</td>
        <td>Key finding in one sentence.</td>
        <td style="text-align:center;"><span class="grade-badge grade-a">A</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

Grade criteria:
- **A** (`grade-a`) — large RCT (n>100) or meta-analysis, low bias risk, peer-reviewed
- **B** (`grade-b`) — small RCT, moderate bias risk, or single study
- **C** (`grade-c`) — mechanistic, observational, or in vitro only

Always include 6–10 studies. Flag industry-sponsored studies with "(industry-funded)" in the study cell.

---

## India context box — mandatory

```html
<div class="india-box">
  <div class="india-label">🇮🇳 India market data</div>
  <h3>[Headline about price/regulation/market context]</h3>
  <div class="india-grid">
    <div class="india-stat">
      <div class="stat-val">[₹ price or % stat]</div>
      <div class="stat-label">[1–2 lines of context]</div>
    </div>
    <div class="india-stat">...</div>
    <div class="india-stat">
      <div class="stat-val">FSSAI ✓ / ✗</div>
      <div class="stat-label">Schedule II / III status and relevant regulatory note</div>
    </div>
  </div>
</div>
```

Always include:
- INR price range (Amazon.in, with month and year)
- India-specific prevalence, dietary, or demographic stat relevant to the ingredient
- FSSAI Schedule II or III status + one-line regulatory note

---

## Brand comparison table

```html
<div class="table-scroll">
  <table class="brand-compare-table" style="min-width:640px; border-radius:0;">
    <thead>
      <tr>
        <th>Brand &amp; product</th>
        <th>₹/unit</th>
        <th>[Key spec, e.g. Protein/100g or Purity]</th>
        <th>COA / purity</th>
        <th>Our take</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="brand-name">Brand Name</td>
        <td>₹XXX</td>
        <td class="val-good">XX g / XX%</td>   <!-- val-good / val-ok / val-bad -->
        <td class="val-good">NABL COA published</td>
        <td>One-sentence verdict. <strong>Top pick.</strong> if applicable.</td>
      </tr>
    </tbody>
  </table>
</div>
```

COA status values: `val-good` = COA published from accredited lab; `val-ok` = partial/not batch-level; `val-bad` = no public COA.

Include 4–6 Indian brands. Always mention whether NABL-accredited COA is published. Flag counterfeit risk for imported products.

---

## Synergy tags for "Taken together" cards

```html
<span class="synergy-tag synergy-high">High synergy</span>
<span class="synergy-tag synergy-mod">Moderate synergy</span>
```

CSS:
```css
.synergy-tag {
  font-family: var(--font-mono); font-size: 10px;
  letter-spacing: .1em; text-transform: uppercase;
  padding: 3px 9px; border-radius: var(--r-pill); white-space: nowrap; flex-shrink: 0;
}
.synergy-high { background: var(--mint); color: #3a6040; }
.synergy-mod  { background: var(--butter); color: #7a5c15; }
```

---

## Scoring rubric — 5 fixed dimensions

Always score these exact five dimensions, in this order, each with a `rubric-item` card:

1. **Evidence quality** — RCT depth, meta-analysis support, ISSN/regulatory recognition
2. **Dosage confidence** — How well-established is the effective dose range
3. **India market fit** — Availability, price-per-dose in ₹, FSSAI status, vegetarian/dietary context
4. **Safety profile** — Adverse event record, contraindications, India-specific safety risks
5. **Label accuracy (tested products)** — COA availability, known adulteration issues, testing method quality

Overall score = unweighted average of all five. Display in the score card as one decimal (e.g., 7.6).

```html
<div class="rubric-item">
  <div class="rubric-item-head">
    <h4>[1–5]. [Dimension name]</h4>
    <div class="rubric-score-big">X.X<sub>/10</sub></div>
  </div>
  <div class="rubric-bar-wrap"><div class="rubric-bar-fill" style="width:[score×10]%"></div></div>
  <p>[2–4 sentences of precise reasoning with inline citation refs]</p>
</div>
```

---

## Mechanism SVG — required diagram

Every page needs an inline SVG pathway diagram in a `<figure class="mechanism-wrap">`. Required attributes:

```html
<figure class="mechanism-wrap">
  <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg"
       style="width:100%;height:auto;display:block;">
    <!-- 4–5 step boxes connected by arrows -->
    <!-- Use JetBrains Mono for all text labels -->
    <!-- Colour palette: #f4e2d8 / #d8e6d5 / #d7e3ec / #f7f3ec for box fills -->
    <!-- Arrow colour: #c96442 (accent) -->
  </svg>
  <figcaption>Fig. 1 — [One sentence describing the pathway]</figcaption>
</figure>
```

The SVG must be responsive (`width:100%; height:auto`) — never fixed pixel dimensions.

---

## Content standards

### Word count
3,000–4,000 words of prose (not counting table cell text or references).

### Citation style
- Every factual claim has an inline ref: `[<a href="#ref-N">N</a>]`
- Real study citations: Author et al. (Year), Journal
- Note industry-sponsored studies explicitly
- 15–20 references minimum, all with DOI links
- Reference list uses `<ol class="ref-list">` with `<span class="ref-num">` and `.doi` link

### Evidence tiers (flag in prose when you use each)
- RCT → strongest; always prefer over lower tiers
- Meta-analysis → flag n of pooled studies
- Observational → note limitations
- In vitro / animal → clearly flagged as mechanistic only, not clinical

### India-first framing (mandatory throughout)
- All prices in ₹ (Amazon.in, dated)
- FSSAI Schedule II/III status for every ingredient
- Vegetarian/vegan context where relevant (India's ~40% vegetarian population)
- Reference Indian cities, dietary patterns (dal, roti, paneer, curd), Indian brands
- Iron/B12/Vitamin D deficiency prevalence from NFHS-5 where applicable
- Phytate inhibition of zinc/iron absorption in cereal-heavy Indian diets
- Lactose intolerance prevalence (~30% India) for dairy-derived supplements
- Flag ALA-only "omega-3" products, generic vs patented extracts

### Callout boxes
Use the site's `.callout` component for 2–4 key asides:
```html
<div class="callout">
  <div class="ico">[emoji]</div>
  <div>
    <h4>[Short title]</h4>
    <p>[2–3 sentences]</p>
  </div>
</div>
```

Use `style="background:var(--mint);color:#3a6040;"` on `.ico` for positive/evidence callouts.

---

## JavaScript footer (required)

```html
<script src="../../nc-site.js"></script>
<script>
  /* Active TOC highlight on scroll */
  const tocSections = document.querySelectorAll('h2[id], h3[id]');
  const tocLinks    = document.querySelectorAll('.article-toc a');
  const onScroll = () => {
    let current = '';
    tocSections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    tocLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Reveal animation */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }});
    }, { threshold: 0.1 });
    reveals.forEach(r => obs.observe(r));
  }
</script>
```

---

## Pre-flight checklist — verify before delivering any ingredient page

- [ ] `<link rel="canonical">` present with full URL
- [ ] Author byline uses `.author-byline` / `.ab-avatar` / `.ab-text` exactly
- [ ] No standalone disclaimer box anywhere
- [ ] `<details class="mobile-toc">` is first element inside `<article>`
- [ ] All tables inside `.table-scroll` wrapper with `border-radius:0` on table
- [ ] All inline SVGs: `style="width:100%;height:auto;display:block;"`
- [ ] `<article>` has `min-width:0`
- [ ] All custom grid cards have `min-width:0`
- [ ] Custom grids collapse to `1fr` at `max-width: 700px`
- [ ] JSON-LD has Article + BreadcrumbList + FAQPage
- [ ] `ingredient-shared.css` linked (not its styles inlined)
- [ ] All 10 mandatory article sections present with correct `id` attributes
- [ ] FSSAI status mentioned in India context box
- [ ] All prices in ₹ with Amazon.in source and month/year
- [ ] 15–20 references with DOI links
- [ ] Affiliate disclosure one-liner at bottom of prose
- [ ] `window.PAGE_KEY = 'ingredients'` in head script
- [ ] Newsletter section present before `</main>`
