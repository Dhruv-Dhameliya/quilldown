/* Quilldown — document (preview) typography.
   Kept as a string so the same CSS is (a) injected into the page and (b) embedded in exported HTML/PDF,
   which works even when index.html is opened straight from disk. Uses only --md-*, --tok-*, --al-*, --font-* variables. */
(function () {
  var css = String.raw`
.md{font-family:var(--font-sans);font-size:16px;line-height:1.75;color:var(--md-text);overflow-wrap:break-word;word-wrap:break-word}
.md>*:first-child,.md>.blk:first-child>*:first-child{margin-top:0}
.md h1,.md h2,.md h3,.md h4,.md h5,.md h6{font-weight:650;line-height:1.28;letter-spacing:-.02em;margin:1.9em 0 .6em}
.md h1{font-size:2.2em;letter-spacing:-.035em;margin-top:0}
.md h2{font-size:1.6em;padding-bottom:.35em;border-bottom:1px solid var(--md-line);letter-spacing:-.028em}
.md h2.md-h1{font-size:2.2em;letter-spacing:-.035em;margin-top:0;padding-bottom:0;border-bottom:0}
.md .md-h{margin:1.2em 0 .5em;font-weight:650;line-height:1.28;letter-spacing:-.02em}
.md .md-h:first-child{margin-top:0}
.md .md-h1{font-size:2.1em;letter-spacing:-.035em}
.md .md-h2{font-size:1.55em;padding-bottom:.3em;border-bottom:1px solid var(--md-line)}
.md .md-h3{font-size:1.28em}.md .md-h4{font-size:1.08em}.md .md-h5{font-size:.98em}
.md .md-h6{font-size:.85em;text-transform:uppercase;letter-spacing:.06em;color:var(--md-muted)}
.md h3{font-size:1.3em}.md h4{font-size:1.08em}.md h5{font-size:.98em}
.md h6{font-size:.85em;color:var(--md-muted);text-transform:uppercase;letter-spacing:.06em}
.md p{margin:0 0 1.1em}
.md a{color:var(--md-link);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}
.md strong{font-weight:650}
.md ul,.md ol{margin:0 0 1.1em;padding-left:1.7em}
.md li{margin:.28em 0}.md li>p{margin:.4em 0}.md li>ul,.md li>ol{margin:.3em 0}
.md li:has(>input[type="checkbox"]){list-style:none}
.md li>input[type="checkbox"]{margin:0 .6em 0 -1.5em;vertical-align:-1px;accent-color:var(--md-link)}
.md blockquote{margin:0 0 1.1em;padding:.15em 1.1em;border-left:3px solid var(--md-line-strong);color:var(--md-muted)}
.md blockquote>:last-child{margin-bottom:.4em}
.md code{font-family:var(--font-mono);font-size:.86em;background:var(--md-code-bg);padding:.16em .42em;border-radius:6px}
.md pre{position:relative;margin:0 0 1.2em;padding:16px 18px;background:var(--md-pre-bg);border:1px solid var(--md-line);border-radius:12px;overflow:auto;font-size:13.5px;line-height:1.65;tab-size:2}
.md pre code{background:none;padding:0;border-radius:0;font-size:inherit;color:inherit}
.md pre[data-lang]::before{content:attr(data-lang);position:absolute;top:8px;right:12px;font:500 10.5px var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--tok-com)}
.md .code-copy{position:absolute;top:6px;right:8px;padding:3px 9px;border:1px solid var(--md-line);border-radius:7px;background:var(--md-pre-bg);color:var(--md-muted);font:500 11.5px var(--font-sans);opacity:0;transition:opacity .15s}
.md pre:hover .code-copy,.md .code-copy:focus-visible{opacity:1}
.md .code-copy.done{opacity:1;color:#16a34a;border-color:#16a34a}
.md pre:hover[data-lang]::before{opacity:0}
.md table{display:block;width:max-content;max-width:100%;overflow:auto;border-collapse:collapse;margin:0 0 1.2em;font-size:.95em}
.md th,.md td{padding:.55em .95em;border:1px solid var(--md-line);text-align:left}
.md th{background:var(--md-th-bg);font-weight:600}
.md tbody tr:nth-child(even) td{background:var(--md-stripe)}
.md hr{border:0;border-top:1px solid var(--md-line);margin:2.4em 0}
.md img{max-width:100%;height:auto;border-radius:10px}
.md mark{background:var(--md-mark);color:inherit;padding:.05em .28em;border-radius:4px}
.md kbd{font-family:var(--font-mono);font-size:.8em;padding:.12em .5em;border:1px solid var(--md-line-strong);border-bottom-width:2px;border-radius:6px;background:var(--md-pre-bg)}
.md details{margin:0 0 1.1em;padding:.7em 1.1em;border:1px solid var(--md-line);border-radius:12px}
.md details[open]>summary{margin-bottom:.6em}
.md summary{cursor:pointer;font-weight:600}
.md sub,.md sup{line-height:0}
.md .math-block{margin:1.3em 0;overflow-x:auto;overflow-y:hidden;text-align:center}
.md .katex-display{margin:0}
.md .mermaid-block{display:flex;justify-content:center;margin:1.4em 0;overflow:auto}
.md .mermaid-block svg{max-width:100%;height:auto}
.md .mermaid-loading{color:var(--md-muted);font-size:.85em;padding:1em}
.md .mermaid-error{width:100%;padding:.8em 1em;border:1px solid var(--al-caution);border-radius:10px;color:var(--al-caution);font:400 12.5px/1.6 var(--font-mono);white-space:pre-wrap}
.md sup.fn-ref{font-size:.72em;line-height:0;margin-left:1px}
.md sup.fn-ref a{text-decoration:none;font-weight:600}
.md .footnotes{margin-top:2.6em;font-size:.9em;color:var(--md-muted)}
.md .footnotes hr{margin:0 0 1.2em;width:40%}
.md .footnotes ol{margin:0;padding-left:1.5em}
.md .footnotes li{margin:.35em 0}
.md .footnotes .fn-back{text-decoration:none;margin-left:.3em}
.md img.img-missing{display:inline-block;min-width:120px;min-height:64px;padding:10px;border:1px dashed var(--md-line-strong);border-radius:10px;color:var(--md-muted);font-size:.85em;background:var(--md-pre-bg)}
.md .empty{color:var(--md-muted);text-align:center;padding:80px 0}
.md blockquote.alert{padding:.8em 1.1em;border-left-width:4px;border-radius:0 10px 10px 0;color:var(--md-text);background:var(--md-pre-bg);border-left-color:var(--al-note)}
.md blockquote.alert>p{margin-bottom:.5em}
.md .alert-title{font-weight:650;font-size:.92em;color:var(--al-note)}
.md .alert-tip{border-left-color:var(--al-tip)}.md .alert-tip .alert-title{color:var(--al-tip)}
.md .alert-important{border-left-color:var(--al-important)}.md .alert-important .alert-title{color:var(--al-important)}
.md .alert-warning{border-left-color:var(--al-warning)}.md .alert-warning .alert-title{color:var(--al-warning)}
.md .alert-caution{border-left-color:var(--al-caution)}.md .alert-caution .alert-title{color:var(--al-caution)}
.hljs-keyword,.hljs-selector-tag,.hljs-literal,.hljs-doctag,.hljs-name,.hljs-tag{color:var(--tok-kw)}
.hljs-string,.hljs-regexp,.hljs-addition{color:var(--tok-str)}
.hljs-number,.hljs-symbol,.hljs-bullet,.hljs-link{color:var(--tok-num)}
.hljs-comment,.hljs-quote,.hljs-meta{color:var(--tok-com);font-style:italic}
.hljs-title,.hljs-section,.hljs-selector-id,.hljs-selector-class{color:var(--tok-fn)}
.hljs-built_in,.hljs-type,.hljs-class .hljs-title,.hljs-title.class_{color:var(--tok-type)}
.hljs-attr,.hljs-attribute,.hljs-variable,.hljs-template-variable,.hljs-property,.hljs-params{color:var(--tok-attr)}
.hljs-deletion{color:var(--al-caution)}
.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}
`;
  window.QUILLDOWN_DOC_CSS = css;
  var el = document.createElement('style');
  el.id = 'md-css';
  el.textContent = css;
  document.head.appendChild(el);
})();
