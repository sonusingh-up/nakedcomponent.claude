// Naked Compound — shared header + footer + nav behavior
// Renders into <div id="site-header"></div> and <div id="site-footer"></div>.
// Also wires up: theme toggle, sticky shadow, mobile nav, smooth-scroll, ⌘K focus.
//
// URL structure follows Google SEO best practices:
//   - All paths are absolute root-relative (start with /) — work from ANY subfolder depth
//   - No .html extensions (Vercel cleanUrls:true strips them automatically)
//   - No trailing slashes (Vercel trailingSlash:false enforces this)
//   - Lowercase, hyphen-separated slugs throughout
//   - Two-level max depth: /pages/about  /research/creatine-loading
//
// Pages set window.PAGE_KEY before this script to highlight the active nav item.

(function () {
  'use strict';

  // ─── URL map ──────────────────────────────────────────────────────────────
  // All absolute root-relative — never relative (../), they break the moment
  // a page moves to a different subfolder depth.
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

  // Which nav item is "current" — set by each page via window.PAGE_KEY
  const CURRENT = (window.PAGE_KEY || '').toLowerCase();

  const navItems = [
    { key: 'research',    label: 'Research',        href: PAGES.research    },
    { key: 'protocols',   label: 'Protocols',       href: PAGES.protocols   },
    { key: 'reviews',     label: 'Reviews',         href: PAGES.reviews     },
    { key: 'ingredients', label: 'Ingredients',     href: PAGES.ingredients },
    { key: 'brands',      label: 'Verified brands', href: PAGES.brands      },
    { key: 'learn',       label: 'Learn',           href: PAGES.learn       },
    { key: 'about',       label: 'About',           href: PAGES.about       },
  ];

  // ─── Header & Footer ─────────────────────────────────────────────────────
  // Removed: header and footer are now injected at build time by
  // scripts/inject-partials.js — they exist as real static HTML in every
  // page so Googlebot can crawl all nav and footer links without executing JS.
  // UX behaviors below (theme, mobile nav, etc.) still target the static HTML.

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
  const hdr = document.querySelector('.site-header');
  const onScroll = () => {
    if (!hdr) return;
    hdr.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Mobile nav ───────────────────────────────────────────────────────────
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav  = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => mobileNav.classList.toggle('open'));
    mobileNav.addEventListener('click', (e) => {
      if (e.target.closest('a')) mobileNav.classList.remove('open');
    });
  }

  // ─── ⌘K / Ctrl+K search focus ────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const s = document.querySelector('.search input');
      if (s) s.focus();
    }
  });

  // ─── Smooth-scroll for in-page anchors ───────────────────────────────────
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

      // Progress bars
      en.target.querySelectorAll('.sr-bar > span').forEach((bar) => {
        const pct = bar.dataset.pct || '80';
        requestAnimationFrame(() => { bar.style.width = pct + '%'; });
      });

      // Animated counters
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
          el.firstChild.nodeValue = isFloat
            ? v.toFixed(1)
            : Math.round(v).toLocaleString('en-IN');
          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            el.firstChild.nodeValue = isFloat
              ? target.toFixed(1)
              : target.toLocaleString('en-IN');
          }
        };
        requestAnimationFrame(step);
      });

      io.unobserve(en.target);
    }
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ─── Vercel Speed Insights ────────────────────────────────────────────────
  // Initialize Speed Insights for performance monitoring
  // https://vercel.com/docs/speed-insights/quickstart
  window.si = window.si || function () { 
    (window.siq = window.siq || []).push(arguments); 
  };
  
  // Inject the Speed Insights script from Vercel's CDN
  const siScript = document.createElement('script');
  siScript.src = '/_vercel/speed-insights/script.js';
  siScript.defer = true;
  document.head.appendChild(siScript);

})();
