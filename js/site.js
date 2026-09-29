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

  // highlight the current section in the table of contents
  var links = [].slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          if (current) current.classList.remove('on');
          current = map[en.target.id]; if (current) current.classList.add('on');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
})();

/* start-page toggle (header): homepage by default, or the full-screen editor */
(function () {
  var boxes = document.querySelectorAll('[data-starteditor]');
  if (!boxes.length) return;
  var pref = null; try { pref = localStorage.getItem('quilldown:start'); } catch (e) { }
  boxes.forEach(function (b) {
    b.checked = pref === 'editor';
    b.addEventListener('change', function () {
      try { localStorage.setItem('quilldown:start', b.checked ? 'editor' : 'home'); } catch (e) { }
      boxes.forEach(function (o) { o.checked = b.checked; });
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
