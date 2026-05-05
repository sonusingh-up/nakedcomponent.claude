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

  // ─── Header ───────────────────────────────────────────────────────────────
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <header class="site-header" id="site-header-el">
        <div class="container nav">
          <a class="brand" href="${HOME}" aria-label="Naked Compound home">
            <span class="mark" aria-hidden="true"></span>
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

            <button class="menu-toggle" data-menu-toggle aria-label="Open menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
          </div>
        </div>
      </header>

      <div class="mobile-nav" aria-hidden="true">
        <button class="search-trigger mobile-search-trigger" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <span>Search 312 ingredients…</span>
        </button>
        ${navItems.map(n => `<a href="${n.href}">${n.label}</a>`).join('')}
      </div>
    `;
  }

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

  // ─── Search Index ─────────────────────────────────────────────────────────
  const SEARCH_INDEX = [
    // Guides
    { type:'guide', title:'Should you really "load" creatine? 27 trials reviewed', tags:'creatine loading dose rct muscleblaze gnc', href:'/research/creatine-loading', meta:'11 min · Apr 2026' },
    { type:'guide', title:'The 60,000 IU vitamin D sachet: a uniquely Indian problem', tags:'vitamin d cholecalciferol deficiency icmr 60000 iu sachet south asian', href:'/research/vitamin-d-60000iu-weekly-sachet', meta:'12 min · Jan 2026' },
    { type:'guide', title:'Whey isolate vs concentrate for the Indian lactose-sensitive lifter', tags:'whey protein isolate concentrate lactose dairy mbblaze on gnc', href:'/pages/guides', meta:'14 min · Mar 2026' },
    { type:'guide', title:'Fish oil in India: why most bottles fail a freshness test', tags:'omega 3 fish oil epa dha peroxide totox freshness rancid', href:'/pages/guides', meta:'9 min · Feb 2026' },
    { type:'guide', title:'Ashwagandha: what KSM-66 and Sensoril trials actually show', tags:'ashwagandha ksm-66 sensoril withania stress cortisol adaptogen', href:'/pages/guides', meta:'16 min · Mar 2026' },
    { type:'guide', title:'Magnesium glycinate vs citrate vs oxide: the form actually matters', tags:'magnesium glycinate citrate oxide sleep cramps absorption', href:'/pages/guides', meta:'8 min · Apr 2026' },
    { type:'guide', title:'Caffeine and L-theanine: the stack behind every clean pre-workout', tags:'caffeine theanine pre workout focus energy stimulant', href:'/pages/guides', meta:'7 min · Mar 2026' },
    { type:'guide', title:'Beta-alanine: what the tingling actually means for Indian gym-goers', tags:'beta alanine carnosine paresthesia tingling pre workout endurance', href:'/pages/guides', meta:'10 min · Feb 2026' },
    { type:'guide', title:'Iron deficiency in Indian women: supplementation vs diet', tags:'iron ferritin anaemia women india diet vegetarian deficiency', href:'/pages/guides', meta:'13 min · Jan 2026' },
    { type:'guide', title:'Melatonin: why less is more (0.3mg vs 10mg)', tags:'melatonin sleep circadian dose chronobiotic low dose', href:'/pages/guides', meta:'6 min · Mar 2026' },

    // Ingredients
    { type:'ingredient', title:'Creatine monohydrate', tags:'creatine phosphocreatine atp strength muscle power creapure', href:'/pages/ingredients', meta:'Strong evidence · 3–5g/day' },
    { type:'ingredient', title:'Ashwagandha (KSM-66 / Sensoril)', tags:'ashwagandha ksm 66 sensoril withanolides stress cortisol adaptogen withania somnifera', href:'/pages/ingredients', meta:'Moderate evidence · 300–600mg/day' },
    { type:'ingredient', title:'Whey protein isolate', tags:'whey protein isolate wpi leucine dairy fast digesting muscle', href:'/pages/ingredients', meta:'Strong evidence · 20–40g/serving' },
    { type:'ingredient', title:'Omega-3 (EPA + DHA)', tags:'omega 3 epa dha fish oil fatty acid cardiovascular inflammation marine', href:'/pages/ingredients', meta:'Strong evidence · 1–2g EPA+DHA/day' },
    { type:'ingredient', title:'Vitamin D3 (cholecalciferol)', tags:'vitamin d3 cholecalciferol bone immune calcium deficiency south asian', href:'/pages/ingredients', meta:'Strong evidence · 1,000–2,000 IU/day' },
    { type:'ingredient', title:'Melatonin', tags:'melatonin sleep circadian hormone pineal shift work jet lag', href:'/pages/ingredients', meta:'Moderate evidence · 0.3–1mg pre-bed' },
    { type:'ingredient', title:'Magnesium glycinate', tags:'magnesium glycinate bisglycinate sleep anxiety cramps absorption chelate', href:'/pages/ingredients', meta:'Moderate evidence · 200–400mg/day' },
    { type:'ingredient', title:'L-theanine', tags:'theanine tea focus calm gaba relaxation caffeine synergy', href:'/pages/ingredients', meta:'Moderate evidence · 100–200mg/day' },
    { type:'ingredient', title:'Caffeine anhydrous', tags:'caffeine stimulant alertness pre workout endurance ergogenic', href:'/pages/ingredients', meta:'Strong evidence · 3–6mg/kg body weight' },
    { type:'ingredient', title:'Beta-alanine', tags:'beta alanine carnosine buffering paresthesia endurance lactic acid', href:'/pages/ingredients', meta:'Moderate evidence · 3.2–6.4g/day' },
    { type:'ingredient', title:'Coenzyme Q10 (ubiquinol)', tags:'coq10 ubiquinol mitochondria energy antioxidant statin heart', href:'/pages/ingredients', meta:'Moderate evidence · 100–300mg/day' },
    { type:'ingredient', title:'Zinc bisglycinate', tags:'zinc bisglycinate testosterone immune absorption chelate oyster', href:'/pages/ingredients', meta:'Moderate evidence · 15–30mg/day' },
    { type:'ingredient', title:'Vitamin B12 (methylcobalamin)', tags:'vitamin b12 methylcobalamin vegetarian vegan deficiency india neurological', href:'/pages/ingredients', meta:'Strong evidence · 500–1000mcg/day' },
    { type:'ingredient', title:'Rhodiola rosea', tags:'rhodiola adaptogen fatigue stress mental performance cortisol', href:'/pages/ingredients', meta:'Moderate evidence · 200–600mg/day' },
    { type:'ingredient', title:'Berberine', tags:'berberine glucose insulin resistance blood sugar ayurveda hba1c', href:'/pages/ingredients', meta:'Moderate evidence · 500mg 3×/day' },
    { type:'ingredient', title:'Turmeric (curcumin + piperine)', tags:'turmeric curcumin piperine inflammation bioavailability india traditional', href:'/pages/ingredients', meta:'Limited RCT evidence · 500–1000mg/day' },
    { type:'ingredient', title:'Collagen peptides (hydrolysed)', tags:'collagen peptides skin joint hydrolysed bovine marine gelatin', href:'/pages/ingredients', meta:'Limited evidence · 10–20g/day' },
    { type:'ingredient', title:'Vitamin K2 (MK-7)', tags:'vitamin k2 mk7 menaquinone bone calcium arterial d3 pairing', href:'/pages/ingredients', meta:'Moderate evidence · 90–180mcg/day' },
    { type:'ingredient', title:'L-tyrosine', tags:'tyrosine dopamine catecholamine focus stress cognitive', href:'/pages/ingredients', meta:'Limited evidence · 500–2000mg/day' },
    { type:'ingredient', title:'Probiotics (Lactobacillus + Bifidobacterium)', tags:'probiotic gut health lactobacillus bifidobacterium microbiome ibs', href:'/pages/ingredients', meta:'Moderate evidence · strain-dependent' },

    // Protocols
    { type:'protocol', title:'The Foundation Stack', tags:'beginner whey creatine vitamin d multivitamin starter basic', href:'/pages/protocols', meta:'₹1,840/month · Beginner' },
    { type:'protocol', title:'Lean Mass Builder', tags:'muscle gain lean mass creatine whey protein calories hypertrophy', href:'/pages/protocols', meta:'₹3,260/month · Muscle gain' },
    { type:'protocol', title:'Wind-Down Protocol', tags:'sleep recovery magnesium theanine melatonin wind down insomnia', href:'/pages/protocols', meta:'₹1,120/month · Sleep & recovery' },
    { type:'protocol', title:'Desk Athlete Stack', tags:'energy focus desk work tyrosine rhodiola caffeine omega brain fog', href:'/pages/protocols', meta:'₹2,090/month · Energy & focus' },
    { type:'protocol', title:'Bone & Joint Support', tags:'bone joint vitamin d k2 calcium collagen glucosamine arthritis', href:'/pages/protocols', meta:'₹980/month · Joints' },
    { type:'protocol', title:'Gut Reset Protocol', tags:'gut microbiome probiotic prebiotic fibre digestive health ibs', href:'/pages/protocols', meta:'₹1,350/month · Gut health' },

    // Reviews
    { type:'review', title:'MuscleBlaze Biozyme Performance Whey', tags:'muscleblaze biozyme whey protein blend india', href:'/pages/reviews', meta:'6.4/10 · ₹3,199/kg' },
    { type:'review', title:'GNC Pro Performance Creatine (Creapure)', tags:'gnc creatine creapure monohydrate pure unflavoured', href:'/pages/reviews', meta:'8.7/10 · ₹1,299/300g' },
    { type:'review', title:'Wellbeing Nutrition D3 + K2', tags:'wellbeing vitamin d3 k2 mk7 slow melt nano', href:'/pages/reviews', meta:'7.2/10 · ₹699/30d' },
    { type:'review', title:'Himalayan Organics Plant Omega 3-6-9', tags:'himalayan organics omega ala plant based flaxseed misleading', href:'/pages/reviews', meta:'4.1/10 · ₹599/60ct' },
    { type:'review', title:'Optimum Nutrition Gold Standard Whey', tags:'on gold standard whey isolate concentrate blend chocolate', href:'/pages/reviews', meta:'8.9/10 · ₹4,999/2lb' },
    { type:'review', title:'AS-IT-IS Creatine Monohydrate', tags:'as it is creatine monohydrate unflavoured budget value', href:'/pages/reviews', meta:'8.2/10 · ₹849/250g' },
    { type:'review', title:'Fast&Up Reload Electrolytes', tags:'fastup reload electrolyte hydration sodium potassium tablet effervescent', href:'/pages/reviews', meta:'6.8/10 · ₹349/20ct' },
    { type:'review', title:'Oziva Protein & Herbs for Women', tags:'oziva protein women plant based herbs fenugreek shatavari', href:'/pages/reviews', meta:'5.9/10 · ₹1,799/500g' },
  ];

  // Type icons + colors
  const TYPE_META = {
    guide:      { label:'Guide',      icon:'📖', cls:'st-guide'      },
    ingredient: { label:'Ingredient', icon:'⚗️', cls:'st-ingredient' },
    protocol:   { label:'Protocol',   icon:'📋', cls:'st-protocol'   },
    review:     { label:'Review',     icon:'⭐', cls:'st-review'     },
  };

  function searchQuery(q) {
    if (!q || q.length < 2) return [];
    const terms = q.toLowerCase().trim().split(/\s+/);
    return SEARCH_INDEX.filter(item => {
      const haystack = (item.title + ' ' + item.tags).toLowerCase();
      return terms.every(t => haystack.includes(t));
    }).slice(0, 12);
  }

  function renderResults(q) {
    const hitsEl   = document.getElementById('search-hits');
    const emptyEl  = document.getElementById('search-empty');
    const noResEl  = document.getElementById('search-no-results');
    const qDisp    = document.getElementById('search-query-display');
    if (!hitsEl) return;

    if (!q || q.length < 2) {
      hitsEl.hidden   = true;
      noResEl.hidden  = true;
      emptyEl.style.display = '';
      return;
    }

    const results = searchQuery(q);
    emptyEl.style.display = 'none';

    if (results.length === 0) {
      hitsEl.hidden  = true;
      noResEl.hidden = false;
      if (qDisp) qDisp.textContent = `"${q}"`;
      return;
    }

    noResEl.hidden = true;
    hitsEl.hidden  = false;

    // Group by type
    const grouped = {};
    results.forEach(r => {
      if (!grouped[r.type]) grouped[r.type] = [];
      grouped[r.type].push(r);
    });

    let html = '';
    const typeOrder = ['guide', 'ingredient', 'protocol', 'review'];
    typeOrder.forEach(type => {
      if (!grouped[type]) return;
      const tm = TYPE_META[type];
      html += `<div class="sr-group">
        <div class="sr-group-label">${tm.label}s</div>`;
      grouped[type].forEach((item, idx) => {
        html += `<a href="${item.href}" class="sr-item" data-idx="${idx}" tabindex="0">
          <span class="sr-type ${tm.cls}">${tm.icon}</span>
          <span class="sr-body">
            <span class="sr-title">${highlight(item.title, q)}</span>
            <span class="sr-meta">${item.meta}</span>
          </span>
          <span class="sr-arrow">→</span>
        </a>`;
      });
      html += `</div>`;
    });

    hitsEl.innerHTML = html;
    attachItemKeyboard(hitsEl);
  }

  function highlight(text, q) {
    const terms = q.toLowerCase().trim().split(/\s+/);
    let result = text;
    terms.forEach(t => {
      if (t.length < 2) return;
      result = result.replace(new RegExp(`(${escRe(t)})`, 'gi'), '<mark>$1</mark>');
    });
    return result;
  }

  function escRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    padding: 7px 14px;
    width:220px; cursor:pointer;
    transition: border-color .15s, box-shadow .15s;
  }
  .search-trigger:hover { border-color:var(--line-strong); }
  .search-trigger:focus { outline:0; box-shadow:0 0 0 3px color-mix(in oklab,var(--accent) 20%,transparent); border-color:var(--ink); }
  .search-trigger svg { width:15px;height:15px;color:var(--ink-muted);flex:0 0 auto; }
  .search-placeholder { flex:1; font-size:14px; color:var(--ink-muted); text-align:left; }
  .search-trigger .kbd { font-family:var(--font-mono);font-size:11px;color:var(--ink-muted);padding:2px 6px;border:1px solid var(--line);border-radius:5px;background:var(--bg);flex-shrink:0; }
  @media(max-width:1200px){ .search-trigger .kbd,.search-placeholder { display:none; } .search-trigger { width:auto; padding:7px; } }

  #search-overlay {
    position:fixed; inset:0; z-index:200;
    display:flex; align-items:flex-start; justify-content:center;
    padding-top:80px; padding-left:16px; padding-right:16px;
    pointer-events:none; opacity:0;
    transition:opacity .2s;
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
    transition:transform .2s cubic-bezier(.2,.7,.3,1);
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
    transition:background .15s,color .15s;
  }
  .search-close:hover { background:var(--ink);color:var(--bg); }
  .search-close svg { width:14px;height:14px; }

  .search-results { max-height:420px; overflow-y:auto; }

  .search-empty { padding:28px 24px; text-align:center; }
  .search-hint { color:var(--ink-muted); font-size:14.5px; }
  .sh-ex {
    display:inline-block; margin:0 4px;
    padding:2px 10px; border-radius:var(--r-pill);
    background:var(--surface); border:1px solid var(--line);
    color:var(--ink); font-size:13px; cursor:pointer;
    transition:border-color .15s,background .15s;
  }
  .sh-ex:hover { border-color:var(--accent);background:var(--accent-soft);color:var(--accent-deep); }

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
    transition:background .1s;
    cursor:pointer;
  }
  .sr-item:hover, .sr-item:focus { background:var(--surface); outline:0; }
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
                <span class="mark" aria-hidden="true"></span>
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

  // ─── Mobile nav ───────────────────────────────────────────────────────────
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('[data-menu-toggle]');
    if (toggleBtn) {
      const mobileNav = document.querySelector('.mobile-nav');
      if (mobileNav) mobileNav.classList.toggle('open');
      return;
    }
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav && e.target.closest('.mobile-nav a')) {
      mobileNav.classList.remove('open');
    }
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

  // ─── Vercel Speed Insights ────────────────────────────────────────────────
  window.si = window.si || function () {
    (window.siq = window.siq || []).push(arguments);
  };
  const siScript = document.createElement('script');
  siScript.src = '/_vercel/speed-insights/script.js';
  siScript.defer = true;
  document.head.appendChild(siScript);

})();
