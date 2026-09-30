/* Quilldown: /faq behaviour. Search (press / to focus), expand and collapse all, deep links that open the right answer.
   The page reads fine without any of this: every answer is plain HTML inside a <details> element. */
(function () {
  'use strict';
  var doc = document, list = doc.getElementById('faqList'), input = doc.getElementById('faqSearch');
  if (!list || !input) return;
  var items = [].slice.call(list.querySelectorAll('details')), secs = [].slice.call(list.querySelectorAll('.faq-sec'));
  var status = doc.getElementById('faqStatus'), empty = doc.getElementById('faqEmpty'), ask = doc.getElementById('faqAsk');
  var base = status ? status.textContent : '', total = items.length, reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var texts = items.map(function (d) { return d.textContent.toLowerCase(); });
  var opened = null;   // which answers were open before a search started

  function clearMarks() {
    [].slice.call(list.querySelectorAll('mark.hit')).forEach(function (m) { var p = m.parentNode; p.replaceChild(doc.createTextNode(m.textContent), m); p.normalize(); });
  }
  function mark(root, words) {
    var walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return n.parentNode.closest('pre,code,script,style,mark') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } });
    var nodes = [], n; while ((n = walker.nextNode())) nodes.push(n);
    var re = new RegExp('(' + words.map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'ig');
    nodes.forEach(function (t) {
      if (!re.test(t.nodeValue)) return; re.lastIndex = 0;
      var frag = doc.createDocumentFragment(), last = 0, m, s = t.nodeValue;
      while ((m = re.exec(s))) { if (m.index > last) frag.appendChild(doc.createTextNode(s.slice(last, m.index))); var k = doc.createElement('mark'); k.className = 'hit'; k.textContent = m[0]; frag.appendChild(k); last = m.index + m[0].length; if (m[0].length === 0) re.lastIndex++; }
      if (last < s.length) frag.appendChild(doc.createTextNode(s.slice(last)));
      t.parentNode.replaceChild(frag, t);
    });
  }
  function search() {
    var q = input.value.trim().toLowerCase(), words = q.split(/\s+/).filter(function (w) { return w.length > 0; });
    clearMarks();
    if (!words.length) {
      items.forEach(function (d, i) { d.hidden = false; if (opened) d.open = opened[i]; });
      secs.forEach(function (s) { s.hidden = false; }); opened = null;
      if (empty) empty.hidden = true; if (status) status.textContent = base; return;
    }
    if (!opened) opened = items.map(function (d) { return d.open; });
    var shown = 0;
    items.forEach(function (d, i) {
      var ok = words.every(function (w) { return texts[i].indexOf(w) > -1; });
      d.hidden = !ok; if (ok) { shown++; d.open = true; mark(d, words); }
    });
    secs.forEach(function (s) { s.hidden = !s.querySelector('details:not([hidden])'); });
    if (empty) empty.hidden = shown > 0;
    if (ask) ask.href = 'https://github.com/Dhruv-Dhameliya/quilldown/issues/new?title=' + encodeURIComponent('FAQ question: ' + input.value.trim());
    if (status) status.textContent = shown + ' of ' + total + ' questions match';
  }
  var timer = 0;
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(search, 90); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Escape' && input.value) { input.value = ''; search(); } });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    e.preventDefault(); input.focus(); input.select();
  });

  var ex = doc.getElementById('faqExpand'), co = doc.getElementById('faqCollapse');
  if (ex) ex.addEventListener('click', function () { items.forEach(function (d) { if (!d.hidden) d.open = true; }); });
  if (co) co.addEventListener('click', function () { items.forEach(function (d) { d.open = false; }); });

  /* a link to one answer (#markdown-to-pdf, or a "most asked" chip) opens it and scrolls to it */
  function goHash() {
    var id = decodeURIComponent(location.hash.slice(1)); if (!id) return;
    var el = doc.getElementById(id); if (!el) return;
    if (input.value) { input.value = ''; search(); }
    if (el.tagName === 'DETAILS') el.open = true;
    requestAnimationFrame(function () { el.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' }); });
  }
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.faq-most a, .faq-symptoms a'); if (!a) return;
    var el = doc.getElementById(a.getAttribute('href').slice(1)); if (!el) return;
    e.preventDefault(); history.replaceState(null, '', a.getAttribute('href')); goHash();
  });
  window.addEventListener('hashchange', goHash);
  if (location.hash) setTimeout(goHash, 60);

  /* print: open every answer */
  window.addEventListener('beforeprint', function () { items.forEach(function (d) { d.dataset.was = d.open ? '1' : ''; d.open = true; }); });
  window.addEventListener('afterprint', function () { items.forEach(function (d) { d.open = !!d.dataset.was; }); });
})();
