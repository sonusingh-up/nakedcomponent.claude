import re

def main():
    file_path = r'd:\nakedcomponent.claude\project\blog\best-ice-cream-brands-india-2026.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. CSS & Style replacements
    style_pattern = re.compile(r'<style>.*?</style>', re.DOTALL)
    new_style = """<link rel="stylesheet" href="../../style.css?v=1001" />
<link rel="stylesheet" href="../../pages.css" />
<link rel="stylesheet" href="blog-components.css" />

<style>
  /* Stats strip */
  .stat-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--s-4); margin: var(--s-6) 0; }
  .stat-strip-card { background: var(--bg-elev); border: 1px solid var(--line); border-radius: var(--r-lg); padding: var(--s-4); text-align: center; min-width: 0; }
  .stat-strip-val { font-family: "Instrument Serif", Georgia, serif; font-size: 2rem; font-weight: 400; font-style: italic; color: var(--ink); line-height: 1; margin-bottom: 4px; }
  .stat-strip-label { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-muted); line-height: 1.3; }

  @media (max-width: 700px) {
    .stat-strip  { grid-template-columns: 1fr; }
  }
</style>"""
    
    # We should also replace the old CSS links
    content = re.sub(r'<link rel="stylesheet" href="/style\.css\?v=1001"/>\s*<link rel="stylesheet" href="/pages\.css"/>', '', content)
    content = style_pattern.sub(new_style, content)
    
    # 2. Hero structure
    # Old: <div class="blog-wrap"> \n  <!-- CATEGORY --> \n  <div class="blog-cat">...</div> \n  <h1>...</h1> \n  <p class="blog-lede">...</p> \n  <div class="blog-hero">...</div> \n  <div class="blog-byline">...</div>
    
    hero_pattern = re.compile(
        r'<div class="blog-wrap">\s*<!-- CATEGORY -->\s*<div class="blog-cat">(.*?)</div>\s*<!-- H1 -->\s*(<h1>.*?</h1>)\s*<!-- LEDE -->\s*<p class="blog-lede">(.*?)</p>\s*<!-- HERO -->\s*<div class="blog-hero">\s*<img src="#" alt="(.*?)" loading="eager"/>\s*</div>\s*<!-- BYLINE -->\s*<div class="blog-byline">.*?</div>',
        re.DOTALL
    )
    
    def hero_repl(match):
        cat = match.group(1)
        h1 = match.group(2)
        lede = match.group(3)
        alt = match.group(4)
        
        return f"""
  <section class="blog-hero">
    <div class="container">
      <div class="blog-category-pill">
        <span class="dot"></span>
        {cat}
      </div>
      
      {h1}
      
      <p class="blog-hero-deck">
        {lede}
      </p>

      <div class="blog-meta-row">
        <span>25 August 2026</span>
        <span class="sep">·</span>
        <span>~12 min read</span>
        <span class="sep">·</span>
        <span>{cat}</span>
      </div>

      <a href="/pages/authors" class="author-byline">
        <div class="ab-avatar">N</div>
        <div class="ab-text">
          Naked Compound Research Team
          <span>Editorial analysis · Authors page →</span>
        </div>
      </a>
    </div>
  </section>

  <!-- Hero Image (moved outside of the container) -->
  <section style="background:var(--bg);padding:var(--s-5) 0;">
    <div class="container" style="max-width:800px;">
       <img src="/uploads/icecrean-by-nakedcompound.png" alt="{alt}" style="width:100%;border-radius:var(--r-xl);border:1px solid var(--line);" />
    </div>
  </section>

  <div class="blog-body-wrap">
    <div class="blog-layout">
      <!-- Article -->
      <article class="blog-article" style="min-width:0;">
"""

    content = hero_pattern.sub(hero_repl, content)
    
    # 3. Callout boxes
    # <div class="callout-box info"> \n <span class="cb-icon">ℹ️</span> \n <div class="cb-body">...</div> \n </div>
    # to <div class="callout"><div class="ico">ℹ️</div><div>...</div></div>
    
    callout_pattern = re.compile(
        r'<div class="callout-box (.*?)">\s*<span class="cb-icon">(.*?)</span>\s*<div class="cb-body">(.*?)</div>\s*</div>',
        re.DOTALL
    )
    
    def callout_repl(match):
        ctype = match.group(1)
        icon = match.group(2)
        body = match.group(3)
        
        style = ""
        if 'warn' in ctype:
            style = ' style="background:var(--butter);color:#6b4f10;"'
        elif 'ok' in ctype:
            style = ' style="background:var(--mint);color:#3a6040;"'
            
        return f'<div class="callout">\n  <div class="ico"{style}>{icon}</div>\n  <div>\n    {body}\n  </div>\n</div>'
        
    content = callout_pattern.sub(callout_repl, content)
    
    # 4. Stat row to stat strip
    stat_row_pattern = re.compile(
        r'<div class="stat-row">(.*?)</div>\s*<p>',
        re.DOTALL
    )
    def stat_row_repl(match):
        inner = match.group(1)
        # replace stat-block with stat-strip-card, stat-num with stat-strip-val, stat-label with stat-strip-label
        inner = inner.replace('stat-block', 'stat-strip-card')
        inner = inner.replace('stat-num', 'stat-strip-val')
        inner = inner.replace('stat-label', 'stat-strip-label')
        return f'<div class="stat-strip">{inner}</div>\n<p>'
    
    content = stat_row_pattern.sub(stat_row_repl, content)
    
    # 5. Mobile TOC
    toc_pattern = re.compile(
        r'<!-- TOC -->\s*<div class="blog-toc">.*?<ol>(.*?)</ol>\s*</div>',
        re.DOTALL
    )
    def toc_repl(match):
        items = match.group(1)
        return f'<details class="mobile-toc">\n  <summary>On this page</summary>\n  <ul>\n{items}  </ul>\n</details>'
    
    content = toc_pattern.sub(toc_repl, content)

    # 6. Close the article and add sidebar
    # We need to replace:
    #   </div><!-- /blog-wrap -->
    #   </div><!-- /container -->
    # With the end of article and sidebar.
    
    sidebar = """
      </article><!-- /article -->

      <!-- Sidebar -->
      <aside class="blog-sidebar">
        <!-- Recommended products -->
        <div class="sidebar-block">
          <div class="sidebar-block-head">Featured in this guide</div>
          <div class="rec-product">
            <div class="rec-product-img">
              <span class="img-placeholder">🍨</span>
            </div>
            <div class="rec-product-name">Noto Sugar-Free Ice Cream</div>
            <div class="rec-product-sub">Sugar-free · High-protein</div>
            <div class="rec-product-actions">
              <a href="#" class="btn-review">Read full review →</a>
            </div>
          </div>
        </div>
      </aside><!-- /sidebar -->
    </div><!-- /.blog-layout -->
  </div><!-- /.blog-body-wrap -->
</div><!-- /container -->"""

    content = re.sub(r'</div><!-- /blog-wrap -->\s*</div><!-- /container -->', sidebar, content)
    
    # Finally, remove <div class="container" style="padding-top:var(--s-7);"> up to <div class="blog-wrap">
    # Wait, in original:
    # <div class="container" style="padding-top:var(--s-7);">
    # <nav class="nc-breadcrumb" style="margin-bottom:var(--s-5);">...</nav>
    # <div class="blog-wrap">
    # We should replace this with just the breadcrumb at the top.
    
    nav_pattern = re.compile(r'<div class="container" style="padding-top:var(--s-7);">\s*<nav class="nc-breadcrumb".*?</nav>\s*<div class="blog-wrap">')
    content = nav_pattern.sub('', content)

    # Clean up the breadcrumb - actually the reference shelf-survey doesn't have a visible breadcrumb block in the body, it's just in the JSON-LD, or maybe it's handled by #site-header. Let's just remove the container entirely and let <main> flow into <section class="blog-hero">
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    main()
