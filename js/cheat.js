/* Quilldown: cheat-sheet helpers. Search the syntax table (press / to focus), click any syntax to copy it,
   print the one-page PDF, and copy the whole cheat sheet as Markdown. The page reads fine without this script. */
(function () {
  'use strict';
  var doc = document, input = doc.getElementById('csSearch'), head = doc.getElementById('syntax-at-a-glance');
  if (!head) return;
  var table = head.nextElementSibling; while (table && !(table.classList && table.classList.contains('tbl'))) table = table.nextElementSibling;
  var rows = table ? [].slice.call(table.querySelectorAll('tbody tr')) : [];
  var notice = doc.createElement('p'); notice.className = 'cs-none'; notice.hidden = true; notice.textContent = 'Nothing in the table matches that. Try the search in the outline, or browse the sections below.';
  if (table) table.parentNode.insertBefore(notice, table.nextSibling);

  function toast(node, msg) {
    var t = doc.createElement('span'); t.className = 'cs-toast'; t.textContent = msg; node.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 1100);
  }
  function copy(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    else { var ta = doc.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px'; doc.body.appendChild(ta); ta.select(); var ok = false; try { ok = doc.execCommand('copy'); } catch (e) { } ta.remove(); done(ok); }
  }

  /* search */
  function filter() {
    var q = (input.value || '').trim().toLowerCase(), n = 0;
    rows.forEach(function (tr) { var ok = !q || tr.textContent.toLowerCase().indexOf(q) > -1; tr.hidden = !ok; if (ok) n++; });
    notice.hidden = n > 0 || !q;
  }
  if (input) {
    input.addEventListener('input', filter);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { input.value = ''; filter(); input.blur(); }
      if (e.key === 'Enter') { var tr = rows.filter(function (r) { return !r.hidden; })[0], a = tr && tr.querySelector('a[href^="#"]'); if (a) { location.hash = a.getAttribute('href'); } }
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      e.preventDefault(); input.focus(); input.select();
    });
  }

  /* click a syntax to copy it */
  if (table) {
    table.classList.add('cs-copyable');
    table.addEventListener('click', function (e) {
      var c = e.target.closest && e.target.closest('td code'); if (!c || e.target.closest('a')) return;
      var text = c.textContent.replace(/^\s+|\s+$/g, '');
      copy(text, function (ok) { c.classList.add('copied'); toast(c, ok ? 'Copied' : 'Press Ctrl+C'); setTimeout(function () { c.classList.remove('copied'); }, 1100); });
    });
  }

  /* one-page PDF: print only the syntax table */
  var pb = doc.getElementById('csPrint');
  if (pb && table) pb.addEventListener('click', function () {
    var box = doc.createElement('div'); box.id = 'glancePrint';
    box.innerHTML = '<h1>Markdown cheat sheet</h1><p>Quilldown · quilldown.vercel.app/docs/markdown-cheat-sheet</p>' + table.outerHTML;
    [].slice.call(box.querySelectorAll('tr[hidden]')).forEach(function (r) { r.hidden = false; });
    doc.body.appendChild(box); doc.body.classList.add('gp');
    var done = function () { doc.body.classList.remove('gp'); if (box.parentNode) box.parentNode.removeChild(box); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done); window.print(); setTimeout(function () { if (doc.body.classList.contains('gp') && !window.matchMedia('print').matches) done(); }, 1500);
  });

  /* copy the whole page as Markdown */
  var cb = doc.getElementById('csCopyMd'), src = doc.getElementById('cheat-md');
  if (cb && src) cb.addEventListener('click', function () {
    var text = '# Markdown cheat sheet\n\n' + src.textContent.replace(/<!--[\s\S]*?-->/g, '');
    copy(text, function (ok) { var old = cb.textContent; cb.textContent = ok ? 'Copied ✓' : 'Press Ctrl+C'; setTimeout(function () { cb.textContent = old; }, 1400); });
  });
})();
