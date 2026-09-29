---
title: Math in Markdown — Write LaTeX Equations with KaTeX
h1: How to write math (LaTeX) in Markdown
short: Math in Markdown
card: Equations with KaTeX.
description: Write math in Markdown with LaTeX and KaTeX: inline and display equations, matrices, aligned steps, currency dollar-sign fixes and common errors solved.
lead: Wrap LaTeX in single dollar signs for a formula inside a sentence, or double dollar signs for a centred equation, and Quilldown typesets it live with KaTeX. Here is the syntax, the traps and the fixes.
category: write
order: 8
math: true
published: 2026-09-29
updated: 2026-09-29
related: markdown-cheat-sheet, mermaid-diagrams-in-markdown, markdown-to-pdf
cta: Try an equation in the editor
ctaText: Type LaTeX between dollar signs and see it typeset live. The Math and ƒx toolbar buttons insert formulas for you.
---

## How to write math in Markdown

**Put LaTeX between dollar signs.** `$…$` makes an inline formula that sits inside a sentence. `$$…$$` on its own lines makes a centred display equation. Markdown has no built-in math syntax, so editors add it as an extension; Quilldown uses **KaTeX**, which typesets the formula as you type. GitHub and many other tools use the same dollar-sign convention, though the details differ (more on that below).

````example title="Inline and display math"
Einstein's equation is $E = mc^2$, and the quadratic formula is:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
````

> [!TIP]
> The toolbar has buttons for inserting math, which is handy when you can't remember how a command is spelled. Everything they insert is ordinary text you can edit afterwards.

New to the format itself? Start with [what Markdown is](/guides/what-is-markdown), then come back here.

## Inline or display: which should you use?

The two forms use the same LaTeX. The difference is layout.

| | Inline `$…$` | Display `$$…$$` |
| --- | --- | --- |
| **Where it sits** | Inside the sentence, on the text baseline | On its own line, centred |
| **Best for** | Variables, short expressions, units: "let $n$ be the sample size" | The key equation, anything long, anything the reader should study |
| **Sums, integrals, fractions** | Compressed to fit the line height, with limits beside the symbol | Full size, with limits above and below |
| **Line breaks** | None; a long formula overflows the line | Multi-line layouts with `aligned` |

A useful rule: if the reader needs to read the formula rather than glance at it, display it. The same expression looks quite different in each form:

````example title="Same formula, inline and display"
Inline, the sum $\sum_{i=1}^{n} i^2$ is squeezed to fit the line.

Displayed, it gets room for its limits:

$$
\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}
$$
````

Keep `$$` on lines of its own, with a blank line before and after, and no blank lines inside the block. That layout renders correctly in Quilldown and in stricter tools such as GitHub.

## Dollar signs and currency

Dollar signs are also how people write prices, which is the classic trap of this syntax. Quilldown only treats a pair of dollar signs as math when it looks like math:

- The opening `$` must be followed directly by a non-space character.
- The closing `$` must follow a non-space character and must not be followed by a digit.

| You write | Result | Why |
| --- | --- | --- |
| `Tickets cost $5 or $10.` | Plain text | The second `$` follows a space and precedes a digit |
| `The range is $5-$10.` | Plain text | The closing `$` is followed by a digit |
| `Let $ x $ be a number.` | Plain text | Spaces just inside the dollar signs |
| `Let $x$ be a number.` | Math | No spaces inside, no digit after |
| `Pay \$5 for $x^2$.` | Price, then math | `\$` is a literal dollar sign |

> [!WARNING]
> Other Markdown tools apply their own rules. If your document will be published somewhere else, put a backslash before every price (`\$5`) and never leave spaces inside math delimiters. That works everywhere.

## Powers, indices and Greek letters

Use `^` for superscripts and `_` for subscripts. **Wrap anything longer than one character in braces**, otherwise only the first character is affected: `x^10` prints an `x` with a superscript 1 followed by a 0, while `x^{10}` is what you meant.

````example title="Powers, indices and Greek letters"
$x^2$, $x_i$, $x_i^2$, $x^{10}$, $a_{ij}$, $e^{i\pi} + 1 = 0$

$\alpha, \beta, \gamma, \theta, \lambda, \mu, \pi, \sigma, \omega$

$\Gamma, \Delta, \Sigma, \Omega$
````

Greek letters are spelled out after a backslash. A lowercase name gives the lowercase letter and a capitalised name gives the capital (`\sigma` and `\Sigma`). A few capitals, such as Alpha and Beta, look identical to Latin letters, so LaTeX has no command for them; just type `A` and `B`.

## Fractions, roots and binomials

`\frac{numerator}{denominator}` builds a fraction. Inline, it shrinks; `\dfrac` forces the full-size version and `\tfrac` the compact one. Nest fractions freely, but a long stack is a sign to define a symbol instead.

````example title="Fractions, roots and binomials"
$\frac{a}{b}$, $\dfrac{a}{b}$, $\tfrac{a}{b}$

