/* Quilldown — builds the guide pages.
   Sources:  pages/*.md (front matter + Markdown), pages/diagrams.json, pages/faq.json
   Output:   guides/*.html, sitemap.xml, and the generated regions of index.html (FAQ, guide cards, footer links, FAQ structured data)
   Run from the project root:   node tools/build-pages.mjs
   No dependencies: it reuses the bundled marked / KaTeX / highlight.js / emoji data from ./vendor. */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { Marked } = require('../vendor/marked.min.js');
const katex = require('../vendor/katex/katex.min.js');
const hljs = require('../vendor/highlight.min.js');

const SITE = 'https://quilldown.vercel.app';
const GITHUB = 'https://github.com/Dhruv-Dhameliya/quilldown';
const GITHUB_PROFILE = 'https://github.com/Dhruv-Dhameliya';
const AUTHOR = 'Dhruv-Dhameliya';
const OG_IMAGE = SITE + '/social/og-image.png';
const CATEGORIES = [
  { id: 'learn', title: 'Learn Markdown', blurb: 'The basics and the reference.' },
  { id: 'convert', title: 'Convert & export', blurb: 'Turn Markdown into PDF, Word, HTML or an e-book — privately, in your browser.' },
  { id: 'write', title: 'Write better documents', blurb: 'Tables, math, diagrams, emoji and READMEs — the parts of Markdown people search for most.' }
];
const warnings = [];
const warn = m => { warnings.push(m); };

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const safeJson = o => JSON.stringify(o).replace(/</g, '\\u003c');   // JSON-LD lives inside a <script>: never let "<" through
const escAttr = s => esc(s).replace(/"/g, '&quot;');
const slugify = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
const b64u = s => Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const openInEditor = (text, name) => '/#d=u.' + b64u(JSON.stringify({ n: name, t: text }));
const fmtDate = iso => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const words = html => (html.replace(/<[^>]+>/g, ' ').match(/\S+/g) || []).length;

const emojiCtx = { window: {} }; vm.createContext(emojiCtx);
vm.runInContext(await readFile(path.join(ROOT, 'vendor/emoji.js'), 'utf8'), emojiCtx);
const EMOJI = new Map();
for (const e of emojiCtx.window.QUILLDOWN_EMOJI) for (const c of (e[4] || '').split(' ')) if (c && !EMOJI.has(c)) EMOJI.set(c, e[0]);

const diagrams = JSON.parse(await readFile(path.join(ROOT, 'pages/diagrams.json'), 'utf8'));
const faqHome = JSON.parse(await readFile(path.join(ROOT, 'pages/faq.json'), 'utf8'));
const indexHtml = await readFile(path.join(ROOT, 'index.html'), 'utf8');
const FAVICON = /<link rel="icon"\s+href="(data:[^"]+)"\s*\/?>/.exec(indexHtml)[1];   // tolerant of editors that re-wrap the tag

/* ---------- Markdown engine (mirrors the app: math, footnotes, emoji shortcodes, callouts) ---------- */
function extensions(st) {
  return [
    { name: 'footnoteDef', level: 'block',
      start(src) { const m = src.match(/(?:^|\n) {0,3}\[\^[^\]\s]+\]:/); return m ? m.index + (m[0][0] === '\n' ? 1 : 0) : undefined; },
      tokenizer(src) { const m = /^ {0,3}\[\^([^\]\s]+)\]:[ \t]*([^\n]*(?:\n(?:[ \t]{2,}|\t)[^\n]*)*)(?:\n|$)/.exec(src); if (!m) return; st.defs[m[1]] = m[2].replace(/\n[ \t]{2,}/g, '\n').trim(); return { type: 'footnoteDef', raw: m[0] }; },
      renderer() { return ''; } },
    { name: 'footnoteRef', level: 'inline', start: s => s.indexOf('[^'),
      tokenizer(src) { const m = /^\[\^([^\]\s]+)\]/.exec(src); if (m && st.defs[m[1]] !== undefined) return { type: 'footnoteRef', raw: m[0], id: m[1] }; },
      renderer(t) { let n = st.order.indexOf(t.id) + 1; if (!n) { st.order.push(t.id); n = st.order.length; } return `<sup class="fn-ref"><a href="#fn-${n}" id="fnref-${n}">${n}</a></sup>`; } },
    { name: 'blockMath', level: 'block',
      start(src) { const m = src.match(/(?:^|\n) {0,3}\$\$/); return m ? m.index + (m[0][0] === '\n' ? 1 : 0) : undefined; },
      tokenizer(src) { const m = /^ {0,3}\$\$[ \t]*\n?([\s\S]+?)\n?[ \t]*\$\$[ \t]*(?:\n|$)/.exec(src); if (m) return { type: 'blockMath', raw: m[0], text: m[1].trim() }; },
      renderer: t => `<div class="math-block">${katex.renderToString(t.text, { displayMode: true, throwOnError: false })}</div>` },
    { name: 'inlineMath', level: 'inline', start: s => s.indexOf('$'),
      tokenizer(src) {
        let m = /^\$\$((?:\\.|[^$\\])+?)\$\$/.exec(src); if (m) return { type: 'inlineMath', raw: m[0], text: m[1].trim(), display: true };
        m = /^\$(?!\s)((?:\\.|[^$\\\n])+?)(?<!\s)\$(?!\d)/.exec(src); if (m) return { type: 'inlineMath', raw: m[0], text: m[1], display: false };
      },
      renderer: t => katex.renderToString(t.text, { displayMode: !!t.display, throwOnError: false }) },
    { name: 'emojiCode', level: 'inline', start: s => s.indexOf(':'),
      tokenizer(src) { const m = /^:([a-z0-9_+-]{1,30}):/i.exec(src); const ch = m && EMOJI.get(m[1].toLowerCase()); if (ch) return { type: 'emojiCode', raw: m[0], ch }; },
      renderer: t => t.ch }
  ];
}
function highlight(code, lang) {
  if (lang && hljs.getLanguage(lang)) { try { return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value; } catch (e) { /* fall through */ } }
  return esc(code);
}
function footnotesHTML(st, m) {
  if (!st.order.length) return '';
  return `<section class="footnotes"><hr><ol>${st.order.map((id, i) => `<li id="fn-${i + 1}">${m.parseInline(st.defs[id] || '')} <a class="fn-back" href="#fnref-${i + 1}">↩</a></li>`).join('')}</ol></section>`;
}
const ALERT_TITLES = { NOTE: 'Note', TIP: 'Tip', IMPORTANT: 'Important', WARNING: 'Warning', CAUTION: 'Caution' };

