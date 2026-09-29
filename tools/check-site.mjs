/* Quilldown — audits the built site: SEO basics, structured data, sitemap and every internal link / anchor / image.
   Run from the project root after building:   node tools/check-site.mjs        (exit code 1 if anything is wrong) */
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://quilldown.vercel.app';
const problems = [], notes = [];
const bad = m => problems.push(m);

const exists = async p => { try { return (await stat(p)).isFile(); } catch { return false; } };
const pages = [{ file: 'index.html', url: '/' }];
for (const f of ['about']) if (await exists(path.join(ROOT, f + '.html'))) pages.push({ file: f + '.html', url: '/' + f });
for (const f of (await readdir(path.join(ROOT, 'guides'))).sort()) {
  if (!f.endsWith('.html')) continue;
  pages.push({ file: 'guides/' + f, url: f === 'index.html' ? '/guides' : '/guides/' + f.replace(/\.html$/, '') });
}
const html = {};
for (const p of pages) html[p.url] = await readFile(path.join(ROOT, p.file), 'utf8');

/** Map a site path to the file Vercel would serve (cleanUrls). */
async function resolveFile(urlPath) {
  const p = decodeURIComponent(urlPath.replace(/\/$/, '')) || '/';
  const candidates = p === '/' ? ['index.html'] : [p.slice(1), p.slice(1) + '.html', p.slice(1) + '/index.html'];
  for (const c of candidates) if (await exists(path.join(ROOT, c))) return c;
  return null;
}
const idsOf = h => new Set([...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));

const titles = new Map(), descs = new Map();
for (const p of pages) {
  const h = html[p.url], where = p.url;
  const title = (/<title>([^<]*)<\/title>/.exec(h) || [])[1], desc = (/<meta name="description"\s+content="([^"]*)"/.exec(h) || [])[1];
  const canon = (/<link rel="canonical" href="([^"]*)"/.exec(h) || [])[1];
  if (!title) bad(`${where}: missing <title>`); else { if (title.length > 70) bad(`${where}: title is ${title.length} chars`); if (titles.has(title)) bad(`${where}: duplicate title with ${titles.get(title)}`); titles.set(title, where); }
  if (!desc) bad(`${where}: missing meta description`); else { if (desc.length < 100 || desc.length > 160) bad(`${where}: description is ${desc.length} chars`); if (descs.has(desc)) bad(`${where}: duplicate description with ${descs.get(desc)}`); descs.set(desc, where); }
  const wantCanon = SITE + (p.url === '/' ? '/' : p.url);
  if (canon !== wantCanon) bad(`${where}: canonical is ${canon}, expected ${wantCanon}`);
  const h1s = (h.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${where}: ${h1s} <h1> elements (want exactly 1)`);
  if (!/<meta property="og:image" content="https:\/\/quilldown\.vercel\.app\/social\/og-image\.png">/.test(h)) bad(`${where}: missing og:image`);
  if (!/<html lang="en"/.test(h)) bad(`${where}: missing lang`);
  // no render-blocking scripts in <head> (external scripts must be defer/async/module)
  const head = (/<head[\s\S]*?<\/head>/.exec(h) || [''])[0].replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  for (const m of head.matchAll(/<script\b([^>]*)\bsrc="([^"]+)"([^>]*)>/g)) if (!/\b(defer|async)\b|type="module"/.test(m[1] + m[3])) bad(`${where}: render-blocking <script src="${m[2]}"> in <head>`);
  for (const m of head.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)) if (/katex/.test(m[0]) && !/media="print"/.test(m[0])) bad(`${where}: KaTeX stylesheet blocks first paint`);
  if (!/<meta name="author" content="Dhruv-Dhameliya">/.test(h)) bad(`${where}: missing author meta`);
  if (!/<meta name="robots" content="index, follow/.test(h)) bad(`${where}: missing robots meta`);
  if (!h.includes('href="https://github.com/Dhruv-Dhameliya"')) bad(`${where}: no link to the GitHub profile (contact)`);
  // structured data: ONE parseable @graph whose @id references all resolve
  const lds = [...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (lds.length !== 1) bad(`${where}: ${lds.length} JSON-LD scripts (want one @graph)`);
  for (const m of lds) {
    try {
      const g = JSON.parse(m[1])['@graph'];
      if (!Array.isArray(g)) { bad(`${where}: JSON-LD has no @graph`); continue; }
      const ids = new Set(g.map(n => n['@id']).filter(Boolean)), types = g.flatMap(n => [].concat(n['@type']));
      for (const need of ['Organization', 'Person', 'WebSite']) if (!types.includes(need)) bad(`${where}: @graph lacks ${need}`);
      if (!types.some(x => /^(WebPage|AboutPage|CollectionPage|ContactPage)$/.test(x))) bad(`${where}: @graph lacks a WebPage`);
      const refs = [];
      (function walk(x) { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') { const ks = Object.keys(x); if (ks.length === 1 && ks[0] === '@id') refs.push(x['@id']); else ks.forEach(k => walk(x[k])); } })(g);
      for (const r of refs) if (!ids.has(r)) bad(`${where}: JSON-LD references unknown @id ${r}`);
      const faq = g.find(n => n['@type'] === 'FAQPage');
      if (faq && !faq.mainEntity.length) bad(`${where}: empty FAQPage`);
      if (p.url === '/' && !types.includes('WebApplication')) bad(`${where}: homepage graph lacks WebApplication`);
      if (p.url.startsWith('/guides/') && !types.includes('Article')) bad(`${where}: guide graph lacks Article`);
      if (p.url !== '/' && !types.includes('BreadcrumbList')) bad(`${where}: graph lacks BreadcrumbList`);
    } catch (e) { bad(`${where}: invalid JSON-LD (${e.message})`); }
  }
  // images need alt text
  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) bad(`${where}: <img> without alt: ${m[0].slice(0, 60)}`);
  // heading order: no jump from h2 to h4
  const levels = [...h.matchAll(/<h([1-6])[\s>]/g)].map(m => +m[1]);
  for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) { bad(`${where}: heading jumps from h${levels[i - 1]} to h${levels[i]}`); break; }
}

// links, anchors, images
let linkCount = 0;
for (const p of pages) {
  const h = html[p.url];
  const targets = [...h.matchAll(/\s(?:href|src)="([^"]+)"/g)].map(m => m[1]).filter(u => !/^(https?:|mailto:|data:|javascript:)/.test(u));
  for (const raw of targets) {
    if (raw === '#') continue;
    linkCount++;
    const [pathPart, frag] = raw.split('#');
    if (raw.startsWith('#')) { if (!idsOf(h).has(frag) && !/^d=/.test(frag)) bad(`${p.url}: anchor #${frag} not found on the page`); continue; }
    const target = pathPart.startsWith('/') ? pathPart : path.posix.join(path.posix.dirname(p.url === '/' ? '/x' : p.url + '/x'), pathPart);
    const file = await resolveFile(target);
    if (!file) { bad(`${p.url}: broken link ${raw}`); continue; }
    if (frag && file.endsWith('.html') && !/^d=/.test(frag)) {
      const th = html[target === '/index.html' ? '/' : target] || await readFile(path.join(ROOT, file), 'utf8');
      if (!idsOf(th).has(frag)) bad(`${p.url}: ${raw} → anchor #${frag} missing in ${file}`);
    }
  }
}