$$\frac{1}{1 + \frac{1}{x}}$$

$\sqrt{x}$, $\sqrt[3]{x}$, $\sqrt{a^2 + b^2}$, $\binom{n}{k}$
````

## Sums, products, limits and integrals

These are "big operators". Limits go after `_` and `^`. In display math they appear above and below the symbol; inline they move to the side to save vertical space.

````example title="Sums, limits and integrals"
$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

$$\prod_{k=1}^{n} k = n!$$

$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$

$$\int_0^{\infty} e^{-x}\,dx = 1$$
````

Two habits make these read properly. Put a thin space (`\,`) before the `dx` of an integral, and write function names as commands (`\sin`, `\log`, `\max`) so they are upright rather than italic products of letters.

## Matrices, vectors and piecewise functions

Matrices use an environment. Inside it, `&` separates columns and `\\` ends a row. The environment name sets the brackets:

| Environment | Brackets |
| --- | --- |
| `matrix` | None |
| `pmatrix` | Round `( )` |
| `bmatrix` | Square `[ ]` |
| `vmatrix` | Vertical bars, for determinants |
| `cases` | A left brace, for piecewise definitions |

````example title="Matrices and piecewise functions"
$$
A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix},
\qquad
\det A = \begin{vmatrix} 1 & 2 \\ 3 & 4 \end{vmatrix},
\qquad
|x| = \begin{cases} x & x \ge 0 \\ -x & x < 0 \end{cases}
$$
````

If you are building a grid of plain data rather than numbers in a matrix, a Markdown table is the better tool; see the [table generator guide](/guides/markdown-table-generator).

## Aligned, multi-line equations

To show a derivation, use `aligned` and put `&` right before the character each line should line up on, usually the `=` sign. End every line except the last with `\\`.

````example title="Aligned steps"
$$
\begin{aligned}
(a + b)^2 &= (a + b)(a + b) \\
          &= a^2 + ab + ba + b^2 \\
          &= a^2 + 2ab + b^2
\end{aligned}
$$
````

Blank space in the source is ignored by LaTeX, so pad it to keep the lines readable. Only the `&` matters.

## Text, spacing and units

Anything inside math is treated as a product of variables: letters are italic and spaces vanish. Wrap real words in `\text{…}`. Use `\mathrm{…}` for units and labels that should stay upright, and add spacing by hand where needed.

````example title="Words, units and spacing"
$$\text{Area} = \pi r^2 \quad \text{when } r = 3\ \text{cm}$$

$$v = 9.8\,\mathrm{m/s^2} \qquad \text{but } a b \text{ is not } a\;b$$
````

| Command | Space it adds |
| --- | --- |
| `\,` | A thin space, ideal before `dx` and between a number and its unit |
| `\:` | A medium space |
| `\;` | A thick space |
| `\quad` | About the width of the letter M |
| `\qquad` | Twice that |
| `\!` | A negative thin space that pulls symbols closer |

## Cheat table of common commands

| You want | Type | Result |
| --- | --- | --- |
| Multiply, divide | `\times` `\cdot` `\div` | $\times$ $\cdot$ $\div$ |
| Not equal, approximately | `\ne` `\approx` | $\ne$ $\approx$ |
| Less or equal, greater or equal | `\le` `\ge` | $\le$ $\ge$ |
| Plus or minus | `\pm` | $\pm$ |
| Infinity, partial, nabla | `\infty` `\partial` `\nabla` | $\infty$ $\partial$ $\nabla$ |
| Arrows | `\to` `\Rightarrow` `\iff` | $\to$ $\Rightarrow$ $\iff$ |
| Sets | `\in` `\subset` `\cup` `\cap` `\emptyset` | $\in$ $\subset$ $\cup$ $\cap$ $\emptyset$ |
| Logic | `\forall` `\exists` `\neg` | $\forall$ $\exists$ $\neg$ |
| Number sets | `\mathbb{R}` `\mathbb{N}` | $\mathbb{R}$ $\mathbb{N}$ |
| Bold vector, arrow, hat, bar | `\mathbf{v}` `\vec{v}` `\hat{x}` `\bar{x}` | $\mathbf{v}$ $\vec{v}$ $\hat{x}$ $\bar{x}$ |
| Scaling brackets | `\left( \frac{a}{b} \right)` | $\left( \frac{a}{b} \right)$ |
| Dots | `\ldots` `\cdots` `\vdots` | $\ldots$ $\cdots$ $\vdots$ |
| Percent sign, braces | `\%` `\{` `\}` | $\%$ $\{$ $\}$ |
| Function names | `\sin` `\log` `\max` | $\sin$ $\log$ $\max$ |

## Worked examples

Real formulas from statistics, calculus and linear algebra, ready to copy and adapt.

````example title="Bayes' theorem and the normal distribution"
$$
P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}
$$

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$
````

````example title="Definition of the derivative"
$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$
````

````example title="A linear system and a matrix product"
$$
\begin{cases}
2x + y = 5 \\
x - y = 1
\end{cases}
\quad\Rightarrow\quad x = 2,\; y = 1
$$

