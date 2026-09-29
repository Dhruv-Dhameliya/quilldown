---
title: Math in Markdown — Write LaTeX Equations with KaTeX
h1: How to write math (LaTeX) in Markdown
short: Math in Markdown
card: Write equations with LaTeX and KaTeX: fractions, roots, sums, integrals, matrices and more.
description: Learn how to write math in Markdown with LaTeX and KaTeX: inline and block equations, fractions, sums, integrals, matrices and aligned equations, with live examples.
lead: Write beautiful equations in plain text. Wrap LaTeX in dollar signs and Quilldown typesets it instantly with KaTeX — inline in a sentence or as a centred block.
category: write
order: 7
math: true
published: 2026-09-29
updated: 2026-09-29
related: markdown-cheat-sheet, mermaid-diagrams-in-markdown, markdown-to-pdf
cta: Try an equation in the editor
ctaText: Type LaTeX between dollar signs and see it typeset live. The Math and ƒx toolbar buttons insert formulas for you.
---

## Inline and block math

Markdown itself has no math syntax, but most modern editors — including Quilldown — accept LaTeX between dollar signs and render it with **KaTeX**, a fast math typesetting library.

- **Inline math** goes between single dollar signs: `$E = mc^2$`.
- **Block math** goes between double dollar signs on their own lines and is centred.

````example title="Inline and block math"
Einstein's famous equation is $E = mc^2$, and the quadratic formula is:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
````

> [!TIP]
> Use the **Math** buttons in the toolbar for inline and block math, and the **ƒx** menu for ready-made fraction, sum, integral, quadratic-formula and matrix templates.

## Building blocks

### Superscripts, subscripts and Greek letters

````example title="Powers, indices and Greek letters"
$x^2$, $x_i$, $x_i^2$, $e^{i\pi} + 1 = 0$

$\alpha, \beta, \gamma, \theta, \lambda, \mu, \pi, \sigma, \omega$

$\Gamma, \Delta, \Sigma, \Omega$
````

### Fractions and roots

````example title="Fractions and roots"
$\frac{a}{b}$ and $\dfrac{1}{1 + \frac{1}{x}}$

$\sqrt{x}$, $\sqrt[3]{x}$, $\sqrt{a^2 + b^2}$
````

### Sums, products, limits and integrals

````example title="Sums, limits and integrals"
$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

$$\prod_{k=1}^{n} k = n!$$

$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$

$$\int_0^{\infty} e^{-x}\,dx = 1$$
````

### Matrices and cases

````example title="Matrices and piecewise functions"
$$
A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix},
\qquad
|x| = \begin{cases} x & x \ge 0 \\ -x & x < 0 \end{cases}
$$
````

### Aligned equations

Use the `aligned` environment and put `&` where the lines should line up.

````example title="Aligned steps"
$$
\begin{aligned}
(a + b)^2 &= a^2 + 2ab + b^2 \\
(a - b)^2 &= a^2 - 2ab + b^2
\end{aligned}
$$
````

### Text inside math

Wrap words in `\text{…}` so they aren't italicised like variables.

````example title="Words inside equations"
$$\text{Area} = \pi r^2 \quad \text{when } r = 3 \text{ cm}$$
````

## Handy symbol reference

| You want | Type | Result |
| --- | --- | --- |
| Not equal / approx. | `\ne`  `\approx` | $\ne$  $\approx$ |
| Less / greater or equal | `\le`  `\ge` | $\le$  $\ge$ |
| Plus or minus | `\pm` | $\pm$ |
| Infinity | `\infty` | $\infty$ |
| Arrows | `\to`  `\Rightarrow` | $\to$  $\Rightarrow$ |
| Set symbols | `\in`  `\subset`  `\cup`  `\cap` | $\in$  $\subset$  $\cup$  $\cap$ |
| Real numbers | `\mathbb{R}` | $\mathbb{R}$ |
| Vector / hat | `\vec{v}`  `\hat{x}` | $\vec{v}$  $\hat{x}$ |
| Dots | `\ldots`  `\cdots` | $\ldots$  $\cdots$ |

## Dollar signs and currency

Quilldown treats `$…$` as math only when it looks like math, so ordinary prices such as `$5 or $10` stay as text. If you ever need a literal dollar sign right before math, escape it with a backslash: `\$`.

## Math in exports

| Export | How equations appear |
| --- | --- |
| **PDF** | Typeset as MathML by the browser |
| **HTML** | MathML markup (no extra CSS needed) |
| **PNG image** | Rendered with KaTeX like the preview |
| **EPUB** | MathML |
| **Word (.docx)** | Included as the TeX source text — retype important equations with Word's equation editor |

## Frequently asked questions

### How do I write math in Markdown?

Put LaTeX between dollar signs: `$x^2$` for inline math or `$$ … $$` on separate lines for a centred block. Quilldown renders it live with KaTeX.

### What is the difference between KaTeX and MathJax?

Both typeset LaTeX in the browser. KaTeX is faster and covers the most commonly used commands; MathJax supports a wider range of obscure ones. For everyday equations the syntax is identical.

### Does Google Docs or Word support these equations?

Word's `.docx` export includes the equation as TeX text rather than a native equation, and Google Docs doesn't accept pasted MathML. For documents with important equations, share a [PDF](/guides/markdown-to-pdf) or an image.

### Why isn't my equation rendering?

Check for unbalanced braces `{ }`, a missing backslash before a command (`\frac`, not `frac`), or a stray dollar sign. Quilldown shows the source text in red when KaTeX can't parse it.

### Can I write chemistry formulas?

Simple formulas work with subscripts, for example `$H_2O$`. The specialised `\ce{}` chemistry extension isn't included.
