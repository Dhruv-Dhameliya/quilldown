/* Quilldown: /docs/markdown-to-pdf. Turns the "Save as PDF in your browser" table into tabs and preselects the visitor's likely browser.
   Without this script the table stays as it is. */
(function () {
  'use strict';
  var doc = document, h = doc.getElementById('save-as-pdf-in-your-browser'); if (!h) return;
  var wrap = h.nextElementSibling; while (wrap && !(wrap.classList && wrap.classList.contains('tbl'))) wrap = wrap.nextElementSibling;
  if (!wrap) return;
  var rows = [].slice.call(wrap.querySelectorAll('tbody tr')).map(function (tr) { var c = tr.children; return { name: c[0].textContent.trim(), html: c[1].innerHTML }; });
  if (rows.length < 2) return;
  var ua = navigator.userAgent || '', pick = 0;
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) pick = 3; else if (/Firefox/i.test(ua)) pick = 1; else if (/Macintosh/i.test(ua) && !/Chrome|Edg/i.test(ua)) pick = 2;
  var box = doc.createElement('div'); box.className = 'pdf-tabs';
  var bar = doc.createElement('div'); bar.className = 'pdf-tabbar'; bar.setAttribute('role', 'tablist'); bar.setAttribute('aria-label', 'Where you are');
  var panel = doc.createElement('div'); panel.className = 'pdf-tabpanel'; panel.setAttribute('role', 'tabpanel');
  var btns = rows.map(function (r, i) {
    var b = doc.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = r.name; b.addEventListener('click', function () { show(i); });
    b.addEventListener('keydown', function (e) { var d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (d) { e.preventDefault(); show((i + d + rows.length) % rows.length, true); } });
    bar.appendChild(b); return b;
  });
  function show(i, focus) { btns.forEach(function (b, j) { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; }); panel.innerHTML = rows[i].html; if (focus) btns[i].focus(); }
  box.appendChild(bar); box.appendChild(panel);
  wrap.parentNode.insertBefore(box, wrap); wrap.classList.add('pdf-table-fallback'); box.appendChild(wrap);
  wrap.hidden = true; show(pick);
})();
