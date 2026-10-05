/* Quilldown: behaviour for /how-to-use.
   - A copy of the editor stays put while you scroll. A pointer glides to the part of it that each step explains.
   - Click any part of the copy and a popup explains it (its words are cloned from the reference section lower on the page).
   - The reference section has area chips that filter the list.
   Everything here is an enhancement: without JavaScript the page reads as a normal article. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, win = window;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || doc).querySelectorAll(s)); };
  var reduced = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (n, a, b) { return Math.min(b, Math.max(a, n)); };

  var track = $('.gd-track'), sticky = $('.gd-sticky'), frame = $('#gdFrame'), scaler = $('#gdScaler'), tool = $('#gdTool');
  var hud = $('.gd-hud'), ring = $('#gdRing'), pointer = $('#gdPointer'), cap = $('#gdCap'), num = $('#gdNum'), fill = $('#gdFill');
  var steps = $$('.gd-step');
  var DW = 1180, DH = 580;
  var cur = -1, ready = false, aimed = null, popOpen = false, dismissed = false, lit = false;
  var compact = false, frameW = 0, frameH = 0, basePad = 14, baseScale = 1, cam = { s: 1, x: 0, y: 0 };

  /* ---------------------------------------------------------------- reference filter (works on its own) */
  (function chips() {
    var box = $('.gd-chips'); if (!box) return;
    var btns = $$('button', box), secs = $$('.gd-rg');
    function apply(g) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-g') === g)); });
      secs.forEach(function (s) { s.hidden = g !== 'all' && s.getAttribute('data-g') !== g; });
    }
    box.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) apply(b.getAttribute('data-g')); });
    win.gdShowAll = function () { apply('all'); };
    if (/^#(f|ref)-/.test(location.hash)) apply('all');
  })();

  /* ---------------------------------------------------------------- reference cards: arrive as you scroll, glow under the cursor */
  (function cards() {
    var ref = $('.gd-ref'); if (!ref) return;
    ref.addEventListener('pointermove', function (e) {
      var c = e.target.closest ? e.target.closest('.gf') : null; if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    if (reduced || !('IntersectionObserver' in win)) return;
    root.classList.add('gd-rv');
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    $$('.gf', ref).forEach(function (a, i) { a.style.setProperty('--d', ((i % 4) * 70) + 'ms'); io.observe(a); });
  })();

  if (!track || !tool || !steps.length || !frame || !scaler) return;
  root.classList.add('gd-js');

  /* ---------------------------------------------------------------- layout and camera
     On a wide screen the whole copy is scaled to fit. On a phone it is shown larger and the camera pans and zooms to the part being explained. */
  var stickyTop = 76;
  function layout() {
    var w = sticky.clientWidth, vh = win.innerHeight;
    compact = w < 760;
    sticky.classList.toggle('gd-compact', compact);
    stickyTop = parseFloat(getComputedStyle(sticky).top) || 76;
    var hudH = $('.gd-hud').offsetHeight, pad = compact ? 6 : 14, fh, base;
    if (compact) { fh = clamp(Math.round(vh * 0.42), 250, 380); base = clamp(w / 520, 0.6, 0.95); }
    else {
      var availH = vh - stickyTop - hudH - 28;
      base = clamp(Math.min((w - pad * 2) / DW, (availH - pad * 2) / DH), 0.3, 1.32);
      fh = Math.round(DH * base + pad * 2);
    }
    frameW = w; frameH = fh; basePad = pad; baseScale = base;
    frame.style.height = fh + 'px';
  }
  function designRect(el) {
    var t = tool.getBoundingClientRect(), r = el.getBoundingClientRect(), k = t.width / DW;
    return { l: (r.left - t.left) / k, t: (r.top - t.top) / k, w: r.width / k, h: r.height / k };
  }
  function camFor(el) {
    var s = baseScale;
    if (!compact || !el) return { s: s, x: Math.round((frameW - DW * s) / 2), y: basePad };
    var d = designRect(el), vw = frameW / s, vh = frameH / s;
    // a target that fits is centered; one that is bigger than the window is lined up by its top-left corner
    var cx = d.w > vw - 24 ? d.l + (vw / 2 - 14) : d.l + d.w / 2, cy = d.h > vh - 24 ? d.t + (vh / 2 - 14) : d.t + d.h / 2;
    return { s: s, x: clamp(frameW / 2 - cx * s, frameW - DW * s - 6, 6), y: clamp(frameH / 2 - cy * s, frameH - DH * s - 6, 6) };
  }
  function applyCam(c, instant) {
    cam = c;
    if (instant) scaler.style.transition = 'none';
    scaler.style.transform = 'translate3d(' + c.x + 'px,' + c.y + 'px,0) scale(' + c.s + ')';
    if (instant) { void scaler.offsetWidth; scaler.style.transition = ''; }
  }

  /* ---------------------------------------------------------------- finding things */
  function resolve(spec) {
    var p = spec.split(':'), k = p[0], id = p[1];
    return k === 'f' ? $('[data-f="' + id + '"]', tool) : $('[data-g="' + id + '"]', tool);
  }
  function ringTarget(el) { return el.getAttribute('data-ring') ? (el.closest(el.getAttribute('data-ring')) || el) : el; }
  var tapTimer = 0;
  function movePointer(el, instant) {
    var rt = ringTarget(el), c = camFor(rt), d = designRect(rt);
    applyCam(c, instant);
    var l = c.x + d.l * c.s, t = c.y + d.t * c.s, w = d.w * c.s, h = d.h * c.s, big = w > 220 && h > 120;
    var x = l + (big ? Math.min(w * 0.3, 150) : w / 2), y = t + (big ? Math.min(h * 0.3, 90) : h / 2);
    if (instant) { pointer.style.transition = 'none'; ring.style.transition = 'none'; }
    pointer.style.transform = 'translate3d(' + (x - 2) + 'px,' + (y - 1) + 'px,0)';
    var g = c.s > 0.6 ? 5 : 3;
    ring.style.transform = 'translate3d(' + (l - g) + 'px,' + (t - g) + 'px,0)';
    ring.style.width = (w + g * 2) + 'px'; ring.style.height = (h + g * 2) + 'px';
    ring.style.borderRadius = Math.min(14, Math.max(7, Math.round(Math.min(w, h) / 3))) + 'px';
    if (instant) { void pointer.offsetWidth; pointer.style.transition = ''; ring.style.transition = ''; }
    clearTimeout(tapTimer);
    pointer.classList.remove('tap');
    tapTimer = setTimeout(function () { pointer.classList.add('tap'); }, reduced || instant ? 0 : 880);
  }
  function placeCap(el, instant) {
    if (compact) { cap.style.transform = ''; return; }
    var s = sticky.getBoundingClientRect(), f = frame.getBoundingClientRect(), r = ringTarget(el).getBoundingClientRect();
    var w = cap.offsetWidth, h = cap.offsetHeight, gap = 20;
    var fl = f.left - s.left, ft = f.top - s.top, fr = f.right - s.left, fb = f.bottom - s.top;
    var cx = r.left - s.left + r.width / 2, tt = r.top - s.top, tb = r.bottom - s.top;
    var x = clamp(cx - w / 2, fl + 12, fr - w - 12), y;
    if (tb + gap + h <= fb - 8) y = tb + gap;
    else if (tt - gap - h >= ft + 8) y = tt - gap - h;
    else y = clamp(tt + 56, ft + 8, fb - h - 8);
    if (instant) cap.style.transition = 'none';
    cap.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(y) + 'px,0)';
    if (instant) { void cap.offsetWidth; cap.style.transition = ''; }
  }
  function setCaption(i) {
    var s = steps[i], title = $('.gd-st', s).textContent, text = $('p', s).textContent;
    var spec = s.getAttribute('data-t'), isF = spec.charAt(0) === 'f', cta = s.hasAttribute('data-cta'), hint = s.hasAttribute('data-hint');
    var paint = function () {
      $('.gd-cap-n b', cap).textContent = String(i + 1);
      $('.gd-cap-t', cap).textContent = title;
      $('.gd-cap-p', cap).textContent = text;
      $('.gd-more', cap).hidden = !isF || cta;
      $('.gd-cta', cap).hidden = !cta;
      $('.gd-cap-hint', cap).hidden = !hint;
      cap.classList.remove('out');
    };
    if (reduced || !ready) paint(); else { cap.classList.add('out'); setTimeout(paint, 170); }
  }
  function aim(el, instant) {
    aimed = el; movePointer(el, instant); placeCap(el, instant);
  }

  /* ---------------------------------------------------------------- scroll position -> step
     At the very top of the tour nothing is selected. Steps appear one by one as you scroll. The close button on the card puts the copy back to
     that neutral state, and Next / Previous carry on from the step you were on. */
  function scrollable() { return Math.max(1, track.offsetHeight - sticky.offsetHeight); }
  function indexFromScroll() {
    var y = stickyTop - track.getBoundingClientRect().top;
    if (y < 24) return -1;
    return clamp(Math.floor((y / scrollable()) * steps.length), 0, steps.length - 1);
  }
  function light(on) { pointer.classList.toggle('on', on); ring.classList.toggle('on', on); lit = on; }
  function clearStage() {
    light(false); cap.classList.remove('show'); cap.setAttribute('aria-hidden', 'true');
    aimed = null; applyCam(camFor(null));
  }
  function updateNav() {
    var prev = $('.gd-nav[data-dir="-1"]'), next = $('.gd-nav[data-dir="1"]');
    if (prev) prev.disabled = cur <= 0;
    if (next) next.disabled = cur >= steps.length - 1 && !dismissed;
    hud.classList.toggle('paused', dismissed);
    num.textContent = cur < 0 ? '\u2013' : String(cur + 1);
    fill.style.width = (cur < 0 ? 0 : ((cur + 1) / steps.length) * 100) + '%';
  }
  /* the pointer arrives from the corner of the stage the first time it appears */
  function flyIn(el) {
    aim(el, true);
    var f = frame.getBoundingClientRect();
    pointer.style.transition = 'none';
    pointer.style.transform = 'translate3d(' + Math.round(f.width * 0.84) + 'px,' + Math.round(f.height * 0.9) + 'px,0)';
    void pointer.offsetWidth; pointer.style.transition = '';
    light(true);
    movePointer(el, false);
  }
  function go(i, force) {
    if (i === cur && lit && !force) return;
    var first = !lit;
    cur = i; dismissed = false;
    if (popOpen) closePop(false);
    var el = resolve(steps[i].getAttribute('data-t'));
    cap.setAttribute('aria-hidden', 'false'); cap.classList.add('show'); cap.classList.remove('away');
    setCaption(i);
    if (el) { if (first) flyIn(el); else aim(el); }
    updateNav();
  }
  function sync() {
    var i = indexFromScroll();
    if (i < 0) {                                       // back at the top: nothing selected again
      if (cur !== -1 || dismissed || lit) { dismissed = false; if (popOpen) closePop(false); cur = -1; clearStage(); updateNav(); }
      return;
    }
    if (dismissed) return;
    go(i);
  }
  function dismiss() {
    if (!lit && !popOpen) return;
    dismissed = true;
    if (popOpen) closePop(false);
    clearStage(); updateNav();
  }
  var ticking = false;
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; sync(); }); }
  function scrollToStep(i) {
    i = clamp(i, 0, steps.length - 1);
    var top = track.getBoundingClientRect().top + win.pageYOffset - stickyTop + ((i + 0.5) / steps.length) * scrollable();
    win.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
  }
  function stepBy(d) {
    var t = cur < 0 ? (d > 0 ? 0 : -1) : clamp(cur + d, 0, steps.length - 1);
    if (t < 0) return;
    if (dismissed || !lit) go(t, true);
    scrollToStep(t);
  }
  $$('.gd-nav').forEach(function (b) { b.addEventListener('click', function () { stepBy(parseInt(b.getAttribute('data-dir'), 10)); }); });
  $('.gd-close', cap).addEventListener('click', dismiss);

  /* ---------------------------------------------------------------- popup that explains a feature */
  var pop = doc.createElement('div');
  pop.className = 'gd-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-modal', 'false'); pop.tabIndex = -1; pop.hidden = true;
  doc.body.appendChild(pop);
  var popAnchor = null, popId = '';
  function popHTML(id) {
    var art = doc.getElementById('f-' + id); if (!art) return '';
    var c = art.cloneNode(true);
    $$('[id]', c).forEach(function (n) { n.removeAttribute('id'); });
    $$('.gf-docs', c).forEach(function (n) { n.classList.add('gd-pop-docs'); });
    var title = $('.gf-t', c); if (title) { title.id = 'gd-pop-title'; }
    c.removeAttribute('id');
    return '<button type="button" class="gd-pop-x" aria-label="Close"><svg class="i"><use href="#i-x"/></svg></button>' + c.outerHTML
      + '<p class="gd-pop-foot"><a href="#f-' + id + '" data-ref>See it in the full reference <svg class="i" style="transform:rotate(90deg)"><use href="#i-arrow"/></svg></a></p>';
  }
  function placePop() {
    if (pop.hidden || !popAnchor) return;
    if (win.innerWidth < 760) { pop.classList.remove('above', 'below'); pop.style.left = pop.style.top = ''; return; }
    var a = popAnchor.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight, vw = root.clientWidth, vh = win.innerHeight, gap = 14;
    var cx = a.left + a.width / 2, x = clamp(cx - w / 2, 12, vw - w - 12), y, side;
    if (a.bottom + gap + h <= vh - 12) { y = a.bottom + gap; side = 'below'; }
    else if (a.top - gap - h >= 12) { y = a.top - gap - h; side = 'above'; }
    else { y = clamp((vh - h) / 2, 12, vh - h - 12); x = a.right + gap + w <= vw - 12 ? a.right + gap : clamp(a.left - gap - w, 12, vw - w - 12); side = ''; }
    pop.style.left = Math.round(x) + 'px'; pop.style.top = Math.round(y) + 'px';
    pop.classList.toggle('below', side === 'below'); pop.classList.toggle('above', side === 'above');
    pop.style.setProperty('--nx', clamp(cx - x, 22, w - 22) + 'px');
    pop.style.transformOrigin = side ? clamp(cx - x, 22, w - 22) + 'px ' + (side === 'below' ? '0' : '100%') : '50% 50%';
  }
  function openPop(id, anchor) {
    var html = popHTML(id); if (!html) return;
    popOpen = true; popAnchor = anchor; popId = id;
    pop.innerHTML = html; pop.setAttribute('aria-labelledby', 'gd-pop-title');
    pop.scrollTop = 0;
    var wasHidden = pop.hidden;
    pop.hidden = false; placePop();
    if (wasHidden) { pop.classList.remove('on'); void pop.offsetWidth; }
    requestAnimationFrame(function () { pop.classList.add('on'); });
    if (ready) { cap.classList.add('away'); if (!lit) flyIn(anchor); else aim(anchor); }
    hideTip();
    try { pop.focus({ preventScroll: true }); } catch (e) { }
  }
  function closePop(returnFocus) {
    if (!popOpen) return;
    popOpen = false; pop.classList.remove('on');
    var a = popAnchor; popAnchor = null;
    setTimeout(function () { if (!popOpen) pop.hidden = true; }, reduced ? 0 : 220);
    if (lit) {
      if (cur >= 0 && !dismissed) { cap.classList.remove('away'); var el = resolve(steps[cur].getAttribute('data-t')); if (el) aim(el); }
      else clearStage();
    }
    if (returnFocus && a && a.focus) a.focus({ preventScroll: true });
  }
  pop.addEventListener('click', function (e) {
    if (e.target.closest('.gd-pop-x')) { closePop(true); return; }
    var r = e.target.closest('[data-ref]');
    if (r && win.gdShowAll) { win.gdShowAll(); closePop(false); }
  });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && popOpen) { e.preventDefault(); closePop(true); } });
  doc.addEventListener('pointerdown', function (e) {
    if (!popOpen) return;
    if (pop.contains(e.target) || e.target.closest('[data-f]') || e.target.closest('.gd-more')) return;
    closePop(false);
  });
  win.addEventListener('resize', function () { placePop(); });
  win.addEventListener('scroll', function () { placePop(); hideTip(); }, { passive: true });

  /* ---------------------------------------------------------------- clicking the copy of the editor */
  function hot(e) { return e.target.closest ? e.target.closest('[data-f]') : null; }
  tool.addEventListener('click', function (e) {
    var el = hot(e); if (!el) return;
    if (popOpen && popId === el.getAttribute('data-f')) { closePop(true); return; }
    openPop(el.getAttribute('data-f'), el);
  });
  tool.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute && e.target.getAttribute('role') === 'button' && e.target.hasAttribute('data-f')) { e.preventDefault(); e.target.click(); }
  });
  $('.gd-more', cap).addEventListener('click', function () {
    var spec = steps[Math.max(cur, 0)].getAttribute('data-t').split(':'), el = resolve(steps[Math.max(cur, 0)].getAttribute('data-t'));
    if (spec[0] === 'f' && el) { if (popOpen) closePop(false); openPop(spec[1], el); }
  });

  /* ---------------------------------------------------------------- hover label */
  var tip = doc.createElement('div'); tip.className = 'gd-tip'; tip.setAttribute('aria-hidden', 'true'); doc.body.appendChild(tip);
  function showTip(el) {
    if (popOpen || win.matchMedia('(hover: none)').matches) return;
    var id = el.getAttribute('data-f'), art = doc.getElementById('f-' + id), name = art ? $('.gf-t', art).textContent : (el.getAttribute('aria-label') || '');
    tip.textContent = name + ' · click to learn';
    var r = el.getBoundingClientRect();
    tip.hidden = false; tip.style.left = '0px'; tip.style.top = '0px';
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var below = r.top - h - 10 < 8;
    tip.style.left = Math.round(clamp(r.left + r.width / 2 - w / 2, 8, root.clientWidth - w - 8)) + 'px';
    tip.style.top = Math.round(below ? r.bottom + 10 : r.top - h - 10) + 'px';
    tip.classList.add('on');
  }
  function hideTip() { tip.classList.remove('on'); }
  tool.addEventListener('pointerover', function (e) { var el = hot(e); if (el) showTip(el); });
  tool.addEventListener('pointerout', function (e) { if (hot(e)) hideTip(); });
  tool.addEventListener('focusin', function (e) { var el = hot(e); if (el && e.target.matches && e.target.matches(':focus-visible')) showTip(el); });
  tool.addEventListener('focusout', hideTip);

  /* ---------------------------------------------------------------- boot */
  function boot() {
    layout();
    applyCam(camFor(null), true);
    setCaption(0);
    ready = true;
    updateNav();
    win.addEventListener('scroll', onScroll, { passive: true });
    sync();
  }
  var resizeTimer = 0;
  win.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { layout(); if (aimed && lit) aim(aimed, true); else applyCam(camFor(null), true); }, 80);
  });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { if (ready) { layout(); if (aimed && lit) aim(aimed, true); else applyCam(camFor(null), true); } });
  if (doc.readyState === 'complete') boot(); else win.addEventListener('load', boot);
})();
