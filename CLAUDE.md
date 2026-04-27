# Naked Compound — Claude Code Rules

This file is read automatically by Claude Code before every task.
Follow every rule here without being asked. Never skip them.

---

## 1. Tech stack

- **Static HTML/CSS/JS site** — no framework, no build step.
- Deployed on **Vercel** with `cleanUrls: true` and `trailingSlash: false`.
- This means the file path = the URL. `project/ingredients/creatine-monohydrate.html` → `https://nakedcompound.in/ingredients/creatine-monohydrate`
- Output directory is `project/`. All content lives there.

---

## 2. URL & slug rules — apply every time you create or rename a file

### 2a. Slug generation (automatic — never ask the user to type a slug)

When the user gives you a page title, generate the slug yourself using these rules:

1. Lowercase everything.
2. Replace spaces and special characters with hyphens (`-`).
3. Remove stop words: `a`, `an`, `the`, `and`, `or`, `but`, `in`, `on`, `at`, `to`, `for`, `of`, `with`, `by`, `from`, `is`, `was`, `are`.
4. Remove any character that is not `a-z`, `0-9`, or `-`.
5. Collapse multiple hyphens into one.
6. Strip leading and trailing hyphens.
7. Keep the slug **under 50 characters**. If it's longer, drop words from the right until it fits, but never cut a word mid-syllable.
8. Never include dates, years, or version numbers in slugs.

**Examples:**
```
"The Complete Guide to Whey Protein in India"
→ complete-guide-whey-protein-india          ✓

"Should you really 'load' creatine? A look at 27 trials"
→ creatine-loading-trials                    ✓

"MuscleBlaze Biozyme Whey — Re-review (March 2026)"
→ muscleblaze-biozyme-whey                   ✓

"Ashwagandha KSM-66 vs Sensoril: Which is better?"
→ ashwagandha-ksm66-vs-sensoril              ✓
```

### 2b. Content type → folder mapping

| Content type           | Folder                          | Example URL                                    |
|------------------------|---------------------------------|------------------------------------------------|
| Ingredient deep-dives  | `project/ingredients/`          | `/ingredients/creatine-monohydrate`            |
| Research / long reads  | `project/research/`             | `/research/creatine-loading-trials`            |
| Product reviews        | `project/reviews/`              | `/reviews/muscleblaze-biozyme-whey`            |
| Protocols              | `project/protocols/`            | `/protocols/sleep-stack`                       |
| Guides                 | `project/guides/`               | `/guides/whey-protein-india`                   |
| Blog posts             | `project/blog/`                 | `/blog/shelf-survey-2026`                      |
| Static / utility pages | `project/pages/`                | `/pages/about`, `/pages/contact`               |

> **Never** put content pages inside `project/pages/`. That folder is for static utility pages only (about, contact, privacy, terms, etc.). Content always goes in its own typed folder.

### 2c. Canonical tag — required on every HTML page

Every HTML `<head>` must include a self-referencing canonical:

```html
<link rel="canonical" href="https://nakedcompound.in/FULL-PATH-HERE" />
```

Use the clean URL (no `.html`, no trailing slash). Example:
```html
<link rel="canonical" href="https://nakedcompound.in/ingredients/creatine-monohydrate" />
```

### 2d. `<title>` tag format

```
{Page Title} — Naked Compound
```

Keep the title under 60 characters total (including " — Naked Compound"). Trim the page title if needed.

### 2e. Breadcrumb `<script type="application/ld+json">` — required on content pages

Every ingredient, research, guide, review, protocol, and blog page must include:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home",        "item": "https://nakedcompound.in/" },
    { "@type": "ListItem", "position": 2, "name": "{Category}",  "item": "https://nakedcompound.in/{category}/" },
    { "@type": "ListItem", "position": 3, "name": "{Page Title}","item": "https://nakedcompound.in/{category}/{slug}" }
  ]
}
</script>
```

---

## 3. Sitemap — never edit manually, always run the script

**`project/sitemap.xml` is auto-generated. Do not hand-edit it.**

Run this after any of the following:
- Creating a new page
- Renaming or deleting a page
- Updating content on an existing page
- Finishing a coding session

```bash
node scripts/update-sitemap.js
```

The script scans every `.html` file in `project/`, derives the clean URL (using the same logic Vercel uses with `cleanUrls: true`), assigns the correct `<priority>` and `<changefreq>` by URL pattern, and rebuilds the file from scratch. It also reads `<link rel="canonical">` from pages that have one and uses that URL instead of deriving from the path.

**This also runs automatically:**
- On every `git commit` via `.githooks/pre-commit`
- On every Vercel deploy via `vercel.json` `buildCommand`

So in practice you rarely need to run it manually — committing is enough.

If you add a new content type that doesn't match any existing rule, add a rule to the `ROUTE_RULES` array in `scripts/update-sitemap.js`.

---

## 4. RSS feed — update for content pages

File: `project/feed.xml`

When creating any ingredient, research, guide, review, protocol, or blog page, **prepend** a new `<item>` block inside `<channel>`, after the existing `<item>` elements. Use `pubDate` in RFC-822 format (`Mon, 27 Apr 2026 08:00:00 +0530`).

```xml
<item>
  <title>{Page Title}</title>
  <link>https://nakedcompound.in/{type}/{slug}</link>
  <guid isPermaLink="true">https://nakedcompound.in/{type}/{slug}</guid>
  <pubDate>Mon, 27 Apr 2026 08:00:00 +0530</pubDate>
  <category>{Category}</category>
  <description>{Meta description — 1–2 sentences, under 160 chars}</description>
</item>
```

Also update `<lastBuildDate>` in the `<channel>` header to today's date.

---

## 5. CSS/JS paths — depth-aware

Because content folders are at different depths from `project/`, use the right relative path:

| File location                            | CSS/JS path           |
|------------------------------------------|-----------------------|
| `project/ingredients/slug.html`          | `../style.css`        |
| `project/research/slug.html`             | `../style.css`        |
| `project/guides/slug.html`               | `../style.css`        |
| `project/pages/about.html`               | `../style.css`        |

Or use root-relative paths (always safe): `/style.css`, `/pages.css`, `/script.js`

---

## 6. New page checklist — run through this every time

When the user asks you to create any new page:

- [ ] Generate the slug from the title using rule 2a
- [ ] Identify content type → pick the correct folder from rule 2b
- [ ] Write the HTML file with correct `<title>`, `<meta name="description">`, `<link rel="canonical">`
- [ ] Add breadcrumb JSON-LD (rule 2e)
- [ ] Add the entry to `project/sitemap.xml` by running `node scripts/update-sitemap.js`
- [ ] If it's a content page: add the entry to `project/feed.xml`
- [ ] Confirm the final URL to the user in the format: `✓ URL: https://nakedcompound.in/{type}/{slug}`

---

## 7. Never do these things

- Never put a year or date in a slug.
- Never use underscores in file names or slugs.
- Never create a file named `index.html` inside a content folder (that breaks cleanUrls routing).
- Never omit the canonical tag.
- Never forget to update `sitemap.xml`.
- Never place content pages under `project/pages/`.
- Never use uppercase letters in file names or folder names.

---

## 8. Quick-reference: scaffold command

If the user asks you to scaffold a new page, you can run:

```bash
node scripts/new-page.js --type ingredient --title "Beta Alanine"
```

This creates the file at the right path, prints the final URL, and updates sitemap + feed automatically. See `scripts/new-page.js` for full usage.
