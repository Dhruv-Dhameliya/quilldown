/* Quilldown — editor, preview, sync scroll, snippets, copy/export, files, landing page behaviour. */
document.addEventListener('DOMContentLoaded', () => {
'use strict';

/* ---------------------------------------------------------------
   Helpers
--------------------------------------------------------------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const KEY = 'quilldown:';
const store = {
  get(k, d) { try { const v = localStorage.getItem(KEY + k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(KEY + k, v); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(KEY + k); } catch (e) {} }
};
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
const escapeHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = s => escapeHtml(s).replace(/"/g, '&quot;');
// Payloads (diagram source, TeX) travel through DOMPurify in attributes; it drops values containing "-->", so encode them.
const enc = s => encodeURIComponent(s);
const dec = s => { try { return decodeURIComponent(s || ''); } catch (e) { return s || ''; } };
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
const keyLabel = k => isMac ? k.replace('Ctrl', '⌘').replace('Shift', '⇧').replace(/\+/g, '') : k;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ic = n => `<svg class="i"><use href="#i-${n}"/></svg>`;

const editor = $('#editor'), mirror = $('#mirror'), preview = $('#preview'), pane = $('#previewPane');
const panes = $('#panes'), shell = $('#tool'), gutter = $('#gutter');
const SAMPLE = window.QUILLDOWN_SAMPLE || '';
const state = {
  theme: document.documentElement.getAttribute('data-theme') || 'light',
  mode: store.get('mode', matchMedia('(max-width: 640px)').matches ? 'editor' : 'split'),   // phones: one pane at a time
  sync: store.get('sync', '1') === '1',
  full: true
};

let toastTimer;
function toast(msg, action) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.toggle('has-action', !!action);
  if (action) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = action.label;
    b.addEventListener('click', () => { t.classList.remove('show'); action.fn(); });
    t.appendChild(b);
  }
  t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), action ? 6000 : 2400);
}

/* ---------------------------------------------------------------
   Markdown engine (marked + math + mermaid + highlight)
--------------------------------------------------------------- */
const enginesReady = !!(window.marked && window.DOMPurify);

/* footnotes: definitions are collected while lexing, references are numbered in document order while rendering */
const fn = { order: [], defs: {}, refs: {} };
const resetFootnotes = () => { fn.order = []; fn.defs = {}; fn.refs = {}; };
function footnotesHTML() {
  if (!fn.order.length) return '';
  const ids = fn.order.slice();
  const items = ids.map((id, i) => {
    const n = i + 1;
    return `<li id="fn-${n}">${marked.parseInline(fn.defs[id] || '')} <a class="fn-back" href="#fnref-${n}" aria-label="Back to reference ${n}">↩</a></li>`;
  });
  return `<section class="footnotes"><hr><ol>${items.join('')}</ol></section>`;
}

function setupMarked() {
  const footnoteDef = {
    name: 'footnoteDef', level: 'block',
    start(src) { const m = src.match(/(?:^|\n) {0,3}\[\^[^\]\s]+\]:/); return m ? m.index + (m[0][0] === '\n' ? 1 : 0) : undefined; },
    tokenizer(src) {
      const m = /^ {0,3}\[\^([^\]\s]+)\]:[ \t]*([^\n]*(?:\n(?:[ \t]{2,}|\t)[^\n]*)*)(?:\n|$)/.exec(src);
      if (!m) return;
      const text = m[2].replace(/\n[ \t]{2,}/g, '\n').trim();
      fn.defs[m[1]] = text;
      return { type: 'footnoteDef', raw: m[0], id: m[1], text };
    },
    renderer() { return ''; }
  };
  const footnoteRef = {
    name: 'footnoteRef', level: 'inline',
    start(src) { return src.indexOf('[^'); },
    tokenizer(src) {
      const m = /^\[\^([^\]\s]+)\]/.exec(src);
      if (m && fn.defs[m[1]] !== undefined) return { type: 'footnoteRef', raw: m[0], id: m[1] };
    },
    renderer(t) {
      let n = fn.order.indexOf(t.id) + 1;
      if (!n) { fn.order.push(t.id); n = fn.order.length; }
      const k = fn.refs[n] = (fn.refs[n] || 0) + 1;
      return `<sup class="fn-ref" data-fn="${n}"><a href="#fn-${n}" id="fnref-${n}${k > 1 ? '-' + k : ''}">${n}</a></sup>`;
    }
  };
  const emojiCode = {                                  // :rocket: → 🚀 (only names that exist, so "10:30:00" stays as typed)
    name: 'emojiCode', level: 'inline',
    start(src) { return src.indexOf(':'); },
    tokenizer(src) {
      const m = /^:([a-z0-9_+-]{1,30}):/i.exec(src);
      const ch = m && (window.QUILLDOWN_EMOJI ? scLookup(m[1]) : null);
      if (ch) return { type: 'emojiCode', raw: m[0], ch };
    },
    renderer(t) { return t.ch; }
  };
  const inlineMath = {
    name: 'inlineMath', level: 'inline',
    start(src) { return src.indexOf('$'); },
    tokenizer(src) {
      let m = /^\$\$((?:\\.|[^$\\])+?)\$\$/.exec(src);
      if (m) return { type: 'inlineMath', raw: m[0], text: m[1].trim(), display: true };
      m = /^\$(?!\s)((?:\\.|[^$\\\n])+?)(?<!\s)\$(?!\d)/.exec(src);
      if (m) return { type: 'inlineMath', raw: m[0], text: m[1], display: false };
    },
    renderer(t) { return `<span class="math" data-display="${t.display ? 1 : 0}" data-tex="${enc(t.text)}"></span>`; }
  };
  const blockMath = {
    name: 'blockMath', level: 'block',
    start(src) { const m = src.match(/(?:^|\n) {0,3}\$\$/); return m ? m.index + (m[0][0] === '\n' ? 1 : 0) : undefined; },
    tokenizer(src) {
      const m = /^ {0,3}\$\$[ \t]*\n?([\s\S]+?)\n?[ \t]*\$\$[ \t]*(?:\n|$)/.exec(src);
      if (m) return { type: 'blockMath', raw: m[0], text: m[1].trim() };
    },
    renderer(t) { return `<div class="math math-block" data-display="1" data-tex="${enc(t.text)}"></div>`; }
  };
  marked.use({
    gfm: true, breaks: false,
    extensions: [footnoteDef, footnoteRef, blockMath, inlineMath, emojiCode],
    renderer: {
      image(href, title, text) {                       // pasted / uploaded images are stored per document as img:<id>
        if (/^img:/.test(href || '')) return `<img data-img="${escapeAttr(href.slice(4))}" alt="${escapeAttr(text)}"${title ? ` title="${escapeAttr(title)}"` : ''}>`;
        return false;
      },
      code(code, infostring) {
        const lang = ((infostring || '').match(/^[\w+#.-]*/) || [''])[0].toLowerCase();
        if (lang === 'mermaid') return `<div class="mermaid-block" data-src="${enc(code)}"></div>`;
        let html;
        if (lang && window.hljs && hljs.getLanguage(lang)) {
          try { html = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value; } catch (e) { html = escapeHtml(code); }
        } else html = escapeHtml(code);
        return `<pre${lang ? ` data-lang="${escapeAttr(lang)}"` : ''}><code class="hljs${lang ? ' language-' + escapeAttr(lang) : ''}">${html}</code></pre>`;
      }
    }
  });
}

const countNL = s => (s.match(/\n/g) || []).length;

/** Markdown → sanitized HTML. With wrap, top-level blocks are tagged with their source line range (for sync scroll). */
function mdToHTML(src, wrap) {
  resetFootnotes();
  const tokens = marked.lexer(src);
  let out = '';
  if (!wrap) out = marked.parser(tokens);
  else {
    let line = 0;
    for (const t of tokens) {
      const nl = countNL(t.raw);
      if (t.type === 'space' || t.type === 'footnoteDef') { line += nl; continue; }
      if (t.type === 'html') { out += marked.parser([t]); line += nl; continue; } // raw HTML may open/close tags across blocks
      const end = line + countNL(t.raw.replace(/\n+$/, ''));
      out += `<div class="blk" data-s="${line}" data-e="${end}">${marked.parser([t])}</div>`;
      line += nl;
    }
  }
  out += footnotesHTML();
  return DOMPurify.sanitize(out, { FORBID_TAGS: ['style'] });
}

/** The page itself owns the only <h1>. A document's "# Title" therefore shows as an <h2 class="md-h1"> in the live preview
 *  (same look); exports are built from the original HTML and keep the real <h1>. */
function demoteH1(root) {
  $$('h1', root).forEach(h => {
    const n = document.createElement('h2');
    n.className = 'md-h1';
    while (h.firstChild) n.appendChild(h.firstChild);
    h.replaceWith(n);
  });
}
/** Headings inside the landing page's syntax cards are examples, not page headings → styled paragraphs. */
function headingsToParagraphs(root) {
  $$('h1,h2,h3,h4,h5,h6', root).forEach(h => {
    const p = document.createElement('p');
    p.className = 'md-h md-h' + h.tagName[1];
    while (h.firstChild) p.appendChild(h.firstChild);
    h.replaceWith(p);
  });
}

function slugify(s) {
  return s.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-') || 'section';
}
function assignIds(root) {
  const seen = {};
  $$('h1,h2,h3,h4,h5,h6', root).forEach(h => {
    let id = slugify(h.textContent); const n = seen[id] = (seen[id] || 0) + 1;
    if (n > 1) id += '-' + (n - 1);
    h.id = id;
  });
}

const ALERT_TITLES = { NOTE: 'Note', TIP: 'Tip', IMPORTANT: 'Important', WARNING: 'Warning', CAUTION: 'Caution' };
function postProcess(root, mode) {
  // GitHub-style callouts
  $$('blockquote', root).forEach(bq => {
    const p = bq.firstElementChild;
    if (!p || p.tagName !== 'P') return;
    const m = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i.exec(p.textContent);
    if (!m) return;
    const type = m[1].toUpperCase();
    const first = p.firstChild;
    if (first && first.nodeType === 3) first.nodeValue = first.nodeValue.replace(/^\s*\[!\w+\]\s*/, '');
    bq.classList.add('alert', 'alert-' + type.toLowerCase());
    const title = document.createElement('p');
    title.className = 'alert-title'; title.textContent = ALERT_TITLES[type];
    bq.insertBefore(title, p);
    if (!p.textContent.trim() && !p.querySelector('img,code')) p.remove();
  });
  const lib = (typeof activeTab === 'function' && activeTab() && activeTab().images) || {};
  $$('img[data-img]', root).forEach(img => {
    const src = lib[img.dataset.img];
    if (src) img.src = src; else { img.classList.add('img-missing'); img.alt = img.alt ? img.alt + ' (image missing)' : 'image missing'; }
  });
  renderMath(root, mode === 'export' ? 'mathml' : 'html');
  if (mode === 'preview') {
    $$('a[href^="http"]', root).forEach(a => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
    $$('pre', root).forEach(pre => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'code-copy'; b.textContent = 'Copy'; b.setAttribute('aria-label', 'Copy code');
      pre.appendChild(b);
    });
  }
}

function renderMath(root, output) {
  $$('.math', root).forEach(el => {
    const tex = dec(el.dataset.tex), display = el.dataset.display === '1';
    if (!window.katex) { el.textContent = display ? `$$${tex}$$` : `$${tex}$`; return; }
    try {
      if (output === 'mathml') el.innerHTML = katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: 'ignore', output: 'mathml' });
      else katex.render(tex, el, { displayMode: display, throwOnError: false, strict: 'ignore' });
    } catch (e) { el.textContent = tex; }
  });
}

/* ---- Mermaid (lazy loaded, cached, serialised) ---- */
const MERMAID_URL = 'vendor/mermaid.min.js';
let mermaidLoad = null;
function loadMermaid() {
  if (window.mermaid) return Promise.resolve(window.mermaid);
  return mermaidLoad || (mermaidLoad = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = MERMAID_URL; s.async = true; s.onload = () => res(window.mermaid);
    s.onerror = () => { mermaidLoad = null; rej(new Error('Could not load the diagram engine (check your connection).')); };
    document.head.appendChild(s);
  }));
}
const mermaidCache = new Map();
let mermaidQueue = Promise.resolve(), mermaidSeq = 0;
const mermaidTheme = () => state.theme === 'dark' ? 'dark' : 'neutral';
function mermaidSVG(code, theme) {
  const key = theme + '\u0000' + code;
  if (mermaidCache.has(key)) return Promise.resolve(mermaidCache.get(key));
  const job = mermaidQueue.then(async () => {
    const m = await loadMermaid();
    m.initialize({ startOnLoad: false, securityLevel: 'strict', theme, suppressErrorRendering: true, fontFamily: 'Nunito, system-ui, sans-serif' });
    const id = 'mmd' + (++mermaidSeq);
    try {
      const { svg } = await m.render(id, code);
      if (mermaidCache.size > 60) mermaidCache.delete(mermaidCache.keys().next().value);
      mermaidCache.set(key, svg);
      return svg;
    } catch (err) {
      const d = document.getElementById('d' + id); if (d) d.remove();
      const e = document.getElementById(id); if (e) e.remove();
      throw err;
    }
  });
  mermaidQueue = job.catch(() => {});
  return job;
}
function renderOneDiagram(node, theme) {
  return mermaidSVG(dec(node.dataset.src), theme).then(svg => { node.innerHTML = svg; }, err => {
    node.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'mermaid-error';
    box.textContent = 'Diagram error: ' + String((err && err.message) || err).split('\n').slice(0, 3).join('\n');
    node.appendChild(box);
  });
}
/** Draws every diagram under `root`. With `lazy`, uncached diagrams are only drawn (and the ~2.5 MB diagram library only
 *  loaded) once they scroll near the viewport, which keeps the first paint fast. Exports call it eagerly. */
function renderMermaidIn(root, theme, lazy) {
  const tasks = [], pending = [];
  for (const node of $$('.mermaid-block', root)) {
    const cached = mermaidCache.get(theme + '\u0000' + dec(node.dataset.src));
    if (cached) { node.innerHTML = cached; continue; }
    node.innerHTML = '<span class="mermaid-loading">Rendering diagram…</span>';
    if (lazy && 'IntersectionObserver' in window) pending.push(node); else tasks.push(renderOneDiagram(node, theme));
  }
  if (root._diagramIO) { root._diagramIO.disconnect(); root._diagramIO = null; }
  if (pending.length) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { io.unobserve(en.target); renderOneDiagram(en.target, theme); }
    }), { root: root.closest('#previewPane'), rootMargin: '400px 0px' });
    root._diagramIO = io; pending.forEach(n => io.observe(n));
  }
  return Promise.all(tasks);
}

/* ---------------------------------------------------------------
   Preview rendering
--------------------------------------------------------------- */
let lastHTML = '', blocksCache = null, blocksDirty = true, renderTimer;

function render() {
  if (!enginesReady) {
    preview.innerHTML = '<div class="empty">Couldn’t load the Markdown engine.<br>Check your connection and reload the page.</div>';
    return;
  }
  const src = editor.value.replace(/\r\n?/g, '\n');
  if (!src.trim()) {
    lastHTML = ''; preview.innerHTML = '<div class="empty">Your preview will appear here.</div>'; blocksDirty = true; return;
  }
  const html = mdToHTML(src, true);
  lastHTML = html;
  preview.innerHTML = html;
  demoteH1(preview);
  postProcess(preview, 'preview');
  assignIds(preview);
  renderMermaidIn(preview, mermaidTheme(), true);
  blocksDirty = true;
  updateOutline();
  if (state.sync && document.activeElement === editor) requestAnimationFrame(() => { claim('editor'); editorToPreview(); });
}
function scheduleRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(render, editor.value.length > 60000 ? 260 : 70);
}

/* ---------------------------------------------------------------
   Sync scroll (block-aware, wrapped-line aware)
--------------------------------------------------------------- */
let lineTops = [0, 0], totalLines = 1, linesDirty = true;
function ensureLineMap() {
  if (!linesDirty) return;
  const lines = editor.value.split('\n');
  totalLines = lines.length;
  mirror.style.width = editor.clientWidth + 'px';
  mirror.innerHTML = lines.map(l => `<div>${l === '' ? '&#8203;' : escapeHtml(l)}</div>`).join('');
  const kids = mirror.children;
  lineTops = new Array(totalLines + 1);
  for (let i = 0; i < totalLines; i++) lineTops[i] = kids[i].offsetTop;
  const last = kids[totalLines - 1];
  lineTops[totalLines] = last.offsetTop + last.offsetHeight;
  linesDirty = false;
}
function yToLine(y) {
  let lo = 0, hi = totalLines - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineTops[mid] <= y) lo = mid; else hi = mid - 1; }
  const h = lineTops[lo + 1] - lineTops[lo];
  return lo + (h > 0 ? clamp((y - lineTops[lo]) / h, 0, 1) : 0);
}
function lineToY(l) {
  l = clamp(l, 0, totalLines);
  const i = Math.min(Math.floor(l), totalLines - 1);
  return lineTops[i] + (l - i) * (lineTops[i + 1] - lineTops[i]);
}
function getBlocks() {
  if (!blocksDirty && blocksCache) return blocksCache;
  blocksCache = $$('.blk', preview).map(el => ({ s: +el.dataset.s, e: +el.dataset.e + 1, top: el.offsetTop, h: el.offsetHeight }));
  blocksDirty = false;
  return blocksCache;
}
function lastIndex(arr, pred) {
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) { const mid = (lo + hi) >> 1; if (pred(arr[mid])) { ans = mid; lo = mid + 1; } else hi = mid - 1; }
  return ans;
}
function editorToPreview() {
  const edMax = editor.scrollHeight - editor.clientHeight, pMax = pane.scrollHeight - pane.clientHeight;
  if (edMax <= 0 || pMax <= 0) return;
  if (editor.scrollTop <= 0) { pane.scrollTop = 0; return; }
  if (editor.scrollTop >= edMax - 2) { pane.scrollTop = pMax; return; }
  ensureLineMap();
  const L = yToLine(editor.scrollTop), bl = getBlocks();
  let y;
  if (!bl.length) y = editor.scrollTop / edMax * pMax;
  else {
    const i = lastIndex(bl, b => b.s <= L);
    if (i < 0) y = bl[0].s > 0 ? (L / bl[0].s) * bl[0].top : 0;
    else {
      const b = bl[i], n = bl[i + 1], bottom = b.top + b.h;
      if (L < b.e) y = b.top + (L - b.s) / Math.max(b.e - b.s, 1) * b.h;
      else if (n) y = bottom + (L - b.e) / Math.max(n.s - b.e, 1) * (n.top - bottom);
      else y = bottom + (L - b.e) / Math.max(totalLines - b.e, 1) * Math.max(pMax + pane.clientHeight - bottom, 0);
    }
  }
  pane.scrollTop = y;
}
function previewToEditor() {
  const edMax = editor.scrollHeight - editor.clientHeight, pMax = pane.scrollHeight - pane.clientHeight;
  if (edMax <= 0 || pMax <= 0) return;
  if (pane.scrollTop <= 0) { editor.scrollTop = 0; return; }
  if (pane.scrollTop >= pMax - 2) { editor.scrollTop = edMax; return; }
  ensureLineMap();
  const y = pane.scrollTop, bl = getBlocks();
  let L;
  if (!bl.length) L = y / pMax * totalLines;
  else {
    const i = lastIndex(bl, b => b.top <= y);
    if (i < 0) L = bl[0].top > 0 ? (y / bl[0].top) * bl[0].s : 0;
    else {
      const b = bl[i], n = bl[i + 1], bottom = b.top + b.h;
      if (y < bottom) L = b.s + (y - b.top) / Math.max(b.h, 1) * (b.e - b.s);
      else if (n) L = b.e + (y - bottom) / Math.max(n.top - bottom, 1) * (n.s - b.e);
      else L = b.e + (y - bottom) / Math.max(pMax + pane.clientHeight - bottom, 1) * (totalLines - b.e);
    }
  }
  editor.scrollTop = lineToY(L);
}
let scrollOwner = null, ownerTimer;
function claim(who) { scrollOwner = who; clearTimeout(ownerTimer); ownerTimer = setTimeout(() => scrollOwner = null, 140); }
editor.addEventListener('scroll', () => {
  if (!state.sync || state.mode !== 'split' || (scrollOwner && scrollOwner !== 'editor')) return;
  claim('editor'); editorToPreview();
}, { passive: true });
pane.addEventListener('scroll', () => {
  if (!state.sync || state.mode !== 'split' || (scrollOwner && scrollOwner !== 'preview')) return;
  claim('preview'); previewToEditor();
}, { passive: true });
if (window.ResizeObserver) {
  new ResizeObserver(() => { blocksDirty = true; }).observe(preview);
  new ResizeObserver(() => { linesDirty = true; if (fb.open) fbPaint(); }).observe(editor);
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { linesDirty = true; blocksDirty = true; });
preview.addEventListener('load', () => { blocksDirty = true; }, true);

