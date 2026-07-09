/* lesson.js — shared behaviour for /learn/* lesson pages.
 * Renders the sidebar path outline, progress dots, and prev/next nav from
 * /data/learn-curriculum.json so published pages never go stale when a new
 * lesson ships. Also records read lessons in localStorage (nc-learn-read).
 */
(function () {
  var root = document.querySelector('main[data-lesson]');
  if (!root) return;

  var slug = root.getAttribute('data-lesson');
  var pathNum = parseInt(root.getAttribute('data-path'), 10);

  var READ_KEY = 'nc-learn-read';
  function getRead() {
    try { return JSON.parse(localStorage.getItem(READ_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  // Mark this lesson as read on visit
  try {
    var read = getRead();
    if (!read[slug]) {
      read[slug] = new Date().toISOString().slice(0, 10);
      localStorage.setItem(READ_KEY, JSON.stringify(read));
    }
  } catch (e) { /* private mode etc. — non-fatal */ }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  fetch('/data/learn-curriculum.json')
    .then(function (r) { return r.json(); })
    .then(function (cur) {
      var p = (cur.paths || []).find(function (x) { return x.num === pathNum; });
      if (!p) return;
      var idx = p.lessons.findIndex(function (l) { return l.slug === slug; });
      if (idx === -1) return;
      var read = getRead();

      // Sidebar outline
      var list = document.getElementById('path-outline');
      if (list) {
        list.innerHTML = p.lessons.map(function (l, i) {
          var n = String(i + 1).padStart(2, '0');
          if (!l.published) {
            return '<li><span class="ol-soon"><span class="ol-num">' + n + '</span>' +
              esc(l.title) + '<em>soon</em></span></li>';
          }
          var cls = i === idx ? ' class="active"' : '';
          var done = read[l.slug] && i !== idx ? '<span class="ol-done">✓</span>' : '';
          return '<li><a href="/learn/' + l.slug + '"' + cls + '><span class="ol-num">' + n + '</span>' +
            esc(l.title) + done + '</a></li>';
        }).join('');
      }

      // Progress dots
      var dots = document.getElementById('lesson-dots');
      if (dots) {
        dots.innerHTML = p.lessons.map(function (l, i) {
          var cls = i === idx ? ' now' : (i < idx ? ' past' : '');
          return '<span class="dot' + cls + '"></span>';
        }).join('');
      }

      // Prev / next
      function setNav(el, lesson) {
        if (!el) return;
        var title = el.querySelector('.ln-title');
        if (!lesson) { el.style.display = 'none'; return; }
        if (lesson.published) {
          el.setAttribute('href', '/learn/' + lesson.slug);
          if (title) title.textContent = lesson.title;
        } else {
          el.classList.add('disabled');
          el.removeAttribute('href');
          if (title) title.textContent = lesson.title + ' — coming soon';
        }
      }
      setNav(document.getElementById('lesson-prev'), p.lessons[idx - 1]);
      setNav(document.getElementById('lesson-next'), p.lessons[idx + 1]);
    })
    .catch(function () { /* offline / file:// — sidebar keeps its fallback */ });
})();