/** Renders an example's Markdown the way the editor's preview would (alert boxes use the preview classes). */
function renderExample(src) {
  const st = { order: [], defs: {} };
  const m = new Marked({ gfm: true, extensions: extensions(st), renderer: {
    image(href, title, text) { return `<span class="img-ph" role="img" aria-label="${escAttr(text)}">🖼 ${esc(text)}</span>`; },   // examples show a placeholder, not a broken image
    code(code, info) { const lang = (info || '').match(/^[\w+#.-]*/)[0].toLowerCase(); return `<pre${lang ? ` data-lang="${escAttr(lang)}"` : ''}><code class="hljs">${lang === 'mermaid' ? esc(code) : highlight(code, lang)}</code></pre>\n`; }
  } });
  let html = m.parse(src) + footnotesHTML(st, m);
  html = html.replace(/<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br\s*\/?>)?\s*/gi, (all, t) => `<blockquote class="alert alert-${t.toLowerCase()}"><p class="alert-title">${ALERT_TITLES[t.toUpperCase()]}</p><p>`);
  // examples must not add headings to the page outline → show them as styled paragraphs
  html = html.replace(/<h([1-6])(?: [^>]*)?>([\s\S]*?)<\/h\1>/g, (m, l, inner) => `<p class="md-h md-h${l}">${inner}</p>`);
  return html;
}

/* ---------- page bodies ---------- */
let codeSeq = 0;
function copyButton(targetId) { return `<button type="button" class="copy-btn" data-copy-from="#${targetId}">Copy</button>`; }
function codeHTML(code, lang) {
  const id = 'c' + (++codeSeq);
  return `<div class="code"><div class="code-h"><span>${esc(lang || 'text')}</span>${copyButton(id)}</div><pre id="${id}"><code class="hljs${lang ? ' language-' + escAttr(lang) : ''}">${highlight(code.replace(/\n$/, ''), lang)}</code></pre></div>\n`;
}
function exampleHTML(src, args, pageSlug) {
  const id = 'c' + (++codeSeq), title = (/title="([^"]*)"/.exec(args) || [])[1] || 'Example', file = (/file=(\S+)/.exec(args) || [])[1] || 'example.md';
  src = src.replace(/\n$/, '');
  return `<figure class="ex"><div class="ex-title"><span>${esc(title)}</span><span class="code-actions">${copyButton(id)}<a class="open-btn" href="${openInEditor(src + '\n', file)}" rel="nofollow">Open in editor</a></span></div><div class="ex-body"><pre class="ex-src" id="${id}">${esc(src)}</pre><div class="ex-out md">${renderExample(src)}</div></div></figure>\n`;
}
async function diagramHTML(name) {
  const d = diagrams[name]; if (!d) { warn(`unknown diagram "${name}"`); return ''; }
  const dim = async mode => { const svg = await readFile(path.join(ROOT, `assets/diagrams/${name}-${mode}.svg`), 'utf8'); return [/ width="(\d+)"/.exec(svg)[1], / height="(\d+)"/.exec(svg)[1]]; };
  const [w, h] = await dim('light'), id = 'c' + (++codeSeq);
  const img = mode => `<img class="only-${mode}" src="/assets/diagrams/${name}-${mode}.svg" width="${w}" height="${h}" alt="${escAttr(d.alt)}" loading="lazy" decoding="async">`;
  return `<figure class="diagram"><div class="code"><div class="code-h"><span>mermaid · ${esc(d.title)}</span><span class="code-actions">${copyButton(id)}<a class="open-btn" href="${openInEditor('```mermaid\n' + d.source + '\n```\n', name + '-diagram.md')}" rel="nofollow">Open in editor</a></span></div><pre id="${id}"><code>${esc(d.source)}</code></pre></div><div class="diagram-img">${img('light')}${img('dark')}</div></figure>\n`;
}
function emojiTableHTML(list) {
  const codes = list.split(/[\s,]+/).filter(Boolean), cells = [];
  for (const c of codes) { const e = EMOJI.get(c); if (!e) { warn(`unknown emoji shortcode ":${c}:"`); continue; } cells.push(`<div><span class="e">${e}</span><code>:${c}:</code></div>`); }
  return `<div class="emoji-grid">${cells.join('')}</div>\n`;
}

async function renderBody(md, pageSlug) {
  const toc = [], seen = new Map(), st = { order: [], defs: {} };
  // custom fenced blocks need async work (diagram sizes) → pre-resolve them into placeholders
  const stash = [];
  const marked = new Marked({ gfm: true, extensions: extensions(st), renderer: {
    heading(text, level, raw) {
      let id = slugify(raw) || 'section'; const n = seen.get(id) || 0; seen.set(id, n + 1); if (n) id += '-' + n;
      if (level === 2) toc.push({ id, text: raw.replace(/[*_`]/g, '') });
      return `<h${level} id="${id}">${text}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${level}>\n`;
    },
    code(code, info) {
      const [lang, ...rest] = (info || '').trim().split(/\s+/), args = rest.join(' ');
      if (lang === 'example') return exampleHTML(code, args, pageSlug);
      if (lang === 'diagram') { stash.push(diagramHTML(args.trim())); return `<!--diagram:${stash.length - 1}-->`; }
      if (lang === 'emoji-table') return emojiTableHTML(code);
      return codeHTML(code, lang.toLowerCase());
    },
    table(header, body) { return `<div class="tbl"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>\n`; },
    link(href, title, text) { const ext = /^https?:/.test(href); return `<a href="${escAttr(href)}"${title ? ` title="${escAttr(title)}"` : ''}${ext ? ' rel="noopener noreferrer" target="_blank"' : ''}>${text}</a>`; },
    blockquote(quote) {
      const m = /^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br\s*\/?>)?\s*/i.exec(quote);
      if (!m) return `<blockquote>\n${quote}</blockquote>\n`;
      const t = m[1].toUpperCase();
      return `<aside class="callout callout-${t.toLowerCase()}"><p class="callout-title">${ALERT_TITLES[t]}</p><p>${quote.slice(m[0].length)}</aside>\n`;
    }
  } });
  let html = marked.parse(md) + footnotesHTML(st, marked);
  const resolved = await Promise.all(stash);
  html = html.replace(/<!--diagram:(\d+)-->/g, (_, i) => resolved[+i]);
  return { html, toc };
}

/* FAQ section: everything after a "## Frequently asked questions" heading, one "### Question" per item */
function splitFaq(md) {
  const m = /^## (Frequently asked questions|FAQ)[^\n]*\n/im.exec(md);
  if (!m) return { md, faq: [] };
  const rest = md.slice(m.index + m[0].length), items = [];
  for (const part of rest.split(/^### /m).slice(1)) {
    const nl = part.indexOf('\n');
    items.push({ q: part.slice(0, nl).trim(), a: part.slice(nl + 1).trim() });
  }
  return { md: md.slice(0, m.index), faq: items };
}
const inlineHtml = md => new Marked({ gfm: true, extensions: extensions({ order: [], defs: {} }) }).parse(md).trim();
/** Homepage FAQ: questions grouped under h3 headings, generous spacing (styled in styles.css). */
function faqGroupsHTML(items) {
  const groups = [];
  for (const i of items) { let g = groups.find(x => x.name === i.group); if (!g) groups.push(g = { name: i.group, items: [] }); g.items.push(i); }
  // two columns, filled in reading order until the first holds about half of the questions (open/close never shifts the other column)
  const cols = [[], []]; let n = 0;
  for (const g of groups) { cols[n < items.length / 2 ? 0 : 1].push(g); n += g.items.length; }
  let first = true;
  const group = g => `<section class="faq-set" aria-labelledby="faq-${slugify(g.name)}"><h3 class="faq-group" id="faq-${slugify(g.name)}">${esc(g.name)}</h3><div class="faq">${g.items.map(i => `<details${first && (first = false, true) ? ' open' : ''}><summary>${esc(i.q)}</summary>${i.a}</details>`).join('')}</div></section>`;
  return cols.map(c => `<div class="faq-col">${c.map(group).join('')}</div>`).join('');
}
function faqHTML(items, asMarkdown) {
  return `<div class="faq">${items.map(i => `<details><summary>${esc(i.q)}</summary>${asMarkdown ? inlineHtml(i.a) : i.a}</details>`).join('')}</div>`;
}
const stripTags = h => h.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

/* ---------- page chrome ---------- */
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<symbol id="i-logo" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="currentColor"/><path d="M6 22V10l5 6 5-6v12M23 11v10m-3.5-3.5L23 21l3.5-3.5" style="stroke:var(--logo-fg)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-2.93 1.41-1.41m11.32-11.32 1.41-1.41M2 12h2m16 0h2M6.34 6.34 4.93 4.93m14.14 14.14-1.41-1.41"/></symbol>
<symbol id="i-moon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7"/></symbol>
<symbol id="i-github" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></symbol>
</defs></svg>`;
const HEAD_SCRIPT = `<script>(function(){var t=null;try{t=localStorage.getItem('quilldown:theme')}catch(e){}if(!t)t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t)})();</script>`;
/** One header for every page (same links as the homepage). `current` marks the Docs link on /guides and guide pages. */
const navHTML = (current = '') => `<header class="nav" id="nav"><div class="container nav-in">
  <a class="brand" href="/#top" aria-label="Quilldown home"><svg class="logo"><use href="#i-logo"/></svg>Quilldown</a>
  <nav class="nav-links" aria-label="Primary" id="navMenu"><a href="/#features">Features</a><a href="/#how">How it works</a><a href="/guides"${current === 'docs' ? ' aria-current="page"' : ''}>Docs</a><a href="/#privacy">Privacy</a><a href="/#faq">FAQ</a><a class="m-only" href="/#editor">Open editor</a></nav>
  <div class="nav-cta">
    <button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="navMenu" aria-label="Menu"><svg class="i" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    <a class="icon-btn" href="${GITHUB}" target="_blank" rel="noopener noreferrer" aria-label="Quilldown on GitHub" title="View on GitHub"><svg class="i i-fill"><use href="#i-github"/></svg></a>
    <button class="icon-btn" data-act="theme" aria-label="Toggle theme"><svg class="i theme-icon-sun"><use href="#i-sun"/></svg><svg class="i theme-icon-moon"><use href="#i-moon"/></svg></button>
    <a class="btn btn-primary btn-sm" href="/#editor">Open editor <svg class="i"><use href="#i-arrow"/></svg></a>
  </div></div></header>`;
const footerHTML = guides => `<footer class="footer"><div class="container">
  <div class="footer-cols">
    <div><a class="brand" href="/#top"><svg class="logo"><use href="#i-logo"/></svg>Quilldown</a><p>A calm, private Markdown editor with live preview, tabs, math and diagrams. Works offline.</p></div>
    ${CATEGORIES.map(c => `<div><h3>${esc(c.title)}</h3><ul>${guides.filter(p => p.category === c.id).map(p => `<li><a href="/guides/${p.slug}">${esc(p.short || p.h1)}</a></li>`).join('')}</ul></div>`).join('\n    ')}
    <div><h3>Contact</h3><ul>
      <li><a href="${GITHUB_PROFILE}" target="_blank" rel="me noopener noreferrer">GitHub profile</a></li>
      <li><a href="${GITHUB}/issues" target="_blank" rel="noopener noreferrer">Report an issue</a></li>
      <li><a href="${GITHUB}" target="_blank" rel="noopener noreferrer">Source code</a></li>
      <li><a href="/about">About &amp; press</a></li>
    </ul></div>
  </div>
  <div class="footer-base"><span>© 2026 Quilldown · built by <a href="${GITHUB_PROFILE}" target="_blank" rel="me noopener noreferrer">${AUTHOR}</a>. Your Markdown never leaves your browser.</span><span><a href="/#editor">Editor</a> · <a href="/guides">Docs</a> · <a href="/about">About</a></span></div>
</div></footer>`;
const ARROW = '<svg class="i"><use href="#i-arrow"/></svg>';
const cardHTML = p => `<a class="gcard" href="/guides/${p.slug}"><strong>${esc(p.short || p.h1)}</strong><span class="d">${esc(p.card || '')}</span>${ARROW}</a>`;
/** Guide navigator: one column per category, one line per guide (homepage + hub). */
const gnavHTML = (guides, lvl = 3) => `<div class="gnav">${CATEGORIES.map((c, ci) => { const list = guides.filter(p => p.category === c.id); return `<section class="gcol" id="cat-${c.id}"><header><span class="gcol-n">0${ci + 1}</span><h${lvl}>${esc(c.title)}</h${lvl}><span class="gcol-c">${list.length} guides</span></header><ul>${list.map(p => `<li><a class="grow" href="/guides/${p.slug}"><span class="gt">${esc(p.short || p.h1)}</span><span class="gd">${esc(p.card || '')}</span>${ARROW}</a></li>`).join('')}</ul></section>`; }).join('')}</div>`;

/* ---------- structured data: ONE linked @graph per page ---------- */
const ID = { org: SITE + '/#organization', person: SITE + '/#person', site: SITE + '/#website', logo: SITE + '/#logo', app: SITE + '/#app', code: GITHUB + '#source' };
const SITE_DESC = 'Quilldown is a free online Markdown editor with live preview, tabs, math, diagrams and export to PDF, Word, PNG and EPUB. It runs in your browser and works offline.';
const imageNode = { '@type': 'ImageObject', url: OG_IMAGE, contentUrl: OG_IMAGE, width: 1200, height: 630, caption: 'Quilldown — Write Markdown. Watch it come alive.' };
const baseNodes = () => [
  { '@type': 'ImageObject', '@id': ID.logo, url: SITE + '/icons/icon-512.png', contentUrl: SITE + '/icons/icon-512.png', width: 512, height: 512, caption: 'Quilldown logo' },
  { '@type': 'Organization', '@id': ID.org, name: 'Quilldown', url: SITE + '/', description: SITE_DESC,
    logo: { '@id': ID.logo }, image: { '@id': ID.logo }, founder: { '@id': ID.person }, sameAs: [GITHUB, GITHUB_PROFILE],
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer support', url: GITHUB + '/issues', availableLanguage: 'English' },
      { '@type': 'ContactPoint', contactType: 'media relations', url: GITHUB_PROFILE, availableLanguage: 'English' }
    ] },
  { '@type': 'Person', '@id': ID.person, name: AUTHOR, url: GITHUB_PROFILE, sameAs: [GITHUB_PROFILE], worksFor: { '@id': ID.org } },
  { '@type': 'WebSite', '@id': ID.site, url: SITE + '/', name: 'Quilldown', description: SITE_DESC, inLanguage: 'en', publisher: { '@id': ID.org } }
];
const webPageNode = (url, name, description, extra = {}) => ({ '@type': 'WebPage', '@id': url + '#webpage', url, name, description, inLanguage: 'en', isPartOf: { '@id': ID.site }, primaryImageOfPage: imageNode, image: imageNode, ...extra });
const breadcrumbNode = (url, items) => ({ '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: SITE + c.href })) });
const faqNode = (url, items) => ({ '@type': 'FAQPage', '@id': url + '#faq', url, isPartOf: { '@id': url + '#webpage' }, mainEntity: items.map(i => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: stripTags(i.html) } })) });
const graph = nodes => ({ '@context': 'https://schema.org', '@graph': nodes });
const CRUMB_HOME = { name: 'Home', href: '/#top' };

/* ---------- head / chrome ---------- */
const fontsCss = await readFile(path.join(ROOT, 'vendor/fonts/fonts.css'), 'utf8');
const INTER_LATIN = (/\/\* latin \*\/\s*@font-face\s*\{[^}]*font-family:\s*'Inter'[^}]*url\(([^)]+\.woff2)\)/.exec(fontsCss) || [])[1];
function headHTML({ title, description, url, type = 'article', math = false, ld }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${escAttr(description)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="${AUTHOR}">
<meta name="theme-color" content="#fbfbfa">
<link rel="canonical" href="${url}">
<link rel="author" href="${GITHUB_PROFILE}">
<link rel="me" href="${GITHUB_PROFILE}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Quilldown">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${escAttr(title)}">
<meta property="og:description" content="${escAttr(description)}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:secure_url" content="${OG_IMAGE}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Quilldown — Write Markdown. Watch it come alive.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(title)}">
<meta name="twitter:description" content="${escAttr(description)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<meta name="twitter:image:alt" content="Quilldown — Write Markdown. Watch it come alive.">
<link rel="icon" href="${FAVICON}">
${HEAD_SCRIPT}
${INTER_LATIN ? `<link rel="preload" href="/vendor/fonts/${INTER_LATIN}" as="font" type="font/woff2" crossorigin>\n` : ''}<link rel="stylesheet" href="/vendor/fonts/fonts.css">
${math ? '<link rel="stylesheet" href="/vendor/katex/katex.min.css" media="print" onload="this.media=\'all\'">\n<noscript><link rel="stylesheet" href="/vendor/katex/katex.min.css"></noscript>\n' : ''}<link rel="stylesheet" href="/css/styles.css">
<link rel="stylesheet" href="/css/document.css">
<link rel="stylesheet" href="/css/site.css">
<script type="application/ld+json" id="ld-graph">${safeJson(ld)}</script>
</head>
<body>
${SPRITE}
`;
}
const crumbsHTML = items => `<ol class="crumbs" aria-label="Breadcrumb">${items.map((c, i) => i === items.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.href}">${esc(c.name)}</a></li>`).join('')}</ol>`;
const ctaBand = (h, p) => `<section class="cta-band"><div><h2>${esc(h)}</h2><p>${esc(p)}</p></div><a class="btn btn-primary" href="/#editor">Open the editor <svg class="i"><use href="#i-arrow"/></svg></a></section>`;

/* the stylesheet for rendered documents is generated from the single source (js/document-style.js) so guide pages
   can link it as CSS instead of running a render-blocking script */
{
  const sandbox = { window: {}, document: { createElement: () => ({}), head: { appendChild() {} } } };
  vm.createContext(sandbox); vm.runInContext(await readFile(path.join(ROOT, 'js/document-style.js'), 'utf8'), sandbox);
  await writeFile(path.join(ROOT, 'css/document.css'), '/* Generated by tools/build-pages.mjs from js/document-style.js — do not edit. */\n' + sandbox.window.QUILLDOWN_DOC_CSS.trim() + '\n');
}

/* ---------- read sources ---------- */
function parseFront(text) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text.replace(/\r\n/g, '\n'));
  if (!m) throw new Error('missing front matter');
  const fm = {};
  for (const line of m[1].split('\n')) { const i = line.indexOf(':'); if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1'); }
  return { fm, body: text.replace(/\r\n/g, '\n').slice(m[0].length) };
}
const files = (await readdir(path.join(ROOT, 'pages'))).filter(f => f.endsWith('.md')).sort();
const allPages = [];
for (const f of files) {
  const { fm, body } = parseFront(await readFile(path.join(ROOT, 'pages', f), 'utf8'));
  allPages.push({ slug: f.replace(/\.md$/, ''), ...fm, isSite: fm.section === 'site', math: fm.math === 'true', order: +fm.order || 99, related: (fm.related || '').split(',').map(s => s.trim()).filter(Boolean), body });
}
allPages.sort((a, b) => a.order - b.order);
const pages = allPages.filter(p => !p.isSite), sitePages = allPages.filter(p => p.isSite);   // `pages` = guides
const slugs = new Set(pages.map(p => p.slug)), siteSlugs = new Set(sitePages.map(p => p.slug));
const LAST_UPDATED = allPages.map(p => p.updated).sort().pop();
const FIRST_PUBLISHED = allPages.map(p => p.published || p.updated).sort()[0];

const pnHTML = p => { const i = pages.indexOf(p), a = pages[i - 1], b = pages[i + 1]; return `<nav class="pn" aria-label="More guides">${a ? `<a class="pn-prev" href="/guides/${a.slug}"><span>Previous</span><strong>${esc(a.short || a.h1)}</strong></a>` : '<span></span>'}${b ? `<a class="pn-next" href="/guides/${b.slug}"><span>Next</span><strong>${esc(b.short || b.h1)}</strong></a>` : '<span></span>'}</nav>`; };

/* ---------- build each page ---------- */
await mkdir(path.join(ROOT, 'guides'), { recursive: true });
const built = [];
for (const p of allPages) {
  const urlPath = p.isSite ? `/${p.slug}` : `/guides/${p.slug}`, url = SITE + urlPath;
  codeSeq = 0;
  const { md, faq } = splitFaq(p.body);
  const { html: bodyHtml, toc } = await renderBody(md, p.slug);
  let html = bodyHtml;
  const faqItems = faq.map(i => ({ q: i.q, a: i.a, html: inlineHtml(i.a) }));
  if (faqItems.length) { toc.push({ id: 'faq', text: 'Frequently asked questions' }); html += `<h2 id="faq">Frequently asked questions<a class="anchor" href="#faq" aria-label="Link to this section">#</a></h2>\n${faqHTML(faqItems, true)}`; }
  const wc = words(html), mins = Math.max(1, Math.round(wc / 220));
  const related = p.related.filter(s => { if (!slugs.has(s)) { warn(`${p.slug}: unknown related page "${s}"`); return false; } return true; }).map(s => pages.find(x => x.slug === s));
  const crumbs = p.isSite ? [CRUMB_HOME, { name: p.short || p.h1, href: urlPath }] : [CRUMB_HOME, { name: 'Docs', href: '/guides' }, { name: p.h1, href: urlPath }];
  const eyebrow = p.isSite ? (p.eyebrow || 'About') : CATEGORIES.find(c => c.id === p.category).title;

  const nodes = [...baseNodes(),
    webPageNode(url, p.title, p.description, { breadcrumb: { '@id': url + '#breadcrumb' }, datePublished: p.published || p.updated, dateModified: p.updated, ...(p.isSite ? { '@type': ['AboutPage', 'ContactPage'], mainEntity: { '@id': ID.org } } : { mainEntity: { '@id': url + '#article' } }) }),
    breadcrumbNode(url, crumbs)];
  if (!p.isSite) nodes.push({ '@type': 'Article', '@id': url + '#article', headline: p.h1, description: p.description, image: imageNode, datePublished: p.published || p.updated, dateModified: p.updated, inLanguage: 'en', wordCount: wc,
    articleSection: eyebrow, isAccessibleForFree: true, author: { '@id': ID.person }, publisher: { '@id': ID.org }, mainEntityOfPage: { '@id': url + '#webpage' }, isPartOf: { '@id': url + '#webpage' } });
  if (faqItems.length) nodes.push(faqNode(url, faqItems));

  // validation
  if (p.title.length > 65) warn(`${p.slug}: title is ${p.title.length} chars (aim ≤ 65)`);
  if (p.description.length < 110 || p.description.length > 160) warn(`${p.slug}: description is ${p.description.length} chars (aim 110–160)`);
  if (/<h1[ >]/i.test(html)) warn(`${p.slug}: body contains an <h1>`);
  for (const m of html.matchAll(/href="\/guides\/([^"#]+)/g)) if (!slugs.has(m[1])) warn(`${p.slug}: broken internal link /guides/${m[1]}`);

  p.html = headHTML({ title: p.title, description: p.description, url, math: p.math || /class="katex/.test(html), ld: graph(nodes) }) + navHTML(p.isSite ? '' : 'docs') + `
<main class="doc-wrap">
  ${crumbsHTML(crumbs)}
  <header class="doc-head">
    <p class="eyebrow">${esc(eyebrow)}</p>
    <h1>${esc(p.h1)}</h1>
    <p class="lead">${esc(p.lead)}</p>
    <div class="doc-meta"><span>Updated ${fmtDate(p.updated)}</span><span>${mins} min read</span><span>Free · No sign-up · Runs in your browser</span></div>
    <div class="doc-actions"><a class="btn btn-primary" href="/#editor">Open the editor <svg class="i"><use href="#i-arrow"/></svg></a>${p.isSite ? `<a class="btn" href="${GITHUB_PROFILE}" target="_blank" rel="me noopener noreferrer">GitHub profile</a>` : '<a class="btn" href="/guides">All docs</a>'}</div>
  </header>
  <div class="doc-grid">
    <aside class="toc" aria-label="On this page"><h2>On this page</h2>${toc.map(t => `<a href="#${t.id}">${esc(t.text)}</a>`).join('')}</aside>
    <article class="doc-body">
${html}
    </article>
  </div>
  ${p.isSite ? '' : pnHTML(p)}
  <div class="after">
    ${related.length ? `<h2>Related guides</h2><div class="cards">${related.map(cardHTML).join('')}</div>` : ''}
    ${ctaBand(p.cta || 'Try it in Quilldown', p.ctaText || 'A free Markdown editor with live preview. Nothing to install and nothing uploaded — your writing stays in your browser.')}
  </div>
</main>
` + footerHTML(pages) + `
<script src="/js/site.js" defer></script>
</body>
</html>
`;
  await writeFile(path.join(ROOT, p.isSite ? `${p.slug}.html` : `guides/${p.slug}.html`), p.html);
  built.push({ slug: p.slug, words: wc, mins, faq: faqItems.length, title: p.title.length, desc: p.description.length });
}

/* ---------- guides hub ---------- */
{
  const url = `${SITE}/guides`, crumbs = [CRUMB_HOME, { name: 'Docs', href: '/guides' }];
  const title = 'Quilldown Docs: Markdown Guides & Cheat Sheet';
  const description = 'Free Markdown guides: a complete cheat sheet, how to convert Markdown to PDF, Word and HTML, plus tables, math, diagrams, emoji and README templates.';
  if (title.length > 75) warn(`hub title is ${title.length} chars`);
  if (description.length > 160) warn(`hub description is ${description.length} chars`);
  const nodes = [...baseNodes(),
    webPageNode(url, title, description, { '@type': 'CollectionPage', breadcrumb: { '@id': url + '#breadcrumb' }, datePublished: FIRST_PUBLISHED, dateModified: LAST_UPDATED, mainEntity: { '@id': url + '#list' } }),
    breadcrumbNode(url, crumbs),
    { '@type': 'ItemList', '@id': url + '#list', name: 'Quilldown docs: Markdown guides & cheat sheet', numberOfItems: pages.length, itemListElement: pages.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/guides/${p.slug}`, name: p.h1 })) }];
  const html = headHTML({ title, description, url, type: 'website', ld: graph(nodes) }) + navHTML('docs') + `
<main class="doc-wrap">
  ${crumbsHTML(crumbs)}
  <header class="doc-head">
    <p class="eyebrow">Docs</p>
    <h1>Quilldown docs</h1>
    <p class="lead">The Markdown cheat sheet and step-by-step guides. Every example opens in the editor.</p>
    <div class="doc-actions"><a class="btn btn-primary" href="/#editor">Open the editor <svg class="i"><use href="#i-arrow"/></svg></a></div>
  </header>
  <section class="docs-block"><h2 class="docs-h">Reference</h2><a class="docfeat" href="/guides/markdown-cheat-sheet"><span class="docfeat-t"><strong>Markdown cheat sheet</strong><span>Every syntax, with live examples.</span></span>${ARROW}</a></section>
  <section class="docs-block"><h2 class="docs-h">Guides</h2>${gnavHTML(pages, 3)}</section>
  <div class="after">${ctaBand('Start writing', 'Open Quilldown and try any example from these guides — it takes one click and nothing leaves your browser.')}</div>
</main>
` + footerHTML(pages) + `
<script src="/js/site.js" defer></script>
</body>
</html>
`;
  await writeFile(path.join(ROOT, 'guides', 'index.html'), html);
}

/* ---------- sitemap ---------- */
{
  const urls = [
    { loc: SITE + '/', lastmod: LAST_UPDATED, priority: '1.0', freq: 'weekly' },
    { loc: SITE + '/guides', lastmod: LAST_UPDATED, priority: '0.8', freq: 'weekly' },
    ...pages.map(p => ({ loc: `${SITE}/guides/${p.slug}`, lastmod: p.updated, priority: p.slug === 'markdown-cheat-sheet' || p.slug === 'what-is-markdown' ? '0.9' : '0.7', freq: 'monthly' })),
    ...sitePages.map(p => ({ loc: `${SITE}/${p.slug}`, lastmod: p.updated, priority: '0.5', freq: 'yearly' }))
  ];
  await writeFile(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`);
}

/* ---------- generated regions of the homepage ---------- */
{
  const url = SITE + '/';
  const faqItems = faqHome.map(i => ({ group: i.group, q: i.q, a: i.a, html: i.a }));
  const homeTitle = (/<title>([^<]*)<\/title>/.exec(indexHtml) || [])[1] || 'Quilldown';
  const homeDesc = (/<meta name="description"\s+content="([^"]*)"/.exec(indexHtml) || [])[1] || SITE_DESC;
  if (homeDesc.length > 160) warn(`homepage description is ${homeDesc.length} chars (aim ≤ 160)`);
  const nodes = [...baseNodes(),
    webPageNode(url, homeTitle, homeDesc, { datePublished: FIRST_PUBLISHED, dateModified: LAST_UPDATED, about: { '@id': ID.app }, mainEntity: { '@id': ID.app } }),
    { '@type': 'WebApplication', '@id': ID.app, name: 'Quilldown', alternateName: 'Quilldown Markdown editor', url: SITE + '/', description: SITE_DESC,
      applicationCategory: 'UtilitiesApplication', applicationSubCategory: 'Markdown editor', operatingSystem: 'Any (runs in a web browser)',
      browserRequirements: 'Requires JavaScript. Works in current Chrome, Edge, Firefox and Safari.', isAccessibleForFree: true, inLanguage: 'en',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      featureList: ['Live Markdown preview with synced scrolling', 'Tabs for multiple documents', 'Copy for Google Docs with clean heading sizes', 'Export to PDF, Word (.docx), PNG, EPUB, HTML, Markdown and plain text', 'LaTeX math with KaTeX', 'Mermaid diagrams', 'Visual table editor and emoji picker', 'Find and replace, outline and footnotes', 'Works offline and installs as an app', 'Private: nothing is uploaded'],
      image: OG_IMAGE, screenshot: imageNode, softwareHelp: { '@type': 'CreativeWork', name: 'Quilldown guides', url: SITE + '/guides' }, installUrl: SITE + '/',
      datePublished: FIRST_PUBLISHED, dateModified: LAST_UPDATED, author: { '@id': ID.person }, publisher: { '@id': ID.org }, sameAs: [GITHUB], isBasedOn: { '@id': ID.code } },
    { '@type': 'SoftwareSourceCode', '@id': ID.code, name: 'Quilldown source code', codeRepository: GITHUB, programmingLanguage: ['JavaScript', 'HTML', 'CSS'], runtimePlatform: 'Web browser', author: { '@id': ID.person }, url: GITHUB },
    faqNode(url, faqItems)];
  const regions = {
    FAQ: faqGroupsHTML(faqItems),
    GUIDES: gnavHTML(pages),
    FOOTER: footerHTML(pages),
    LD: `<script type="application/ld+json" id="ld-graph">${safeJson(graph(nodes))}</script>`
  };
  let idx = indexHtml;
  for (const [name, inner] of Object.entries(regions)) {
    const re = new RegExp(`(<!--${name}:start-->)[\\s\\S]*?(<!--${name}:end-->)`);
    if (!re.test(idx)) { warn(`index.html is missing the generated-region markers for ${name}`); continue; }
    idx = idx.replace(re, (m, a, b) => `${a}\n${inner}\n${b}`);
  }
  await writeFile(path.join(ROOT, 'index.html'), idx);
}

/* ---------- report ---------- */
console.log(`Built ${pages.length} guides + ${sitePages.length} site page(s) + hub, css/document.css, sitemap.xml, and refreshed index.html regions\n`);
for (const b of built) console.log(`  ${b.slug.padEnd(30)} ${String(b.words).padStart(5)} words  ${String(b.mins).padStart(2)} min  title ${b.title}  desc ${b.desc}${b.faq ? '  faq ' + b.faq : ''}`);
if (warnings.length) { console.log('\nWarnings:'); warnings.forEach(w => console.log('  ⚠ ' + w)); process.exitCode = 1; } else console.log('\nNo warnings.');