/* ---------------------------------------------------------------
   Editing primitives (all undo-friendly)
--------------------------------------------------------------- */
function replace(start, end, text, selStart, selEnd) {
  if (selStart == null) selStart = start + text.length;
  if (selEnd == null) selEnd = selStart;
  editor.focus({ preventScroll: true });
  editor.setSelectionRange(start, end);
  const before = editor.value;
  let ok = false;
  if (text.length < 200000) {
    try { ok = text === '' ? document.execCommand('delete') : document.execCommand('insertText', false, text); } catch (e) { ok = false; }
    if (ok && editor.value !== before.slice(0, start) + text + before.slice(end)) ok = false;
  }
  if (!ok) { editor.value = before.slice(0, start) + text + before.slice(end); editor.dispatchEvent(new Event('input', { bubbles: true })); }
  editor.setSelectionRange(selStart, selEnd);
}
const sel = () => ({ s: editor.selectionStart, e: editor.selectionEnd, v: editor.value });
function lineBounds(s, e, v) {
  const ls = v.lastIndexOf('\n', s - 1) + 1;
  const end = (e > s && v[e - 1] === '\n') ? e - 1 : e;
  let le = v.indexOf('\n', end); if (le < 0) le = v.length;
  return [ls, le];
}
function wrapInline(b, a, placeholder) {
  const { s, e, v } = sel(), chosen = v.slice(s, e);
  if (s >= b.length && v.slice(s - b.length, s) === b && v.slice(e, e + a.length) === a) {           // markers around selection → unwrap
    replace(s - b.length, e + a.length, chosen, s - b.length, s - b.length + chosen.length); return;
  }
  if (chosen.length >= b.length + a.length && chosen.startsWith(b) && chosen.endsWith(a)) {           // markers inside selection → unwrap
    const inner = chosen.slice(b.length, chosen.length - a.length); replace(s, e, inner, s, s + inner.length); return;
  }
  const t = chosen || placeholder;
  replace(s, e, b + t + a, s + b.length, s + b.length + t.length);
}
function setHeading(n) {
  const { s, e, v } = sel(), [ls, le] = lineBounds(s, e, v);
  const lines = v.slice(ls, le).split('\n');
  const single = lines.length === 1;
  const already = single && new RegExp('^#{' + n + '}\\s').test(lines[0]);
  const out = lines.map(l => {
    const stripped = l.replace(/^#{1,6}\s+/, '');
    if (!n || already) return stripped;
    return l.trim() === '' && !single ? l : '#'.repeat(n) + ' ' + stripped;
  });
  let text = out.join('\n');
  if (single && n && !already && lines[0].trim() === '') { text = '#'.repeat(n) + ' Heading'; replace(ls, le, text, ls + n + 1, ls + text.length); return; }
  replace(ls, le, text, single && s === e ? ls + text.length : ls, ls + text.length);
}
function toggleLinePrefix(kind) {
  const { s, e, v } = sel(), [ls, le] = lineBounds(s, e, v);
  const lines = v.slice(ls, le).split('\n');
  const RE = { quote: /^ {0,3}>\s?/, ul: /^(\s*)[-*+]\s(?!\[[ xX]\]\s)/, ol: /^(\s*)\d+[.)]\s/, task: /^(\s*)[-*+]\s\[[ xX]\]\s/ }[kind];
  const nonBlank = lines.filter(l => l.trim());
  const allHave = nonBlank.length > 0 && nonBlank.every(l => RE.test(l));
  let n = 0;
  const out = lines.map(l => {
    if (!l.trim() && lines.length > 1) return l;
    if (allHave) return l.replace(RE, kind === 'quote' ? '' : '$1');
    const base = kind === 'quote' ? l : l.replace(/^(\s*)(?:[-*+]\s\[[ xX]\]\s|[-*+]\s|\d+[.)]\s)/, '$1');
    const indent = kind === 'quote' ? '' : base.match(/^\s*/)[0];
    const rest = base.slice(indent.length);
    n++;
    return indent + ({ quote: '> ', ul: '- ', ol: n + '. ', task: '- [ ] ' }[kind]) + rest;
  });
  const text = out.join('\n');
  replace(ls, le, text, s === e ? ls + text.length : ls, ls + text.length);
}
function insertBlock(text, pick) {
  const { s, e, v } = sel(), before = v.slice(0, s), after = v.slice(e);
  const pre = !before ? '' : before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
  const post = !after ? '\n' : after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n';
  let a = text.length, b = text.length;
  if (pick) { const i = text.indexOf(pick); if (i >= 0) { a = i; b = i + pick.length; } }
  replace(s, e, pre + text + post, s + pre.length + a, s + pre.length + b);
}
function insertLinkLike(image) {
  const { s, e, v } = sel(), chosen = v.slice(s, e), bang = image ? '!' : '';
  if (/^https?:\/\/\S+$/.test(chosen)) {
    const label = image ? 'alt text' : 'link text', t = `${bang}[${label}](${chosen})`;
    replace(s, e, t, s + bang.length + 1, s + bang.length + 1 + label.length); return;
  }
  const label = chosen || (image ? 'alt text' : 'link text'), t = `${bang}[${label}](https://)`;
  if (chosen) replace(s, e, t, s + t.length - 9, s + t.length - 1);          // select the URL placeholder
  else replace(s, e, t, s + bang.length + 1, s + bang.length + 1 + label.length);
}
function indentLines(dir) {
  const { s, e, v } = sel(), [ls, le] = lineBounds(s, e, v);
  const lines = v.slice(ls, le).split('\n'), deltas = [];
  const out = lines.map(l => {
    if (dir > 0) { if (!l.trim() && lines.length > 1) { deltas.push(0); return l; } deltas.push(2); return '  ' + l; }
    const m = /^( {1,2}|\t)/.exec(l); const d = m ? m[0].length : 0; deltas.push(-d); return l.slice(d);
  });
  const total = deltas.reduce((a, b) => a + b, 0), text = out.join('\n');
  replace(ls, le, text, Math.max(ls, s + deltas[0]), Math.max(ls, e + total));
}
function setText(text, keepSelection) {
  editor.focus({ preventScroll: true });
  editor.select();
  replace(0, editor.value.length, text, 0, 0);
  if (!keepSelection) { editor.scrollTop = 0; pane.scrollTop = 0; }
}
function appendMarkdown(md) {
  const v = editor.value, gap = !v.trim() ? '' : v.endsWith('\n\n') ? '' : v.endsWith('\n') ? '\n' : '\n\n';
  replace(v.length, v.length, gap + md + '\n');
  editor.scrollTop = editor.scrollHeight;
}

/* ---------------------------------------------------------------
   Snippets & actions
--------------------------------------------------------------- */
const MERMAID_TPL = {
  flow: 'flowchart TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Do it]\n  B -->|No| D[Skip]\n  C --> E[Done]\n  D --> E',
  seq: 'sequenceDiagram\n  participant A as Alice\n  participant B as Bob\n  A->>B: Hello Bob!\n  B-->>A: Hi Alice!',
  cls: 'classDiagram\n  class Animal {\n    +String name\n    +eat()\n  }\n  class Dog {\n    +bark()\n  }\n  Animal <|-- Dog',
  state: 'stateDiagram-v2\n  [*] --> Idle\n  Idle --> Working : start\n  Working --> Idle : done\n  Working --> [*]',
  er: 'erDiagram\n  USER ||--o{ ORDER : places\n  ORDER ||--|{ ITEM : contains',
  gantt: 'gantt\n  title Roadmap\n  dateFormat YYYY-MM-DD\n  section Build\n  Design   :a1, 2026-01-05, 7d\n  Develop  :after a1, 10d\n  section Launch\n  Release  :2026-01-24, 3d',
  pie: 'pie title Pets\n  "Dogs" : 42\n  "Cats" : 33\n  "Other" : 25',
  mind: 'mindmap\n  root((Idea))\n    Research\n    Design\n    Build'
};
const MATH_TPL = {
  frac: '\\frac{a}{b}', sum: '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}',
  int: '\\int_{a}^{b} f(x)\\,dx', sqrt: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
  matrix: '\\begin{bmatrix}\n  a & b \\\\\n  c & d\n\\end{bmatrix}'
};
const CALLOUTS = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'];

