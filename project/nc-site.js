// Naked Compound — shared header + footer + nav behavior
// Renders into <div id="site-header"></div> and <div id="site-footer"></div>.
// Also wires up: theme toggle, sticky shadow, mobile nav, smooth-scroll, ⌘K focus.

(function () {
  'use strict';

  // --- path prefix auto-detect (works from any subfolder depth) ---
  // Always use absolute root-relative paths so /research/, /pages/, or
  // any future subfolder never breaks nav or footer links.
  const root    = '/';
  const selfDir = '/pages/';

  // Which nav item is "current" — set by each page via window.PAGE_KEY before nc-site.js
  const CURRENT = (window.PAGE_KEY || '').toLowerCase();

  const navItems = [
    { key: 'research',    label: 'Research',    href: `${selfDir}research.html` },
    { key: 'protocols',   label: 'Protocols',   href: `${selfDir}protocols.html` },
    { key: 'reviews',     label: 'Reviews',     href: `${selfDir}reviews.html` },
    { key: 'ingredients', label: 'Ingredients', href: `${selfDir}ingredients.html` },
    { key: 'brands',      label: 'Verified brands',  href: `${selfDir}verified-brands.html` },
    { key: 'learn',       label: 'Learn',       href: `${selfDir}learn.html` },
    { key: 'about',       label: 'About',       href: `${selfDir}about.html` },
  ];

  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <div class="container nav">
          <a class="brand" href="${root}index.html" aria-label="Naked Compound home">
            <span class="mark" aria-hidden="true"></span>
            <span class="brand-name">Naked<em>·</em>Compound</span>
          </a>

          <nav aria-label="Primary">
            <ul class="nav-links">
              ${navItems.map(n => `<li><a href="${n.href}"${CURRENT === n.key ? ' aria-current="page" class="current"' : ''}>${n.label}</a></li>`).join('')}
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

            <a href="${selfDir}research.html" class="btn btn-primary">Explore research</a>

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
        ${navItems.map(n => `<a href="${n.href}">${n.label}</a>`).join('')}
      </div>
    `;
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a class="brand" href="${root}index.html">
                <span class="mark" aria-hidden="true"></span>
                <span class="brand-name">Naked<em>·</em>Compound</span>
              </a>
              <p>Independent supplement research for India. Strip the label. See the science.</p>
            </div>

            <div class="footer-col">
              <h4>Research</h4>
              <ul>
                <li><a href="${selfDir}research.html">Research hub</a></li>
                <li><a href="${selfDir}guides.html">Guides</a></li>
                <li><a href="${selfDir}protocols.html">Protocols</a></li>
                <li><a href="${selfDir}reviews.html">Reviews</a></li>
                <li><a href="${selfDir}ingredients.html">Ingredients</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Library</h4>
              <ul>
                <li><a href="${selfDir}categories.html">Categories</a></li>
                <li><a href="${selfDir}blog.html">Blog</a></li>
                <li><a href="${selfDir}learn.html">Learn</a></li>
                <li><a href="${selfDir}verified-brands.html">Verified brands</a></li>
                <li><a href="${selfDir}changelog.html">Database changelog</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="${selfDir}about.html">About</a></li>
                <li><a href="${selfDir}authors.html">Authors</a></li>
                <li><a href="${selfDir}methodology.html">Methodology</a></li>
                <li><a href="${selfDir}scoring-rubric.html">Scoring rubric</a></li>
                <li><a href="${selfDir}conflicts-policy.html">Conflicts policy</a></li>
                <li><a href="${selfDir}contact.html">Contact</a></li>
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
              <a href="${selfDir}privacy.html">Privacy</a>
              <a href="${selfDir}terms.html">Terms</a>
              <a href="${selfDir}rss.html">RSS</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  // ---- behaviors ----
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

  const hdr = document.querySelector('.site-header');
  const onScroll = () => {
    if (!hdr) return;
    hdr.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => mobileNav.classList.toggle('open'));
    mobileNav.addEventListener('click', (e) => {
      if (e.target.closest('a')) mobileNav.classList.remove('open');
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const s = document.querySelector('.search input');
      if (s) s.focus();
    }
  });

  // Smooth-scroll for in-page anchors only
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

  // Newsletter form
  document.querySelectorAll('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      if (!input || !btn) return;
      const val = (input.value || '').trim();
      if (!val || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) {
        input.focus();
        input.style.boxShadow = '0 0 0 2px var(--accent)';
        setTimeout(() => { input.style.boxShadow = ''; }, 1200);
        return;
      }
      btn.textContent = 'Subscribed ✓';
      btn.disabled = true;
      input.value = '';
      setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 3000);
    });
  });

  // Reveal observer for .reveal elements
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      en.target.classList.add('in');
      en.target.querySelectorAll('.sr-bar > span').forEach((bar) => {
        const pct = bar.dataset.pct || '80';
        requestAnimationFrame(() => { bar.style.width = pct + '%'; });
      });
      en.target.querySelectorAll('[data-num]').forEach((el) => {
        const target = parseFloat(el.dataset.num || '0');
        const isFloat = (el.dataset.num || '').includes('.');
        const duration = 1200;
        const start = performance.now();
        if (!el.firstChild || el.firstChild.nodeType !== 3) {
          el.insertBefore(document.createTextNode('0'), el.firstChild || null);
        } else { el.firstChild.nodeValue = '0'; }
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
})();
