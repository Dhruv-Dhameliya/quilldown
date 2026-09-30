/* Quilldown — behaviour for /how-quilldown-works (timeline, sticky demo, export chooser, mini editor).
   Everything here is an enhancement: the page reads fine without it. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('hw-js');
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. timeline progress + the sticky demo that follows the step in view */
  var timeline = doc.querySelector('.hw-timeline'), steps = [].slice.call(doc.querySelectorAll('.hw-step')), demo = doc.querySelector('.hw-demo');
  var panels = [];
  if (demo) {
    var holder = demo.querySelector('.hw-panels');
    steps.forEach(function (s, i) {
      var shot = s.querySelector('.hw-shot'); if (!shot) return;
      var p = doc.createElement('div'); p.className = 'hw-panel'; p.innerHTML = shot.innerHTML;
      holder.appendChild(p); panels[i] = p;
    });
    demo.setAttribute('data-step', '1'); if (panels[0]) panels[0].classList.add('on');
  }
  var ticking = false, active = -1;
  function update() {
    ticking = false;
    if (timeline) {
      var r = timeline.getBoundingClientRect(), mid = window.innerHeight * 0.5;
      var p = Math.max(0, Math.min(1, (mid - r.top) / Math.max(1, r.height)));
      timeline.style.setProperty('--p', p.toFixed(3));
    }
    var idx = 0;
    steps.forEach(function (s, i) { if (s.getBoundingClientRect().top < window.innerHeight * 0.55) idx = i; });
    if (idx !== active) {
      active = idx;
      steps.forEach(function (s, i) { s.classList.toggle('on', i <= idx); });
      if (demo) {
        demo.setAttribute('data-step', String(idx + 1));
        panels.forEach(function (pn, i) { if (pn) pn.classList.toggle('on', i === idx); });
      }
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  if (steps.length) { window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); update(); }

  /* 2. export chooser (tabs) */
  [].slice.call(doc.querySelectorAll('.hw-choose')).forEach(function (box) {
    var tabs = [].slice.call(box.querySelectorAll('[role="tab"]')), pans = [].slice.call(box.querySelectorAll('[role="tabpanel"]'));
    function show(i, focus) {
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
      pans.forEach(function (p, j) { p.hidden = i !== j; });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var d = { ArrowRight: 1, ArrowLeft: -1, Home: -tabs.length, End: tabs.length }[e.key];
        if (d) { e.preventDefault(); show(e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + d + tabs.length) % tabs.length, true); }
      });
    });
    show(0);
  });

  /* 3. the tiny live editor */
  var ta = doc.getElementById('hwText'), out = doc.getElementById('hwOut'), open = doc.getElementById('hwOpen');
  if (ta && out) {
    var b64u = function (s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
    var timer = 0;
    var render = function () {
      var html;
      if (window.marked) {
        html = window.marked.parse(ta.value, { gfm: true });
        html = html.replace(/<(\/?)h([1-6])([ >])/g, function (m, slash, n, end) { return slash ? '</div>' : '<div class="hd hd' + n + '"' + (end === '>' ? '>' : ' '); });
        if (window.DOMPurify) html = window.DOMPurify.sanitize(html);
        out.innerHTML = html;
      } else out.textContent = ta.value;
      if (open) open.href = '/#d=u.' + b64u(JSON.stringify({ n: 'try-it.md', t: ta.value }));
    };
    ta.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(render, reduced ? 0 : 60); });
    render();
    window.addEventListener('load', render);
  }
})();