const A = {
  bold: () => wrapInline('**', '**', 'bold text'),
  italic: () => wrapInline('_', '_', 'italic text'),
  underline: () => wrapInline('<u>', '</u>', 'underlined text'),
  strike: () => wrapInline('~~', '~~', 'strikethrough'),
  code: () => wrapInline('`', '`', 'code'),
  h: n => setHeading(+n),
  quote: () => toggleLinePrefix('quote'),
  codeblock: () => { const { s, e, v } = sel(), c = v.slice(s, e) || 'code'; insertBlock('```\n' + c + '\n```', c); },
  hr: () => insertBlock('---'),
  ul: () => toggleLinePrefix('ul'),
  ol: () => toggleLinePrefix('ol'),
  task: () => toggleLinePrefix('task'),
  link: () => insertLinkLike(false),
  image: () => insertLinkLike(true),
  'image-upload': () => $('#imageInput').click(),
  footnote: () => {
    const v = editor.value, nums = Array.from(v.matchAll(/\[\^(\d+)\]/g), m => +m[1]), n = (nums.length ? Math.max(...nums) : 0) + 1;
    const { e } = sel(), def = 'Footnote text.', tail = v.endsWith('\n\n') ? '' : v.endsWith('\n') ? '\n' : '\n\n';
    replace(v.length, v.length, `${tail}[^${n}]: ${def}\n`);          // definition first (later in the text), then the marker
    replace(e, e, `[^${n}]`);
    const at = editor.value.lastIndexOf(def);
    editor.setSelectionRange(at, at + def.length);
    linesDirty = true; ensureLineMap();
    editor.scrollTop = Math.max(0, lineToY(countNL(editor.value.slice(0, at))) - editor.clientHeight / 2);
    toast('Footnote added — type its text at the bottom');
  },
  table: () => openTableEditor(),
  emoji: () => (emojiState.open ? closeEmoji() : openEmoji($('[data-act="emoji"]'))),
  mathi: () => wrapInline('$', '$', 'x^2'),
  mathb: () => { const { s, e, v } = sel(), c = v.slice(s, e) || 'E = mc^2'; insertBlock('$$\n' + c + '\n$$', c); },
  mathtpl: k => { const t = MATH_TPL[k]; insertBlock('$$\n' + t + '\n$$', t); },
  mermaid: k => insertBlock('```mermaid\n' + MERMAID_TPL[k] + '\n```'),
  callout: t => { const { s, e, v } = sel(), c = v.slice(s, e).replace(/\n/g, '\n> ') || 'Write something helpful here.'; insertBlock(`> [!${t}]\n> ${c}`, c); },
  details: () => insertBlock('<details>\n<summary>Summary</summary>\n\nHidden content goes here.\n\n</details>', 'Summary'),
  center: () => insertBlock('<div align="center">\n\nCentered content\n\n</div>', 'Centered content'),
  kbd: () => wrapInline('<kbd>', '</kbd>', 'Ctrl'),
  sup: () => wrapInline('<sup>', '</sup>', '2'),
  sub: () => wrapInline('<sub>', '</sub>', '2'),
  mark: () => wrapInline('<mark>', '</mark>', 'highlighted'),
  comment: () => wrapInline('<!-- ', ' -->', 'comment'),

  noop: () => {},
  template: id => {
    const t = (window.QUILLDOWN_TEMPLATES || []).find(x => x.id === id); if (!t) return;
    newTab(t.file, t.text()); toast(t.name + ' template opened in a new tab');
  },
  share: () => openShare(),
  find: () => (fb.open ? closeFind() : openFind(false)),
  outline: () => setOutline(!work.classList.contains('has-outline')),
  undo: () => { editor.focus({ preventScroll: true }); document.execCommand('undo'); },
  redo: () => { editor.focus({ preventScroll: true }); document.execCommand('redo'); },

  open: async () => {
    if (window.showOpenFilePicker) {                                     // Chromium: real file handles, so Save can write back
      try {
        const hs = await window.showOpenFilePicker({ multiple: true, types: [{ description: 'Markdown & text', accept: { 'text/markdown': ['.md', '.markdown', '.mdown', '.mkd'], 'text/plain': ['.txt', '.text'] } }] });
        await openFiles(await Promise.all(hs.map(h => h.getFile())), hs); return;
      } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    $('#fileInput').click();
  },
  blank: () => { newTab(null, ''); editor.focus(); },
  sample: () => { newTab('welcome.md', SAMPLE); toast('Sample document opened in a new tab'); },
  save: async () => {                                                    // linked tab → write back to the file; otherwise download
    const t = activeTab(), { text, n } = markdownWithImages(), note = n ? ` (${n} image${n > 1 ? 's' : ''} embedded)` : '';
    if (t && t.handle) {
      try {
        let perm = t.handle.queryPermission ? await t.handle.queryPermission({ mode: 'readwrite' }) : 'granted';
        if (perm !== 'granted' && t.handle.requestPermission) perm = await t.handle.requestPermission({ mode: 'readwrite' });
        if (perm !== 'granted') throw new Error('denied');
        const w = await t.handle.createWritable();
        await w.write(t.eol === '\r\n' ? text.replace(/\n/g, '\r\n') : text); await w.close();
        t.saved = norm(t.text); updateTabDirty(); toast('Saved to ' + t.handle.name + note); return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        downloadMarkdown();
        toast('Couldn’t write to “' + t.handle.name + '” — downloaded a copy instead');
        return;
      }
    }
    downloadMarkdown();
  },
  'copy-rich': () => copyFormatted('rich'),
  'copy-docs': () => copyFormatted('docs'),
  'copy-md': async () => { const { text, n } = markdownWithImages(); const ok = await writeClipboard({ text }); toast(ok ? (n ? `Markdown copied (${n} image${n > 1 ? 's' : ''} embedded)` : 'Markdown copied') : 'Copy failed — your browser blocked clipboard access'); return ok; },
  'copy-html': () => copyHTMLSource(),
  'export-pdf': () => exportPDF(),
  'export-docx': () => exportDOCX(),
  'export-html': () => exportHTMLFile(),
  'export-md': () => downloadMarkdown(),
  'export-txt': () => exportTXT(),
  'export-png': () => exportPNG(),
  'export-epub': () => exportEPUB(),
  mode: m => setMode(m),
  sync: () => setSync(!state.sync),
  theme: () => setTheme(state.theme === 'dark' ? 'light' : 'dark'),
  full: () => setFull(!state.full),
  home: () => { setFull(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 60); }
};

/* ---- toolbar + menu definitions ---- */
const BAR = [
  [ { act: 'undo', icon: 'undo', t: 'Undo', keys: 'Ctrl+Z' }, { act: 'redo', icon: 'redo', t: 'Redo', keys: 'Ctrl+Y' } ],
  [ { act: 'bold', icon: 'bold', t: 'Bold', keys: 'Ctrl+B' }, { act: 'italic', icon: 'italic', t: 'Italic', keys: 'Ctrl+I' },
    { act: 'underline', icon: 'underline', t: 'Underline', keys: 'Ctrl+U' }, { act: 'strike', icon: 'strike', t: 'Strikethrough', keys: 'Ctrl+Shift+X' },
    { act: 'code', icon: 'code', t: 'Inline code', keys: 'Ctrl+E' }, { act: 'mark', icon: 'highlight', t: 'Highlight' },
    { act: 'sup', badge: 'x²', t: 'Superscript' }, { act: 'sub', badge: 'x₂', t: 'Subscript' }, { act: 'kbd', icon: 'kbd', t: 'Keyboard key' } ],
  [ { menu: 'headings', icon: 'heading', t: 'Headings 1–6', chev: 1 }, { act: 'quote', icon: 'quote', t: 'Quote' },
    { act: 'codeblock', icon: 'codeblock', t: 'Code block' }, { act: 'hr', icon: 'hr', t: 'Horizontal rule' } ],
  [ { act: 'ul', icon: 'ul', t: 'Bullet list' }, { act: 'ol', icon: 'ol', t: 'Numbered list' }, { act: 'task', icon: 'task', t: 'Task list' } ],
  [ { act: 'link', icon: 'link', t: 'Link', keys: 'Ctrl+K' }, { menu: 'image', icon: 'image', t: 'Image (link, upload, paste or drop)', chev: 1 }, { act: 'table', icon: 'table', t: 'Table (visual editor — also edits the table under your cursor)' } ],
  [ { act: 'mathi', icon: 'math', t: 'Inline math' }, { act: 'mathb', icon: 'mathblock', t: 'Math block' },
    { menu: 'formulas', badge: 'ƒx', t: 'Formula templates', chev: 1 }, { menu: 'diagram', icon: 'diagram', t: 'Diagram (Mermaid)', chev: 1 } ],
  [ { menu: 'callouts', icon: 'note', t: 'Callouts (Note, Tip, Important, Warning, Caution)', chev: 1 },
    { act: 'details', icon: 'chevr', t: 'Collapsible section' }, { act: 'center', icon: 'center', t: 'Centered block' },
    { act: 'comment', badge: '//', t: 'Hidden comment' }, { act: 'footnote', badge: '[¹]', t: 'Footnote' }, { act: 'emoji', icon: 'smile', t: 'Emoji' } ]
];
const MENUS = {
  new: [
    { act: 'blank', icon: 'newfile', label: 'Blank document', desc: 'Opens in a new tab' },
    { act: 'sample', icon: 'file', label: 'Sample document', desc: 'A tour of everything Markdown can do' },
    ...((window.QUILLDOWN_TEMPLATES || []).length ? [ { group: 'Templates' }, ...window.QUILLDOWN_TEMPLATES.map(t => ({ act: 'template:' + t.id, icon: t.icon || 'file', label: t.name, desc: t.desc })) ] : [])
  ],
  copy: [
    { act: 'copy-rich', icon: 'rich', label: 'Formatted text', desc: 'Rich text as shown in the preview' },
    { act: 'copy-docs', icon: 'docs', label: 'Copy for Docs', desc: 'H1 23 · H2 17 · H3 14 · text 12 pt, your own font' },
    { act: 'copy-md', icon: 'md', label: 'Markdown', desc: 'The raw source' },
    { act: 'copy-html', icon: 'html', label: 'HTML', desc: 'Clean, ready-to-use markup' } ],
  export: [
    { act: 'save', icon: 'download', label: 'Save', desc: 'Back to the file you opened — or download a .md', keys: 'Ctrl+S' },
    { group: 'Documents' },
    { act: 'export-pdf', icon: 'file', label: 'PDF', desc: 'Opens print dialog → Save as PDF' },
    { act: 'export-docx', icon: 'docs', label: 'Word (.docx)', desc: 'Opens in Word, Google Docs, Pages' },
    { group: 'Image & e-book' },
    { act: 'export-png', icon: 'image', label: 'Image (.png)', desc: 'The whole document as one picture' },
    { act: 'export-epub', icon: 'book', label: 'E-book (.epub)', desc: 'For Apple Books, Kindle apps, Kobo…' },
    { group: 'Web & text' },
    { act: 'export-html', icon: 'html', label: 'HTML file', desc: 'Standalone, styled page' },
    { act: 'export-md', icon: 'md', label: 'Markdown (.md)', desc: 'Download the raw source' },
    { act: 'export-txt', icon: 'text', label: 'Plain text (.txt)', desc: 'Rendered text, no formatting' } ],
  image: [
    { act: 'image-upload', icon: 'upload', label: 'Upload from computer…', desc: 'Stored inside this document' },
    { act: 'image', icon: 'link', label: 'Image from a URL', desc: '![alt](https://…)' },
    { group: 'Tip' }, { act: 'noop', icon: 'image', label: 'Paste or drop an image', desc: 'Straight into the editor' } ],
  headings: [ 1, 2, 3, 4, 5, 6 ].map(n => ({ act: 'h:' + n, badge: 'H' + n, label: 'Heading ' + n, cls: 'mi-h' + n }))
    .concat([ '-', { act: 'h:0', badge: 'P', label: 'Normal text' } ]),
  formulas: [
    { act: 'mathtpl:frac', badge: '÷', label: 'Fraction' }, { act: 'mathtpl:sum', badge: 'Σ', label: 'Sum' }, { act: 'mathtpl:int', badge: '∫', label: 'Integral' },
    { act: 'mathtpl:sqrt', badge: '√', label: 'Quadratic formula' }, { act: 'mathtpl:matrix', badge: '[ ]', label: 'Matrix' } ],
  diagram: [
    { act: 'mermaid:flow', icon: 'diagram', label: 'Flowchart' }, { act: 'mermaid:seq', icon: 'diagram', label: 'Sequence diagram' },
    { act: 'mermaid:cls', icon: 'diagram', label: 'Class diagram' }, { act: 'mermaid:state', icon: 'diagram', label: 'State diagram' },
    { act: 'mermaid:er', icon: 'diagram', label: 'Entity relationship' }, { act: 'mermaid:gantt', icon: 'diagram', label: 'Gantt chart' },
    { act: 'mermaid:pie', icon: 'diagram', label: 'Pie chart' }, { act: 'mermaid:mind', icon: 'diagram', label: 'Mind map' } ],
  callouts: CALLOUTS.map(c => ({ act: 'callout:' + c, icon: 'note', label: ALERT_TITLES[c], desc: '> [!' + c + ']' }))
};

function buildBar() {
  const bar = $('#snippetBar');
  bar.innerHTML = BAR.map(group => group.map(b => {
    const title = b.t + (b.keys ? ` (${keyLabel(b.keys)})` : '');
    const attr = b.menu ? `data-menu="${b.menu}"` : `data-act="${b.act}"`;
    const lead = b.badge ? `<span class="sbadge">${b.badge}</span>` : ic(b.icon);
    return `<button type="button" class="sbtn" ${attr} title="${title}" aria-label="${b.t}"${b.menu ? ' aria-haspopup="menu" aria-expanded="false"' : ''}>${lead}${b.text ? `<span>${b.text}</span>` : ''}${b.chev ? '<svg class="i chev"><use href="#i-chev"/></svg>' : ''}</button>`;
  }).join('')).join('<span class="sb-sep"></span>');
}
function buildMenus() {
  Object.entries(MENUS).forEach(([id, items]) => {
    const m = document.createElement('div');
    m.className = 'menu'; m.id = 'menu-' + id; m.hidden = true; m.setAttribute('role', 'menu');
    m.innerHTML = items.map(it => {
      if (it === '-') return '<div class="menu-sep"></div>';
      if (it.group) return `<div class="menu-label">${it.group}</div>`;
      const lead = it.badge ? `<span class="mi-badge">${it.badge}</span>` : ic(it.icon);
      return `<button type="button" class="mi ${it.cls || ''}" role="menuitem" data-act="${it.act}">${lead}<span class="mi-t"><b>${it.label}</b>${it.desc ? `<small>${escapeHtml(it.desc)}</small>` : ''}</span>${it.keys ? `<kbd>${keyLabel(it.keys)}</kbd>` : ''}</button>`;
    }).join('');
    document.body.appendChild(m);
  });
}

/* ---- menus ---- */
let openMenuId = null, openAnchor = null;
function closeMenus() {
  $$('.menu').forEach(m => m.hidden = true);
  if (openAnchor) openAnchor.setAttribute('aria-expanded', 'false');
  openMenuId = openAnchor = null;
}
function toggleMenu(id, anchor) {
  const same = openMenuId === id;
  closeMenus();
  if (same) return;
  const m = $('#menu-' + id); if (!m) return;
  m.hidden = false;
  const r = anchor.getBoundingClientRect(), w = m.offsetWidth, h = m.offsetHeight;
  m.style.left = clamp(r.left, 8, innerWidth - w - 8) + 'px';
  m.style.top = (r.bottom + h + 12 > innerHeight && r.top > h + 12 ? r.top - h - 6 : r.bottom + 6) + 'px';
  anchor.setAttribute('aria-expanded', 'true');
  openMenuId = id; openAnchor = anchor;
}
document.addEventListener('mousedown', e => {
  if (e.target.closest('.snippet-bar,.menu')) e.preventDefault();          // keep focus/selection in the editor
  if (openMenuId && !e.target.closest('.menu,[data-menu]')) closeMenus();
});
document.addEventListener('click', e => {
  const mb = e.target.closest('[data-menu]');
  if (mb) { e.stopPropagation(); toggleMenu(mb.dataset.menu, mb); return; }
  const ab = e.target.closest('[data-act]');
  if (!ab) return;
  const [name, arg] = ab.dataset.act.split(':');
  const anchor = openAnchor;
  closeMenus();
  const fn = A[name]; if (!fn) return;
  const result = fn(arg);
  if (COPY_ACTS.has(name)) Promise.resolve(result).then(ok => { if (typeof ok === 'boolean') flashCopy(ab.closest('.menu') ? anchor : ab, ok); });
});
document.addEventListener('keydown', e => {
  if (!openMenuId) return;
  const items = $$('.mi', $('#menu-' + openMenuId));
  const i = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
});
window.addEventListener('resize', closeMenus);

/* ---------------------------------------------------------------
   Copy / export
--------------------------------------------------------------- */
const baseName = () => ((activeTab() && activeTab().name || '').trim() || 'untitled').replace(/\.(md|markdown|mdown|mkd|txt|text)$/i, '').replace(/[\\/:*?"<>|]+/g, '-') || 'untitled';
const mdName = () => baseName() + '.md';
/** Pasted/uploaded images are kept as short img:<id> references while editing; exporting Markdown embeds them as data URIs. */
function downloadMarkdown() {
  const { text, n } = markdownWithImages();
  download(mdName(), new Blob([text], { type: 'text/markdown;charset=utf-8' }));
  toast('Saved ' + mdName() + (n ? ` (${n} image${n > 1 ? 's' : ''} embedded)` : ''));
}
function markdownWithImages() {
  const lib = (activeTab() && activeTab().images) || {}; let n = 0;
  const text = editor.value.replace(/\]\(img:([\w-]+)([^)]*)\)/g, (m, id, rest) => lib[id] ? (n++, '](' + lib[id] + rest + ')') : m);
  return { text, n };
}

function download(name, blob) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Clean, theme-independent DOM: math as MathML, diagrams re-rendered with the light theme. */
async function buildExportDOM(mathMode) {
  const root = document.createElement('div');
  root.className = 'md';
  if (!enginesReady) return root;
  root.innerHTML = lastHTML || mdToHTML(editor.value.replace(/\r\n?/g, '\n'), true);
  $$('.blk', root).forEach(b => b.replaceWith(...b.childNodes));
  postProcess(root, mathMode === 'html' ? 'image' : 'export');
  assignIds(root);
  await renderMermaidIn(root, 'neutral');
  return root;
}

async function svgToImg(svg) {
  const vb = (svg.getAttribute('viewBox') || '').split(/\s+/).map(Number);
  let w = vb[2], h = vb[3];
  if (!w || !h) { const r = svg.getBoundingClientRect(); w = r.width; h = r.height; }
  if (!w || !h) throw new Error('size');
  const clone = svg.cloneNode(true);
  clone.setAttribute('width', w); clone.setAttribute('height', h);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.style.maxWidth = 'none';
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
  await img.decode();
  const scale = 2, canvas = document.createElement('canvas');
  canvas.width = w * scale; canvas.height = h * scale;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const out = new Image();
  out.src = canvas.toDataURL('image/png'); out.width = Math.min(w, 720); out.alt = 'Diagram';
  out.dataset.scale = scale;
  return out;
}

const INLINE_STYLES = {
  h1: 'font-size:2em;font-weight:700;line-height:1.25;margin:0 0 .6em;',
  h2: 'font-size:1.55em;font-weight:700;line-height:1.3;margin:1.6em 0 .5em;',
  h3: 'font-size:1.25em;font-weight:700;margin:1.4em 0 .4em;', h4: 'font-size:1.05em;font-weight:700;margin:1.2em 0 .4em;',
  h5: 'font-size:.95em;font-weight:700;margin:1.2em 0 .4em;', h6: 'font-size:.85em;font-weight:700;margin:1.2em 0 .4em;color:#6b7280;',
  p: 'margin:0 0 1em;line-height:1.65;', a: 'color:#4f46e5;text-decoration:underline;',
  ul: 'margin:0 0 1em;padding-left:1.6em;', ol: 'margin:0 0 1em;padding-left:1.6em;', li: 'margin:.25em 0;',
  blockquote: 'margin:0 0 1em;padding:.2em 1em;border-left:3px solid #d4d4d8;color:#52525b;',
  hr: 'border:0;border-top:1px solid #e4e4e7;margin:2em 0;',
  table: 'border-collapse:collapse;margin:0 0 1em;',
  th: 'border:1px solid #d4d4d8;padding:6px 12px;background:#f4f4f5;font-weight:600;text-align:left;',
  td: 'border:1px solid #d4d4d8;padding:6px 12px;',
  pre: 'background:#f6f6f7;border:1px solid #e4e4e7;border-radius:8px;padding:12px 14px;margin:0 0 1em;font-family:Consolas,Menlo,monospace;font-size:13px;line-height:1.55;white-space:pre-wrap;',
  code: 'font-family:Consolas,Menlo,monospace;font-size:.9em;background:#f1f1f3;padding:.15em .35em;border-radius:4px;',
  kbd: 'font-family:Consolas,monospace;font-size:.85em;border:1px solid #d4d4d8;border-radius:4px;padding:.1em .4em;',
  mark: 'background:#fef08a;padding:0 .2em;', img: 'max-width:100%;', summary: 'font-weight:600;'
};
const ALERT_COLORS = { note: '#2563eb', tip: '#0f8f62', important: '#7c3aed', warning: '#c2680a', caution: '#dc2626' };
const TOKEN_COLORS = [
  [/^hljs-(keyword|selector-tag|literal|doctag|name|tag)$/, '#7c3aed'], [/^hljs-(string|regexp|addition)$/, '#0f8f62'],
  [/^hljs-(number|symbol|bullet|link)$/, '#c2680a'], [/^hljs-(comment|quote|meta)$/, '#9a9aa3'],
  [/^hljs-(title|section)$/, '#2563eb'], [/^hljs-(built_in|type|class_)$/, '#c026a3'], [/^hljs-(attr|attribute|variable|property|params)$/, '#0e7490']
];
/* "Copy for Docs": explicit point sizes so Google Docs / Word keep the intended hierarchy.
   H1 23pt · H2 17pt · H3 14pt · everything else 12pt.
   No font-family or text colour is set on normal text, so Google Docs / Word apply the destination document's own font.
   Only code keeps a monospace font. */
const DOCS_MONO = "'Courier New',Courier,monospace";
const DOCS_STYLES = {
  h1: 'font-size:23pt;font-weight:700;line-height:1.25;margin:0 0 8pt;',
  h2: 'font-size:17pt;font-weight:700;line-height:1.3;margin:18pt 0 6pt;',
  h3: 'font-size:14pt;font-weight:700;line-height:1.35;margin:16pt 0 4pt;',
  h4: 'font-size:12pt;font-weight:700;margin:14pt 0 4pt;', h5: 'font-size:12pt;font-weight:700;margin:12pt 0 4pt;',
  h6: 'font-size:12pt;font-weight:700;margin:12pt 0 4pt;color:#666666;',
  p: 'font-size:12pt;line-height:1.5;margin:0 0 10pt;', a: 'font-size:12pt;color:#1155cc;text-decoration:underline;',
  ul: 'margin:0 0 10pt;', ol: 'margin:0 0 10pt;', li: 'font-size:12pt;line-height:1.5;margin:0 0 3pt;',
  blockquote: 'font-size:12pt;margin:0 0 10pt 18pt;padding:0 0 0 12pt;border-left:3pt solid #cccccc;color:#555555;',
  hr: 'border:0;border-top:1pt solid #cccccc;margin:16pt 0;',
  table: 'border-collapse:collapse;margin:0 0 10pt;',
  th: 'font-size:12pt;font-weight:700;border:1pt solid #999999;padding:4pt 8pt;background:#f3f3f3;text-align:left;',
  td: 'font-size:12pt;border:1pt solid #999999;padding:4pt 8pt;',
  pre: `font-family:${DOCS_MONO};font-size:11pt;line-height:1.4;background:#f3f3f3;padding:8pt;margin:0 0 10pt;white-space:pre-wrap;`,
  code: `font-family:${DOCS_MONO};font-size:11pt;background:#f3f3f3;`,
  kbd: `font-family:${DOCS_MONO};font-size:11pt;border:1pt solid #cccccc;`,
  mark: 'background:#ffff00;', summary: 'font-size:12pt;font-weight:700;', img: 'max-width:100%;'
};
function applyInlineStyles(root, flavor) {
  const docs = flavor === 'docs', map = docs ? DOCS_STYLES : INLINE_STYLES;
  $$('input[type="checkbox"]', root).forEach(cb => cb.replaceWith(document.createTextNode(cb.checked ? '☑ ' : '☐ ')));
  $$('*', root).forEach(el => {
    const tag = el.tagName.toLowerCase();
    let css = map[tag] || '';
    if (tag === 'code' && el.closest('pre')) css = `font-family:${docs ? DOCS_MONO : 'Consolas,Menlo,monospace'};font-size:inherit;`;
    if (tag === 'blockquote' && /alert-(\w+)/.test(el.className)) {
      const c = ALERT_COLORS[RegExp.$1] || '#2563eb';
      css = docs ? `font-size:12pt;margin:0 0 10pt;padding:6pt 12pt;border-left:4pt solid ${c};background:#f7f7f8;color:#27272a;`
                 : `margin:0 0 1em;padding:.5em 1em;border-left:4px solid ${c};background:#f7f7f8;color:#27272a;`;
    }
    if (el.classList.contains('alert-title')) { const c = ALERT_COLORS[(el.parentElement.className.match(/alert-(\w+)/) || [])[1]] || '#2563eb'; css = `${docs ? 'font-size:12pt;margin:0 0 4pt;' : 'margin:0 0 .4em;'}font-weight:700;color:${c};`; }
    if (el.classList.contains('math-block')) css = docs ? 'font-size:12pt;margin:10pt 0;text-align:center;' : 'margin:1em 0;text-align:center;';
    for (const c of el.classList) for (const [re, col] of TOKEN_COLORS) if (re.test(c)) css += `color:${col};`;
    if (css) el.setAttribute('style', css + (el.getAttribute('style') || ''));
  });
}

/** Show whether a copy worked: swap the button's icon (and label) to a check, or a cross if it failed, then restore it. */
function flashCopy(btn, ok) {
  if (!btn) return;
  const use = $('svg.i:not(.chev) use', btn), lbl = $('.pl', btn);
  if (!use) return;
  if (!btn._copyOrig) btn._copyOrig = { href: use.getAttribute('href'), label: lbl ? lbl.textContent : '' };
  const o = btn._copyOrig;
  use.setAttribute('href', ok ? '#i-check' : '#i-x');
  if (lbl) lbl.textContent = ok ? 'Copied' : 'Failed';
  btn.classList.remove('done', 'fail'); void btn.offsetWidth;
  btn.classList.add(ok ? 'done' : 'fail');
  clearTimeout(btn._copyTimer);
  btn._copyTimer = setTimeout(() => {
    use.setAttribute('href', o.href); if (lbl) lbl.textContent = o.label;
    btn.classList.remove('done', 'fail'); btn._copyOrig = null;
  }, 1600);
}
const COPY_ACTS = new Set(['copy-rich', 'copy-docs', 'copy-md', 'copy-html']);

async function writeClipboard({ html, text }, builder) {
  try {
    if (navigator.clipboard && window.ClipboardItem && (html || builder)) {
      const built = builder ? builder() : Promise.resolve({ html, text });
      await navigator.clipboard.write([new ClipboardItem({
        'text/html': built.then(b => new Blob([b.html], { type: 'text/html' })),
        'text/plain': built.then(b => new Blob([b.text], { type: 'text/plain' }))
      })]);
      return true;
    }
    if (navigator.clipboard && !html && !builder) { await navigator.clipboard.writeText(text); return true; }
  } catch (e) { /* fall through to legacy path */ }
  // legacy fallback
  if (builder) { const b = await builder(); html = b.html; text = b.text; }
  try {
    if (html) {
      const d = document.createElement('div');
      d.contentEditable = 'true'; d.style.cssText = 'position:fixed;left:-9999px;top:0;background:#fff;color:#000';
      d.innerHTML = html; document.body.appendChild(d);
      const r = document.createRange(); r.selectNodeContents(d);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      const ok = document.execCommand('copy'); s.removeAllRanges(); d.remove();
      return ok;
    }
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.appendChild(ta);
    ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch (e) { return false; }
}

async function copyFormatted(flavor) {
  if (!editor.value.trim()) return toast('Nothing to copy yet');
  const docs = flavor === 'docs';
  toast('Preparing…');
  const builder = async () => {
    const root = await buildExportDOM();
    for (const svg of $$('.mermaid-block svg', root)) {
      try { svg.replaceWith(await svgToImg(svg)); } catch (e) { /* keep vector version */ }
    }
    const text = domToText(root.cloneNode(true));
    $$('.fn-back', root).forEach(x => x.remove());
    $$('.fn-ref a', root).forEach(x => x.replaceWith(...x.childNodes));
    applyInlineStyles(root, flavor);
    const wrap = docs ? `font-size:12pt;`
                      : "font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1c1f;line-height:1.65";
    return { html: `<div style="${wrap}">${root.innerHTML}</div>`, text };
  };
  const ok = await writeClipboard({}, builder);
  toast(ok ? (docs ? 'Copied for Docs — paste it into Google Docs or Word' : 'Formatted text copied — paste it anywhere')
           : 'Copy failed — your browser blocked clipboard access');
  return ok;
}
async function copyHTMLSource() {
  if (!editor.value.trim()) return toast('Nothing to copy yet');
  const root = await buildExportDOM();
  const html = Array.from(root.childNodes).map(n => n.nodeType === 1 ? n.outerHTML : n.textContent.trim()).filter(Boolean).join('\n');
  const ok = await writeClipboard({ text: html });
  toast(ok ? 'HTML copied' : 'Copy failed — your browser blocked clipboard access');
  return ok;
}

const EXPORT_VARS = `:root{--font-sans:'Nunito',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;--font-mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
--md-text:#1c1c1f;--md-muted:#5b5b63;--md-line:#e6e6e2;--md-line-strong:#cfcfca;--md-code-bg:#f1f1ef;--md-pre-bg:#f7f7f5;--md-link:#4f46e5;--md-mark:#fff1a8;--md-th-bg:#f6f6f4;--md-stripe:#fbfbfa;
--tok-kw:#7c3aed;--tok-str:#0f8f62;--tok-num:#c2680a;--tok-com:#9a9aa3;--tok-fn:#2563eb;--tok-type:#c026a3;--tok-attr:#0e7490;
--al-note:#2563eb;--al-tip:#0f8f62;--al-important:#7c3aed;--al-warning:#c2680a;--al-caution:#dc2626}`;
const EXPORT_PAGE = `*{box-sizing:border-box}html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;background:#fff;color:#1c1c1f}.md{max-width:780px;margin:0 auto;padding:56px 28px 80px}
.md pre{white-space:pre-wrap;overflow:visible}.md math[display="block"]{display:block math;margin:1em 0}
@page{margin:18mm 16mm}
@media print{.md{max-width:none;padding:0}.md pre,.md table,.md img,.md svg,.md blockquote,.md .math-block,.md details{break-inside:avoid}.md h1,.md h2,.md h3,.md h4,.md h5,.md h6{break-after:avoid}.md a{color:inherit}}`;
/** `local` = link the bundled fonts (used for the print frame, works offline); otherwise add no font link, so a downloaded .html never contacts a third party. */
function standaloneHTML(body, title, local) {
  const css = window.QUILLDOWN_DOC_CSS;
  const fonts = local
    ? '<link rel="stylesheet" href="' + new URL('vendor/fonts/fonts.css', location.href).href + '">'
    : '';   // a downloaded .html makes no web requests when opened: it falls back to the system fonts
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title>
${fonts}
<style>${EXPORT_VARS}\n${css}\n${EXPORT_PAGE}</style></head><body><article class="md">\n${body}\n</article></body></html>`;
}
async function exportHTMLFile() {
  if (!editor.value.trim()) return toast('Nothing to export yet');
  toast('Preparing HTML…');
  const root = await buildExportDOM();
  download(baseName() + '.html', new Blob([standaloneHTML(root.innerHTML, baseName())], { type: 'text/html;charset=utf-8' }));
  toast('Exported ' + baseName() + '.html');
}
async function exportPDF() {
  if (!editor.value.trim()) return toast('Nothing to export yet');
  toast('Preparing PDF — choose “Save as PDF” in the print dialog');
  const root = await buildExportDOM();
  const f = document.createElement('iframe');
  f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
  f.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none';
  f.srcdoc = standaloneHTML(root.innerHTML, baseName(), true);
  const loaded = new Promise(r => { f.onload = r; });
  document.body.appendChild(f);
  await loaded;
  try { await f.contentDocument.fonts.ready; } catch (e) {}
  await new Promise(r => setTimeout(r, 250));
  const prevTitle = document.title; document.title = baseName();
  const cleanup = () => { document.title = prevTitle; setTimeout(() => f.remove(), 500); };
  f.contentWindow.addEventListener('afterprint', cleanup, { once: true });
  setTimeout(() => { if (f.isConnected) cleanup(); }, 120000);
  f.contentWindow.focus(); f.contentWindow.print();
}

/* ---- Plain text ---- */
function domToText(root) {
  $$('input[type="checkbox"]', root).forEach(cb => cb.replaceWith(document.createTextNode(cb.checked ? '[x] ' : '[ ] ')));
  $$('.math', root).forEach(m => { const t = dec(m.dataset.tex); m.textContent = m.dataset.display === '1' ? `$$${t}$$` : `$${t}$`; });
  $$('.mermaid-block', root).forEach(m => { m.textContent = '[Diagram]'; });
  $$('.fn-ref', root).forEach(s => { s.textContent = '[' + s.dataset.fn + ']'; });
  $$('.fn-back', root).forEach(x => x.remove());
  $$('.footnotes li', root).forEach(li => li.insertBefore(document.createTextNode('[' + String(li.id).replace('fn-', '') + '] '), li.firstChild));
  const flat = n => n.textContent.replace(/\s+/g, ' ').trim();
  const list = (ul, depth) => {
    let i = 0;
    return Array.from(ul.children).filter(li => li.tagName === 'LI').map(li => {
      i++;
      const own = li.cloneNode(true);
      Array.from(own.children).filter(x => /^(UL|OL)$/.test(x.tagName)).forEach(x => x.remove());
      const subs = Array.from(li.children).filter(x => /^(UL|OL)$/.test(x.tagName)).map(x => list(x, depth + 1));
      return ['  '.repeat(depth) + (ul.tagName === 'OL' ? i + '. ' : '- ') + flat(own), ...subs].join('\n');
    }).join('\n');
  };
  const blocks = node => {
    const out = [];
    for (const c of node.children) {
      const tag = c.tagName.toLowerCase();
      if (tag === 'ul' || tag === 'ol') out.push(list(c, 0));
      else if (tag === 'pre') out.push(c.textContent.replace(/\n$/, ''));
      else if (tag === 'table') out.push(Array.from(c.querySelectorAll('tr')).map(tr => Array.from(tr.children).map(flat).join(' | ')).join('\n'));
      else if (tag === 'hr') out.push('----------------------------------------');
      else if (tag === 'blockquote') out.push(blocks(c).join('\n\n').split('\n').map(l => '> ' + l).join('\n'));
      else if (tag === 'div' || tag === 'section' || tag === 'article' || tag === 'details') out.push(...blocks(c));
      else { const t = flat(c); if (t) out.push(t); }
    }
    return out;
  };
  return blocks(root).join('\n\n') + '\n';
}
async function exportTXT() {
  if (!editor.value.trim()) return toast('Nothing to export yet');
  const root = await buildExportDOM();
  download(baseName() + '.txt', new Blob([domToText(root)], { type: 'text/plain;charset=utf-8' }));
  toast('Exported ' + baseName() + '.txt');
}

/* ---- Word (.docx) — real document, not an HTML wrapper ---- */
const DOCX_URL = 'vendor/docx.umd.js';
let docxLoad = null;
function loadDocx() {
  if (window.docx) return Promise.resolve(window.docx);
  return docxLoad || (docxLoad = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = DOCX_URL; s.async = true; s.onload = () => res(window.docx);
    s.onerror = () => { docxLoad = null; rej(new Error('load')); };
    document.head.appendChild(s);
  }));
}
async function imgToBytes(img, scale) {
  try { await img.decode(); } catch (e) { return null; }
  const w = img.naturalWidth, h = img.naturalHeight; if (!w || !h) return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); ctx.drawImage(img, 0, 0);
  let blob; try { blob = await new Promise(r => c.toBlob(r, 'image/png')); } catch (e) { return null; }   // throws if the canvas is tainted
  if (!blob) return null;
  const k = Math.min(1, 600 / (w / scale));
  return { data: new Uint8Array(await blob.arrayBuffer()), width: Math.round(w / scale * k), height: Math.round(h / scale * k) };
}
async function domToDocx(root, d) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink, ImageRun, Table, TableRow, TableCell,
          WidthType, BorderStyle, ShadingType, AlignmentType, LevelFormat, FootnoteReferenceRun } = d;
  const footnotes = {};
  const FONT = 'Arial', MONO = 'Courier New';
  const HSIZE = [0, 46, 34, 28, 24, 24, 24];                 // half-points: 23 / 17 / 14 / 12 pt
  const HSPACE = [0, [360, 120], [320, 100], [280, 80], [240, 80], [240, 80], [240, 80]];
  const HLEVEL = [null, HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6];
  const ALERT = { note: '2563EB', tip: '0F8F62', important: '7C3AED', warning: 'C2680A', caution: 'DC2626' };
  const numbering = [];
  const lvl = (level, format, text) => ({ level, format, text, alignment: AlignmentType.START, style: { paragraph: { indent: { left: 540 + level * 360, hanging: 270 } } } });
  numbering.push({ reference: 'ink-bullets', levels: Array.from({ length: 9 }, (_, i) => lvl(i, LevelFormat.BULLET, ['•', '◦', '▪'][i % 3])) });
  let listSeq = 0;
  const newOrdered = () => {
    const ref = 'ink-ol-' + (++listSeq), fm = [LevelFormat.DECIMAL, LevelFormat.LOWER_LETTER, LevelFormat.LOWER_ROMAN];
    numbering.push({ reference: ref, levels: Array.from({ length: 9 }, (_, i) => lvl(i, fm[i % 3], `%${i + 1}.`)) });
    return ref;
  };
  const flatFmt = f => { const o = { font: FONT, size: 24 }; for (const k in f) if (f[k] !== undefined) o[k] = f[k]; return o; };

  async function imageRunFrom(img, scale = 1) {
    const b = await imgToBytes(img, scale);
    return b ? new ImageRun({ data: b.data, type: 'png', transformation: { width: b.width, height: b.height } }) : null;
  }
  async function runs(nodes, fmt) {
    const out = [];
    for (const n of nodes) {
      if (n.nodeType === 3) { const t = n.nodeValue.replace(/\s+/g, ' '); if (t) out.push(new TextRun({ ...flatFmt(fmt), text: t })); continue; }
      if (n.nodeType !== 1) continue;
      const tag = n.tagName.toLowerCase(); const f = { ...fmt };
      if (n.classList.contains('math')) { out.push(new TextRun({ ...flatFmt(fmt), text: dec(n.dataset.tex), italics: true, font: 'Cambria Math' })); continue; }
      if (tag === 'strong' || tag === 'b') f.bold = true;
      else if (tag === 'em' || tag === 'i') f.italics = true;
      else if (tag === 'u') f.underline = {};
      else if (tag === 'del' || tag === 's') f.strike = true;
      else if (tag === 'mark') f.highlight = 'yellow';
      else if (tag === 'sup' && n.classList.contains('fn-ref')) { out.push(new FootnoteReferenceRun(+n.dataset.fn)); continue; }
      else if (tag === 'sup') f.superScript = true;
      else if (tag === 'sub') f.subScript = true;
      else if (tag === 'code' || tag === 'kbd') { f.font = MONO; f.size = 22; f.shading = { type: ShadingType.CLEAR, fill: 'F1F1F3', color: 'auto' }; }
      else if (tag === 'br') { out.push(new TextRun({ break: 1 })); continue; }
      else if (tag === 'input') { out.push(new TextRun({ ...flatFmt(fmt), text: n.checked ? '☑ ' : '☐ ' })); continue; }
      else if (tag === 'img') {
        let run = null;
        try { const im = new Image(); im.crossOrigin = 'anonymous'; im.src = n.getAttribute('src') || ''; run = await imageRunFrom(im); } catch (e) {}
        out.push(run || new TextRun({ ...flatFmt(fmt), text: `[image: ${n.getAttribute('alt') || 'image'}]`, italics: true }));
        continue;
      }
      else if (tag === 'a') {
        const href = n.getAttribute('href') || '';
        const kids = await runs(n.childNodes, { ...f, color: '1155CC', underline: {} });
        if (/^(https?:|mailto:)/i.test(href)) out.push(new ExternalHyperlink({ link: href, children: kids })); else out.push(...kids);
        continue;
      }
      out.push(...await runs(n.childNodes, f));
    }
    return out;
  }
  async function para(nodes, fmt, opts, ctx) {
    return new Paragraph({ children: await runs(nodes, fmt), spacing: { after: 160, line: 300 }, ...quoteProps(ctx), ...opts });
  }
  const quoteProps = ctx => ctx && ctx.quote ? { indent: { left: 400 }, border: { left: { style: BorderStyle.SINGLE, size: 18, color: ctx.quote, space: 8 } } } : {};
  const plainCell = async (c, th) => {
    const al = c.getAttribute('align');
    return new TableCell({
      width: { size: c._w, type: WidthType.DXA },
      shading: th ? { type: ShadingType.CLEAR, fill: 'F3F3F3', color: 'auto' } : undefined,
      margins: { top: 60, bottom: 60, left: 110, right: 110 },
      children: [new Paragraph({ children: await runs(c.childNodes, th ? { bold: true } : {}), alignment: al === 'center' ? AlignmentType.CENTER : al === 'right' ? AlignmentType.RIGHT : AlignmentType.LEFT })]
    });
  };
  async function tableBlock(t) {
    const trs = Array.from(t.querySelectorAll('tr')), cols = Math.max(1, ...trs.map(r => r.children.length)), w = Math.floor(9000 / cols);
    const b = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
    const rows = [];
    for (const tr of trs) {
      const th = !!tr.closest('thead');
      Array.from(tr.children).forEach(c => { c._w = w; });
      rows.push(new TableRow({ tableHeader: th, children: await Promise.all(Array.from(tr.children).map(c => plainCell(c, c.tagName === 'TH'))) }));
    }
    return new Table({ width: { size: cols * w, type: WidthType.DXA }, columnWidths: Array(cols).fill(w), rows,
      borders: { top: b, bottom: b, left: b, right: b, insideHorizontal: b, insideVertical: b } });
  }
  async function listItems(list, ctx, ref, level) {
    const out = [], ordered = list.tagName === 'OL';
    ref = ordered ? newOrdered() : 'ink-bullets';
    for (const li of Array.from(list.children).filter(x => x.tagName === 'LI')) {
      const task = !!li.querySelector(':scope > input[type="checkbox"], :scope > p > input[type="checkbox"]');
      let first = true, buf = [];
      const numbering_ = () => (first && !task) ? { numbering: { reference: ref, level } } : { indent: { left: 540 + level * 360 } };
      const flush = async () => {
        if (!buf.length) return;
        out.push(await para(buf, {}, { spacing: { after: 60, line: 288 }, ...numbering_() }, ctx));
        first = false; buf = [];
      };
      for (const c of Array.from(li.childNodes)) {
        if (c.nodeType === 1 && (c.tagName === 'UL' || c.tagName === 'OL')) { await flush(); out.push(...await listItems(c, ctx, ref, Math.min(level + 1, 8))); }
        else if (c.nodeType === 1 && c.tagName === 'P') { await flush(); buf = Array.from(c.childNodes); await flush(); }
        else if (c.nodeType === 1 && /^(PRE|TABLE|BLOCKQUOTE|DIV)$/.test(c.tagName)) { await flush(); out.push(...await blocks([c], ctx)); }
        else buf.push(c);
      }
      await flush();
    }
    return out;
  }
  async function blocks(nodes, ctx) {
    const out = [];
    for (const n of nodes) {
      if (n.nodeType === 3) { if (n.nodeValue.trim()) out.push(await para([n], {}, {}, ctx)); continue; }
      if (n.nodeType !== 1) continue;
      const tag = n.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) {
        const k = +tag[1];
        out.push(await para(n.childNodes, { bold: true, size: HSIZE[k], color: k === 6 ? '666666' : '000000' }, { heading: HLEVEL[k], spacing: { before: HSPACE[k][0], after: HSPACE[k][1], line: 276 } }, ctx));
      } else if (tag === 'p') {
        const title = n.classList.contains('alert-title');
        out.push(await para(n.childNodes, title ? { bold: true, color: ctx && ctx.quote } : {}, title ? { spacing: { after: 60 } } : {}, ctx));
      } else if (tag === 'ul' || tag === 'ol') out.push(...await listItems(n, ctx, null, 0));
      else if (tag === 'blockquote') {
        const al = (n.className.match(/alert-(\w+)/) || [])[1];
        out.push(...await blocks(Array.from(n.childNodes), { ...ctx, quote: al ? ALERT[al] : 'CCCCCC' }));
      } else if (tag === 'pre') {
        const lines = n.textContent.replace(/\n$/, '').replace(/\t/g, '    ').split('\n');
        lines.forEach((line, i) => out.push(new Paragraph({
          children: [new TextRun({ text: line || ' ', font: MONO, size: 20 })],
          shading: { type: ShadingType.CLEAR, fill: 'F3F3F3', color: 'auto' },
          spacing: { after: i === lines.length - 1 ? 200 : 0, line: 264 }, indent: { left: 120, right: 120 }
        })));
      } else if (tag === 'table') { out.push(await tableBlock(n)); out.push(new Paragraph({ spacing: { after: 120 } })); }
      else if (tag === 'hr') out.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'BBBBBB', space: 1 } }, spacing: { before: 120, after: 240 } }));
      else if (n.classList.contains('mermaid-block')) {
        const svg = n.querySelector('svg'); let run = null;
        if (svg) { try { const im = await svgToImg(svg); run = await imageRunFrom(im, 2); } catch (e) {} }
        out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [run || new TextRun({ text: '[Diagram]', italics: true, font: FONT, size: 24 })] }));
      } else if (n.classList.contains('math')) {
        out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 200 }, children: [new TextRun({ text: dec(n.dataset.tex).replace(/\s*\n\s*/g, ' '), italics: true, font: 'Cambria Math', size: 24 })] }));
      } else if (tag === 'section' && n.classList.contains('footnotes')) {
        for (const li of $$('li', n)) {
          const num = +String(li.id).replace('fn-', ''); if (!num) continue;
          $$('.fn-back', li).forEach(x => x.remove());
          footnotes[num] = { children: [await para(li.childNodes, { size: 20 }, { spacing: { after: 60 } }, null)] };
        }
      } else if (tag === 'summary') out.push(await para(n.childNodes, { bold: true }, {}, ctx));
      else if (tag === 'div' || tag === 'section' || tag === 'article' || tag === 'details') out.push(...await blocks(Array.from(n.childNodes), ctx));
      else { const t = n.textContent.trim(); if (t) out.push(await para(n.childNodes, {}, {}, ctx)); }
    }
    return out;
  }

  const children = await blocks(Array.from(root.childNodes), null);
  const doc = new Document({
    creator: 'Quilldown', title: baseName(),
    styles: { default: { document: { run: { font: FONT, size: 24 } } } },
    numbering: { config: numbering },
    footnotes,
    sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: children.length ? children : [new Paragraph('')] }]
  });
  return Packer.toBlob(doc);
}
async function exportDOCX() {
  if (!editor.value.trim()) return toast('Nothing to export yet');
  toast('Building Word document…');
  let d;
  try { d = await loadDocx(); } catch (e) { return toast('Couldn’t load the Word exporter — check your connection'); }
  try {
    const root = await buildExportDOM();
    download(baseName() + '.docx', await domToDocx(root, d));
    toast('Exported ' + baseName() + '.docx');
  } catch (e) { console.error(e); toast('Word export failed — please report this document'); }
}

/* ---- PNG image of the whole document (html2canvas, lazy-loaded from ./vendor) ---- */
let h2cLoad = null;
function loadHtml2Canvas() {
  if (window.html2canvas) return Promise.resolve(window.html2canvas);
  return h2cLoad || (h2cLoad = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'vendor/html2canvas.min.js'; s.async = true; s.onload = () => res(window.html2canvas);
    s.onerror = () => { h2cLoad = null; rej(new Error('load')); };
    document.head.appendChild(s);
  }));
}
async function exportPNG() {
  if (!editor.value.trim()) return toast('Nothing to export yet');
  toast('Rendering image…');
  let h2c;
  try { h2c = await loadHtml2Canvas(); } catch (e) { return toast('Couldn’t load the image exporter'); }
  const host = document.createElement('div');
  try {
    const root = await buildExportDOM('html');                                  // KaTeX (not MathML) so it can be drawn
    for (const svg of $$('.mermaid-block svg', root)) { try { svg.replaceWith(await svgToImg(svg)); } catch (e) { /* keep vector */ } }
    host.style.cssText = 'position:fixed;left:-10000px;top:0;width:860px;box-sizing:border-box;padding:48px 56px;background:#fff;color:#1c1c1f;' +
      EXPORT_VARS.replace(/^:root\{|\}\s*$/g, '').replace(/\n/g, '');
    host.appendChild(root); document.body.appendChild(host);
    try { await document.fonts.ready; } catch (e) {}
    await Promise.all($$('img', host).map(i => i.decode ? i.decode().catch(() => {}) : null));
    const w = host.offsetWidth, h = host.scrollHeight, scale = h <= 9000 ? 2 : 1;
    if (h * scale > 30000) { toast('This document is too tall for a single image — use PDF instead'); return; }
    const canvas = await h2c(host, { scale, backgroundColor: '#ffffff', useCORS: true, logging: false, width: w, height: h, windowWidth: w, windowHeight: h });
    const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
    if (!blob) throw new Error('empty');
    download(baseName() + '.png', blob);
    toast('Exported ' + baseName() + '.png (' + canvas.width + ' × ' + canvas.height + ')');
  } catch (e) { console.error(e); toast('Image export failed — try PDF instead'); }
  finally { host.remove(); }
}

/* ---- EPUB e-book (EPUB 3, hand-built zip — no library) ---- */
const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = bytes => { let c = 0xFFFFFFFF; for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
/** Minimal ZIP writer (stored / uncompressed). `files`: [{ name, data: Uint8Array|string }] — EPUB needs `mimetype` first and uncompressed. */
function zipStore(files) {
  const enc = new TextEncoder(), parts = [], central = []; let offset = 0;
  const now = new Date(), dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1), dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  for (const f of files) {
    const name = enc.encode(f.name), data = typeof f.data === 'string' ? enc.encode(f.data) : f.data, crc = crc32(data);
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
    lh.setUint16(10, dosTime, true); lh.setUint16(12, dosDate, true); lh.setUint32(14, crc, true);
    lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, name.length, true); lh.setUint16(28, 0, true);
    parts.push(new Uint8Array(lh.buffer), name, data);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true);
    ch.setUint16(12, dosTime, true); ch.setUint16(14, dosDate, true); ch.setUint32(16, crc, true);
    ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true); ch.setUint16(28, name.length, true); ch.setUint32(42, offset, true);
    central.push(new Uint8Array(ch.buffer), name);
    offset += 30 + name.length + data.length;
  }
  const cdSize = central.reduce((n, p) => n + p.length, 0), end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: 'application/epub+zip' });
}
const XHTML_NS = 'http://www.w3.org/1999/xhtml', EPUB_NS = 'http://www.idpf.org/2007/ops';
const xmlEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function epubCss() {
  const vars = {}; EXPORT_VARS.replace(/(--[\w-]+):([^;}]+)/g, (m, k, v) => { vars[k] = v.trim(); return m; });
  const css = window.QUILLDOWN_DOC_CSS.replace(/var\((--[\w-]+)\)/g, (m, k) => vars[k] || 'inherit');
  return css + '\nbody{margin:5%}.md{font-family:inherit;line-height:1.6;max-width:none}.md pre,.md code,.md kbd{font-family:monospace}.md pre{white-space:pre-wrap}.md img{max-width:100%}\n';
}
async function exportEPUB() {
  if (!editor.value.trim()) return toast('Nothing to export yet');
  toast('Building e-book…');
  try {
    const root = await buildExportDOM();
    for (const svg of $$('.mermaid-block svg', root)) { try { svg.replaceWith(await svgToImg(svg)); } catch (e) {} }
    $$('.mermaid-block', root).forEach(m => { if (!m.querySelector('img')) m.textContent = '[Diagram]'; });

    /* images → files (data URIs only; WebP is converted to PNG because EPUB 3 does not allow it) */
    const media = [], seen = new Map();
    const extOf = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/svg+xml': 'svg' };
    for (const img of $$('img', root)) {
      const src = img.getAttribute('src') || '', m = /^data:([\w/+.-]+)(;base64)?,(.*)$/s.exec(src);
      if (!m) { const a = document.createElement('a'); a.href = src; a.textContent = img.alt || 'image'; img.replaceWith(a); continue; }
      if (seen.has(src)) { img.setAttribute('data-epub-src', seen.get(src)); continue; }
      let type = m[1], bytes;
      if (type === 'image/webp' || !extOf[type]) {
        const im = new Image(); im.src = src; await im.decode();
        const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0);
        bytes = new Uint8Array(await (await new Promise(r => c.toBlob(r, 'image/png'))).arrayBuffer()); type = 'image/png';
      } else if (m[2]) { const b = atob(m[3]); bytes = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) bytes[i] = b.charCodeAt(i); }
      else bytes = new TextEncoder().encode(decodeURIComponent(m[3]));
      const href = 'images/img-' + (media.length + 1) + '.' + extOf[type];
      media.push({ href, type, data: bytes }); seen.set(src, href); img.setAttribute('data-epub-src', href);
      if (!img.hasAttribute('alt')) img.setAttribute('alt', '');
    }

    /* split into chapters at each H1 */
    const title = baseName(), chapters = []; let cur = null;
    const start = t => { cur = { title: t, nodes: [] }; chapters.push(cur); };
    for (const n of Array.from(root.childNodes)) {
      if (n.nodeType === 1 && n.tagName === 'H1') start(n.textContent.trim() || title);
      else if (!cur) { if (n.nodeType === 1 || n.textContent.trim()) start(title); else continue; }
      cur.nodes.push(n);
    }
    if (!chapters.length) start(title);
    chapters.forEach((c, i) => { c.file = 'ch' + (i + 1) + '.xhtml'; });
    const owner = new Map();
    chapters.forEach(c => c.nodes.forEach(n => { if (n.nodeType === 1) { if (n.id) owner.set(n.id, c); $$('[id]', n).forEach(e => owner.set(e.id, c)); } }));
    chapters.forEach(c => c.nodes.forEach(n => { if (n.nodeType === 1) $$('a[href^="#"]', n).forEach(a => { const id = a.getAttribute('href').slice(1), o = owner.get(id); if (o) a.setAttribute('href', (o === c ? '' : o.file) + '#' + id); else a.removeAttribute('href'); }); }));

    const chapterXhtml = c => {
      const d = document.implementation.createDocument(XHTML_NS, 'html', null), html = d.documentElement;
      html.setAttribute('xmlns:epub', EPUB_NS); html.setAttribute('lang', 'en'); html.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:lang', 'en');
      const head = d.createElementNS(XHTML_NS, 'head'), body = d.createElementNS(XHTML_NS, 'body'), wrap = d.createElementNS(XHTML_NS, 'div');
      const t = d.createElementNS(XHTML_NS, 'title'); t.textContent = c.title; head.appendChild(t);
      const lk = d.createElementNS(XHTML_NS, 'link'); lk.setAttribute('rel', 'stylesheet'); lk.setAttribute('type', 'text/css'); lk.setAttribute('href', 'style.css'); head.appendChild(lk);
      wrap.setAttribute('class', 'md'); c.nodes.forEach(n => wrap.appendChild(d.importNode(n, true)));
      Array.from(wrap.getElementsByTagNameNS(XHTML_NS, 'img')).forEach(im => { const f = im.getAttribute('data-epub-src'); if (f) { im.setAttribute('src', f); im.removeAttribute('data-epub-src'); } });
      body.appendChild(wrap); html.appendChild(head); html.appendChild(body);
      c.hasMath = !!wrap.getElementsByTagNameNS('http://www.w3.org/1998/Math/MathML', 'math').length;
      return '<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n' + new XMLSerializer().serializeToString(d);
    };
    const files = [
      { name: 'mimetype', data: 'application/epub+zip' },
      { name: 'META-INF/container.xml', data: '<?xml version="1.0"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>' }
    ];
    chapters.forEach(c => files.push({ name: 'OEBPS/' + c.file, data: chapterXhtml(c) }));
    const tocItems = chapters.map(c => {
      const subs = c.nodes.filter(n => n.nodeType === 1 && n.tagName === 'H2').map(n => '<li><a href="' + c.file + '#' + xmlEsc(n.id) + '">' + xmlEsc(n.textContent.trim()) + '</a></li>');
      return '<li><a href="' + c.file + '">' + xmlEsc(c.title) + '</a>' + (subs.length ? '<ol>' + subs.join('') + '</ol>' : '') + '</li>';
    }).join('');
    files.push({ name: 'OEBPS/nav.xhtml', data: '<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n<html xmlns="' + XHTML_NS + '" xmlns:epub="' + EPUB_NS + '" lang="en" xml:lang="en"><head><title>Contents</title></head><body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol>' + tocItems + '</ol></nav></body></html>' });
    files.push({ name: 'OEBPS/style.css', data: epubCss() });
    media.forEach(m => files.push({ name: 'OEBPS/' + m.href, data: m.data }));
    const id = 'urn:uuid:' + (crypto.randomUUID ? crypto.randomUUID() : uid() + uid());
    const manifest = ['<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>', '<item id="css" href="style.css" media-type="text/css"/>']
      .concat(chapters.map((c, i) => '<item id="ch' + (i + 1) + '" href="' + c.file + '" media-type="application/xhtml+xml"' + (c.hasMath ? ' properties="mathml"' : '') + '/>'))
      .concat(media.map((m, i) => '<item id="img' + (i + 1) + '" href="' + m.href + '" media-type="' + m.type + '"/>')).join('\n    ');
    const spine = chapters.map((c, i) => '<itemref idref="ch' + (i + 1) + '"/>').join('');
    files.splice(2, 0, { name: 'OEBPS/content.opf', data: '<?xml version="1.0" encoding="utf-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="en">\n  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n    <dc:identifier id="bookid">' + id + '</dc:identifier>\n    <dc:title>' + xmlEsc(title) + '</dc:title>\n    <dc:language>en</dc:language>\n    <meta property="dcterms:modified">' + new Date().toISOString().replace(/\.\d+Z$/, 'Z') + '</meta>\n  </metadata>\n  <manifest>\n    ' + manifest + '\n  </manifest>\n  <spine>' + spine + '</spine>\n</package>' });
    download(baseName() + '.epub', zipStore(files));
    toast('Exported ' + baseName() + '.epub (' + chapters.length + (chapters.length === 1 ? ' chapter' : ' chapters') + ')');
  } catch (e) { console.error(e); toast('E-book export failed'); }
}

/* ---------------------------------------------------------------
   Files: open + drag & drop
--------------------------------------------------------------- */
async function readFile(file) {
  const okType = /\.(md|markdown|mdown|mkd|txt|text)$/i.test(file.name) || (file.type || '').startsWith('text/');
  if (!okType) { toast('“' + file.name + '” isn’t a Markdown or text file'); return null; }
  if (file.size > 5 * 1024 * 1024) { toast('“' + file.name + '” is over 5 MB'); return null; }
  try { return await file.text(); } catch (e) { toast('Couldn’t read ' + file.name); return null; }
}
const norm = s => String(s).replace(/\r\n?/g, '\n');
async function findTabByHandle(handle) {
  for (const t of tabs) { try { if (t.handle && t.handle.isSameEntry && await t.handle.isSameEntry(handle)) return t; } catch (e) {} }
  return null;
}
/** Opens files as tabs. `handles` (File System Access) are optional; with one, the tab stays linked to the file on disk and Ctrl+S saves back to it. */
async function openFiles(files, handles) {
  let opened = 0, last = '';
  for (let i = 0; i < files.length; i++) {
    const file = files[i], handle = handles && handles[i] && handles[i].kind === 'file' ? handles[i] : null;
    if (handle) { const dupe = await findTabByHandle(handle); if (dupe) { switchTab(dupe.id); opened++; last = file.name; continue; } }
    const text = await readFile(file);
    if (text === null) continue;
    // reuse the current tab if it is an untouched blank one
    const t = activeTab(); let target;
    if (tabs.length === 1 && !t.text.trim() && !t.handle) { t.name = file.name; loadActive(); persistTabs(); scheduleSave(); replace(0, 0, text, 0, 0); target = t; }
    else target = newTab(file.name, text);
    if (target && handle) { target.handle = handle; target.saved = norm(text); target.eol = /\r\n/.test(text) ? '\r\n' : '\n'; renderTabs(); }
    opened++; last = file.name;
  }
  if (opened) toast(opened === 1 ? 'Opened ' + last : `Opened ${opened} files in tabs`);
}
$('#fileInput').addEventListener('change', e => { openFiles(Array.from(e.target.files)); e.target.value = ''; });

let dragDepth = 0;
const hasFiles = e => e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');
const dz = $('#dropzone');
window.addEventListener('dragenter', e => { if (!hasFiles(e)) return; e.preventDefault(); dragDepth++; dz.classList.add('show'); });
window.addEventListener('dragover', e => { if (!hasFiles(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
window.addEventListener('dragleave', e => { if (!hasFiles(e)) return; dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) dz.classList.remove('show'); });
window.addEventListener('drop', e => {
  if (!hasFiles(e)) return;
  e.preventDefault(); dragDepth = 0; dz.classList.remove('show');
  const files = Array.from(e.dataTransfer.files);
  const handlePromises = Array.from(e.dataTransfer.items || []).filter(i => i.kind === 'file').map(i => (i.getAsFileSystemHandle ? i.getAsFileSystemHandle().catch(() => null) : Promise.resolve(null)));   // must be requested synchronously
  if (!files.length) return;
  if (!state.full) setFull(true);
  const imgs = files.filter(f => f.type.startsWith('image/')), rest = files.filter(f => !f.type.startsWith('image/'));
  if (imgs.length) addImageFiles(imgs);
  if (rest.length) Promise.all(handlePromises).then(hs => { const by = new Map(files.map((f, i) => [f, hs[i]])); openFiles(rest, rest.map(f => by.get(f))); });
});

/* ---------------------------------------------------------------
   Images: paste / drop / upload → stored with the document, referenced as img:<id>
--------------------------------------------------------------- */
function persistImages(t) {
  const keys = Object.keys(t.images || {});
  if (!keys.length) { store.del('img:' + t.id); return true; }
  const ok = store.set('img:' + t.id, JSON.stringify(t.images));
  if (!ok) toast('Image added, but it is too big to save in this browser — export soon so you don’t lose it');
  return ok;
}
const readAsDataURL = blob => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob); });
async function processImage(file) {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    if (file.size > 400 * 1024) throw new Error('That ' + file.type.split('/')[1].toUpperCase() + ' is over 400 KB');
    return readAsDataURL(file);
  }
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  const ctx = c.getContext('2d'); ctx.drawImage(bmp, 0, 0, c.width, c.height);
  let blob = await new Promise(r => c.toBlob(r, 'image/webp', 0.88));
  if (!blob || blob.type !== 'image/webp') {                                    // Safari: no WebP encoder → JPEG on white
    ctx.globalCompositeOperation = 'destination-over'; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.88));
  }
  return readAsDataURL(blob);
}
async function addImageFiles(files) {
  const t = activeTab(); let added = 0;
  for (const file of files) {
    try {
      const url = await processImage(file);
      const id = 'i' + uid().slice(0, 6);
      t.images[id] = url;
      const alt = (file.name || 'image').replace(/\.[^.]+$/, '').replace(/[\[\]()]/g, '') || 'image';
      const { s, e } = sel();
      replace(s, e, `![${alt}](img:${id})` + (files.length > 1 ? '\n\n' : ''));
      added++;
    } catch (err) { toast(err && err.message && /over/.test(err.message) ? err.message : 'Couldn’t add “' + (file.name || 'image') + '”'); }
  }
  if (added) { persistImages(t); scheduleSave(); toast(added === 1 ? 'Image added to this document' : added + ' images added'); }
}
$('#imageInput').addEventListener('change', e => { addImageFiles(Array.from(e.target.files)); e.target.value = ''; });

/* ---------------------------------------------------------------
   Tabs (multiple documents) + persistence
--------------------------------------------------------------- */
const MAX_TABS = 30;
let tabs = [], activeId = null, saveTimer;
const closedStack = [];
const activeTab = () => tabs.find(t => t.id === activeId);

function uniqueName(base) {
  const m = /^(.*?)(\.[^.]+)?$/.exec(base), stem = m[1] || 'untitled', ext = m[2] || '.md';
  let name = stem + ext, n = 1;
  while (tabs.some(t => t.name === name)) name = `${stem}-${++n}${ext}`;
  return name;
}
function persistTabs() {
  store.set('tabs', JSON.stringify(tabs.map(t => ({ id: t.id, name: t.name }))));
  store.set('active', activeId);
}
function scheduleSave() {
  $('#stSaved').lastChild.textContent = 'Saving…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const t = activeTab(); let ok = true;
    if (t) ok = store.set('doc:' + t.id, t.text);
    $('#stSaved').lastChild.textContent = ok ? 'Saved locally' : 'Not saved (storage full)';
  }, 450);
}
function captureView() {
  const t = activeTab(); if (!t) return;
  t.text = editor.value; t.sel = [editor.selectionStart, editor.selectionEnd];
  t.scroll = editor.scrollTop; t.pscroll = pane.scrollTop;
}
/** Push the active tab's content into the editor + preview. */
function loadActive() {
  const t = activeTab();
  editor.value = t.text;
  const [s, e] = t.sel || [0, 0];
  editor.setSelectionRange(Math.min(s, t.text.length), Math.min(e, t.text.length));
  linesDirty = blocksDirty = true;
  render(); updateStats(); updateCursor(); renderTabs();
  if (fb.open) fbCompute(0);
  claim('tab');
  requestAnimationFrame(() => { editor.scrollTop = t.scroll || 0; pane.scrollTop = t.pscroll || 0; });
}
function switchTab(id) {
  if (id === activeId || !tabs.some(t => t.id === id)) return;
  captureView(); store.set('doc:' + activeId, activeTab().text);
  activeId = id; loadActive(); persistTabs(); editor.focus({ preventScroll: true });
}
function newTab(name, text) {
  if (tabs.length >= MAX_TABS) return toast(`You can have up to ${MAX_TABS} tabs open — close one first`);
  captureView();
  if (activeTab()) store.set('doc:' + activeId, activeTab().text);
  const t = { id: uid(), name: uniqueName(name || 'untitled.md'), text: text || '', sel: [0, 0], scroll: 0, pscroll: 0, images: {} };
  tabs.push(t); activeId = t.id;
  store.set('doc:' + t.id, t.text); persistTabs(); loadActive();
  editor.focus({ preventScroll: true });
  return t;
}
function closeTab(id) {
  const i = tabs.findIndex(t => t.id === id); if (i < 0) return;
  captureView();
  const [gone] = tabs.splice(i, 1);
  closedStack.push({ tab: gone, index: i }); if (closedStack.length > 10) closedStack.shift();
  store.del('doc:' + gone.id); store.del('img:' + gone.id);
  const hadContent = !!gone.text.trim();
  if (!tabs.length) { tabs.push({ id: uid(), name: 'untitled.md', text: '', sel: [0, 0], scroll: 0, pscroll: 0, images: {} }); activeId = tabs[0].id; store.set('doc:' + activeId, ''); }
  else if (id === activeId) activeId = tabs[Math.min(i, tabs.length - 1)].id;
  loadActive(); persistTabs();
  toast(`Closed ${gone.name}`, hadContent ? { label: 'Undo', fn: reopenTab } : null);
}
function reopenTab() {
  const c = closedStack.pop(); if (!c) return toast('No closed tabs to restore');
  captureView();
  // drop the placeholder blank tab if that's all there is
  if (tabs.length === 1 && !tabs[0].text.trim()) tabs.length = 0;
  tabs.splice(Math.min(c.index, tabs.length), 0, c.tab);
  activeId = c.tab.id; store.set('doc:' + c.tab.id, c.tab.text); persistImages(c.tab);
  loadActive(); persistTabs(); toast('Restored ' + c.tab.name);
}
function updateTabDirty() {
  const t = activeTab(), el = $('.tab[aria-selected="true"]');
  if (t && el) el.classList.toggle('modified', !!t.handle && norm(t.text) !== t.saved);
}
function renderTabs() {
  const host = $('#tabs');
  host.innerHTML = tabs.map(t => `<div class="tab${t.handle ? ' linked' : ''}${t.handle && norm(t.text) !== t.saved ? ' modified' : ''}" role="tab" draggable="true" data-id="${t.id}" aria-selected="${t.id === activeId}" title="${escapeAttr(t.name + (t.handle ? ' — linked to a file on your computer (Ctrl+S saves it)' : ''))}"><span class="tab-name">${escapeHtml(t.name)}</span><button type="button" class="tab-x" data-close="${t.id}" aria-label="Close ${escapeAttr(t.name)}" tabindex="-1"><svg class="i"><use href="#i-x"/></svg></button></div>`).join('')
    + '<button type="button" class="tab-new" data-act="blank" title="New tab" aria-label="New tab"><svg class="i"><use href="#i-plus"/></svg></button>';
  const cur = host.querySelector('[aria-selected="true"]'); if (cur) cur.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
(function initTabs() {
  const host = $('#tabs'); let dragId = null;
  host.addEventListener('click', e => {
    const x = e.target.closest('[data-close]'); if (x) { closeTab(x.dataset.close); return; }
    const tab = e.target.closest('.tab'); if (tab) switchTab(tab.dataset.id);
  });
  host.addEventListener('auxclick', e => { const tab = e.target.closest('.tab'); if (tab && e.button === 1) { e.preventDefault(); closeTab(tab.dataset.id); } });
  host.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); });
  host.addEventListener('dblclick', e => { const tab = e.target.closest('.tab'); if (tab && !e.target.closest('.tab-x,.tab-input')) renameTab(tab.dataset.id); });
  host.addEventListener('dragstart', e => { const tab = e.target.closest('.tab'); if (!tab) return; dragId = tab.dataset.id; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/x-quilldown-tab', dragId); });
  host.addEventListener('dragover', e => {
    if (!dragId) return; e.preventDefault();
    $$('.tab.drag-over', host).forEach(t => t.classList.remove('drag-over'));
    const tab = e.target.closest('.tab'); if (tab && tab.dataset.id !== dragId) tab.classList.add('drag-over');
  });
  host.addEventListener('dragleave', e => { if (!host.contains(e.relatedTarget)) $$('.tab.drag-over', host).forEach(t => t.classList.remove('drag-over')); });
  host.addEventListener('drop', e => {
    if (!dragId) return; e.preventDefault();
    const target = e.target.closest('.tab'), from = tabs.findIndex(t => t.id === dragId);
    if (target && from >= 0) {
      const to = tabs.findIndex(t => t.id === target.dataset.id), [m] = tabs.splice(from, 1);
      tabs.splice(to, 0, m); persistTabs(); renderTabs();
    }
    dragId = null;
  });
  host.addEventListener('dragend', () => { dragId = null; $$('.tab.drag-over', host).forEach(t => t.classList.remove('drag-over')); });
  // keyboard: Ctrl/Cmd + Alt + ←/→ switch tabs, Ctrl/Cmd + Alt + W closes
  document.addEventListener('keydown', e => {
    if (!state.full || !(e.ctrlKey || e.metaKey) || !e.altKey) return;
    const i = tabs.findIndex(t => t.id === activeId);
    if (e.key === 'ArrowRight') { e.preventDefault(); switchTab(tabs[(i + 1) % tabs.length].id); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); switchTab(tabs[(i - 1 + tabs.length) % tabs.length].id); }
    else if (e.key.toLowerCase() === 'w') { e.preventDefault(); closeTab(activeId); }
    else if (e.key.toLowerCase() === 'n') { e.preventDefault(); A.blank(); }
  });
})();
function loadTabsFromStorage() {
  let meta = null;
  try { meta = JSON.parse(store.get('tabs', 'null')); } catch (e) {}
  if (Array.isArray(meta) && meta.length) {
    tabs = meta.map(m => {
      const text = store.get('doc:' + m.id, ''); let images = {};
      try { images = JSON.parse(store.get('img:' + m.id, '{}')) || {}; } catch (e) {}
      Object.keys(images).forEach(k => { if (!text.includes('img:' + k)) delete images[k]; });      // drop images no longer referenced
      return { id: m.id, name: m.name || 'untitled.md', text, sel: [0, 0], scroll: 0, pscroll: 0, images };
    });
    const a = store.get('active', meta[0].id); activeId = tabs.some(t => t.id === a) ? a : tabs[0].id;
    return;
  }
  const old = store.get('doc', null);                         // migrate the single-document format
  const t = { id: uid(), name: old !== null ? store.get('name', 'untitled.md') : 'welcome.md', text: old !== null ? old : SAMPLE, sel: [0, 0], scroll: 0, pscroll: 0, images: {} };
  tabs = [t]; activeId = t.id;
  store.set('doc:' + t.id, t.text); store.del('doc'); store.del('name'); persistTabs();
}
function updateStats() {
  const v = editor.value, words = (v.match(/\S+/g) || []).length;
  $('#stWords').textContent = words.toLocaleString();
  $('#stChars').textContent = v.length.toLocaleString();
  $('#stRead').textContent = words ? Math.max(1, Math.round(words / 220)) : 0;
}
function updateCursor() {
  const p = editor.selectionStart, before = editor.value.slice(0, p);
  $('#stLn').textContent = countNL(before) + 1;
  $('#stCol').textContent = p - before.lastIndexOf('\n');
}
editor.addEventListener('input', ev => {
  const t = activeTab(); if (t) t.text = editor.value;
  linesDirty = true; scheduleRender(); updateStats(); updateCursor(); scheduleSave(); updateTabDirty(); scUpdate(ev);
  if (fb.open) { clearTimeout(fbTimer); fbTimer = setTimeout(() => fbCompute(editor.selectionStart), 120); }
});
['keyup', 'click', 'focus'].forEach(ev => editor.addEventListener(ev, updateCursor));
/** Rename a tab in place (double-click): Enter or clicking away saves, Esc cancels. */
function renameTab(id) {
  const t = tabs.find(x => x.id === id); if (!t) return;
  if (id !== activeId) switchTab(id);
  const tabEl = $('#tabs .tab[data-id="' + id + '"]'), nameEl = tabEl && $('.tab-name', tabEl);
  if (!nameEl || $('.tab-input', tabEl)) return;
  const input = document.createElement('input');
  input.className = 'tab-input'; input.value = t.name; input.spellcheck = false; input.autocomplete = 'off'; input.setAttribute('aria-label', 'File name');
  tabEl.draggable = false; nameEl.replaceWith(input);
  input.focus(); input.select();
  let done = false;
  const finish = save => {
    if (done) return; done = true;
    if (save) t.name = input.value.trim() || 'untitled.md';
    persistTabs(); renderTabs();
    if (save) editor.focus({ preventScroll: true });
  };
  input.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'Enter') { e.preventDefault(); finish(true); }
    else if (e.key === 'Escape') { e.preventDefault(); finish(false); editor.focus({ preventScroll: true }); }
  });
  input.addEventListener('blur', () => finish(true));
  input.addEventListener('click', e => e.stopPropagation());
}

/* ---------------------------------------------------------------
   Editor keyboard behaviour
--------------------------------------------------------------- */
editor.addEventListener('keydown', e => {
  if (scKey(e)) return;                                            // emoji suggestions use Up/Down/Enter/Tab/Esc
  const mod = e.ctrlKey || e.metaKey;
  if (mod && !e.altKey) {
    const k = e.key.toLowerCase();
    const map = e.shiftKey ? { x: 'strike' } : { b: 'bold', i: 'italic', u: 'underline', k: 'link', e: 'code' };
    if (map[k]) { e.preventDefault(); A[map[k]](); return; }
  }
  if (e.key === 'Tab' && !mod && !e.altKey) {
    const { s, e: en, v } = sel();
    const ls = v.lastIndexOf('\n', s - 1) + 1, nl = v.indexOf('\n', s), line = v.slice(ls, nl < 0 ? v.length : nl);
    e.preventDefault();
    if (v.slice(s, en).includes('\n') || /^\s*([-*+]|\d+[.)])\s/.test(line) || e.shiftKey) indentLines(e.shiftKey ? -1 : 1);
    else replace(s, en, '  ');
    return;
  }
  if (e.key === 'Enter' && !mod && !e.shiftKey && !e.altKey && !e.isComposing) {
    const { s, e: en, v } = sel();
    if (s !== en) return;
    const ls = v.lastIndexOf('\n', s - 1) + 1, line = v.slice(ls, s);
    const m = /^(\s*)([-*+]|\d+[.)])\s(\[[ xX]\]\s)?/.exec(line);
    if (!m || line.length < m[0].length) return;
    const nl = v.indexOf('\n', s), rest = v.slice(s, nl < 0 ? v.length : nl);
    e.preventDefault();
    if (line.length === m[0].length && !rest.trim()) { replace(ls, s + rest.length, '', ls); return; }   // empty item ends the list
    const marker = /\d/.test(m[2]) ? (parseInt(m[2], 10) + 1) + m[2].slice(-1) : m[2];
    replace(s, s, '\n' + m[1] + marker + ' ' + (m[3] ? '[ ] ' : ''));
  }
});
editor.addEventListener('paste', e => {
  const imgs = Array.from((e.clipboardData && e.clipboardData.files) || []).filter(f => f.type.startsWith('image/'));
  if (imgs.length) { e.preventDefault(); addImageFiles(imgs); return; }
  const { s, e: en, v } = sel(), text = (e.clipboardData && e.clipboardData.getData('text/plain') || '').trim();
  if (s !== en && /^https?:\/\/\S+$/.test(text) && !/\n/.test(v.slice(s, en))) {
    e.preventDefault();
    const label = v.slice(s, en), t = `[${label}](${text})`;
    replace(s, en, t, s + t.length);
  }
});
// code-block "Copy" buttons in the preview
preview.addEventListener('click', async e => {
  const b = e.target.closest('.code-copy'); if (!b) return;
  const code = b.parentElement.querySelector('code');
  const ok = await writeClipboard({ text: code ? code.textContent : '' });
  b.textContent = ok ? '✓ Copied' : 'Failed'; b.classList.toggle('done', ok); setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('done'); }, 1400);
});

/* ---------------------------------------------------------------
   Find & replace (matches are highlighted in a layer behind the text)
--------------------------------------------------------------- */
const hl = $('#hl'), findbar = $('#findbar'), findInput = $('#findInput'), replaceInput = $('#replaceInput'), fbCount = $('#fbCount');
const fb = { open: false, case: false, word: false, regex: false, matches: [], cur: -1 };
let fbTimer;
function fbBuild() {
  const q = findInput.value; if (!q) return null;
  let src = fb.regex ? q : q.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&');
  if (fb.word) src = '\\b(?:' + src + ')\\b';
  try { return new RegExp(src, 'g' + (fb.case ? '' : 'i') + 'm'); } catch (e) { return false; }
}
function fbCompute(pos) {
  const re = fbBuild(); fb.matches = [];
  findInput.classList.toggle('bad', re === false);
  if (re) {
    const v = editor.value; let m;
    while ((m = re.exec(v)) && fb.matches.length < 5000) {
      if (m[0] === '') { re.lastIndex++; continue; }
      fb.matches.push({ s: m.index, e: m.index + m[0].length });
    }
  }
  if (fb.matches.length) {
    const p = pos == null ? editor.selectionStart : pos, i = fb.matches.findIndex(x => x.s >= p);
    fb.cur = i >= 0 ? i : 0;
  } else fb.cur = -1;
  fbPaint();
}
function fbPaint() {
  const v = editor.value, n = fb.matches.length;
  fbCount.textContent = !findInput.value ? '' : n ? (fb.cur + 1) + ' of ' + n + (n >= 5000 ? '+' : '') : (findInput.classList.contains('bad') ? 'Invalid regex' : 'No results');
  let html = '', last = 0;
  fb.matches.forEach((m, i) => { html += escapeHtml(v.slice(last, m.s)) + '<mark' + (i === fb.cur ? ' class="cur"' : '') + '>' + escapeHtml(v.slice(m.s, m.e)) + '</mark>'; last = m.e; });
  hl.style.width = editor.clientWidth + 'px';
  hl.innerHTML = html + escapeHtml(v.slice(last)) + '\u200b';
  hl.scrollTop = editor.scrollTop;
}
function fbGo(i) {
  if (!fb.matches.length) return;
  fb.cur = (i + fb.matches.length) % fb.matches.length;
  const m = fb.matches[fb.cur];
  editor.setSelectionRange(m.s, m.e);
  linesDirty = true; ensureLineMap();
  const y = lineToY(countNL(editor.value.slice(0, m.s)));
  if (y < editor.scrollTop + 24 || y > editor.scrollTop + editor.clientHeight - 80) editor.scrollTop = Math.max(0, y - editor.clientHeight / 3);
  fbPaint(); updateCursor();
}
function fbReplacement(m) {
  const rep = replaceInput.value; if (!fb.regex) return rep;
  const re = fbBuild(); if (!re) return rep;
  try { return editor.value.slice(m.s, m.e).replace(new RegExp(re.source, re.flags.replace('g', '')), rep); } catch (e) { return rep; }
}
function fbReplaceOne() {
  if (fb.cur < 0) return;
  const m = fb.matches[fb.cur], rep = fbReplacement(m);
  replace(m.s, m.e, rep);
  fbCompute(m.s + rep.length); fbGo(fb.cur); replaceInput.focus();
}
function fbReplaceAll() {
  if (!fb.matches.length) return;
  const v = editor.value, n = fb.matches.length; let out = '', last = 0;
  fb.matches.forEach(m => { out += v.slice(last, m.s) + fbReplacement(m); last = m.e; });
  out += v.slice(last);
  const top = editor.scrollTop;
  replace(0, v.length, out, 0, 0);
  editor.scrollTop = top; fbCompute(0); replaceInput.focus();
  toast('Replaced ' + n + (n === 1 ? ' match' : ' matches'));
}
function fbShowReplace(on) { $('#replaceRow').hidden = !on; const b = $('#fbExpand'); b.setAttribute('aria-expanded', String(on)); }
function openFind(withReplace) {
  if (state.mode === 'preview') setMode('split');
  fb.open = true; findbar.hidden = false;
  const { s, e, v } = sel(), chosen = v.slice(s, e);
  if (chosen && !chosen.includes('\n') && chosen.length < 120) findInput.value = chosen;
  fbShowReplace(withReplace || !$('#replaceRow').hidden);
  $('#btnFind').classList.add('on');
  fbCompute(s); findInput.focus(); findInput.select();
  if (fb.matches.length) fbGo(fb.cur);
}
function closeFind() {
  fb.open = false; findbar.hidden = true; hl.innerHTML = ''; fb.matches = []; $('#btnFind').classList.remove('on');
  editor.focus({ preventScroll: true });
}
findInput.addEventListener('input', () => { fbCompute(); if (fb.matches.length) fbGo(fb.cur); });
[['fbCase', 'case'], ['fbWord', 'word'], ['fbRegex', 'regex']].forEach(([id, key]) => $('#' + id).addEventListener('click', () => {
  fb[key] = !fb[key]; $('#' + id).setAttribute('aria-pressed', String(fb[key])); fbCompute(); if (fb.matches.length) fbGo(fb.cur);
}));
$('#fbExpand').addEventListener('click', () => { fbShowReplace($('#replaceRow').hidden); (($('#replaceRow').hidden ? findInput : replaceInput)).focus(); });
findbar.addEventListener('click', e => {
  const b = e.target.closest('[data-fb]'); if (!b) return;
  ({ next: () => fbGo(fb.cur + 1), prev: () => fbGo(fb.cur - 1), close: closeFind, replace: fbReplaceOne, replaceAll: fbReplaceAll })[b.dataset.fb]();
});
findbar.addEventListener('keydown', e => {
  if (e.altKey && !e.ctrlKey && !e.metaKey) {
    const k = e.key.toLowerCase(), id = { c: 'fbCase', w: 'fbWord', r: 'fbRegex' }[k];
    if (id) { e.preventDefault(); $('#' + id).click(); return; }
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    if (e.target === replaceInput) fbReplaceOne(); else fbGo(fb.cur + (e.shiftKey ? -1 : 1));
  }
  if (e.key === 'F3') { e.preventDefault(); fbGo(fb.cur + (e.shiftKey ? -1 : 1)); }
});
editor.addEventListener('scroll', () => { if (fb.open) hl.scrollTop = editor.scrollTop; }, { passive: true });

/* ---------------------------------------------------------------
   Outline sidebar (headings of the current document)
--------------------------------------------------------------- */
const work = $('#work'), olList = $('#olList');
let headings = [], olKey = '';
const plainInline = s => s.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '').replace(/[`*_~]/g, '').trim() || '(untitled)';
function scanHeadings() {
  const lines = editor.value.split('\n'), out = []; let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i], f = /^ {0,3}(`{3,}|~{3,})/.exec(l);
    if (f) { if (!fence) fence = f[1][0]; else if (f[1][0] === fence && /^ {0,3}(`{3,}|~{3,})\s*$/.test(l)) fence = null; continue; }
    if (fence) continue;
    const m = /^ {0,3}(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/.exec(l);
    if (m) out.push({ line: i, level: m[1].length, text: plainInline(m[2]) });
  }
  return out;
}
function updateOutline() {
  if (!work.classList.contains('has-outline')) return;
  headings = scanHeadings();
  const key = headings.map(h => h.line + '|' + h.level + '|' + h.text).join('\n');
  if (key !== olKey) {
    olKey = key;
    olList.innerHTML = headings.length
      ? headings.map((h, i) => '<button type="button" class="ol-item l' + h.level + '" style="--lv:' + (h.level - 1) + '" data-i="' + i + '" title="' + escapeAttr(h.text) + '">' + escapeHtml(h.text) + '</button>').join('')
      : '<div class="ol-empty">No headings yet.<br>Start a line with <b>#</b> to add one.</div>';
  }
  updateOutlineActive();
}
function currentTopLine() {
  if (state.mode === 'preview') {
    const bl = getBlocks(), i = lastIndex(bl, b => b.top <= pane.scrollTop + 30);
    return i < 0 ? 0 : bl[i].s;
  }
  ensureLineMap();
  return Math.floor(yToLine(editor.scrollTop + 30));
}
function updateOutlineActive() {
  if (!headings.length) return;
  const cur = currentTopLine(), idx = lastIndex(headings, h => h.line <= cur);
  Array.from(olList.children).forEach((el, i) => el.classList.toggle('active', i === idx));
  const el = olList.children[idx]; if (!el) return;
  const r = el.getBoundingClientRect(), lr = olList.getBoundingClientRect();
  if (r.top < lr.top) olList.scrollTop -= lr.top - r.top + 8; else if (r.bottom > lr.bottom) olList.scrollTop += r.bottom - lr.bottom + 8;
}
function goToHeading(h) {
  claim('outline');
  ensureLineMap();
  const pos = editor.value.split('\n').slice(0, h.line).join('\n').length + (h.line ? 1 : 0);
  editor.setSelectionRange(pos, pos);
  editor.scrollTop = Math.max(0, lineToY(h.line) - 24);
  const blk = preview.querySelector('.blk[data-s="' + h.line + '"]');
  if (blk) pane.scrollTop = Math.max(0, blk.offsetTop - 20);
  if (state.mode !== 'preview') editor.focus({ preventScroll: true });
  updateOutlineActive(); updateCursor();
}
function setOutline(on, quiet) {
  work.classList.toggle('has-outline', on); store.set('outline', on ? '1' : '0');
  const b = $('#btnOutline'); b.setAttribute('aria-pressed', String(on)); b.classList.toggle('on', on);
  olKey = ''; linesDirty = blocksDirty = true; updateOutline();
}
olList.addEventListener('click', e => { const b = e.target.closest('.ol-item'); if (b) goToHeading(headings[+b.dataset.i]); });
let spyRaf = 0;
const spy = () => { if (spyRaf || !work.classList.contains('has-outline')) return; spyRaf = requestAnimationFrame(() => { spyRaf = 0; updateOutlineActive(); }); };
editor.addEventListener('scroll', spy, { passive: true });
pane.addEventListener('scroll', spy, { passive: true });

