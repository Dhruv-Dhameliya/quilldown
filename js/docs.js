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
})();
