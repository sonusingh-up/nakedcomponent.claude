// Naked Compound — shared header + footer + nav behavior
// Renders into <div id="site-header"></div> and <div id="site-footer"></div>.
// Also wires up: theme toggle, sticky shadow, mobile nav, smooth-scroll, ⌘K focus, SEARCH.

(function () {
  'use strict';

  const HOME  = '/';
  const PAGES = {
    research:        '/pages/research',
    guides:          '/pages/guides',
    protocols:       '/pages/protocols',
    reviews:         '/pages/reviews',
    ingredients:     '/pages/ingredients',
    brands:          '/pages/verified-brands',
    categories:      '/pages/categories',
    learn:           '/pages/learn',
    blog:            '/pages/blog',
    changelog:       '/pages/changelog',
    about:           '/pages/about',
    authors:         '/pages/authors',
    methodology:     '/pages/methodology',
    scoringRubric:   '/pages/scoring-rubric',
    conflictsPolicy: '/pages/conflicts-policy',
    contact:         '/pages/contact',
    privacy:         '/pages/privacy',
    terms:           '/pages/terms',
    rss:             '/pages/rss',
  };

  const CURRENT = (window.PAGE_KEY || '').toLowerCase();

  // ── Nav items ── "Verified brands" → "Brands" ──────────────────
  const navItems = [
    { key: 'research',    label: 'Research',    href: PAGES.research    },
    { key: 'protocols',   label: 'Protocols',   href: PAGES.protocols   },
    { key: 'reviews',     label: 'Reviews',     href: PAGES.reviews     },
    { key: 'ingredients', label: 'Ingredients', href: PAGES.ingredients },
    { key: 'brands',      label: 'Brands',      href: PAGES.brands      },
    { key: 'learn',       label: 'Learn',       href: PAGES.learn       },
    { key: 'about',       label: 'About',       href: PAGES.about       },
  ];

  // Inline SVG brand mark — terracotta rounded square with NC monogram.
  // Embedded so it works regardless of favicon path resolution.
  const BRAND_MARK_SVG = `
    <svg class="mark" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="7" style="fill: var(--accent, #c96442);"/>
      <path d="M9 23 V9 L19 23 V9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M25 12 a6 6 0 1 0 0 8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    </svg>`;

  // ─── Header ───────────────────────────────────────────────────────────────
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <a href="#main-content" class="skip-to-content">Skip to content</a>
      <header class="site-header" id="site-header-el">
        <div class="container nav">
          <a class="brand" href="${HOME}" aria-label="Naked Compound home">
            ${BRAND_MARK_SVG}
            <span class="brand-name">Naked<em>·</em>Compound</span>
          </a>

          <nav aria-label="Primary">
            <ul class="nav-links">
              ${navItems.map(n => `
              <li>
                <a href="${n.href}"${CURRENT === n.key ? ' aria-current="page" class="current"' : ''}>${n.label}</a>
              </li>`).join('')}
            </ul>
          </nav>

          <div class="nav-actions">
            <button class="search-trigger" id="search-trigger" aria-label="Search" aria-expanded="false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <span class="search-placeholder">Search ingredients…</span>
              <span class="kbd">⌘K</span>
            </button>

            <button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">
              <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
              <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            </button>

            <a href="${PAGES.research}" class="btn btn-primary">Explore research</a>

            <button class="menu-toggle" data-menu-toggle aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav-drawer">
              <svg class="icon-burger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
              <svg class="icon-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
            </button>
          </div>
        </div>
      </header>
      <div class="pricing-notice-bar">
        <div class="container">
          (<strong>Pricing Notice:</strong> Prices displayed for all products and brands are subject to change. Please click the "Buy" button to verify the most up-to-date pricing.)
        </div>
      </div>

      <div class="mobile-nav-backdrop" data-menu-backdrop aria-hidden="true"></div>
      <aside class="mobile-nav" id="mobile-nav-drawer" aria-label="Mobile menu" aria-hidden="true">
        <div class="mobile-nav-head">
          <a class="brand" href="${HOME}" aria-label="Naked Compound home">
            ${BRAND_MARK_SVG}
            <span class="brand-name">Naked<em>·</em>Compound</span>
          </a>
          <button class="mobile-nav-close" data-menu-toggle aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <nav class="mobile-nav-body" aria-label="Mobile primary">
          <div class="mobile-nav-section-label">Browse</div>
          ${navItems.map(n => `<a class="mn-link" href="${n.href}"${CURRENT === n.key ? ' aria-current="page"' : ''}><span>${n.label}</span><span class="mn-arrow" aria-hidden="true">→</span></a>`).join('')}
        </nav>
        <div class="mobile-nav-foot">
          <button class="mobile-search-trigger search-trigger" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <span>Search ingredients, guides…</span>
          </button>
          <div class="mn-actions">
            <a href="${PAGES.research}" class="btn btn-primary">Explore research</a>
            <button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">
              <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
              <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            </button>
          </div>
        </div>
      </aside>
    `;
  }

  // ─── RSS auto-discovery ───────────────────────────────────────────────────
  if (!document.querySelector('link[type="application/rss+xml"]')) {
    const rssLink = document.createElement('link');
    rssLink.rel = 'alternate';
    rssLink.type = 'application/rss+xml';
    rssLink.title = 'Naked Compound RSS';
    rssLink.href = '/feed.xml';
    document.head.appendChild(rssLink);
  }

  // ─── Web App Manifest & Apple Touch Icon ──────────────────────────────────
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = '/site.webmanifest';
    document.head.appendChild(manifest);
  }
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.sizes = '180x180';
    appleIcon.href = '/apple-touch-icon.png';
    document.head.appendChild(appleIcon);
  }

  // ─── DNS prefetch for third-party domains ─────────────────────────────────
  ['https://pagead2.googlesyndication.com', 'https://www.googletagmanager.com'].forEach(href => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const dns = document.createElement('link');
      dns.rel = 'dns-prefetch';
      dns.href = href;
      document.head.appendChild(dns);
    }
  });

  // ─── Search Modal ─────────────────────────────────────────────────────────
  // Inject modal once
  const searchOverlay = document.createElement('div');
  searchOverlay.id = 'search-overlay';
  searchOverlay.setAttribute('role', 'dialog');
  searchOverlay.setAttribute('aria-modal', 'true');
  searchOverlay.setAttribute('aria-label', 'Search');
  searchOverlay.innerHTML = `
    <div class="search-modal" id="search-modal">
      <div class="search-modal-input-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="search" id="search-input" placeholder="Search ingredients, guides, protocols…" autocomplete="off" spellcheck="false" />
        <button class="search-close" id="search-close" aria-label="Close search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="search-results" id="search-results" aria-live="polite">
        <div class="search-empty" id="search-empty">
          <p class="search-hint">Try <span class="sh-ex" data-q="creatine">creatine</span>, <span class="sh-ex" data-q="ashwagandha">ashwagandha</span>, <span class="sh-ex" data-q="vitamin d">vitamin D</span>, <span class="sh-ex" data-q="whey">whey</span></p>
        </div>
        <div class="search-hits" id="search-hits" hidden></div>
        <div class="search-no-results" id="search-no-results" hidden>
          <p>No results for <strong id="search-query-display"></strong>. Try a shorter term.</p>
        </div>
      </div>
    </div>
    <div class="search-backdrop" id="search-backdrop"></div>
  `;
  document.body.appendChild(searchOverlay);

  // ─── Pagefind Search ─────────────────────────────────────────────────────────────
  // Pagefind index is generated at build time by `npx pagefind --site project`.
  // The /pagefind/ directory is produced automatically and served by Vercel.

  const TYPE_META = {
    guide:      { label:'Guide',      icon:'\u{1F4D6}', cls:'st-guide'      },
    ingredient: { label:'Ingredient', icon:'\u2697\uFE0F', cls:'st-ingredient' },
    protocol:   { label:'Protocol',   icon:'\u{1F4CB}', cls:'st-protocol'   },
    review:     { label:'Review',     icon:'\u2B50', cls:'st-review'     },
    compare:    { label:'Compare',    icon:'\u2696\uFE0F', cls:'st-guide'      },
    blog:       { label:'Blog',       icon:'\u270D\uFE0F', cls:'st-guide'      },
  };

  // Infer content type from URL path
  function typeFromUrl(url) {
    if (url.includes('/reviews/'))    return 'review';
    if (url.includes('/protocols/'))  return 'protocol';
    if (url.includes('/compare/'))    return 'compare';
    if (url.includes('/blog/'))       return 'blog';
    if (url.includes('/ingredients/') || url.includes('/pages/ingredients')) return 'ingredient';
    return 'guide';
  }

  // Lazy-load Pagefind once, reuse after
  let _pf = null;
  async function getPagefind() {
    if (_pf) return _pf;
    try {
      _pf = await import('/pagefind/pagefind.js');
      await _pf.init();
    } catch (e) {
      console.warn('[NC Search] Pagefind not ready. Push to Vercel (or run `npx pagefind --site project` locally) to generate the index.', e);
      _pf = null;
    }
    return _pf;
  }

  async function renderResults(q) {
    const hitsEl  = document.getElementById('search-hits');
    const emptyEl = document.getElementById('search-empty');
    const noResEl = document.getElementById('search-no-results');
    const qDisp   = document.getElementById('search-query-display');
    if (!hitsEl) return;

    if (!q || q.length < 2) {
      hitsEl.hidden  = true;
      noResEl.hidden = true;
      emptyEl.style.display = '';
      return;
    }

    emptyEl.style.display = 'none';

    const pf = await getPagefind();
    if (!pf) {
      hitsEl.hidden  = true;
      noResEl.hidden = false;
      if (qDisp) qDisp.textContent = '"search index not built yet"';
      return;
    }

    const search = await pf.search(q);

    if (!search.results.length) {
      hitsEl.hidden  = true;
      noResEl.hidden = false;
      if (qDisp) qDisp.textContent = `"${q}"`;
      return;
    }

    // Fetch full data for top 12 results
    const data = await Promise.all(search.results.slice(0, 12).map(r => r.data()));

    noResEl.hidden = true;
    hitsEl.hidden  = false;

    // Group by content type inferred from URL
    const grouped = {};
    data.forEach(r => {
      const type = typeFromUrl(r.url);
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(r);
    });

    let html = '';
    const typeOrder = ['guide', 'ingredient', 'protocol', 'review', 'compare', 'blog'];
    typeOrder.forEach(type => {
      if (!grouped[type]) return;
      const tm = TYPE_META[type];
      html += `<div class="sr-group"><div class="sr-group-label">${tm.label}s</div>`;
      grouped[type].forEach((r, idx) => {
        // Strip .html so Vercel cleanUrls works correctly
        const href  = r.url.replace(/\.html$/, '');
        const title = r.meta.title || href;
        // Pagefind provides an HTML excerpt with <mark> tags already applied
        const excerpt = r.excerpt || '';
        html += `<a href="${href}" class="sr-item" data-idx="${idx}" tabindex="0">
          <span class="sr-type ${tm.cls}">${tm.icon}</span>
          <span class="sr-body">
            <span class="sr-title">${title}</span>
            <span class="sr-meta">${excerpt}</span>
          </span>
          <span class="sr-arrow">→</span>
        </a>`;
      });
      html += `</div>`;
    });

    hitsEl.innerHTML = html;
    attachItemKeyboard(hitsEl);
  }

    function attachItemKeyboard(container) {
    const items = container.querySelectorAll('.sr-item');
    items.forEach((item, i) => {
      item.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); if (items[i+1]) items[i+1].focus(); }
        if (e.key === 'ArrowUp')   { e.preventDefault();
          if (i === 0) document.getElementById('search-input')?.focus();
          else if (items[i-1]) items[i-1].focus();
        }
        if (e.key === 'Enter') item.click();
      });
    });
  }

  // Open / close search
  function openSearch() {
    const overlay = document.getElementById('search-overlay');
    const input   = document.getElementById('search-input');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.classList.add('search-open');
    document.getElementById('search-trigger')?.setAttribute('aria-expanded', 'true');
    getPagefind(); // preload index in background
    setTimeout(() => input?.focus(), 60);
  }

  function closeSearch() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.classList.remove('search-open');
    document.getElementById('search-trigger')?.setAttribute('aria-expanded', 'false');
    // Reset
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    renderResults('');
  }

  // Wire triggers (use delegation — elements injected later)
  document.addEventListener('click', e => {
    if (e.target.closest('.search-trigger')) { openSearch(); return; }
    if (e.target.closest('#search-close') || e.target.id === 'search-backdrop') { closeSearch(); return; }
  });

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const overlay = document.getElementById('search-overlay');
      overlay?.classList.contains('open') ? closeSearch() : openSearch();
    }
    if (e.key === 'Escape' && document.getElementById('search-overlay')?.classList.contains('open')) {
      closeSearch();
    }
    if (e.key === 'ArrowDown' && document.getElementById('search-overlay')?.classList.contains('open')) {
      const first = document.querySelector('#search-hits .sr-item');
      if (first) { e.preventDefault(); first.focus(); }
    }
  });

  // Live search input
  document.addEventListener('input', e => {
    if (e.target.id === 'search-input') {
      renderResults(e.target.value.trim());
    }
  });

  // Example hint chips
  document.addEventListener('click', e => {
    const chip = e.target.closest('.sh-ex');
    if (!chip) return;
    const q = chip.dataset.q;
    const input = document.getElementById('search-input');
    if (input) { input.value = q; renderResults(q); input.focus(); }
  });

  // ─── Search styles (injected once) ────────────────────────────────────────
  const searchStyles = document.createElement('style');
  searchStyles.textContent = `
  .search-trigger {
    display:flex; align-items:center; gap:8px;
    background: var(--bg-elev);
    border: 1px solid var(--line);
    border-radius: var(--r-pill);
    padding: 8px 14px;
    width:240px; cursor:pointer;
    transition: transform 120ms var(--ease-out), border-color 160ms var(--ease-out), box-shadow 160ms var(--ease-out);
    flex: 0 1 auto;
    min-width: 0;
  }
  @media (hover: hover) and (pointer: fine) {
    .search-trigger:hover { border-color:var(--line-strong); }
  }
  .search-trigger:active { transform: scale(0.97); }
  .search-trigger:focus { outline:0; box-shadow:0 0 0 3px color-mix(in oklab,var(--accent) 20%,transparent); border-color:var(--ink); }
  .search-trigger svg { width:15px;height:15px;color:var(--ink-muted);flex:0 0 auto; }
  .search-placeholder { flex:1; font-size:14px; color:var(--ink-muted); text-align:left; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .search-trigger .kbd { font-family:var(--font-mono);font-size:11px;color:var(--ink-muted);padding:2px 6px;border:1px solid var(--line);border-radius:5px;background:var(--bg);flex-shrink:0; }

  #search-overlay {
    position:fixed; inset:0; z-index:200;
    display:flex; align-items:flex-start; justify-content:center;
    padding-top:80px; padding-left:16px; padding-right:16px;
    pointer-events:none; opacity:0;
    transition:opacity 200ms var(--ease-out);
  }
  #search-overlay.open { pointer-events:auto; opacity:1; }

  .search-backdrop {
    position:fixed; inset:0; z-index:-1;
    background: rgba(26,23,20,0.5);
    backdrop-filter:blur(4px);
    -webkit-backdrop-filter:blur(4px);
  }

  .search-modal {
    width:100%; max-width:640px;
    background:var(--bg-elev);
    border:1px solid var(--line-strong);
    border-radius:var(--r-xl);
    box-shadow:var(--shadow-lg);
    overflow:hidden;
    transform:translateY(-12px);
    transition:transform 250ms var(--ease-out);
  }
  #search-overlay.open .search-modal { transform:translateY(0); }

  .search-modal-input-wrap {
    display:flex; align-items:center; gap:12px;
    padding:16px 20px;
    border-bottom:1px solid var(--line);
  }
  .search-modal-input-wrap svg { width:18px;height:18px;color:var(--ink-muted);flex-shrink:0; }
  #search-input {
    flex:1; border:0; outline:0; background:transparent;
    font:inherit; font-size:17px; color:var(--ink);
  }
  #search-input::placeholder { color:var(--ink-muted); }
  .search-close {
    width:32px;height:32px; border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    border:1px solid var(--line); background:var(--surface);
    color:var(--ink-soft); cursor:pointer; flex-shrink:0;
    transition:transform 120ms var(--ease-out), background 160ms var(--ease-out), color 160ms var(--ease-out);
  }
  @media (hover: hover) and (pointer: fine) {
    .search-close:hover { background:var(--ink);color:var(--bg); }
  }
  .search-close:active { transform: scale(0.94); }
  .search-close svg { width:14px;height:14px; }

  .search-results { max-height:420px; overflow-y:auto; }

  .search-empty { padding:28px 24px; text-align:center; }
  .search-hint { color:var(--ink-muted); font-size:14.5px; }
  .sh-ex {
    display:inline-block; margin:0 4px;
    padding:2px 10px; border-radius:var(--r-pill);
    background:var(--surface); border:1px solid var(--line);
    color:var(--ink); font-size:13px; cursor:pointer;
    transition:transform 120ms var(--ease-out), border-color 160ms var(--ease-out), background 160ms var(--ease-out), color 160ms var(--ease-out);
  }
  @media (hover: hover) and (pointer: fine) {
    .sh-ex:hover { border-color:var(--accent);background:var(--accent-soft);color:var(--accent-deep); }
  }
  .sh-ex:active { transform: scale(0.95); }

  .search-hits { padding:8px; }
  .sr-group-label {
    padding:8px 12px 4px;
    font-family:var(--font-mono);font-size:10px;
    letter-spacing:0.14em;text-transform:uppercase;
    color:var(--ink-muted);
  }
  .sr-item {
    display:flex; align-items:center; gap:12px;
    padding:10px 12px; border-radius:var(--r-md);
    text-decoration:none; color:inherit;
    transition:transform 120ms var(--ease-out), background 160ms var(--ease-out);
    cursor:pointer;
  }
  @media (hover: hover) and (pointer: fine) {
    .sr-item:hover, .sr-item:focus { background:var(--surface); outline:0; }
  }
  .sr-item:active { transform: scale(0.98); }
  .sr-type {
    width:34px;height:34px; border-radius:var(--r-sm);
    display:flex;align-items:center;justify-content:center;
    font-size:16px; flex-shrink:0;
  }
  .st-guide      { background:var(--accent-soft); }
  .st-ingredient { background:var(--mint); }
  .st-protocol   { background:var(--sky); }
  .st-review     { background:var(--butter); }
  .sr-body { flex:1; min-width:0; }
  .sr-title { display:block; font-size:14.5px; color:var(--ink); font-weight:500; line-height:1.3; }
  .sr-title mark { background:transparent;color:var(--accent);font-weight:700; }
  .sr-meta { display:block; font-size:12px; color:var(--ink-muted); font-family:var(--font-mono); margin-top:2px; }
  .sr-arrow { color:var(--ink-muted); font-size:14px; flex-shrink:0; }

  .search-no-results { padding:28px 24px; color:var(--ink-soft); font-size:14.5px; text-align:center; }

  body.search-open { overflow:hidden; }
  .mobile-search-trigger {
    width:100% !important; border-radius:var(--r-md) !important;
    padding:12px 16px !important; justify-content:flex-start !important;
  }
  `;
  document.head.appendChild(searchStyles);

  // ─── Footer ───────────────────────────────────────────────────────────────
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a class="brand" href="${HOME}">
                ${BRAND_MARK_SVG}
                <span class="brand-name">Naked<em>·</em>Compound</span>
              </a>
              <p>Independent supplement research for India. Strip the label. See the science.</p>
            </div>
            <div class="footer-col">
              <h4>Research</h4>
              <ul>
                <li><a href="${PAGES.research}">Research hub</a></li>
                <li><a href="${PAGES.guides}">Guides</a></li>
                <li><a href="${PAGES.protocols}">Protocols</a></li>
                <li><a href="${PAGES.reviews}">Reviews</a></li>
                <li><a href="${PAGES.ingredients}">Ingredients</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Library</h4>
              <ul>
                <li><a href="https://app.nakedcompound.in">Habit Tracker app ↗</a></li>
                <li><a href="${PAGES.categories}">Categories</a></li>
                <li><a href="${PAGES.blog}">Blog</a></li>
                <li><a href="${PAGES.learn}">Learn</a></li>
                <li><a href="${PAGES.brands}">Brands</a></li>
                <li><a href="${PAGES.changelog}">Database changelog</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="${PAGES.about}">About</a></li>
                <li><a href="${PAGES.authors}">Authors</a></li>
                <li><a href="${PAGES.methodology}">Methodology</a></li>
                <li><a href="${PAGES.scoringRubric}">Scoring rubric</a></li>
                <li><a href="${PAGES.conflictsPolicy}">Conflicts policy</a></li>
                <li><a href="${PAGES.contact}">Contact</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-socials">
            <a href="https://instagram.com/nakedcompound" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://substack.com/@nakedcompoundinsider" target="_blank" rel="noopener noreferrer" aria-label="Substack">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"></path>
              </svg>
            </a>
            <a href="https://in.pinterest.com/nakedcompound/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345c-.091.378-.293 1.194-.333 1.361-.052.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.379l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"></path>
              </svg>
            </a>
          </div>

          <div class="footer-google-pref">
            <a href="https://www.google.com/preferences/source?q=nakedcompound.in" target="_blank" rel="noopener noreferrer" class="google-pref-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Add as Google Preferred Source
            </a>
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
              <a href="${PAGES.privacy}">Privacy</a>
              <a href="${PAGES.terms}">Terms</a>
              <a href="${PAGES.rss}">RSS</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  // ─── Theme ────────────────────────────────────────────────────────────────
  const THEME_KEY = 'nc-theme';
  const docEl = document.documentElement;
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') {
    docEl.setAttribute('data-theme', saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    docEl.setAttribute('data-theme', 'dark');
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-theme-toggle]');
    if (!t) return;
    const next = docEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    docEl.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  });

  // ─── Sticky header shadow ─────────────────────────────────────────────────
  const onScroll = () => {
    const hdr = document.querySelector('.site-header');
    if (!hdr) return;
    hdr.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Mobile nav drawer (open / close / backdrop / esc / body-lock) ────────
  function setMenuState(open) {
    const drawer   = document.querySelector('.mobile-nav');
    const backdrop = document.querySelector('.mobile-nav-backdrop');
    const toggle   = document.querySelector('.menu-toggle');
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    if (backdrop) backdrop.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('menu-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }
  function toggleMenu() {
    const drawer = document.querySelector('.mobile-nav');
    setMenuState(!drawer?.classList.contains('open'));
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu-toggle]')) {
      e.preventDefault();
      toggleMenu();
      return;
    }
    if (e.target.closest('[data-menu-backdrop]')) {
      setMenuState(false);
      return;
    }
    // Close drawer when a link inside it is tapped
    if (e.target.closest('.mobile-nav a.mn-link')) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.querySelector('.mobile-nav.open')) {
      setMenuState(false);
    }
  });

  // Auto-close drawer if viewport resizes to desktop while open
  let _resizeRaf = null;
  window.addEventListener('resize', () => {
    if (_resizeRaf) cancelAnimationFrame(_resizeRaf);
    _resizeRaf = requestAnimationFrame(() => {
      if (window.innerWidth > 980) setMenuState(false);
    });
  });

  // ─── Smooth-scroll ────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ─── Newsletter form ──────────────────────────────────────────────────────
  document.querySelectorAll('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button[type="submit"]');
      if (!input || !btn) return;
      const val = (input.value || '').trim();
      if (!val || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) {
        input.focus();
        input.style.boxShadow = '0 0 0 2px var(--accent)';
        setTimeout(() => { input.style.boxShadow = ''; }, 1200);
        return;
      }
      btn.textContent = 'Subscribed ✓';
      btn.disabled    = true;
      input.value     = '';
      setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 3000);
    });
  });

  // ─── Reveal + counter animations ─────────────────────────────────────────
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      en.target.classList.add('in');
      
      // Dynamic Stagger Reveal for child cards, protocols, chips, etc.
      const staggerItems = en.target.querySelectorAll('.card, .protocol, .stat, .pick-card, .chip, .review, .ingredient, .brand-card, .alt-pick-card, .step, .hub-link-card, .faq-item, .picks-summary-grid > *, .evid-tier-box');
      staggerItems.forEach((item, idx) => {
        item.style.setProperty('--stagger', idx);
        item.classList.add('stagger-in');
      });

      en.target.querySelectorAll('.sr-bar > span').forEach((bar) => {
        const pct = bar.dataset.pct || '80';
        requestAnimationFrame(() => { bar.style.width = pct + '%'; });
      });
      en.target.querySelectorAll('[data-num]').forEach((el) => {
        const target   = parseFloat(el.dataset.num || '0');
        const isFloat  = (el.dataset.num || '').includes('.');
        const duration = 1200;
        const start    = performance.now();
        if (!el.firstChild || el.firstChild.nodeType !== 3) {
          el.insertBefore(document.createTextNode('0'), el.firstChild || null);
        } else {
          el.firstChild.nodeValue = '0';
        }
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const v = target * (1 - Math.pow(1 - t, 3));
          el.firstChild.nodeValue = isFloat ? v.toFixed(1) : Math.round(v).toLocaleString('en-IN');
          if (t < 1) requestAnimationFrame(step);
          else el.firstChild.nodeValue = isFloat ? target.toFixed(1) : target.toLocaleString('en-IN');
        };
        requestAnimationFrame(step);
      });
      io.unobserve(en.target);
    }
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ─── Reading progress bar (review pages only) ────────────────────────────
  if (location.pathname.startsWith('/reviews/')) {
    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    document.body.prepend(bar);
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ─── Social share bar (content pages) ─────────────────────────────────────
  const sharePaths = ['/reviews/', '/research/', '/blog/', '/guides/', '/protocols/'];
  if (sharePaths.some(p => location.pathname.startsWith(p))) {
    const shareBar = document.createElement('div');
    shareBar.className = 'share-bar';
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    shareBar.innerHTML = `
      <span class="share-label">Share</span>
      <a href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}" target="_blank" rel="noopener noreferrer" aria-label="Share on X" class="share-btn">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href="https://wa.me/?text=${pageTitle}%20${pageUrl}" target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" class="share-btn">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <button class="share-btn" aria-label="Copy link" onclick="navigator.clipboard.writeText(window.location.href).then(()=>{this.classList.add('copied');this.querySelector('.share-copied').hidden=false;setTimeout(()=>{this.classList.remove('copied');this.querySelector('.share-copied').hidden=true},2000)})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <span class="share-copied" hidden>Copied!</span>
      </button>
    `;
    // Always place the bar at the top of the article, under the page
    // header. (It used to be inserted after .product-hero on review
    // pages, which stranded it mid-article between the product card
    // and the stat tiles.)
    const articleBody = document.querySelector('.article-body, .review-prose, .prose, .doc-wrap');
    if (articleBody) {
      articleBody.insertBefore(shareBar, articleBody.firstChild);
    }
  }

  // ─── Vercel Speed Insights ────────────────────────────────────────────────
  window.si = window.si || function () {
    (window.siq = window.siq || []).push(arguments);
  };
  const siScript = document.createElement('script');
  siScript.src = '/_vercel/speed-insights/script.js';
  siScript.defer = true;
  document.head.appendChild(siScript);

  // ─── Cookie Consent Banner ────────────────────────────────────────────────
  const CONSENT_KEY = 'nc-cookie-consent';
  if (!localStorage.getItem(CONSENT_KEY)) {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent';
    banner.innerHTML = `
      <div class="cc-inner">
        <p>We use cookies for analytics (Google Analytics) and advertising (Google AdSense) to improve your experience. No tracking cookies are set by us directly. <a href="/pages/privacy">Privacy policy</a></p>
        <div class="cc-actions">
          <button class="cc-btn cc-accept">Accept all</button>
          <button class="cc-btn cc-decline">Decline optional</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    banner.querySelector('.cc-accept').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      banner.classList.add('cc-hide');
      setTimeout(() => banner.remove(), 400);
    });
    banner.querySelector('.cc-decline').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'declined');
      banner.classList.add('cc-hide');
      setTimeout(() => banner.remove(), 400);
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => banner.classList.add('cc-show'));
    });
  }

  const ccStyles = document.createElement('style');
  ccStyles.textContent = `
  #cookie-consent {
    position:fixed; bottom:0; left:0; right:0; z-index:190;
    padding:16px;
    transform:translateY(100%);
    transition:transform 400ms var(--ease-out), opacity 400ms var(--ease-out);
    opacity:0;
    pointer-events:none;
  }
  #cookie-consent.cc-show {
    transform:translateY(0);
    opacity:1;
    pointer-events:auto;
  }
  #cookie-consent.cc-hide {
    transform:translateY(100%);
    opacity:0;
    pointer-events:none;
  }
  .cc-inner {
    max-width:720px;
    margin:0 auto;
    background:var(--bg-elev);
    border:1px solid var(--line-strong);
    border-radius:var(--r-xl);
    padding:20px 24px;
    box-shadow:var(--shadow-lg);
    display:flex;
    align-items:center;
    gap:20px;
  }
  .cc-inner p {
    flex:1;
    font-size:13.5px;
    line-height:1.5;
    color:var(--ink-soft);
    margin:0;
  }
  .cc-inner a {
    color:var(--accent);
    text-decoration:underline;
    text-underline-offset:2px;
  }
  .cc-actions {
    display:flex;
    gap:8px;
    flex-shrink:0;
  }
  .cc-btn {
    padding:8px 16px;
    border-radius:var(--r-pill);
    font-size:13px;
    font-weight:500;
    cursor:pointer;
    border:1px solid transparent;
    transition:transform 120ms var(--ease-out), background 160ms var(--ease-out);
  }
  .cc-btn:active { transform:scale(0.97); }
  .cc-accept {
    background:var(--accent);
    color:#fff;
  }
  .cc-accept:hover { background:var(--accent-deep); }
  .cc-decline {
    background:var(--surface);
    border-color:var(--line);
    color:var(--ink-soft);
  }
  .cc-decline:hover { border-color:var(--line-strong); }
  @media (max-width:640px) {
    .cc-inner { flex-direction:column; gap:14px; text-align:center; padding:18px 20px; }
    .cc-actions { width:100%; justify-content:center; }
  }
  `;
  document.head.appendChild(ccStyles);

  // ─── Additional styles (skip-link, stagger, share bar) ────────────────────
  const ncExtraStyles = document.createElement('style');
  ncExtraStyles.textContent = `
  .skip-to-content {
    position: absolute;
    top: -100%;
    left: 16px;
    z-index: 999;
    padding: 12px 24px;
    background: var(--accent);
    color: #fff;
    border-radius: var(--r-md);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: top 200ms ease;
  }
  .skip-to-content:focus {
    top: 12px;
  }
  .stagger-in {
    animation: staggerReveal 280ms var(--ease-out) forwards;
    animation-delay: calc(var(--stagger, 0) * 40ms);
    opacity: 0;
  }
  @keyframes staggerReveal {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .share-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 0;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--line);
  }
  .share-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin-right: 4px;
  }
  .share-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--line);
    color: var(--ink-soft);
    cursor: pointer;
    text-decoration: none;
    transition: transform 120ms var(--ease-out), background 160ms var(--ease-out), color 160ms var(--ease-out), border-color 160ms var(--ease-out);
    position: relative;
  }
  .share-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-soft);
  }
  .share-btn:active { transform: scale(0.93); }
  .share-btn svg { width: 16px; height: 16px; }
  .share-copied {
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    color: var(--accent);
    font-weight: 600;
    white-space: nowrap;
  }
  `;
  document.head.appendChild(ncExtraStyles);

})();
