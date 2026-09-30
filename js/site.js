/* Quilldown — tiny script for the guide pages: theme toggle, copy buttons, table-of-contents highlight. */
(function () {
  'use strict';
  var KEY = 'quilldown:theme';
  var root = document.documentElement;

  // theme (the head script already applied the saved/system theme before first paint)
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act="theme"]');
    if (!t) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (err) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === 'dark' ? '#09090b' : '#fbfbfa';
  });

  // sticky-nav border once scrolled
  var nav = document.getElementById('nav');
  if (nav) window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });

  // copy buttons: <button class="copy-btn" data-copy-from="#id">  or  data-copy="text"
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.copy-btn');
    if (!b) return;
    var text = b.getAttribute('data-copy');
    if (text === null) { var src = document.querySelector(b.getAttribute('data-copy-from')); text = src ? src.textContent : ''; }
    var done = function (ok) {
      var old = b.getAttribute('data-label') || b.textContent;
      b.setAttribute('data-label', old);
      b.textContent = ok ? 'Copied' : 'Press Ctrl+C';
      b.classList.toggle('done', ok);
      setTimeout(function () { b.textContent = old; b.classList.remove('done'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    else {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px'; document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (err) {} ta.remove(); done(ok);
    }
  });

  // highlight the current section in the table of contents / outline (the last heading that has reached the top of the window)
  var links = [].slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (links.length) {
    var items = links.map(function (a) { return { a: a, el: document.getElementById(a.getAttribute('href').slice(1)) }; }).filter(function (x) { return x.el; });
    var busy = false, cur = null;
    var mark = function () {
      busy = false;
      var line = Math.min(160, window.innerHeight * 0.3), pick = null;
      items.forEach(function (x) { if (x.el.getBoundingClientRect().top <= line) pick = x; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && items.length) pick = items[items.length - 1];
      if (pick === cur) return;
      if (cur) cur.a.classList.remove('on');
      cur = pick; if (cur) {
        cur.a.classList.add('on');
        var bar = cur.a.parentNode;   // horizontal chip strip on small screens: keep the active chip in view
        if (bar && bar.scrollWidth > bar.clientWidth + 4) bar.scrollTo({ left: cur.a.offsetLeft - 24, behavior: 'smooth' });
      }
    };
    var tick = function () { if (!busy) { busy = true; requestAnimationFrame(mark); } };
    window.addEventListener('scroll', tick, { passive: true }); window.addEventListener('resize', tick); mark();
  }
})();

/* start-page toggle (header): homepage by default, or the full-screen editor */
(function () {
  var boxes = document.querySelectorAll('[data-starteditor]');
  if (!boxes.length) return;
  var pref = null; try { pref = localStorage.getItem('quilldown:start'); } catch (e) { }
  boxes.forEach(function (b) {
    b.setAttribute('aria-checked', String(pref === 'editor'));
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-checked') !== 'true';
      try { localStorage.setItem('quilldown:start', on ? 'editor' : 'home'); } catch (e) { }
      boxes.forEach(function (o) { o.setAttribute('aria-checked', String(on)); });
    });
  });
})();

/* mobile menu */
(function () {
  var nav = document.getElementById('nav'), btn = nav && nav.querySelector('.nav-toggle');
  if (!btn) return;
  function close() { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function () { btn.setAttribute('aria-expanded', String(nav.classList.toggle('open'))); });
  nav.addEventListener('click', function (e) { if (e.target.closest('.nav-links a')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();

/* docs hub: topic chips + search */
(function () {
  var grid = document.getElementById('docsGrid');
  if (!grid) return;
  var cards = [].slice.call(grid.children), input = document.getElementById('docsSearch'), empty = document.getElementById('docsEmpty'), count = document.getElementById('docsCount');
  var chips = [].slice.call(document.querySelectorAll('.docs-chips button')), cat = 'all';
  function apply() {
    var q = (input.value || '').trim().toLowerCase(), n = 0;
    cards.forEach(function (c) { var ok = (cat === 'all' || c.dataset.cat === cat) && (!q || c.dataset.text.indexOf(q) > -1); c.hidden = !ok; if (ok) n++; });
    count.textContent = n; empty.hidden = n > 0;
  }
  chips.forEach(function (b) { b.addEventListener('click', function () { cat = b.dataset.cat; chips.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); apply(); }); });
  input.addEventListener('input', apply);
  input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; apply(); input.blur(); } });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });
})();

/* remember which guides were opened, on this device only (shown as ticks on /docs) */
(function () {
  var m = /^\/docs\/([\w-]+)\/?$/.exec(location.pathname); if (!m) return;
  try { var k = 'quilldown:docs-visited', v = JSON.parse(localStorage.getItem(k) || '[]'); if (v.indexOf(m[1]) < 0) { v.push(m[1]); localStorage.setItem(k, JSON.stringify(v)); } } catch (e) { }
})();

/* thin reading-progress bar on guide pages */
(function () {
  var bar = document.querySelector('.reading-bar i'), body = document.querySelector('.doc-body');
  if (!bar || !body) return;
  var busy = false;
  function upd() {
    busy = false;
    var r = body.getBoundingClientRect(), total = r.height - window.innerHeight * 0.6;
    var p = total > 0 ? Math.max(0, Math.min(1, (window.innerHeight * 0.4 - r.top) / total)) : 0;
    bar.style.width = (p * 100).toFixed(1) + '%';
  }
  window.addEventListener('scroll', function () { if (!busy) { busy = true; requestAnimationFrame(upd); } }, { passive: true });
  window.addEventListener('resize', upd); upd();
})();

/* Mermaid examples in guides: draw the "Result" pane as a real diagram (the bundled library loads only when a page has one) */
(function () {
  var nodes = [].slice.call(document.querySelectorAll('.ex-out pre[data-lang="mermaid"]'));
  if (!nodes.length) return;
  var items = nodes.map(function (pre) { var code = pre.textContent, box = document.createElement('div'); box.className = 'mmd-out'; box.setAttribute('role', 'img'); box.setAttribute('aria-label', 'Rendered diagram'); pre.parentNode.replaceChild(box, pre); return { box: box, code: code }; });
  var seq = 0, lib = null;
  function load() {
    if (lib) return lib;
    if (window.mermaid) { lib = Promise.resolve(window.mermaid); return lib; }
    lib = new Promise(function (ok, fail) { var s = document.createElement('script'); s.src = '/vendor/mermaid.min.js'; s.onload = function () { ok(window.mermaid); }; s.onerror = fail; document.head.appendChild(s); });
    return lib;
  }
  function draw() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    load().then(function (m) {
      m.initialize({ startOnLoad: false, securityLevel: 'strict', theme: dark ? 'dark' : 'neutral', suppressErrorRendering: true, fontFamily: 'Nunito, system-ui, sans-serif' });
      return items.reduce(function (p, it) {
        return p.then(function () {
          var id = 'mm' + (++seq);
          return m.render(id, it.code).then(function (r) { it.box.innerHTML = r.svg; }, function () { var e = document.getElementById('d' + id); if (e) e.remove(); it.box.textContent = 'Diagram could not be drawn.'; });
        });
      }, Promise.resolve());
    }, function () { items.forEach(function (it) { it.box.textContent = it.code; }); });
  }
  setTimeout(draw, 400);   // after the page has settled; the library is bundled with the site
  new MutationObserver(function () { if (lib) draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