// sitemap must list exactly the built pages
const sm = await readFile(path.join(ROOT, 'sitemap.xml'), 'utf8');
const inMap = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
for (const p of pages) { const u = SITE + (p.url === '/' ? '/' : p.url); if (!inMap.has(u)) bad(`sitemap.xml is missing ${u}`); inMap.delete(u); }
for (const extra of inMap) bad(`sitemap.xml lists a page that isn't built: ${extra}`);
const robots = await readFile(path.join(ROOT, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap: ' + SITE + '/sitemap.xml')) bad('robots.txt does not point at sitemap.xml');

// every guide should be reachable from the hub and from at least two other pages (internal linking)
const inbound = Object.fromEntries(pages.map(p => [p.url, new Set()]));
for (const p of pages) for (const m of html[p.url].matchAll(/href="(\/[^"#]*)"/g)) { const u = m[1].replace(/\/$/, '') || '/'; if (inbound[u] && u !== p.url) inbound[u].add(p.url); }
for (const p of pages.filter(x => x.url.startsWith('/guides/'))) if (inbound[p.url].size < 3) bad(`${p.url}: only ${inbound[p.url].size} internal pages link to it (want ≥ 3)`);

console.log(`Checked ${pages.length} pages, ${linkCount} internal links/assets.`);
notes.push(...pages.map(p => `${p.url.padEnd(34)} inbound links: ${inbound[p.url].size}`));
console.log(notes.join('\n'));
if (problems.length) { console.log('\nProblems:'); problems.forEach(x => console.log('  ✗ ' + x)); process.exitCode = 1; } else console.log('\nAll checks passed ✓');
