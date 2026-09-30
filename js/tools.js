/* Quilldown: the small live tools embedded in four guides (table generator, math box, diagram playground, README generator).
   Everything runs in your browser with bundled libraries; nothing you type is sent anywhere.
   Each tool mounts into <section class="tool" data-tool="table|math|diagram|readme">. Without JavaScript the section stays empty and hidden. */
(function () {
  'use strict';
  var doc = document;
  var mounts = [].slice.call(doc.querySelectorAll('.tool[data-tool]'));
  if (!mounts.length) return;

  /* ---------- helpers ---------- */
  function el(tag, cls, html) { var e = doc.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function text(tag, cls, t) { var e = el(tag, cls); e.textContent = t; return e; }
  function b64u(s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function editorLink(t, name) { return '/#d=u.' + b64u(JSON.stringify({ n: name, t: t })); }
  function copy(t, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); });
    else { var ta = el('textarea'); ta.value = t; ta.style.cssText = 'position:fixed;left:-9999px'; doc.body.appendChild(ta); ta.select(); var ok = false; try { ok = doc.execCommand('copy'); } catch (e) { } ta.remove(); done(ok); }
  }
  function flash(btn, ok) { var old = btn.getAttribute('data-l') || btn.textContent; btn.setAttribute('data-l', old); btn.textContent = ok ? 'Copied ✓' : 'Press Ctrl+C'; setTimeout(function () { btn.textContent = old; }, 1300); }
  var libs = {};
  function lib(url, test) {
    if (test && test()) return Promise.resolve();
    if (libs[url]) return libs[url];
    libs[url] = new Promise(function (ok, fail) {
      var ex = [].slice.call(doc.scripts).filter(function (s) { return s.src && s.src.indexOf(url) > -1; })[0];
      if (ex) { ex.addEventListener('load', function () { ok(); }); ex.addEventListener('error', fail); setTimeout(function () { if (!test || test()) ok(); }, 1500); return; }
      var s = el('script'); s.src = url; s.onload = function () { ok(); }; s.onerror = fail; doc.head.appendChild(s);
    });
    return libs[url];
  }
  function frame(root, title, note) {
    root.innerHTML = '';
    var head = el('div', 'tool-head');
    head.appendChild(text('b', '', title)); head.appendChild(text('span', 'tool-note', note || 'Runs in your browser. Nothing is uploaded.'));
    root.appendChild(head);
    var body = el('div', 'tool-body'); root.appendChild(body);
    return body;
  }
  function button(label, cls, fn) { var b = el('button', cls || 'tool-btn'); b.type = 'button'; b.textContent = label; if (fn) b.addEventListener('click', fn); return b; }
  function linkBtn(label, href) { var a = el('a', 'tool-btn'); a.textContent = label; a.href = href; a.target = '_blank'; a.rel = 'noopener'; return a; }
  function isDark() { return doc.documentElement.getAttribute('data-theme') === 'dark'; }

  /* ---------- 1. table generator ---------- */
  function tableTool(root) {
    var body = frame(root, 'Markdown table generator');
    var rows = [['Name', 'Role', 'Team'], ['Ada', 'Engineer', 'Core'], ['Lin', 'Designer', 'Product']], al = ['', '', ''];
    var AL = ['', 'l', 'c', 'r'], AL_LABEL = { '': 'Default', l: 'Left', c: 'Center', r: 'Right' };
    var left = el('div', 'tool-col'), right = el('div', 'tool-col');
    body.appendChild(left); body.appendChild(right);
    var bar = el('div', 'tool-bar'); left.appendChild(bar);
    var gridWrap = el('div', 'tool-scroll'); left.appendChild(gridWrap);
    var hint = text('p', 'tool-hint', 'Type in the grid, press Tab in the last cell for a new row, or paste rows from Excel or Google Sheets. Click an alignment button to cycle it.');
    left.appendChild(hint);
    var out = el('textarea', 'tool-out'); out.readOnly = true; out.rows = 7; out.setAttribute('aria-label', 'Markdown output'); out.spellcheck = false;
    var prevWrap = el('div', 'tool-preview md');
    var actions = el('div', 'tool-bar');
    var openA = linkBtn('Open in editor', '/#editor');
    actions.appendChild(button('Copy Markdown', 'tool-btn primary', function () { copy(out.value, function (ok) { flash(this, ok); }.bind(this)); }));
    actions.appendChild(openA);
    right.appendChild(text('p', 'tool-label', 'Markdown')); right.appendChild(out); right.appendChild(actions);
    right.appendChild(text('p', 'tool-label', 'Preview')); right.appendChild(prevWrap);

    function cols() { return rows[0].length; }
    function esc(c) { return String(c).replace(/\|/g, '\\|').replace(/\n/g, '<br>'); }
    function md() {
      var n = cols(), w = [];
      for (var c = 0; c < n; c++) { w[c] = 3; rows.forEach(function (r) { w[c] = Math.max(w[c], esc(r[c] || '').length); }); }
      function line(r) { return '| ' + r.map(function (v, c) { var s = esc(v || ''); var pad = w[c] - s.length; return al[c] === 'r' ? ' '.repeat(pad) + s : al[c] === 'c' ? ' '.repeat(Math.floor(pad / 2)) + s + ' '.repeat(Math.ceil(pad / 2)) : s + ' '.repeat(pad); }).join(' | ') + ' |'; }
      var sep = '| ' + w.map(function (x, c) { var d = '-'.repeat(x); if (al[c] === 'l') d = ':' + d.slice(1); else if (al[c] === 'r') d = d.slice(1) + ':'; else if (al[c] === 'c') d = ':' + d.slice(2) + ':'; return d; }).join(' | ') + ' |';
      return [line(rows[0]), sep].concat(rows.slice(1).map(line)).join('\n');
    }
    function update() {
      var m = md(); out.value = m; openA.href = editorLink(m + '\n', 'table.md');
      var t = el('table'), th = el('thead'), tb = el('tbody'); t.appendChild(th); t.appendChild(tb);
      rows.forEach(function (r, i) { var tr = el('tr'); r.forEach(function (v, c) { var cell = el(i ? 'td' : 'th'); cell.textContent = v; if (al[c]) cell.style.textAlign = { l: 'left', c: 'center', r: 'right' }[al[c]]; tr.appendChild(cell); }); (i ? tb : th).appendChild(tr); });
      prevWrap.innerHTML = ''; var box = el('div', 'tbl'); box.appendChild(t); prevWrap.appendChild(box);
    }
    function fill(r0, c0, data) {
      data.forEach(function (row, i) { while (rows.length <= r0 + i) rows.push(rows[0].map(function () { return ''; })); row.forEach(function (v, j) { var c = c0 + j; while (cols() <= c) { rows.forEach(function (r) { r.push(''); }); al.push(''); } rows[r0 + i][c] = v; }); });
    }
    function grid(focus) {
      gridWrap.innerHTML = '';
      var t = el('table', 'tool-grid'), h = el('tr');
      al.forEach(function (a, c) { var th = el('th'); var b = button(AL_LABEL[a], 'tool-al', function () { al[c] = AL[(AL.indexOf(al[c]) + 1) % 4]; grid(); update(); }); b.title = 'Column alignment: click to change'; th.appendChild(b); h.appendChild(th); });
      t.appendChild(h);
      rows.forEach(function (r, i) {
        var tr = el('tr');
        r.forEach(function (v, c) {
          var td = el('td'), inp = el('input', i ? '' : 'hd'); inp.value = v; inp.setAttribute('aria-label', (i ? 'Row ' + i : 'Header') + ', column ' + (c + 1)); inp.spellcheck = false;
          inp.addEventListener('input', function () { rows[i][c] = inp.value; update(); });
          inp.addEventListener('keydown', function (e) { if (e.key === 'Tab' && !e.shiftKey && i === rows.length - 1 && c === cols() - 1) { e.preventDefault(); rows.push(rows[0].map(function () { return ''; })); grid({ r: rows.length - 1, c: 0 }); update(); } });
          inp.addEventListener('paste', function (e) {
            var t = (e.clipboardData || window.clipboardData).getData('text');
            if (!/[\t\n]/.test(t)) return;
            e.preventDefault(); var data = t.replace(/\r/g, '').replace(/\n+$/, '').split('\n').map(function (l) { return l.split('\t'); });
            fill(i, c, data); grid({ r: i, c: c }); update();
          });
          td.appendChild(inp); tr.appendChild(td);
        });
        t.appendChild(tr);
      });
      gridWrap.appendChild(t);
      if (focus) { var ins = t.querySelectorAll('tr')[focus.r + 1].querySelectorAll('input')[focus.c]; if (ins) ins.focus(); }
    }
    bar.appendChild(button('+ Row', 'tool-btn', function () { rows.push(rows[0].map(function () { return ''; })); grid(); update(); }));
    bar.appendChild(button('+ Column', 'tool-btn', function () { rows.forEach(function (r) { r.push(''); }); al.push(''); grid(); update(); }));
    bar.appendChild(button('− Row', 'tool-btn', function () { if (rows.length > 2) { rows.pop(); grid(); update(); } }));
    bar.appendChild(button('− Column', 'tool-btn', function () { if (cols() > 1) { rows.forEach(function (r) { r.pop(); }); al.pop(); grid(); update(); } }));
    bar.appendChild(button('Clear', 'tool-btn', function () { rows = rows.map(function (r) { return r.map(function () { return ''; }); }); grid(); update(); }));
    grid(); update();
  }

  /* ---------- 2. math playground ---------- */
  function mathTool(root) {
    var body = frame(root, 'Try LaTeX math', 'Typeset with KaTeX in your browser. Nothing is uploaded.');
    var left = el('div', 'tool-col'), right = el('div', 'tool-col'); body.appendChild(left); body.appendChild(right);
    var STARTS = [['Fraction', '\\frac{a}{b}'], ['Sum', '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}'], ['Integral', '\\int_{0}^{1} x^2\\,dx = \\frac{1}{3}'], ['Matrix', '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'], ['Quadratic formula', 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'], ['Aligned steps', '\\begin{aligned}\n(a+b)^2 &= (a+b)(a+b) \\\\\n&= a^2 + 2ab + b^2\n\\end{aligned}'], ['Greek', '\\alpha + \\beta = \\gamma']];
    var chips = el('div', 'tool-chips'); left.appendChild(chips);
    var ta = el('textarea', 'tool-in'); ta.rows = 6; ta.spellcheck = false; ta.setAttribute('aria-label', 'LaTeX'); ta.value = STARTS[4][1]; left.appendChild(ta);
    var modeBar = el('div', 'tool-bar'); left.appendChild(modeBar);
    var display = true;
    var bInline = button('Inline', 'tool-seg'), bDisp = button('Display', 'tool-seg on');
    bInline.addEventListener('click', function () { display = false; sync(); }); bDisp.addEventListener('click', function () { display = true; sync(); });
    modeBar.appendChild(bInline); modeBar.appendChild(bDisp);
    modeBar.appendChild(button('Copy with dollar signs', 'tool-btn primary', function () { copy(wrapped(), function (ok) { flash(this, ok); }.bind(this)); }));
    var openA = linkBtn('Open in editor', '/#editor'); modeBar.appendChild(openA);
    right.appendChild(text('p', 'tool-label', 'Result'));
    var res = el('div', 'tool-result math-res'); right.appendChild(res);
    var err = el('p', 'tool-err'); err.hidden = true; right.appendChild(err);
    function wrapped() { var t = ta.value.trim(); return display ? '$$\n' + t + '\n$$' : '$' + t + '$'; }
    function draw() {
      if (!window.katex) { res.textContent = 'Loading…'; return; }
      var t = ta.value;
      try { window.katex.render(t, res, { displayMode: display, throwOnError: true, strict: 'ignore' }); err.hidden = true; }
      catch (e) { window.katex.render(t, res, { displayMode: display, throwOnError: false, strict: 'ignore' }); err.hidden = false; err.textContent = String(e.message || e).replace(/^KaTeX parse error: /, 'Error: '); }
      openA.href = editorLink(wrapped() + '\n', 'math.md');
    }
    function sync() { bInline.classList.toggle('on', !display); bDisp.classList.toggle('on', display); draw(); }
    STARTS.forEach(function (s) { chips.appendChild(button(s[0], 'tool-chip', function () { ta.value = s[1]; draw(); })); });
    ta.addEventListener('input', draw);
    lib('/vendor/katex/katex.min.js', function () { return !!window.katex; }).then(draw, function () { res.textContent = 'The math library could not load.'; });
  }

  /* ---------- 3. diagram playground ---------- */
  function diagramTool(root) {
    var body = frame(root, 'Try a Mermaid diagram', 'Drawn with Mermaid in your browser. Nothing is uploaded.');
    var left = el('div', 'tool-col'), right = el('div', 'tool-col'); body.appendChild(left); body.appendChild(right);
    var T = {
      Flowchart: 'flowchart LR\n  A[Write] --> B{Looks right?}\n  B -- Yes --> C[Export]\n  B -- No --> A',
      Sequence: 'sequenceDiagram\n  participant You\n  participant Editor\n  You->>Editor: Type Markdown\n  Editor-->>You: Live preview',
      Gantt: 'gantt\n  dateFormat YYYY-MM-DD\n  section Plan\n  Draft   :a1, 2026-11-02, 5d\n  Review  :after a1, 3d',
      Class: 'classDiagram\n  class Document {\n    +String title\n    +export()\n  }\n  Document <|-- Report',
      State: 'stateDiagram-v2\n  [*] --> Draft\n  Draft --> Review\n  Review --> Published\n  Published --> [*]',
      ER: 'erDiagram\n  AUTHOR ||--o{ POST : writes\n  POST { string title int id }',
      Pie: 'pie title Formats used\n  "PDF" : 45\n  "Word" : 30\n  "HTML" : 25',
      'Mind map': 'mindmap\n  root((Quilldown))\n    Write\n    Preview\n    Export'
    };
    var chips = el('div', 'tool-chips'); left.appendChild(chips);
    var ta = el('textarea', 'tool-in'); ta.rows = 9; ta.spellcheck = false; ta.setAttribute('aria-label', 'Mermaid code'); ta.value = T.Flowchart; left.appendChild(ta);
    var bar = el('div', 'tool-bar'); left.appendChild(bar);
    var light = !isDark();
    var bL = button('Light', 'tool-seg' + (light ? ' on' : '')), bD = button('Dark', 'tool-seg' + (light ? '' : ' on'));
    bL.addEventListener('click', function () { light = true; bL.classList.add('on'); bD.classList.remove('on'); draw(); }); bD.addEventListener('click', function () { light = false; bD.classList.add('on'); bL.classList.remove('on'); draw(); });
    bar.appendChild(bL); bar.appendChild(bD);
    bar.appendChild(button('Copy code', 'tool-btn primary', function () { copy('```mermaid\n' + ta.value.trim() + '\n```', function (ok) { flash(this, ok); }.bind(this)); }));
    var openA = linkBtn('Open in editor', '/#editor'); bar.appendChild(openA);
    right.appendChild(text('p', 'tool-label', 'Diagram'));
    var res = el('div', 'tool-result dia-res'); right.appendChild(res);
    var err = el('p', 'tool-err'); err.hidden = true; right.appendChild(err);
    var seq = 0, timer = 0, busy = Promise.resolve();
    function draw() {
      clearTimeout(timer); timer = setTimeout(function () {
        res.classList.toggle('dark', !light);
        busy = busy.then(function () {
          if (!window.mermaid) return;
          window.mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: light ? 'neutral' : 'dark', suppressErrorRendering: true, fontFamily: 'Nunito, system-ui, sans-serif' });
          var id = 'tool-mm' + (++seq);
          return window.mermaid.render(id, ta.value).then(function (r) { res.innerHTML = r.svg; err.hidden = true; }, function (e) { var d = doc.getElementById('d' + id); if (d) d.remove(); var x = doc.getElementById(id); if (x) x.remove(); err.hidden = false; err.textContent = 'Diagram error: ' + String((e && e.message) || e).split('\n').slice(0, 3).join(' '); });
        });
        openA.href = editorLink('```mermaid\n' + ta.value.trim() + '\n```\n', 'diagram.md');
      }, 350);
    }
    Object.keys(T).forEach(function (k) { chips.appendChild(button(k, 'tool-chip', function () { ta.value = T[k]; draw(); })); });
    ta.addEventListener('input', draw);
    res.textContent = 'Loading the diagram library…';
    setTimeout(function () { lib('/vendor/mermaid.min.js', function () { return !!window.mermaid; }).then(draw, function () { res.textContent = 'The diagram library could not load.'; }); }, 500);
  }

  /* ---------- 4. README generator ---------- */
  function readmeTool(root) {
    var body = frame(root, 'README generator', 'Builds the file in your browser. Nothing is uploaded.');
    var left = el('div', 'tool-col'), right = el('div', 'tool-col'); body.appendChild(left); body.appendChild(right);
    var st = { type: 'Library', name: 'project-name', desc: 'One sentence that says what this does and who it is for.', on: { badges: true, screenshot: true, features: true, start: true, config: true, roadmap: false, contributing: true, license: true } };
    var f1 = el('label', 'tool-field', '<span>Project name</span>'), i1 = el('input'); i1.value = st.name; i1.spellcheck = false; f1.appendChild(i1);
    var f2 = el('label', 'tool-field', '<span>One-line description</span>'), i2 = el('input'); i2.value = st.desc; f2.appendChild(i2);
    var f3 = el('div', 'tool-field', '<span>Project type</span>'), seg = el('div', 'tool-segs'); f3.appendChild(seg);
    ['Library', 'App', 'CLI', 'Data'].forEach(function (t) { var b = button(t, 'tool-seg' + (t === st.type ? ' on' : ''), function () { st.type = t; [].slice.call(seg.children).forEach(function (x) { x.classList.toggle('on', x === b); }); make(); }); seg.appendChild(b); });
    left.appendChild(f1); left.appendChild(f2); left.appendChild(f3);
    var opts = el('fieldset', 'tool-opts'); opts.appendChild(text('legend', '', 'Sections'));
    [['badges', 'Badges'], ['screenshot', 'Screenshot'], ['features', 'Features'], ['start', 'Quick start'], ['config', 'Configuration table'], ['roadmap', 'Roadmap'], ['contributing', 'Contributing'], ['license', 'License']].forEach(function (o) {
      var l = el('label', 'tool-check'), c = el('input'); c.type = 'checkbox'; c.checked = !!st.on[o[0]]; c.addEventListener('change', function () { st.on[o[0]] = c.checked; make(); });
      l.appendChild(c); l.appendChild(text('span', '', o[1])); opts.appendChild(l);
    });
    left.appendChild(opts);
    var out = el('textarea', 'tool-out'); out.readOnly = true; out.rows = 10; out.spellcheck = false; out.setAttribute('aria-label', 'README.md output');
    var bar = el('div', 'tool-bar'), openA = linkBtn('Open in editor', '/#editor');
    bar.appendChild(button('Copy README.md', 'tool-btn primary', function () { copy(out.value, function (ok) { flash(this, ok); }.bind(this)); }));
    bar.appendChild(button('Download', 'tool-btn', function () { var a = el('a'); a.href = URL.createObjectURL(new Blob([out.value], { type: 'text/markdown;charset=utf-8' })); a.download = 'README.md'; doc.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000); }));
    bar.appendChild(openA);
    var tabs = el('div', 'tool-bar'), bP = button('Preview', 'tool-seg on'), bS = button('Markdown', 'tool-seg');
    tabs.appendChild(bP); tabs.appendChild(bS);
    var prev = el('div', 'tool-preview md');
    right.appendChild(tabs); right.appendChild(prev); right.appendChild(out); right.appendChild(bar);
    out.hidden = true;
    bP.addEventListener('click', function () { bP.classList.add('on'); bS.classList.remove('on'); prev.hidden = false; out.hidden = true; });
    bS.addEventListener('click', function () { bS.classList.add('on'); bP.classList.remove('on'); prev.hidden = true; out.hidden = false; });

    var SETUP = {
      Library: { start: '```bash\nnpm install NAME\n```\n\n```js\nimport { greet } from \'NAME\';\n\nconsole.log(greet(\'Ada\'));\n// Hello, Ada!\n```', feat: ['Small and dependency-free', 'Works in Node and the browser', 'Fully typed'], cfg: [['name', 'string', '"world"', 'Who to greet'], ['loud', 'boolean', 'false', 'Shout the greeting']] },
      App: { start: 'Open the app, or run it locally:\n\n```bash\ngit clone https://github.com/your-name/NAME.git\ncd NAME\nnpm install\nnpm start\n```', feat: ['Works in any modern browser', 'No account needed', 'Your data stays on your device'], cfg: [['PORT', 'number', '3000', 'Port the app listens on'], ['DATA_DIR', 'string', '"./data"', 'Where files are stored']] },
      CLI: { start: '```bash\nnpm install --global NAME\nNAME --help\n```\n\n```bash\nNAME greet Ada --loud\n# HELLO, ADA!\n```', feat: ['One command, clear output', 'Works in scripts and pipelines', 'Helpful error messages'], cfg: [['--loud', 'flag', 'off', 'Shout the greeting'], ['--lang', 'string', '"en"', 'Language of the greeting']] },
      Data: { start: 'Load the data with any tool that reads CSV:\n\n```python\nimport pandas as pd\n\ndata = pd.read_csv("data.csv")\nprint(data.head())\n```', feat: ['Cleaned and documented', 'Source and license stated', 'Steps to reproduce the results'], cfg: [['date', 'string', '', 'Collection date (YYYY-MM-DD)'], ['value', 'number', '', 'The measured value']] }
    };
    function table(head, rows) { var w = head.map(function (h, i) { return Math.max(h.length, 3); }); return '| ' + head.join(' | ') + ' |\n| ' + w.map(function (n) { return '-'.repeat(n); }).join(' | ') + ' |\n' + rows.map(function (r) { return '| ' + r.map(function (c) { return c === '' ? ' ' : '`' + c + '`'; }).join(' | ') + ' |'; }).join('\n'); }
    function make() {
      var n = i1.value.trim() || 'project-name', d = i2.value.trim(), S = SETUP[st.type], o = st.on, p = [];
      p.push('# ' + n);
      if (o.badges) p.push('[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)');
      if (d) p.push('> ' + d);
      if (o.screenshot) p.push('![Screenshot of ' + n + ' showing the main screen](docs/screenshot.png)');
      if (o.features) p.push('## Features\n\n' + S.feat.map(function (x) { return '- ' + x; }).join('\n'));
      if (o.start) p.push('## Quick start\n\n' + S.start.split('NAME').join(n));
      if (o.config) p.push('## ' + (st.type === 'Data' ? 'Columns' : 'Configuration') + '\n\n' + (st.type === 'Data' ? table(['Column', 'Type', 'Default', 'Description'], S.cfg.map(function (r) { return r.concat(); })) : table(['Option', 'Type', 'Default', 'Description'], S.cfg)));
      if (o.roadmap) p.push('## Roadmap\n\n- [x] First release\n- [ ] Next feature\n- [ ] Documentation site');
      if (o.contributing) p.push('## Contributing\n\nBug reports and pull requests are welcome. Please open an issue before starting large changes.');
      if (o.license) p.push('## License\n\nReleased under the [MIT License](LICENSE).');
      var m = p.join('\n\n') + '\n';
      out.value = m; openA.href = editorLink(m, 'README.md');
      lib('/vendor/marked.min.js', function () { return !!window.marked; }).then(function () { return lib('/vendor/purify.min.js', function () { return !!window.DOMPurify; }); }).then(function () {
        var h = window.marked.parse(m, { gfm: true }); h = h.replace(/<(\/?)h([1-6])([ >])/g, function (x, sl, lv, e) { return sl ? '</div>' : '<div class="hd hd' + lv + '"' + (e === '>' ? '>' : ' '); });
        prev.innerHTML = window.DOMPurify.sanitize(h);
      }, function () { prev.textContent = m; });
    }
    i1.addEventListener('input', make); i2.addEventListener('input', make);
    make();
  }

  var BUILD = { table: tableTool, math: mathTool, diagram: diagramTool, readme: readmeTool };
  mounts.forEach(function (m) { var f = BUILD[m.getAttribute('data-tool')]; if (f) f(m); });
})();
