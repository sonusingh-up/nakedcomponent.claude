// Naked Compound — interactions
(function () {
  'use strict';

  // ---------------------------------------------------------------
  // Theme toggle (persisted)
  // ---------------------------------------------------------------
  const THEME_KEY = 'nc-theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') {
    root.setAttribute('data-theme', saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-theme-toggle]');
    if (!t) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  });

  // ---------------------------------------------------------------
  // Sticky-header shadow
  // ---------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------------------------------------------------------------
  // Mobile nav
  // ---------------------------------------------------------------
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    mobileNav.addEventListener('click', (e) => {
      if (e.target.closest('a')) mobileNav.classList.remove('open');
    });
  }

  // ---------------------------------------------------------------
  // Animate stat numbers on reveal
  // ---------------------------------------------------------------
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const animateNumber = (el) => {
    const target = parseFloat(el.dataset.num || '0');
    const suffix = el.dataset.suffix || '';
    const isFloat = (el.dataset.num || '').includes('.');
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const v = target * easeOutCubic(t);
      const text = isFloat ? v.toFixed(1) : Math.round(v).toLocaleString('en-IN');
      el.firstChild.nodeValue = text;
      if (t < 1) requestAnimationFrame(step);
      else el.firstChild.nodeValue = (isFloat ? target.toFixed(1) : target.toLocaleString('en-IN'));
    };
    // Prep: wrap in a text node if needed
    if (!el.firstChild || el.firstChild.nodeType !== 3) {
      el.insertBefore(document.createTextNode('0'), el.firstChild || null);
    } else {
      el.firstChild.nodeValue = '0';
    }
    requestAnimationFrame(step);
  };

  // Reveal observer
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      en.target.classList.add('in');
      // Number counters
      en.target.querySelectorAll('[data-num]').forEach(animateNumber);
      // Methodology bars
      en.target.querySelectorAll('.sr-bar > span').forEach((bar) => {
        const pct = bar.dataset.pct || '80';
        requestAnimationFrame(() => { bar.style.width = pct + '%'; });
      });
      io.unobserve(en.target);
    }
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---------------------------------------------------------------
  // Newsletter form (no-op confirmation)
  // ---------------------------------------------------------------
  const form = document.querySelector('.newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
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
  }

  // ---------------------------------------------------------------
  // Search (nav) — purely cosmetic focus handler for demo
  // ---------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const search = document.querySelector('.search input');
      if (search) search.focus();
    }
  });

  // ---------------------------------------------------------------
  // Smooth-scroll polyfill for browsers ignoring CSS scroll-behavior
  // when pressing in-page anchor links (most modern browsers do fine).
  // ---------------------------------------------------------------
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
})();
