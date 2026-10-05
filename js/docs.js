/* Quilldown: the /docs hub. Search (press / to focus), filter by group, and "visited" ticks kept only on this device.
   Everything is plain HTML without this script. */
(function () {
  'use strict';
  var doc = document, input = doc.getElementById('docsSearch'), main = doc.getElementById('dxMain');
  if (!input || !main) return;
  var cards = [].slice.call(main.querySelectorAll('.dx-card')), groups = [].slice.call(main.querySelectorAll('.dx-group'));
  var statics = [].slice.call(main.querySelectorAll('.dx-static')), chips = [].slice.call(doc.querySelectorAll('.dx-chips button'));
  var status = doc.getElementById('dxStatus'), empty = doc.getElementById('dxEmpty'), ask = doc.getElementById('dxAsk');
  var base = status ? status.textContent : '', cat = 'all', total = cards.length;
  var KEY = 'quilldown:docs-visited';

  function visited() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function paintTicks() {
    var v = visited();
    cards.forEach(function (c) { c.classList.toggle('seen', v.indexOf(c.dataset.slug) > -1); });
  }
  paintTicks();

  function apply() {
    var q = input.value.trim().toLowerCase(), words = q.split(/\s+/).filter(Boolean), shown = 0, filtering = cat !== 'all' || words.length > 0;
    cards.forEach(function (c) {
      var hay = (c.textContent + ' ' + (c.dataset.text || '')).toLowerCase();
      var ok = (cat === 'all' || c.dataset.cat === cat) && words.every(function (w) { return hay.indexOf(w) > -1; });
      c.hidden = !ok; if (ok) shown++;
    });
    groups.forEach(function (g) { g.hidden = !g.querySelector('.dx-card:not([hidden])'); });
    statics.forEach(function (s) { s.hidden = filtering; });
    if (empty) empty.hidden = shown > 0;
    if (ask) ask.href = 'https://github.com/Dhruv-Dhameliya/quilldown/issues/new?title=' + encodeURIComponent('Guide suggestion: ' + input.value.trim());
    if (status) status.textContent = filtering ? shown + ' of ' + total + ' guides' : base;
  }
  chips.forEach(function (b) {
    b.addEventListener('click', function () { cat = b.dataset.cat; chips.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); apply(); if (cat !== 'all') { var t = doc.getElementById('all-documentation'); if (t) t.scrollIntoView({ block: 'start', behavior: 'smooth' }); } });
  });
  input.addEventListener('input', apply);
  input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; apply(); input.blur(); } });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    e.preventDefault(); input.focus(); input.select();
  });

  /* goal picker: hover or focus a goal to preview its guide in the panel beside it */
  var root = doc.documentElement, reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var peek = doc.getElementById('dxPeek'), goals = [].slice.call(main.querySelectorAll('.dx-goal'));
  if (peek && goals.length) {
    var current = null, swapTimer = 0;
    var show = function (g, instant) {
      if (g === current) return;
      var card = main.querySelector('.dx-card[data-slug="' + g.dataset.slug + '"]'); if (!card) return;
      current = g;
      goals.forEach(function (x) { x.classList.toggle('on', x === g); });
      var html = '<div class="dx-pk"><span class="dx-pk-ico" aria-hidden="true">' + esc(g.querySelector('.dx-gi').textContent) + '</span>'
        + '<span class="dx-pk-cat">' + esc(card.querySelector('.dx-cat').textContent) + '</span>'
        + '<h3>' + esc(card.querySelector('strong').textContent) + '</h3>'
        + '<p>' + esc(card.querySelector('.dx-d').textContent) + '</p>'
        + '<span class="dx-pk-meta">' + esc(card.querySelector('.dx-top span:last-child').textContent) + ' read</span>'
        + '<a class="btn btn-primary" href="' + esc(g.getAttribute('href')) + '">Open this guide <svg class="i"><use href="#i-arrow"/></svg></a></div>';
      var paint = function () { peek.innerHTML = html; peek.setAttribute('data-cat', card.dataset.cat); peek.classList.remove('swap'); };
      clearTimeout(swapTimer);
      if (instant || reduced) paint(); else { peek.classList.add('swap'); swapTimer = setTimeout(paint, 150); }
    };
    peek.hidden = false; show(goals[0], true);
    goals.forEach(function (g) {
      g.addEventListener('mouseenter', function () { show(g); });
      g.addEventListener('focus', function () { show(g); });
    });
  }

  /* cards: a soft glow follows the cursor, and they arrive as you scroll */
  main.addEventListener('pointermove', function (e) {
    var c = e.target.closest ? e.target.closest('.dx-card,.dx-goal') : null; if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
  if (!reduced && 'IntersectionObserver' in window) {
    root.classList.add('dx-rv');
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.04 });
    [].slice.call(main.querySelectorAll('.dx-big,.dx-goal,.dx-card,.dx-path')).forEach(function (el, i) {
      el.classList.add('dx-rvi'); el.style.setProperty('--d', ((i % 4) * 60) + 'ms'); io.observe(el);
    });
  }
})();
