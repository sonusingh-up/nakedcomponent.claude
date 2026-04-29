# Sitemap Date Handling — Before & After

## The Problem You Had

```
Day 1: Create article "Creatine" 
       → Sitemap shows: lastmod=2026-04-29 ✓

Day 2: Add new article "Whey Protein"
       → Run: node scripts/update-sitemap.js
       → Sitemap REGENERATES
       → "Creatine" now shows: lastmod=2026-04-30 ✗ (wrong!)
       → "Whey" shows: lastmod=2026-04-30 ✓
```

**Why?** Old script used fs.stat mtime for all files → every re-run updated every date to "today".

---

## The New System (RESOLVED ✓)

### Priority Order for `<lastmod>` in Sitemap

```
┌─ New Article (has <meta name="published">)
├─ Read <meta name="published"> = 2026-04-29
└─ USE IT (frozen forever, won't change on re-runs)

┌─ Old Article (no meta tag, file edited)
├─ Check git log -1
├─ Found: 2026-05-15 (last commit date)
└─ USE IT (reflects real edits, updates when committed)

┌─ New File (not yet committed)
├─ Check <meta name="published"> (not present)
├─ Check git log (no commits yet)
├─ Fall back to fs.stat mtime = 2026-04-29
└─ USE IT (temporary, will be replaced by git log on next commit)
```

---

## Scenario Comparison

### Scenario 1: Publish Article, Then Wait

#### OLD SYSTEM ❌
```
Day 1:
  Create article "Creatine"
  Commit & push
  Sitemap shows: lastmod=2026-04-29

Day 30:
  Run: node scripts/update-sitemap.js (no changes made)
  Sitemap shows: lastmod=2026-05-29 ✗ (WRONG!)
  → Article appears newly modified when it wasn't
  → Search engines think it was just updated
```

#### NEW SYSTEM ✓
```
Day 1:
  Create article "Creatine"
  Commit & push
  File has: <meta name="published" content="2026-04-29">
  Sitemap shows: lastmod=2026-04-29

Day 30:
  Run: node scripts/update-sitemap.js (no changes made)
  Script reads: <meta name="published"> = 2026-04-29
  Sitemap shows: lastmod=2026-04-29 ✓ (CORRECT!)
  → Article keeps its original publish date
```

---

### Scenario 2: Publish Article, Then Edit

#### OLD SYSTEM ❌
```
Day 1:
  Create article "Creatine"
  Sitemap shows: lastmod=2026-04-29

Day 15:
  Edit typo in article, commit
  Sitemap shows: lastmod=2026-04-29 ✗ (doesn't reflect edit)
  → Search engines don't know about the update
```

#### NEW SYSTEM ✓
```
Day 1:
  Create article "Creatine"
  File has: <meta name="published" content="2026-04-29">
  Sitemap shows: lastmod=2026-04-29

Day 15:
  Edit typo in article, commit
  Script checks: <meta name="published"> = 2026-04-29 (kept)
  Script checks: git log -1 = 2026-04-15 (new commit)
  Sitemap shows: lastmod=2026-04-15 ✓ (reflects actual edit)
  → Search engines see the update
  → But article still has original publish date (2026-04-29)
```

---

### Scenario 3: Backdate Old Content

#### OLD SYSTEM ❌
```
You want to publish a research article from April 1st 
(but you're publishing it today, May 15th)

Create article → Sitemap shows: lastmod=2026-05-15 ✗
→ No way to set a different publish date
→ Looks like brand new article, not old research
```

#### NEW SYSTEM ✓
```
You want to publish a research article from April 1st 
(but you're publishing it today, May 15th)

Run:
  node scripts/new-page.js --type research \
    --title "2024 Study Deep Dive" \
    --date 2026-04-01

File created with: <meta name="published" content="2026-04-01">
Sitemap shows: lastmod=2026-04-01 ✓
→ Article appears published on April 1st
→ Correct publish date, published today
```

---

## The Implementation

### In HTML Head (Every New Article)

```html
<!-- Authoritative publish date — read by update-sitemap.js
     DO NOT edit manually. Controls lastmod in sitemap.xml -->
<meta name="published" content="2026-04-29" />

<!-- Optional: update this if you substantially revise the article -->
<meta name="modified" content="2026-04-29" />
```

### In update-sitemap.js (The Magic)

```javascript
function getLastMod(absPath) {
  // Priority 1: embedded publish date (new articles)
  const published = readPublishedDate(absPath);
  if (published) return published;  // ← Frozen forever

  // Priority 2: git log (old articles, tracks real edits)
  try {
    const gitDate = execSync(`git log -1 --format="%ai" ...`);
    if (gitDate) return gitDate;  // ← Updates when edited
  } catch (_) {}

  // Priority 3: filesystem (uncommitted files)
  return fs.statSync(absPath).mtime.toISOString().slice(0, 10);
}
```

---

## Test It Yourself

```bash
# Create new article today
node scripts/new-page.js --type ingredient --title "Test Article"

# Check what's in the file
grep 'name="published"' project/ingredients/test-article.html
# Should show: <meta name="published" content="2026-04-29" />

# Regenerate sitemap
node scripts/update-sitemap.js

# Check sitemap
grep -A 4 'test-article' project/sitemap.xml
# Should show: <lastmod>2026-04-29</lastmod>

# Tomorrow, regenerate again (without editing the article)
node scripts/update-sitemap.js

# Check sitemap again
grep -A 4 'test-article' project/sitemap.xml
# STILL shows: <lastmod>2026-04-29</lastmod> ✓
# → Date stayed frozen
```

---

## Files Changed

| File | What Changed | Why |
|------|-------------|-----|
| `scripts/new-page.js` | Embeds `<meta name="published">` in every new article | Makes publish date explicit and frozen |
| `scripts/new-page.js` | Added `--date` flag for backdating | Allows flexible publish dates |
| `scripts/update-sitemap.js` | Reads `<meta name="published">` first | Respects article's declared publish date |
| `scripts/update-sitemap.js` | Falls back to git log | Tracks real content edits |
| `CLAUDE.md` | Documented new workflow | Ensures consistency going forward |

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| New article publish date | Uses today (fs.stat) | Frozen at creation via `<meta>` tag |
| Old article re-runs | Date keeps updating ✗ | Date stays frozen ✓ |
| Edited article | No way to detect edits | Git log detects & bumps date ✓ |
| Backdate articles | Impossible | `--date` flag ✓ |
| Manual sitemap edits | Needed | Not needed ✓ |
| Search engine confusion | High (false "recently modified") | Low (accurate dates) |
