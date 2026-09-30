/* Quilldown: the 404 page. Shows the address that was requested and, when it looks like a typo of a real page, suggests that page.
   Runs entirely in the browser; the address never leaves it. */
(function () {
  'use strict';
  var path = decodeURIComponent(location.pathname || '/');
  var out = document.getElementById('nfPath');
  if (out) out.textContent = path.length > 60 ? path.slice(0, 57) + '…' : path;

  var box = document.getElementById('nfDid'), link = document.getElementById('nfDidLink');
  if (!box || !link) return;
  var list; try { list = JSON.parse(box.getAttribute('data-index') || '[]'); } catch (e) { return; }

  function norm(s) { return s.toLowerCase().replace(/\.(html|md)$/, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function dist(a, b) {
    var m = a.length, n = b.length, i, j, d = [];
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  var want = norm(path.split('/').filter(Boolean).pop() || '');
  if (!want) return;
  var best = null, bestScore = 1e9;
  list.forEach(function (p) {
    var slug = norm(p.p.split('/').filter(Boolean).pop() || '');
    var words = want.split(' '), hit = words.filter(function (w) { return w.length > 2 && slug.indexOf(w) > -1; }).length;
    var score = dist(want, slug) - hit * 4;
    if (score < bestScore) { bestScore = score; best = p; }
  });
  if (best && bestScore <= Math.max(4, want.length * 0.4)) {
    link.href = best.p; link.textContent = best.t; box.hidden = false;
  }
})();
