/* Quilldown — the default document shown on first visit / "Sample document".
   A guided tour that exercises every feature of the editor. Keep it in sync with the toolbar. */
(function () {
  // A tiny inline image so the sample works offline; it lives in a reference at the bottom to keep the text tidy.
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="200" viewBox="0 0 640 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f46e5"/><stop offset="1" stop-color="#d946ef"/></linearGradient></defs><rect width="640" height="200" rx="18" fill="url(#g)"/><text x="320" y="112" font-family="Georgia,serif" font-style="italic" font-size="42" fill="#fff" text-anchor="middle">Images work too</text></svg>';
  var img = 'data:image/svg+xml;base64,' + btoa(svg);

  window.QUILLDOWN_SAMPLE = String.raw`# Quilldown feature tour

Write on the left, watch it **come alive** on the right. This document uses almost everything Quilldown can do — read it, poke at it, then delete it and write your own.

> [!TIP]
> Open **Export** for PDF, Word, PNG image, EPUB e-book, HTML, Markdown and plain text. Use **Copy for Docs** (on the preview pane) to paste into Google Docs with clean heading sizes. Press **Esc** to leave full screen and see the rest of the site.

## 1. Text formatting

**Bold**, _italic_, **_bold italic_**, <u>underline</u>, ~~strikethrough~~, ` + '`inline code`' + String.raw`, <mark>highlighted text</mark> and a <kbd>Ctrl</kbd> + <kbd>K</kbd> key combo. Chemistry gets subscripts (H<sub>2</sub>O) and physics gets superscripts (E = mc<sup>2</sup>).

Two trailing spaces make a line break,
so this sits on its own line. A backslash escapes characters: \*not italic\*.

<!-- This is a hidden comment: it never shows in the preview. -->

## 2. Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## 3. Lists

- Bullet lists
  - nest as deep as you like
    - like this
- Press <kbd>Enter</kbd> to continue a list, <kbd>Tab</kbd> to indent

1. Numbered lists
2. Renumber themselves
   1. Nested numbers
   2. Work too
3. Nice and tidy

- [ ] Write the draft
- [ ] Add a table of contents
- [ ] Proofread
- [ ] Publish

## 4. Links & images

Inline link: [Markdown guide](https://commonmark.org/help/). Bare URLs turn into links automatically: https://commonmark.org. Reference-style links keep prose tidy: [read the spec][spec]. Footnotes keep the main text clean too.[^tidy]

**Your own images:** paste a screenshot straight into the editor, drop an image file onto it, or use **Image → Upload**. Quilldown shrinks it, stores it inside this document and shows a short <code>img:</code> reference in the text.

![A gradient banner][banner]

## 5. Quotes & callouts

> "The best way to predict the future is to invent it."
>
> — Alan Kay
>
> > Quotes can nest, too.

> [!NOTE]
> Useful information that users should know, even when skimming.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

## 6. Code

Inline ` + '`code`' + String.raw` sits in a sentence. Fenced blocks get syntax highlighting and a copy button:

` + '```js' + String.raw`
// JavaScript
const greet = (name) => ` + '`Hello, ${name}!`' + String.raw`;
console.log(greet("Markdown"));
` + '```' + String.raw`

` + '```python' + String.raw`
# Python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fib(10)))
` + '```' + String.raw`

` + '```css' + String.raw`
/* CSS */
.card { display: grid; gap: 1rem; border-radius: 12px; }
` + '```' + String.raw`

` + '```bash' + String.raw`
# Shell
git commit -m "Write the docs" && git push
` + '```' + String.raw`

` + '```json' + String.raw`
{ "name": "quilldown", "private": true, "features": ["preview", "tabs", "export"] }
` + '```' + String.raw`

## 7. Tables

| Feature          | Shortcut   | Notes                 |
| :--------------- | :--------: | --------------------: |
| **Bold**         | Ctrl + B   | Toggles on and off    |
| _Italic_         | Ctrl + I   | Uses underscores      |
| ` + '`Inline code`' + String.raw`      | Ctrl + E   | Backticks             |
| [Link](https://commonmark.org) | Ctrl + K | Wraps your selection |

Left, center and right alignment come from the colons in the header divider. Click inside a table and press the **Table** button to edit it in a visual grid — or paste rows straight from a spreadsheet. 📋

## 8. Math

Inline math like $e^{i\pi} + 1 = 0$ sits naturally inside a sentence, and prices like $5 or $10 are left alone.

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

$$
\sum_{k=1}^{n} k = \frac{n(n+1)}{2} \qquad \text{and} \qquad x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}
$$

$$
A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}, \quad \det(A) = ad - bc
$$

## 9. Diagrams

` + '```mermaid' + String.raw`
flowchart LR
  A[Write] --> B{Looks good?}
  B -- Yes --> C[Copy or export]
  B -- No --> A
` + '```' + String.raw`

` + '```mermaid' + String.raw`
sequenceDiagram
  participant You
  participant Quilldown
  You->>Quilldown: Type Markdown
  Quilldown-->>You: Live preview
  You->>Quilldown: Export to Word
  Quilldown-->>You: report.docx
` + '```' + String.raw`

` + '```mermaid' + String.raw`
gantt
  title Launch plan
  dateFormat YYYY-MM-DD
  section Build
  Draft      :done,   a1, 2026-01-05, 5d
  Review     :active, a2, after a1, 4d
  section Ship
  Publish    :        a3, after a2, 2d
` + '```' + String.raw`

` + '```mermaid' + String.raw`
pie title Where the time goes
  "Writing" : 55
  "Editing" : 30
  "Formatting" : 5
  "Coffee" : 10
` + '```' + String.raw`

Class, state, ER and mind-map diagrams are in the **Diagram** menu too.

## 10. Layout helpers

<div align="center">

**A centered block** — handy for titles, badges and sign-offs.

</div>

<details>
<summary>A collapsible section (click me)</summary>

Great for FAQs, spoilers and long notes. Anything works in here — **formatting**, lists and even code:

- one
- two

</details>

---

## 11. Working with several documents

- Every document lives in a **tab** — open files, drag & drop several at once, or add a blank tab with **+**.
- Drag tabs to reorder, double-click a name to rename, middle-click to close (and **Undo** if you slip).
- Your tabs are saved in this browser, so they're waiting when you come back.
- **Find & replace** — press <kbd>Ctrl</kbd> + <kbd>F</kbd> (or <kbd>Ctrl</kbd> + <kbd>H</kbd> to replace). Match case, whole word and regular expressions are supported; every match is highlighted.
- **Outline** — the list icon in the top bar shows every heading of this document; click one to jump there.
- **Templates** — **New ▾ → Templates** opens a README, meeting notes, résumé, blog post, email, tables, to-do list or notes in a new tab.
- **Emoji** — the smiley button opens a searchable picker with skin tones and your recent picks. Or type a colon and a few letters (<code>:roc</code>) and press <kbd>Enter</kbd> to choose from suggestions; a completed shortcode turns into the emoji as you type the closing colon. 🎉
- **Files** — files you open with **Open** (Chrome / Edge) stay linked: a dot on the tab shows it, orange when unsaved, and <kbd>Ctrl</kbd> + <kbd>S</kbd> saves straight back. Installed as an app, Quilldown also shows up in your system’s “Open with” menu for .md files.
- **Offline** — once the site is hosted, Quilldown can be installed as an app and works without internet; the **Install** button appears when your browser allows it.
- **Share** — the **Share** button packs this document into a link (no upload, no account) that opens a copy in a new tab for anyone who has it.

## 12. Getting it out

| Need                    | Use                                            |
| ----------------------- | ---------------------------------------------- |
| Paste into Google Docs  | **Copy for Docs** (H1 23 · H2 17 · H3 14 · text 12 pt) |
| Paste rich text anywhere| **Copy** on the preview pane                   |
| Keep the source         | **Copy Markdown** on the editor pane           |
| A finished file         | **Export** → PDF, Word, PNG, EPUB, HTML, Markdown, text |

_That’s the tour. Select everything and make something of your own._

[^tidy]: Footnotes are numbered automatically and collected at the end of the page. Use the **[¹]** toolbar button to add one.

[spec]: https://spec.commonmark.org/
[banner]: __IMG__ "Generated banner"
`.replace('__IMG__', img);
})();