/* in-page links (heading anchors, footnotes) scroll the preview instead of navigating the page */
preview.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]'); if (!link) return;
  e.preventDefault();
  let id = link.getAttribute('href').slice(1); try { id = decodeURIComponent(id); } catch (err) {}
  const el = id && preview.querySelector('[id="' + id.replace(/"/g, '\\"') + '"]');
  if (el) pane.scrollTo({ top: Math.max(0, el.offsetTop - 20), behavior: reducedMotion ? 'auto' : 'smooth' });
});
document.addEventListener('click', e => { if (e.target.closest('.cheat-out a[href^="#"]')) e.preventDefault(); });

/* ---------------------------------------------------------------
   Global shortcuts
--------------------------------------------------------------- */
document.addEventListener('keydown', e => {
  if (shareDialog.open || tableDialog.open) return;                                   // the dialog handles its own Esc
  const mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
  if (e.key === 'Escape') {
    if (openMenuId) { closeMenus(); return; }
    if (emojiState.open) { closeEmoji(); return; }
    if (fb.open) { closeFind(); return; }
    if (state.full) setFull(false);
    return;
  }
  const inTool = state.full || document.activeElement === editor || findbar.contains(document.activeElement);
  if (inTool && mod && !e.shiftKey && !e.altKey && (k === 'f' || k === 'h')) { e.preventDefault(); openFind(k === 'h'); return; }
  if (!state.full) return;
  if (mod && !e.shiftKey && !e.altKey && k === 's') { e.preventDefault(); A.save(); }
  else if (mod && !e.shiftKey && !e.altKey && k === 'o') { e.preventDefault(); A.open(); }
});