$$
\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}
\begin{pmatrix} x \\ y \end{pmatrix}
=
\begin{pmatrix} x + 2y \\ 3x + 4y \end{pmatrix}
$$
````

## Common errors and how to fix them

If KaTeX can't parse a formula, Quilldown shows the source text in red instead of a rendered equation. Match the symptom below.

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| The whole formula appears as red source | Unbalanced braces, as in `\frac{1}{2` | Count the `{` and `}`; each opener needs a closer |
| A single command is red | A typo, or a command KaTeX doesn't have | Check the spelling, or rebuild it from simpler commands |
| The command name prints as plain italic letters | A missing backslash, so `frac{1}{2}` is read as letters | Write `\frac{1}{2}` |
| `x^10` prints wrongly | Only one character follows the `^` | Use braces: `x^{10}` |
| Words look italic and run together | Letters treated as variables | Use `\text{speed limit}` |
| Error mentioning `&` | An `&` outside an environment | Use `&` only inside `aligned`, `cases` or a matrix |
| The rest of the line vanishes | An unescaped `%`, which starts a comment | Write `\%` |
| Error on an underscore inside `\text{}` | `_` is a subscript operator | Write `\_` or move the name out of `\text` |
| A price turns into math, or math stays as text | Spaces inside the dollar signs, or a digit after the closing one | Write `$x$`, not `$ x $`; escape prices as `\$5` |
| Equation breaks in another tool | A blank line inside a `$$` block | Remove blank lines between the delimiters |

> [!NOTE]
> If a command is red and you are sure it is valid LaTeX, it probably comes from a package. KaTeX implements a large subset of core math commands, not the package ecosystem.

## KaTeX, MathJax and full LaTeX

All three read the same core syntax for everyday equations, so what you write here usually carries over.

| | KaTeX | MathJax | Full LaTeX |
| --- | --- | --- | --- |
| **What it is** | A fast browser library for math | A browser library with wider coverage and configuration | A typesetting system for whole documents |
| **Scope** | Math-mode commands only | Math plus many extensions | Everything: packages, layout, citations, figures |
| **Speed in a live preview** | Very quick | Slower | Needs a compile step |
| **Best for** | Editors, notes, web pages | Pages that need rarer commands | Papers, theses, books |

Because a preview must update as you type, KaTeX's speed is the right trade for a Markdown editor. When you outgrow it, formulas usually paste into a LaTeX document inside `\[ … \]` or an `equation` environment, with only the occasional command to adjust.

## Math in exports

- **PDF.** Choose Export, then PDF. The browser's print dialog opens and you pick Save as PDF. Equations render as they do in the preview. See the [Markdown to PDF guide](/guides/markdown-to-pdf) for page-setup tips.
- **Word (.docx).** Equations are kept as the TeX source text, not as native Word equations. If a Word reader must edit an equation, retype it with Word's equation tool; if they only need to read it, send the PDF. The [Markdown to Word guide](/guides/markdown-to-word) covers the rest of that export.

For the full list of syntax you can mix with math, see the [Markdown cheat sheet](/guides/markdown-cheat-sheet). To add flowcharts and other pictures beside your equations, read the [Mermaid diagrams guide](/guides/mermaid-diagrams-in-markdown).

## Frequently asked questions

### How do I write math in Markdown?

Put LaTeX between dollar signs: `$x^2$` for an inline formula, or `$$ … $$` on separate lines for a centred display equation. In Quilldown the result is typeset live with KaTeX as you type. The same convention works in many other Markdown tools, although support varies.

### How do I show a dollar sign without starting math?

Put a backslash in front of it, as in `\$5`. Quilldown also leaves ordinary prices such as `$5 or $10` as text, because a closing dollar sign that follows a space or precedes a digit does not end a formula. In documents that will be published elsewhere, escaping every price is the safest habit.

### What is the difference between KaTeX and MathJax?

Both typeset LaTeX math in the browser. KaTeX is faster and covers the commonly used math commands, while MathJax supports a wider range of rare commands and configuration. For everyday equations the syntax is identical.

### Why isn't my equation rendering?

The usual causes are unbalanced braces, a misspelled command, a stray `&` outside an environment, or spaces just inside the dollar signs. A missing backslash (`frac` instead of `\frac`) doesn't fail at all; the name just prints as plain letters. Quilldown shows the source text in red when KaTeX can't parse a formula, which helps you find the spot. The error table above lists the common cases with fixes.

### Do equations survive export to PDF and Word?

Equations render in a [PDF export](/guides/markdown-to-pdf) just as they appear in the preview. In a [Word export](/guides/markdown-to-word) they are kept as TeX source text rather than native Word equations, so retype any equation that a colleague needs to edit.

### Can I write chemistry formulas?

Simple formulas work with subscripts, for example `$H_2O$`. Use `\text{}` or `\mathrm{}` for element symbols if you want them upright. The specialised `\ce{}` chemistry extension isn't included.
