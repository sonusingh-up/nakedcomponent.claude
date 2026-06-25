# Naked Compound — Article Publishing Workflow

## ✓ Issue Resolved

**Problem:** When publishing new articles, the sitemap would re-generate with today's date for ALL articles, making old articles appear "recently modified" when they weren't.

**Solution:** New articles now have a frozen `<meta name="published">` tag. Old articles use `git log` to track real edits. Both approaches work together perfectly.

---

## Publishing a New Article — Start to Finish

### Step 1: Create the article file

```bash
# Basic usage (today's date)
node scripts/new-page.js --type ingredient --title "Creatine Monohydrate"

# Or backdate if publishing old content
node scripts/new-page.js --type research --title "2023 Study Revisited" --date 2026-04-15
```

**What this does:**
- ✓ Creates `project/ingredients/creatine-monohydrate.html` (or relevant folder)
- ✓ Adds `<meta name="published" content="2026-04-29">` to the `<head>`
- ✓ Adds `<meta name="modified" content="2026-04-29">` to the `<head>`
- ✓ Creates `<meta name="description">` TODO placeholder
- ✓ Creates breadcrumb JSON-LD structure
- ✓ Updates `project/sitemap.xml`
- ✓ Updates `project/feed.xml`
- ✓ Prints the final live URL

### Step 2: Edit the article

Replace the TODO placeholders:
1. `<meta name="description">` — write a 140–160 char summary
2. `<meta name="modified">` — leave as-is if you're just publishing; update to today if you edit it weeks later
3. Page content inside `<main>`
4. Feed description in `project/feed.xml`

### Step 3: Commit and push

```bash
git add -A
git commit -m "feat: add ingredient — creatine-monohydrate"
git push
```

**What happens automatically:**
- ✓ Pre-commit hook runs `node scripts/update-sitemap.js`
- ✓ Sitemap re-generates with correct dates
- ✓ Your new article's `<lastmod>` comes from `<meta name="published">`
- ✓ All old articles keep their original publish dates
- ✓ Vercel deploys the updated site

---

## How the Date System Works

### For NEW articles (published today):

```html
<head>
  <meta name="published" content="2026-04-29" />
  <meta name="modified" content="2026-04-29" />
</head>
```

Sitemap will show:
```xml
<url>
  <loc>https://www.nakedcompound.in/ingredients/creatine-monohydrate</loc>
  <lastmod>2026-04-29</lastmod>
  ...
</url>
```

**If you run the sitemap script tomorrow:** Still shows `2026-04-29` (frozen).

---

### For OLD articles (published weeks ago):

If you edit a previously published article (typo fix, content update):

```bash
# Edit the file
# Update <meta name="modified"> to today if it's a substantial change
# Commit
git commit -m "fix: update creatine article with new study"
```

Sitemap will show:
```xml
<url>
  <loc>https://www.nakedcompound.in/ingredients/creatine-monohydrate</loc>
  <lastmod>2026-04-29</lastmod>
  ...
</url>
```

But if the article was edited **after** the original publish date:

```xml
<url>
  <loc>https://www.nakedcompound.in/ingredients/creatine-monohydrate</loc>
  <lastmod>2026-05-15</lastmod>  <!-- Updated to git log commit date -->
  ...
</url>
```

---

## The Priority Order (Inside update-sitemap.js)

When the script regenerates the sitemap, it checks lastmod in this order:

1. **`<meta name="published">`** if present → USE THIS (for new articles, frozen date)
2. **git log -1** if file was committed → USE THIS (tracks real edits)
3. **fs.stat mtime** as fallback → USE THIS (uncommitted new file)

---

## Examples

### Example 1: Publish new article today

```bash
node scripts/new-page.js --type ingredient --title "L-Theanine"
# Creates file with <meta name="published" content="2026-04-29">
# Sitemap shows lastmod=2026-04-29

# ... 30 days pass, you don't touch the file ...

node scripts/update-sitemap.js
# Sitemap still shows lastmod=2026-04-29 ✓
```

### Example 2: Publish old research, backdate it

```bash
node scripts/new-page.js --type research --title "2024 Study on Magnesium" --date 2026-04-01
# Creates file with <meta name="published" content="2026-04-01">
# Sitemap shows lastmod=2026-04-01 (not today)

# Looks like the article was published on April 1st ✓
```

### Example 3: Edit an article weeks later

```bash
# Created 2026-04-29, published with <meta name="published" content="2026-04-29">
# Today is 2026-05-15, you found a typo and edited the file

git commit -m "fix: typo in creatine article"
# Pre-commit hook runs update-sitemap.js
# Git log shows: 2026-05-15 (last commit)
# Sitemap now shows lastmod=2026-05-15 ✓
# The <meta name="published"> stays 2026-04-29 (publish date didn't change)
```

---

## What Changed (Technical)

### `scripts/new-page.js` improvements:
- ✓ Now writes `<meta name="published" content="YYYY-MM-DD">` to every new article
- ✓ Added `--date` flag for backdating
- ✓ Still does everything else (slug generation, feed update, sitemap add)

### `scripts/update-sitemap.js` improvements:
- ✓ Reads `<meta name="published">` first (new articles)
- ✓ Falls back to `git log -1` (real edits)
- ✓ Falls back to `fs.stat mtime` (uncommitted files)
- ✓ Console output now shows `lastmod` for every URL (for verification)

### `CLAUDE.md` updates:
- ✓ Documented the new `--date` flag
- ✓ Explained the date priority system
- ✓ Added checklist reminder for `<meta name="published">`

---

## Common Questions

**Q: Can I manually edit `<meta name="published">`?**  
A: Please don't. It's the source of truth for the article's publish date. If you need to change it, use the `--date` flag when creating a new version of the page.

**Q: What if I don't use the new-page.js script?**  
A: Old articles without `<meta name="published">` will fall back to `git log`, which is correct. New articles created manually without the script will use `git log` (no frozen date), so you'll want to add the meta tag by hand for consistency.

**Q: Should I update `<meta name="modified">`?**  
A: It's optional. It's useful for readers to know when content was last reviewed. But it doesn't affect the sitemap — only the `<meta name="published">` date and `git log` affect `<lastmod>`.

**Q: What about articles I created before this update?**  
A: They don't have `<meta name="published">`, so `update-sitemap.js` will use their git log date. This is correct — they'll show their actual first commit date. If you want to add the meta tag retroactively, just add it to the `<head>` manually, commit, and re-run the script.

---

## Files Updated

- ✓ `scripts/new-page.js` — new `--date` flag, `<meta name="published">` embedding
- ✓ `scripts/update-sitemap.js` — new date priority logic with `<meta>` tag reading
- ✓ `CLAUDE.md` — documentation of the new system
- ✓ (No changes to `.githooks/pre-commit` — still auto-runs the sitemap script)