/* ---------------------------------------------------------------
   View mode, sync toggle, theme, resizer
--------------------------------------------------------------- */
function setMode(m, temporary) {
  state.mode = m; if (!temporary) store.set('mode', m);
  panes.dataset.mode = m;
  $$('[data-act^="mode:"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.act === 'mode:' + m)));
  blocksDirty = linesDirty = true;
  if (m !== 'editor') render();
}
function setSync(on) {
  state.sync = on; store.set('sync', on ? '1' : '0');
  const b = $('#btnSync'); b.setAttribute('aria-pressed', String(on)); b.classList.toggle('on', on);
  b.title = on ? 'Sync scroll: on' : 'Sync scroll: off';
  toast(on ? 'Scroll sync on' : 'Scroll sync off');
  if (on && state.mode === 'split') { claim('editor'); editorToPreview(); }
}
function setTheme(t) {
  state.theme = t; store.set('theme', t);
  document.documentElement.setAttribute('data-theme', t);
  const meta = $('meta[name="theme-color"]'); if (meta) meta.content = t === 'dark' ? '#09090b' : '#fbfbfa';
  render();
  renderCheats();
}
(function initGutter() {
  let dragging = false;
  const set = pct => panes.style.setProperty('--split', clamp(pct, 20, 80) + '%');
  const saved = parseFloat(store.get('split', '50')); if (saved) set(saved);
  gutter.addEventListener('pointerdown', e => { dragging = true; gutter.setPointerCapture(e.pointerId); gutter.classList.add('drag'); document.body.style.userSelect = 'none'; });
  gutter.addEventListener('pointermove', e => {
    if (!dragging) return;
    const r = panes.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100);
  });
  const end = () => { if (!dragging) return; dragging = false; gutter.classList.remove('drag'); document.body.style.userSelect = ''; store.set('split', parseFloat(panes.style.getPropertyValue('--split')) || 50); };
  gutter.addEventListener('pointerup', end); gutter.addEventListener('pointercancel', end);
  gutter.addEventListener('dblclick', () => { set(50); store.set('split', 50); });
  gutter.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); set((parseFloat(panes.style.getPropertyValue('--split')) || 50) + (e.key === 'ArrowRight' ? 2 : -2));
  });
})();

/* ---------------------------------------------------------------
   Full screen  <->  landing page
--------------------------------------------------------------- */
const landingEls = $$('#nav, .hero-copy, .hero-after, main > section:not(#top), main > .cta, .footer');
let scrollBefore = 0;
function setFull(on) {
  if (state.full === on) return;
  closeMenus();
  const apply = () => {
    state.full = on;
    if (on) scrollBefore = window.scrollY;
    shell.classList.toggle('is-full', on);
    document.documentElement.classList.toggle('tool-open', on);
    landingEls.forEach(el => on ? el.setAttribute('inert', '') : el.removeAttribute('inert'));
    const b = $('#btnFull'); b.title = on ? 'Exit full screen (Esc)' : 'Full screen'; b.setAttribute('aria-pressed', String(on));
    if (!on) window.scrollTo({ top: scrollBefore, behavior: 'instant' });
    blocksDirty = linesDirty = true;
  };
  if (document.startViewTransition && !reducedMotion) document.startViewTransition(apply).finished.then(() => { if (on) editor.focus({ preventScroll: true }); }, () => {});
  else { apply(); if (on) editor.focus({ preventScroll: true }); }
}

/* Start page preference (header toggle "Start in editor"): 'home' (default) or 'editor'. Read by the head script before first paint. */
const startIsHome = () => store.get('start', 'home') !== 'editor';
function syncStartPref() {
  const editorFirst = !startIsHome();
  $$('[data-starteditor]').forEach(i => { i.setAttribute('aria-checked', String(editorFirst)); });
}
function setStartPref(home, quiet) {
  store.set('start', home ? 'home' : 'editor');
  syncStartPref();
  if (!quiet) toast(home ? 'Quilldown will open on the homepage' : 'Quilldown will open the full-screen editor');
}
document.addEventListener('click', e => { const sw = e.target.closest && e.target.closest('[data-starteditor]'); if (sw) setStartPref(sw.getAttribute('aria-checked') === 'true'); });

/* ---------------------------------------------------------------
   Landing page: cheat sheet, reveal, nav
--------------------------------------------------------------- */
const CHEATS = [
  { t: 'Headings', md: '# Heading 1\n## Heading 2\n### Heading 3' },
  { t: 'Emphasis', md: '**bold**  _italic_\n~~strikethrough~~\n`inline code`' },
  { t: 'Lists', md: '- Apples\n- Pears\n  - Nested\n\n1. First\n2. Second' },
  { t: 'Task list', md: '- [x] Write\n- [ ] Review\n- [ ] Publish' },
  { t: 'Quote & callouts', md: '> A wise quote.\n\n> [!WARNING]\n> Heads up!' },
  { t: 'Code', md: '```js\nconst answer = 42;\n```' },
  { t: 'Table', md: '| Name | Role |\n| --- | --- |\n| Ada | Engineer |\n| Lin | Designer |' },
  { t: 'Math', md: '$$\nx = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}\n$$' },
  { t: 'Diagram', md: '```mermaid\nflowchart LR\n  A[Idea] --> B[Draft] --> C[Ship]\n```' },
  { t: 'Links & images', md: '[Anchor text](https://commonmark.org)\n\n![Alt text](image.png "Title")' },
  { t: 'Footnotes', md: 'A claim that needs a source.[^1]\n\n[^1]: Here is the source.' }
];
const CHEATS_VISIBLE = 4;                      // the rest sit behind "Show all syntax"
function renderCheats() {
  const first = $('#cheats'), more = $('#cheatsMore'); if (!first || !more) return;
  if (!first.children.length) {
    const card = (c, i) => `<article class="cheat"><div class="cheat-h"><span>${c.t}</span><button type="button" data-try="${i}">Try it</button></div><div class="cheat-b"><pre class="cheat-src">${escapeHtml(c.md)}</pre><div class="cheat-out md" data-i="${i}"></div></div></article>`;
    first.innerHTML = CHEATS.slice(0, CHEATS_VISIBLE).map((c, i) => card(c, i)).join('');
    more.innerHTML = CHEATS.slice(CHEATS_VISIBLE).map((c, i) => card(c, i + CHEATS_VISIBLE)).join('');
    [first, more].forEach(h => h.addEventListener('click', e => {
      const b = e.target.closest('[data-try]'); if (!b) return;
      appendMarkdown(CHEATS[+b.dataset.try].md); setFull(true); toast('Added to your document');
    }));
    const n = $('#syntaxCount'); if (n) n.textContent = '+' + (CHEATS.length - CHEATS_VISIBLE);
  }
  if (!enginesReady) return;
  $$('.cheat-out', document).forEach(out => {
    const md = CHEATS[+out.dataset.i].md;
    if (/!\[/.test(md)) { out.innerHTML = '<p style="color:var(--md-muted)">Renders an image with alt text and an optional title.</p>'; return; }
    out.innerHTML = mdToHTML(md, false);
    headingsToParagraphs(out);
    postProcess(out, 'landing');
    renderMermaidIn(out, mermaidTheme(), true);
  });
}
/* "Show more" panels — keep the landing page short, everything else one click away */
function setExpanded(btn, open) {
  const panel = document.getElementById(btn.getAttribute('aria-controls')); if (!panel) return;
  btn.setAttribute('aria-expanded', String(open));
  panel.classList.toggle('open', open);
  if (open) panel.firstElementChild.removeAttribute('inert'); else panel.firstElementChild.setAttribute('inert', '');
  const t = btn.querySelector('.ex-t'); if (t) t.textContent = open ? btn.dataset.less : btn.dataset.more;
  if (open) observeReveals();
}
$$('[data-expand]').forEach(btn => {
  setExpanded(btn, false);
  btn.addEventListener('click', () => setExpanded(btn, btn.getAttribute('aria-expanded') !== 'true'));
});
let revealObserver;
function observeReveals() {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(el => el.classList.add('in')); return; }
  revealObserver = revealObserver || new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  $$('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
}
window.addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', window.scrollY > 8), { passive: true });

/* ---------------------------------------------------------------
   Share link — the document is packed (deflate + base64url) into the URL fragment.
   Nothing is uploaded: fragments are never sent to a server.
--------------------------------------------------------------- */
const SHARE_WARN = 8000, SHARE_MAX = 64000;
const friendly = msg => Object.assign(new Error(msg), { friendly: true });
const shareDialog = $('#shareDialog'), shareUrl = $('#shareUrl'), shareCopyBtn = $('#shareCopy'), sharePreview = $('#sharePreview'), shareNotes = $('#shareNotes');
function b64uEncode(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64uDecode(str) {
  const b = atob(str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - str.length % 4) % 4)), out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
}
async function readStream(stream, limit) {
  const reader = stream.getReader(), chunks = []; let n = 0;
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    n += value.length;
    if (n > limit) { reader.cancel(); throw friendly('That link expands to more than 3 MB, so it was not opened'); }
    chunks.push(value);
  }
  const out = new Uint8Array(n); let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  return out;
}
async function packShare(name, text) {
  const raw = new TextEncoder().encode(JSON.stringify({ n: name, t: text }));
  if (window.CompressionStream) return 'z.' + b64uEncode(await readStream(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw')), 8e6));
  return 'u.' + b64uEncode(raw);
}
async function unpackShare(payload) {
  const kind = payload.slice(0, 2), bytes = b64uDecode(payload.slice(2)); let raw;
  if (kind === 'z.') {
    if (!window.DecompressionStream) throw friendly('This link needs a newer browser');
    raw = await readStream(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw')), 3e6);
  } else if (kind === 'u.') raw = bytes;
  else throw friendly('That link is not a valid Quilldown link');
  const o = JSON.parse(new TextDecoder().decode(raw));
  if (!o || typeof o.t !== 'string') throw friendly('That link is not a valid Quilldown link');
  return { name: String(o.n || 'shared.md').slice(0, 120), text: o.t };
}
function shareText() {
  let omitted = 0;
  const text = editor.value.replace(/!\[([^\]]*)\]\(img:[\w-]+[^)]*\)/g, (m, alt) => { omitted++; return '*[image not included' + (alt ? ': ' + alt : '') + ']*'; });
  return { text, omitted };
}
let shareSeq = 0;
async function refreshShare() {
  const my = ++shareSeq, { text, omitted } = shareText();
  shareCopyBtn.disabled = true; shareCopyBtn.textContent = 'Copy link';
  let payload;
  try { payload = await packShare(activeTab().name, text); } catch (e) { shareUrl.value = ''; shareNotes.innerHTML = '<li class="bad">Couldn’t build the link in this browser.</li>'; return; }
  if (my !== shareSeq) return;
  const url = location.href.split('#')[0] + '#d=' + payload + (sharePreview.checked ? '&p=1' : '');
  const notes = [];
  const len = url.length, kb = len >= 1000 ? (len / 1000).toFixed(1) + 'k' : String(len);
  if (len > SHARE_MAX) notes.push(['bad', 'This document is too long for a link (' + kb + ' characters). Use Export → PDF, Word or Markdown instead.']);
  else if (len > SHARE_WARN) notes.push(['warn', 'Long link (' + kb + ' characters). Some chat apps and older browsers may cut it off — test it before sending.']);
  else notes.push(['ok', 'Link length: ' + kb + ' characters.']);
  if (omitted) notes.push(['warn', omitted + ' pasted image' + (omitted > 1 ? 's are' : ' is') + ' not included — images are too large for a link.']);
  if (location.protocol === 'file:') notes.push(['warn', 'This page is opened from a file, so the link only works on this computer. Once the site is hosted, links will work for anyone.']);
  if (!window.CompressionStream) notes.push(['warn', 'Your browser can’t compress links, so this one is longer than usual.']);
  shareNotes.innerHTML = notes.map(n => '<li class="' + n[0] + '">' + escapeHtml(n[1]) + '</li>').join('');
  shareUrl.value = len > SHARE_MAX ? '' : url;
  shareCopyBtn.disabled = len > SHARE_MAX;
}
function openShare() {
  if (!editor.value.trim()) return toast('Write something first — there is nothing to share yet');
  closeMenus();
  if (typeof shareDialog.showModal !== 'function') return toast('Your browser doesn’t support the share dialog');
  shareDialog.showModal(); refreshShare();
}
shareDialog.addEventListener('click', e => { if (e.target === shareDialog) shareDialog.close(); });   // click on the backdrop
sharePreview.addEventListener('change', refreshShare);
shareUrl.addEventListener('focus', () => shareUrl.select());
shareCopyBtn.addEventListener('click', async () => {
  const ok = await writeClipboard({ text: shareUrl.value });
  shareCopyBtn.textContent = ok ? 'Copied ✓' : 'Press Ctrl+C to copy'; if (!ok) shareUrl.select();
  setTimeout(() => { shareCopyBtn.textContent = 'Copy link'; }, 2200);
});

async function openSharedFromHash() {
  if (!/^#d=/.test(location.hash)) return;
  const params = new URLSearchParams(location.hash.slice(1)), payload = params.get('d');
  history.replaceState(null, '', location.href.split('#')[0]);                // so a refresh doesn't open it twice
  if (!payload) return;
  try {
    const { name, text } = await unpackShare(payload);
    if (!state.full) setFull(true);
    newTab(name, text);
    if (params.get('p') === '1') setMode('preview', true);
    toast('Opened shared document “' + name + '” in a new tab');
  } catch (err) { toast(err && err.friendly ? err.message : 'That link looks damaged or incomplete, so it couldn’t be opened'); }
}
window.addEventListener('hashchange', () => {
  const h = location.hash;
  if (/^#d=/.test(h)) { openSharedFromHash(); return; }
  // a link to a homepage section (e.g. #faq) while the editor is full screen: show the homepage, then jump there
  if (h === '#editor') { history.replaceState(null, '', location.pathname + location.search); setFull(true); return; }
  if (h.length > 1 && state.full) { setFull(false); setTimeout(() => { const el = document.getElementById(decodeURIComponent(h.slice(1))); if (el) el.scrollIntoView(); }, 400); }
});

/* ---------------------------------------------------------------
   Visual table editor — edits an existing table under the cursor, converts selected
   spreadsheet text, or builds a new one; writes tidy, aligned GFM Markdown.
--------------------------------------------------------------- */
const tableDialog = $('#tableDialog'), teGrid = $('#teGrid'), teMd = $('#teMd'), teInfo = $('#teInfo'), teOk = $('#teOk');
const te = { rows: [], align: [], range: null, r: 0, c: 0 };
const TE_DELIM = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const TE_ALIGN_NEXT = { none: 'left', left: 'center', center: 'right', right: 'none' };
const TE_ALIGN_ICON = { none: 'alignleft', left: 'alignleft', center: 'center', right: 'alignright' };

function tableSplitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  return s.split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, '|'));
}
function findTableAt(pos) {
  const lines = editor.value.split('\n'), starts = []; let off = 0, fence = null;
  for (const l of lines) { starts.push(off); off += l.length + 1; }
  let cur = 0; while (cur + 1 < starts.length && starts[cur + 1] <= pos) cur++;
  for (let i = 0; i < lines.length - 1; i++) {
    const f = /^ {0,3}(`{3,}|~{3,})/.exec(lines[i]);
    if (f) { if (!fence) fence = f[1][0]; else if (f[1][0] === fence) fence = null; continue; }
    if (fence) continue;
    if (lines[i].includes('|') && lines[i + 1].includes('|') && lines[i + 1].includes('-') && TE_DELIM.test(lines[i + 1])) {
      let end = i + 1; while (end + 1 < lines.length && lines[end + 1].trim() !== '' && lines[end + 1].includes('|')) end++;
      if (cur >= i && cur <= end) return { from: starts[i], to: starts[end] + lines[end].length, lines: lines.slice(i, end + 1) };
      i = end;
    }
  }
  return null;
}
function tableFromDelimited(text) {
  const t = text.replace(/\r/g, '').replace(/\n+$/, ''), lines = t.split('\n');
  let sep = null;
  if (t.includes('\t')) sep = '\t';
  else if (lines.length > 1) { const n = (lines[0].match(/,/g) || []).length; if (n && lines.every(l => (l.match(/,/g) || []).length === n)) sep = ','; }
  if (!sep) return null;
  const rows = lines.map(l => l.split(sep).map(c => c.trim().replace(/^"(.*)"$/, '$1')));
  return rows.length && rows[0].length > 1 ? rows : null;
}
function tableNormalize() {
  const n = Math.max(1, te.align.length, ...te.rows.map(r => r.length));
  te.rows = te.rows.map(r => { const o = r.slice(0, n); while (o.length < n) o.push(''); return o; });
  while (te.align.length < n) te.align.push('none');
  te.align.length = n;
}
function tableMarkdown() {
  tableNormalize();
  const n = te.align.length, esc = s => String(s).replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|');
  const cells = te.rows.map(r => r.map(esc));
  const w = Array.from({ length: n }, (_, c) => Math.max(3, ...cells.map(r => Array.from(r[c] || '').length)));
  const pad = (s, c) => {
    const gap = w[c] - Array.from(s).length, a = te.align[c];
    if (a === 'right') return ' '.repeat(gap) + s;
    if (a === 'center') { const l = gap >> 1; return ' '.repeat(l) + s + ' '.repeat(gap - l); }
    return s + ' '.repeat(gap);
  };
  const line = r => '| ' + r.map((s, c) => pad(s || '', c)).join(' | ') + ' |';
  const delim = '| ' + w.map((x, c) => { const a = te.align[c]; return a === 'center' ? ':' + '-'.repeat(x - 2) + ':' : a === 'left' ? ':' + '-'.repeat(x - 1) : a === 'right' ? '-'.repeat(x - 1) + ':' : '-'.repeat(x); }).join(' | ') + ' |';
  return [line(cells[0]), delim, ...cells.slice(1).map(line)].join('\n');
}
function teRefreshOutput() {
  tableNormalize();
  teMd.textContent = tableMarkdown();
  const body = te.rows.length - 1, cols = te.align.length;
  teInfo.textContent = cols + (cols === 1 ? ' column' : ' columns') + ' · ' + body + (body === 1 ? ' row' : ' rows') + ' + header';
}
function teRender(focusR, focusC) {
  tableNormalize();
  const alignCss = a => (a === 'center' ? 'center' : a === 'right' ? 'right' : 'left');
  const head = '<tr><th class="te-corner"></th>' + te.align.map((a, c) =>
    '<th class="te-ctl"><button type="button" data-te="align" data-c="' + c + '" title="Alignment: ' + (a === 'none' ? 'default' : a) + ' — click to change" aria-label="Column ' + (c + 1) + ' alignment: ' + a + '"><svg class="i"><use href="#i-' + TE_ALIGN_ICON[a] + '"/></svg></button>' +
    (te.align.length > 1 ? '<button type="button" data-te="delcol" data-c="' + c + '" title="Delete column" aria-label="Delete column ' + (c + 1) + '"><svg class="i"><use href="#i-x"/></svg></button>' : '') + '</th>').join('') + '</tr>';
  const body = te.rows.map((r, ri) => '<tr class="' + (ri === 0 ? 'te-head' : '') + '"><th class="te-rownum">' + (ri === 0 ? '<span title="Header row">H</span>' :
    '<button type="button" data-te="delrow" data-r="' + ri + '" title="Delete row" aria-label="Delete row ' + ri + '"><svg class="i"><use href="#i-x"/></svg></button>') + '</th>' +
    r.map((cell, c) => '<td><input data-r="' + ri + '" data-c="' + c + '" value="' + escapeAttr(cell) + '" style="text-align:' + alignCss(te.align[c]) + '" spellcheck="false" autocomplete="off" aria-label="' + (ri === 0 ? 'Header' : 'Row ' + ri) + ', column ' + (c + 1) + '"></td>').join('') + '</tr>').join('');
  teGrid.innerHTML = '<table class="te-table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table>';
  teRefreshOutput();
  if (focusR != null) { const inp = teGrid.querySelector('input[data-r="' + focusR + '"][data-c="' + focusC + '"]'); if (inp) { inp.focus(); inp.select(); } }
}
function teMove(r, c) {
  te.r = Math.max(0, r); te.c = Math.max(0, Math.min(te.align.length - 1, c));
  if (te.r >= te.rows.length) { te.rows.push(new Array(te.align.length).fill('')); teRender(te.r, te.c); return; }
  const inp = teGrid.querySelector('input[data-r="' + te.r + '"][data-c="' + te.c + '"]'); if (inp) { inp.focus(); inp.select(); }
}
function openTableEditor() {
  closeMenus();
  const { s, e, v } = sel(), selected = v.slice(s, e);
  const hit = findTableAt(s);
  if (hit) {
    const header = tableSplitRow(hit.lines[0]), delim = tableSplitRow(hit.lines[1]);
    te.align = header.map((_, i) => { const d = delim[i] || ''; return d.startsWith(':') && d.endsWith(':') ? 'center' : d.endsWith(':') ? 'right' : d.startsWith(':') ? 'left' : 'none'; });
    te.rows = [header, ...hit.lines.slice(2).map(tableSplitRow)];
    te.range = { from: hit.from, to: hit.to };
    $('#teTitle').textContent = 'Edit table'; teOk.textContent = 'Update table';
  } else {
    const conv = selected && tableFromDelimited(selected);
    if (conv) { te.rows = conv; te.align = conv[0].map(() => 'none'); te.range = { from: s, to: e }; $('#teTitle').textContent = 'Convert to table'; teOk.textContent = 'Create table'; }
    else {
      te.rows = [['Column 1', 'Column 2', 'Column 3'], ['', '', ''], ['', '', '']]; te.align = ['none', 'none', 'none']; te.range = null;
      $('#teTitle').textContent = 'Insert table'; teOk.textContent = 'Insert table';
    }
  }
  te.r = 0; te.c = 0;
  tableDialog.showModal(); teRender(0, 0);
}
function tableApply() {
  const md = tableMarkdown();
  tableDialog.close();
  if (te.range) replace(te.range.from, te.range.to, md, te.range.from + md.length);
  else insertBlock(md);
  editor.focus();
}
teGrid.addEventListener('input', e => {
  const i = e.target.closest('input[data-r]'); if (!i) return;
  te.rows[+i.dataset.r][+i.dataset.c] = i.value; te.r = +i.dataset.r; te.c = +i.dataset.c; teRefreshOutput();
});
teGrid.addEventListener('focusin', e => { const i = e.target.closest('input[data-r]'); if (i) { te.r = +i.dataset.r; te.c = +i.dataset.c; } });
teGrid.addEventListener('keydown', e => {
  const i = e.target.closest('input[data-r]'); if (!i) return;
  const r = +i.dataset.r, c = +i.dataset.c, last = te.align.length - 1;
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); tableApply(); }
  else if (e.key === 'Enter') { e.preventDefault(); teMove(r + (e.shiftKey ? -1 : 1), c); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); teMove(r + 1, c); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); teMove(r - 1, c); }
  else if (e.key === 'Tab') {
    e.preventDefault();
    if (e.shiftKey) { if (c > 0) teMove(r, c - 1); else if (r > 0) teMove(r - 1, last); }
    else if (c < last) teMove(r, c + 1); else teMove(r + 1, 0);
  }
});
teGrid.addEventListener('paste', e => {
  const i = e.target.closest('input[data-r]'); if (!i) return;
  const text = (e.clipboardData && e.clipboardData.getData('text/plain')) || '', data = tableFromDelimited(text.trim() ? text : '');
  if (!data) return;
  e.preventDefault();
  const r0 = +i.dataset.r, c0 = +i.dataset.c;
  data.forEach((row, ri) => row.forEach((val, ci) => {
    while (te.rows.length <= r0 + ri) te.rows.push([]);
    while (te.align.length <= c0 + ci) te.align.push('none');
    tableNormalize(); te.rows[r0 + ri][c0 + ci] = val;
  }));
  teRender(r0, c0); toast('Pasted ' + data.length + ' × ' + Math.max(...data.map(r => r.length)));
});
tableDialog.addEventListener('click', e => {
  if (e.target === tableDialog) { tableDialog.close(); return; }
  const b = e.target.closest('[data-te]'); if (!b) return;
  const act = b.dataset.te, c = +b.dataset.c, r = +b.dataset.r;
  if (act === 'addrow') { te.rows.splice(te.r + 1, 0, new Array(te.align.length).fill('')); teRender(te.r + 1, te.c); }
  else if (act === 'addcol') { te.align.splice(te.c + 1, 0, 'none'); te.rows.forEach((row, i) => row.splice(te.c + 1, 0, i === 0 ? 'Column ' + (te.align.length) : '')); teRender(te.r, te.c + 1); }
  else if (act === 'delrow') { te.rows.splice(r, 1); teRender(Math.min(r, te.rows.length - 1), te.c); }
  else if (act === 'delcol') { te.align.splice(c, 1); te.rows.forEach(row => row.splice(c, 1)); teRender(te.r, Math.min(c, te.align.length - 1)); }
  else if (act === 'align') { te.align[c] = TE_ALIGN_NEXT[te.align[c]]; teRender(); const btn = teGrid.querySelector('[data-te="align"][data-c="' + c + '"]'); if (btn) btn.focus(); }
  else if (act === 'clear') { te.rows = te.rows.map((row, i) => i === 0 ? row : row.map(() => '')); teRender(1, 0); }
});
teOk.addEventListener('click', tableApply);
$('#teCancel').addEventListener('click', () => tableDialog.close());

/* ---------------------------------------------------------------
   Emoji picker — search, categories, skin tones, recently used
--------------------------------------------------------------- */
const EMOJI = window.QUILLDOWN_EMOJI || [], EMOJI_GROUPS = window.QUILLDOWN_EMOJI_GROUPS || [];
const EMOJI_TABS = [['recent', '🕘', 'Recently used'], [0, '😀', 'Smileys & emotion'], [1, '👋', 'People & body'], [3, '🐻', 'Animals & nature'], [4, '🍔', 'Food & drink'], [5, '✈️', 'Travel & places'], [6, '⚽', 'Activities'], [7, '💡', 'Objects'], [8, '🔣', 'Symbols'], [9, '🏁', 'Flags']];
const TONES = ['🖐️', '🖐🏻', '🖐🏼', '🖐🏽', '🖐🏾', '🖐🏿'];
const emojiState = { open: false, tab: 0, tone: Math.min(5, Math.max(0, parseInt(store.get('emoji-tone', '0'), 10) || 0)), recent: [] };
try { emojiState.recent = JSON.parse(store.get('emoji-recent', '[]')) || []; } catch (e) {}
let emojiPop = null;
const emojiChar = e => (e[5] && emojiState.tone > 0 && e[5][emojiState.tone - 1]) || e[0];
function buildEmojiPop() {
  emojiPop = document.createElement('div');
  emojiPop.className = 'emoji-pop'; emojiPop.hidden = true; emojiPop.setAttribute('role', 'dialog'); emojiPop.setAttribute('aria-label', 'Emoji picker');
  emojiPop.innerHTML = '<div class="ep-top"><input class="ep-search" type="search" placeholder="Search emoji" spellcheck="false" autocomplete="off" aria-label="Search emoji"><div class="ep-tones" role="group" aria-label="Skin tone">' +
    TONES.map((t, i) => '<button type="button" data-tone="' + i + '" title="' + (i ? 'Skin tone ' + i : 'Default') + '" aria-pressed="false">' + t + '</button>').join('') + '</div></div>' +
    '<div class="ep-tabs" role="tablist">' + EMOJI_TABS.map((t, i) => '<button type="button" data-tab="' + i + '" title="' + t[2] + '" aria-label="' + t[2] + '">' + t[1] + '</button>').join('') + '</div>' +
    '<div class="ep-grid" role="listbox"></div><div class="ep-foot"><span class="ep-name">Pick an emoji — Shift+click keeps this open</span><label class="ep-sc" title="Suggest emoji while you type a colon and two letters, e.g. :roc"><input type="checkbox"> <code>:</code> suggestions</label></div>';
  document.body.appendChild(emojiPop);
  const search = emojiPop.querySelector('.ep-search'), grid = emojiPop.querySelector('.ep-grid'), name = emojiPop.querySelector('.ep-name');
  search.addEventListener('input', renderEmoji);
  emojiPop.addEventListener('mousedown', e => { if (!e.target.closest('.ep-search')) e.preventDefault(); });
  emojiPop.addEventListener('click', e => {
    const tone = e.target.closest('[data-tone]'); if (tone) { emojiState.tone = +tone.dataset.tone; store.set('emoji-tone', emojiState.tone); renderEmoji(); return; }
    const tab = e.target.closest('[data-tab]'); if (tab) { emojiState.tab = +tab.dataset.tab; search.value = ''; renderEmoji(); return; }
    const b = e.target.closest('[data-i]'); if (!b) return;
    const it = EMOJI[+b.dataset.i], ch = emojiChar(it);
    const { s, e: en } = sel(); replace(s, en, ch);
    emojiState.recent = [ch, ...emojiState.recent.filter(x => x !== ch)].slice(0, 24); store.set('emoji-recent', JSON.stringify(emojiState.recent));
    if (!e.shiftKey) closeEmoji(); else renderEmoji();
  });
  emojiPop.addEventListener('change', e => { if (e.target.matches('.ep-sc input')) scSetEnabled(e.target.checked); });
  emojiPop.addEventListener('mouseover', e => { const b = e.target.closest('[data-i]'); if (b) name.textContent = EMOJI[+b.dataset.i][1]; });
}
function renderEmoji() {
  const q = emojiPop.querySelector('.ep-search').value.trim().toLowerCase(), grid = emojiPop.querySelector('.ep-grid');
  let list = [];
  if (q) {
    const words = q.split(/\s+/);
    EMOJI.forEach((e, i) => { const hay = (e[1] + ' ' + e[2] + ' ' + (e[4] || '').replace(/_/g, ' ')).toLowerCase(); if (words.every(w => hay.includes(w))) list.push([i, e[1].toLowerCase().startsWith(q) ? 0 : 1]); });
    list = list.sort((a, b) => a[1] - b[1]).slice(0, 240).map(x => x[0]);
  } else if (EMOJI_TABS[emojiState.tab][0] === 'recent') {
    list = emojiState.recent.map(ch => EMOJI.findIndex(e => e[0] === ch || (e[5] && e[5].includes(ch)))).filter(i => i >= 0);
  } else {
    const g = EMOJI_TABS[emojiState.tab][0]; EMOJI.forEach((e, i) => { if (e[3] === g) list.push(i); });
  }
  grid.innerHTML = list.length ? list.map(i => '<button type="button" class="ep-e" data-i="' + i + '" title="' + escapeAttr(EMOJI[i][1]) + '" aria-label="' + escapeAttr(EMOJI[i][1]) + '">' + emojiChar(EMOJI[i]) + '</button>').join('')
    : '<div class="ep-empty">' + (q ? 'No emoji found for “' + escapeHtml(q) + '”' : 'Nothing here yet — emoji you use will appear here.') + '</div>';
  emojiPop.querySelectorAll('[data-tab]').forEach((b, i) => b.setAttribute('aria-pressed', String(!q && i === emojiState.tab)));
  emojiPop.querySelectorAll('[data-tone]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.tone === emojiState.tone)));
  grid.scrollTop = 0;
}
function openEmoji(anchor) {
  if (!EMOJI.length) return toast('The emoji list isn’t available');
  if (!emojiPop) buildEmojiPop();
  closeMenus(); emojiState.open = true; emojiPop.hidden = false;
  if (emojiState.tab === 0 && emojiState.recent.length === 0) emojiState.tab = 1;
  emojiPop.querySelector('.ep-search').value = ''; renderEmoji();
  emojiPop.querySelector('.ep-sc input').checked = sc.enabled;
  const r = anchor.getBoundingClientRect(), w = emojiPop.offsetWidth, h = emojiPop.offsetHeight;
  emojiPop.style.left = clamp(r.left - 8, 8, innerWidth - w - 8) + 'px';
  emojiPop.style.top = (r.bottom + h + 12 > innerHeight && r.top > h + 12 ? r.top - h - 6 : r.bottom + 6) + 'px';
  anchor.setAttribute('aria-expanded', 'true');
  emojiPop.querySelector('.ep-search').focus();
}
function closeEmoji() {
  if (!emojiState.open) return;
  emojiState.open = false; emojiPop.hidden = true;
  const b = $('[data-act="emoji"]'); if (b) b.setAttribute('aria-expanded', 'false');
  editor.focus({ preventScroll: true });
}
document.addEventListener('mousedown', e => { if (emojiState.open && !e.target.closest('.emoji-pop,[data-act="emoji"]')) closeEmoji(); });

/* ---------------------------------------------------------------
   Emoji shortcodes — type ":roc" for suggestions, ":tada:" turns into 🎉 as you close the colon,
   and :name: written in a document renders as the emoji (like GitHub).
--------------------------------------------------------------- */
let SC_MAP = null, SC_LIST = null;
function scIndex() {
  if (SC_MAP) return;
  SC_MAP = new Map(); SC_LIST = [];
  for (const e of EMOJI) {
    const codes = e[4] ? e[4].split(' ') : [];
    codes.forEach(c => { if (!SC_MAP.has(c)) SC_MAP.set(c, e[0]); });
    SC_LIST.push({ ch: e[0], codes, label: e[1].toLowerCase(), tags: (e[2] || '').toLowerCase() });
  }
}
function scLookup(name) { scIndex(); return SC_MAP.get(String(name).toLowerCase()); }

const sc = { open: false, items: [], idx: 0, start: 0, end: 0, enabled: store.get('sc', '1') === '1' };
const scPop = document.createElement('div');
scPop.className = 'sc-pop'; scPop.id = 'scPop'; scPop.hidden = true; scPop.setAttribute('role', 'listbox'); scPop.setAttribute('aria-label', 'Emoji suggestions');
document.body.appendChild(scPop);
const scMirror = document.createElement('div');
scMirror.className = 'ed-text'; scMirror.setAttribute('aria-hidden', 'true');
scMirror.style.cssText = 'position:fixed;left:-99999px;top:0;visibility:hidden;overflow:hidden;height:auto;pointer-events:none';
document.body.appendChild(scMirror);
editor.setAttribute('aria-autocomplete', 'list'); editor.setAttribute('aria-controls', 'scPop');

const SC_BOUNDARY = '(^|[\\s(\\[{>"\'“‘])';
function scInCode(pos, before) {
  if (before.split('`').length % 2 === 0) return true;                       // inside an inline code span
  let fence = null;                                                        // inside a fenced block
  for (const l of editor.value.slice(0, pos).split('\n')) {
    const m = /^ {0,3}(`{3,}|~{3,})/.exec(l);
    if (m) { if (!fence) fence = m[1][0]; else if (m[1][0] === fence) fence = null; }
  }
  return !!fence;
}
function scContext() {
  if (editor.selectionStart !== editor.selectionEnd) return null;
  const pos = editor.selectionStart, v = editor.value, ls = v.lastIndexOf('\n', pos - 1) + 1, before = v.slice(ls, pos);
  return { pos, before };
}
/* Within equally good matches, show what people usually mean first (and anything used recently before that). */
const SC_POPULAR = ['smile', 'joy', 'heart', '+1', 'thumbsup', 'tada', 'rocket', 'fire', 'eyes', 'pray', '100', 'sparkles', 'white_check_mark', 'warning', 'bulb', 'star', 'clap', 'thinking', 'wave', 'muscle', 'sob', 'sunglasses', 'raised_hands', 'ok_hand', 'memo', 'books', 'bug', 'zap', 'lock', 'key', 'link', 'pushpin', 'calendar', 'construction', 'mag', 'wrench', 'hammer', 'gear', 'package', 'point_right', 'heavy_check_mark', 'x', 'question', 'exclamation', 'bookmark', 'hourglass', 'coffee', 'pizza', 'beer'];
function scSearch(q) {
  scIndex();
  const out = [];
  for (const it of SC_LIST) {
    let score = 99, best = '', len = 99;
    for (const c of it.codes) {
      const s = c === q ? 0 : c.startsWith(q) ? 1 : c.includes(q) ? 2 : 99;
      if (s < score || (s === score && c.length < len)) { score = s; best = c; len = c.length; }
    }
    if (score === 99 && q.length >= 3 && (it.label.includes(q) || it.tags.includes(q))) { score = 3; best = it.codes[0] || ''; len = best.length; }
    if (score < 99 && best) {
      const pop = SC_POPULAR.indexOf(best), rank = emojiState.recent.includes(it.ch) ? -1 : pop >= 0 ? pop : 999;
      out.push({ score, rank, len, ch: it.ch, code: best, label: it.label });
    }
  }
  return out.sort((a, b) => a.score - b.score || a.rank - b.rank || a.len - b.len).slice(0, 8);
}
function scClose() {
  if (!sc.open) return;
  sc.open = false; scPop.hidden = true; editor.removeAttribute('aria-activedescendant');
}
function scRender() {
  scPop.innerHTML = sc.items.map((it, i) =>
    '<div class="sc-item" role="option" id="sc-o' + i + '" data-i="' + i + '" aria-selected="' + (i === sc.idx) + '"><span class="sc-ch">' + it.ch + '</span><span class="sc-code">:' + escapeHtml(it.code) + ':</span><span class="sc-label">' + escapeHtml(it.label) + '</span></div>').join('');
  editor.setAttribute('aria-activedescendant', 'sc-o' + sc.idx);
}
function scPlace() {
  scMirror.style.width = editor.clientWidth + 'px';
  scMirror.textContent = editor.value.slice(0, sc.start);
  const mark = document.createElement('span'); mark.textContent = '​'; scMirror.appendChild(mark);
  const r = editor.getBoundingClientRect(), lh = parseFloat(getComputedStyle(editor).lineHeight) || 22;
  const x = r.left + mark.offsetLeft - editor.scrollLeft, y = r.top + mark.offsetTop - editor.scrollTop;
  scPop.hidden = false;
  const w = scPop.offsetWidth, h = scPop.offsetHeight;
  scPop.style.left = clamp(x, 8, innerWidth - w - 8) + 'px';
  scPop.style.top = (y + lh + 6 + h > innerHeight && y - h - 6 > 0 ? y - h - 6 : y + lh + 6) + 'px';
}
function scAccept(i) {
  const it = sc.items[i]; if (!it) return;
  const { start, end } = sc; scClose();
  replace(start, end, it.ch);
  emojiState.recent = [it.ch, ...emojiState.recent.filter(x => x !== it.ch)].slice(0, 24); store.set('emoji-recent', JSON.stringify(emojiState.recent));
}
/** Called after every edit / caret move. `ev` is the input event when there is one. */
function scUpdate(ev) {
  if (!sc.enabled || !EMOJI.length) return scClose();
  const ctx = scContext(); if (!ctx) return scClose();
  // 1) ":tada:" — closing the colon converts a known shortcode straight away
  if (ev && ev.inputType === 'insertText' && ev.data === ':') {
    const m = new RegExp(SC_BOUNDARY + '(:([a-z0-9_+\\-]{1,30}):)$', 'i').exec(ctx.before);
    const ch = m && scLookup(m[3]);
    if (ch && !scInCode(ctx.pos, ctx.before)) { scClose(); replace(ctx.pos - m[2].length, ctx.pos, ch); return; }
  }
  // 2) ":roc" — suggestions
  const m = new RegExp(SC_BOUNDARY + '(:[a-z0-9_+\\-]{2,30})$', 'i').exec(ctx.before);
  if (!m || scInCode(ctx.pos, ctx.before)) return scClose();
  const items = scSearch(m[2].slice(1).toLowerCase());
  if (!items.length) return scClose();
  const wasOpen = sc.open;
  sc.items = items; sc.start = ctx.pos - m[2].length; sc.end = ctx.pos; sc.idx = wasOpen ? Math.min(sc.idx, items.length - 1) : 0; sc.open = true;
  scRender(); scPlace();
}
/** Keyboard handling while the suggestion list is open; returns true when the key was used. */
function scKey(e) {
  if (!sc.open || e.ctrlKey || e.metaKey || e.altKey) return false;
  const n = sc.items.length;
  if (e.key === 'ArrowDown') sc.idx = (sc.idx + 1) % n;
  else if (e.key === 'ArrowUp') sc.idx = (sc.idx - 1 + n) % n;
  else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); scAccept(sc.idx); return true; }
  else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); scClose(); return true; }
  else return false;
  e.preventDefault(); scRender(); return true;
}
scPop.addEventListener('mousedown', e => e.preventDefault());
scPop.addEventListener('click', e => { const it = e.target.closest('.sc-item'); if (it) scAccept(+it.dataset.i); });
editor.addEventListener('keyup', e => { if (!/^(ArrowUp|ArrowDown|Enter|Tab|Escape|Shift|Control|Alt|Meta)$/.test(e.key)) scUpdate(); });
editor.addEventListener('click', () => scUpdate());
editor.addEventListener('blur', () => setTimeout(scClose, 120));
editor.addEventListener('scroll', scClose, { passive: true });
function scSetEnabled(on) { sc.enabled = on; store.set('sc', on ? '1' : '0'); if (!on) scClose(); }

/* ---------------------------------------------------------------
   Boot
--------------------------------------------------------------- */
buildBar(); buildMenus();
if (enginesReady) setupMarked();

loadTabsFromStorage();
editor.value = activeTab().text;
renderTabs();

setMode(['editor', 'split', 'preview'].includes(state.mode) ? state.mode : 'split');
$('#btnSync').setAttribute('aria-pressed', String(state.sync)); $('#btnSync').classList.toggle('on', state.sync);
$('#btnSync').title = state.sync ? 'Sync scroll: on' : 'Sync scroll: off';
const startEditor = document.documentElement.getAttribute('data-start') === 'editor';   // set by the head script (saved preference, #editor or a share link)
const startHome = !startEditor;
if (startEditor) {
  shell.classList.add('is-full'); document.documentElement.removeAttribute('data-start');   // hand over from the pre-paint CSS to the normal class
  $('#btnFull').setAttribute('aria-pressed', 'true');
  landingEls.forEach(el => el.setAttribute('inert', ''));
} else {
  state.full = false; blocksDirty = linesDirty = true;
  const b = $('#btnFull'); b.title = 'Full screen'; b.setAttribute('aria-pressed', 'false');
}
syncStartPref();
if (location.hash === '#editor') history.replaceState(null, '', location.pathname + location.search);
(function () {   // mobile menu
  const nav = $('#nav'), btn = nav && $('.nav-toggle', nav); if (!btn) return;
  const close = () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => btn.setAttribute('aria-expanded', String(nav.classList.toggle('open'))));
  nav.addEventListener('click', e => { if (e.target.closest('.nav-links a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
setOutline(store.get('outline', '0') === '1');
updateStats(); updateCursor(); render(); renderCheats();
if (enginesReady) renderMath($('#features'), 'html'); else $$('#features .math').forEach(el => el.textContent = dec(el.dataset.tex));
observeReveals();
(function faqTabs() {   // FAQ topics: without JS every topic is listed; with JS the tabs show one topic at a time
  const main = $('#faqMain'), tabs = main && $('.faq-tabs', main);
  if (!tabs) return;
  const btns = $$('[role="tab"]', tabs), panels = $$('.faq-panel', main);
  const show = (i, focus) => {
    btns.forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
    panels.forEach((p, j) => { p.hidden = i !== j; });
    if (focus) btns[i].focus();
    if (i) btns[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: reducedMotion ? 'instant' : 'smooth' });
  };
  btns.forEach((b, i) => {
    b.addEventListener('click', () => show(i));
    b.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowLeft: -1, Home: -btns.length, End: btns.length }[e.key];
      if (d) { e.preventDefault(); show(e.key === 'Home' ? 0 : e.key === 'End' ? btns.length - 1 : (i + d + btns.length) % btns.length, true); }
    });
  });
  main.classList.add('js'); show(0);
})();
if (!startHome) editor.focus({ preventScroll: true });
openSharedFromHash();

/* ---------------------------------------------------------------
   Open with Quilldown — files launched from the OS (installed app + manifest file_handlers)
--------------------------------------------------------------- */
if ('launchQueue' in window && window.launchQueue) {
  window.launchQueue.setConsumer(async params => {
    if (!params || !params.files || !params.files.length) return;
    try {
      if (!state.full) setFull(true);
      const files = await Promise.all(params.files.map(h => h.getFile()));
      await openFiles(files, params.files);
    } catch (err) { toast('Couldn’t open the file you launched Quilldown with'); }
  });
}

/* ---------------------------------------------------------------
   Offline + install (service worker only runs over https:// or localhost)
--------------------------------------------------------------- */
let installEvt = null;
const showInstall = v => $$('[data-act="install"]').forEach(b => { b.hidden = !v; });
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; showInstall(true); });
window.addEventListener('appinstalled', () => { installEvt = null; showInstall(false); toast('Quilldown installed — find it in your apps'); });
A.install = async () => {
  if (!installEvt) return toast('Use your browser menu → “Install Quilldown”');
  installEvt.prompt(); try { await installEvt.userChoice; } catch (e) {}
  installEvt = null; showInstall(false);
};
if (location.protocol === 'file:') $('#stOffline').hidden = false;           // bundled libraries already work offline from disk
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  let hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController) toast('Quilldown was updated — reload for the newest version'); hadController = true; });
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.ready.then(() => { $('#stOffline').hidden = false; });
}
});
