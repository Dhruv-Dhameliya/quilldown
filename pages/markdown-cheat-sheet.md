---
title: Markdown Cheat Sheet: Basic and Extended Syntax, Live Examples
h1: Markdown cheat sheet
h1em: cheat sheet
short: Markdown cheat sheet
card: Every syntax, with live examples.
description: A complete Markdown cheat sheet with live examples for headings, lists, links, tables, code, footnotes, math and diagrams, plus fixes for common problems.
lead: A complete Markdown reference with a live example for every syntax, the rules that trip people up, and a fix for each common problem. Every example opens in the editor with one click. New to Markdown? Start with what Markdown is.
category: learn
order: 2
home: true
math: true
published: 2026-09-29
updated: 2026-09-30
scripts: /js/cheat.js
copymd: true
related: what-is-markdown, markdown-table-generator, emoji-in-markdown
cta: Try any example in the editor
ctaText: Every example on this page has an "Open in editor" button. Or start from a blank document. The preview updates as you type.
---

<div class="cs-tools"><label class="docs-search cs-search" for="csSearch"><svg class="i"><use href="#i-search"/></svg><input type="search" id="csSearch" placeholder="Search the cheat sheet (press / to focus)" aria-label="Search the cheat sheet" autocomplete="off" spellcheck="false"><kbd>/</kbd></label><div class="cs-actions"><button type="button" id="csPrint">Print the one-page PDF</button><button type="button" id="csCopyMd">Copy the whole cheat sheet as Markdown</button></div></div>

<div class="cs-jump"><b>What do you need to do?</b><a href="#tables">Make a table</a><a href="#task-lists">Add a task list</a><a href="#code">Write a code block</a><a href="#paragraphs-and-line-breaks">Add a line break</a><a href="#links">Link to a heading</a><a href="#math">Add math</a><a href="#diagrams">Draw a diagram</a><a href="#things-markdown-cant-do-and-what-to-do-instead">Center or color text</a><a href="#common-problems-and-fixes">Fix a problem</a></div>

> [!TIP]
> **How to use this cheat sheet.** Basic syntax works in almost every Markdown tool. Extended syntax, such as tables, footnotes, math and diagrams, depends on the tool you're writing for, so check "What works where" before you publish somewhere new. Each example has an "Open in editor" button that opens it in a new tab.

## Syntax at a glance

Everything on this page in one table. Click any syntax to copy it. The sections below explain each row with an example and the edge cases that cause most "why doesn't this work?" moments.

| Element | Markdown syntax | Details |
| --- | --- | --- |
| Heading | `# H1`  `## H2`  `### H3` … up to `######` | <span class="tag-b">Basic</span> [Headings](#headings) |
| Bold | `**bold text**` | <span class="tag-b">Basic</span> [Emphasis](#bold-italic-and-strikethrough) |
| Italic | `*italic text*` or `_italic text_` | <span class="tag-b">Basic</span> [Emphasis](#bold-italic-and-strikethrough) |
| Bold and italic | `***both***` | <span class="tag-b">Basic</span> [Emphasis](#bold-italic-and-strikethrough) |
| Strikethrough | `~~struck~~` | <span class="tag-x">Extended</span> [Emphasis](#bold-italic-and-strikethrough) |
| Blockquote | `> quoted text` | <span class="tag-b">Basic</span> [Blockquotes](#blockquotes) |
| Ordered list | `1. First` `2. Second` | <span class="tag-b">Basic</span> [Lists](#lists) |
| Unordered list | `- Item` (or `*` or `+`) | <span class="tag-b">Basic</span> [Lists](#lists) |
| Task list | `- [x] Done` `- [ ] To do` | <span class="tag-x">Extended</span> [Task lists](#task-lists) |
| Inline code | `` `code` `` | <span class="tag-b">Basic</span> [Code](#code) |
| Code block | ` ``` ` on its own line, before and after | <span class="tag-b">Basic</span> [Code](#code) |
| Horizontal rule | `---` | <span class="tag-b">Basic</span> [Horizontal rules](#horizontal-rules) |
| Link | `[title](https://example.com)` | <span class="tag-b">Basic</span> [Links](#links) |
| Image | `![alt text](image.jpg)` | <span class="tag-b">Basic</span> [Images](#images) |
| Table | `\| A \| B \|` with a `\| --- \| --- \|` row | <span class="tag-x">Extended</span> [Tables](#tables) |
| Footnote | `text[^1]` and `[^1]: note` | <span class="tag-x">Extended</span> [Footnotes](#footnotes) |
| Hard line break | two trailing spaces, or `\` at the end of the line | <span class="tag-b">Basic</span> [Line breaks](#paragraphs-and-line-breaks) |
| Escape a symbol | `\*` `\#` `\_` | <span class="tag-b">Basic</span> [Escaping](#escaping-and-comments) |
| Comment | `<!-- hidden -->` | <span class="tag-b">Basic</span> [Escaping and comments](#escaping-and-comments) |
| Math | `$x^2$` inline, `$$ … $$` block | <span class="tag-x">Extended</span> [Math](#math) |
| Diagram | a fenced block tagged `mermaid` | <span class="tag-x">Extended</span> [Diagrams](#diagrams) |
| Callout | `> [!NOTE]` then the text on the next line | <span class="tag-x">Extended</span> [Callouts](#callouts-alerts) |
| Emoji | `:tada:` | <span class="tag-x">Extended</span> [Emoji](#emoji) |

<div class="group-bar" id="basic-syntax" data-title="Basic syntax"><b>Basic syntax</b><span>These work in almost every Markdown tool.</span></div>

## Headings

Start a line with one to six `#` characters followed by a space. One `#` is the top-level title; more `#` mean smaller headings. There is also an older underline style, which only covers the top two levels.

````example title="Heading levels"
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
````

````example title="Underline style (levels 1 and 2 only)"
Title with equals signs
=======================

Subtitle with hyphens
---------------------
````

> [!TIP]
> Use one `#` heading per document as the title, then `##` for sections, and do not skip levels. It keeps your outline clean and your table of contents useful. Put a blank line above and below every heading.

## Paragraphs and line breaks

Separate paragraphs with a blank line. A single new line inside a paragraph is treated as a space. To force a line break, end the line with **two spaces** or a backslash.

````example title="Paragraphs and line breaks"
This is the first paragraph.

This is the second paragraph.

Roses are red,\
violets are blue.
````

> [!WARNING]
> Trailing spaces are invisible and many editors strip them on save, which silently removes your line break. The backslash is easier to see and survives. A few places, such as GitHub issue comments, turn every new line into a break, but do not rely on that in files.

## Bold, italic and strikethrough

Bold and italic are basic syntax. Strikethrough is a small GitHub extension <span class="ext-tag">Extension</span> that most tools now support.

````example title="Emphasis"
**Bold** with asterisks, __bold__ with underscores.

*Italic* with asterisks, _italic_ with underscores.

***Bold and italic*** together.

~~Strikethrough~~ for deleted text.

Mid-word emphasis: un**believ**able.
Underscores inside words stay literal: snake_case_name.
````

Asterisks work everywhere, including inside a word. Underscores are ignored inside words, which is why identifiers such as `snake_case_name` do not turn italic. The opening symbol must touch the text: `** bold **` with spaces inside does not work.

## Blockquotes

Start each line with `>`. Add more `>` to nest quotes, and use other Markdown inside them.

````example title="Blockquote"
> Markdown is intended to be as easy-to-read and easy-to-write as is feasible.
>
> John Gruber
>
> > Quotes can be nested.
````

## Lists

### Unordered lists

Use `-`, `*` or `+`. Nest an item by indenting it under the text of its parent. Two spaces work for `-` bullets.

````example title="Bullet list with nesting"
- Fruit
  - Apples
  - Pears
- Vegetables
- Bread
````

Pick one marker per list. In CommonMark, switching from `-` to `*` starts a new, separate list.

### Ordered lists

Only the first number matters. The list counts up from it, so you can start at any number, and you never have to renumber after inserting an item.

````example title="Numbered list"
1. Mix the ingredients
2. Bake for 20 minutes
   1. Check after 15
   2. Rotate the tray
3. Let it cool
````

````example title="Starting at 5, ignoring later numbers"
5. Starts at five
1. Rendered as six
1. Rendered as seven
````

The rule for nesting is to line the child up with the first character of the parent's text. After `1. ` that is three spaces, after `- ` it is two. Nesting a bullet under a numbered item with only two spaces makes it a separate list.

### Paragraphs and code inside list items

Indent the extra content to the same column as the item's text and separate it with blank lines.

`````example title="Multiple blocks in one list item"
1. Install the dependencies:

   ```bash
   npm install
   ```

2. Start the app.

   Open the address it prints.
`````

### Task lists

Task lists come from GitHub Flavored Markdown <span class="ext-tag">Extension</span>. The box is `[ ]` with a space inside, or `[x]`, and it needs a space after the closing bracket.

````example title="Task list"
- [x] Write the outline
- [x] Draft the introduction
- [ ] Add examples
- [ ] Proofread
````

## Code

Wrap short code in single backticks. For a block, put three backticks on their own lines and add the language after the opening fence for syntax highlighting. Tildes (`~~~`) work as a fence too, and so does indenting every line by four spaces, though fences are clearer.

````example title="Inline code and a fenced block"
Run `npm install` to get started.

```js
function greet(name) {
  return `Hello, ${name}!`;
}
```
````

To show backticks *inside* inline code, wrap the code in double backticks with a space on each side. To show a fenced block *inside* a fenced block, make the outer fence longer, four backticks against three.

``````example title="Backticks inside code"
`` `literal backticks` ``

`````
```
a fence shown as text
```
`````
``````

> [!NOTE]
> The closing fence must be at least as long as the opening one. If a code block swallows the rest of your document, a missing or shorter closing fence is almost always the reason.

## Links

````example title="Links"
[Inline link](https://commonmark.org "Optional title")

[Reference-style link][spec]

Bare address: <https://commonmark.org>

[Jump to a heading](#headings)

[File name with spaces](<my notes.md>)

[spec]: https://spec.commonmark.org/
````

Reference-style links keep long URLs out of your sentences, and the definition can sit anywhere in the file. Heading links (`#headings`) use an anchor the renderer generates from the heading text. The usual rule is lowercase with hyphens instead of spaces and most punctuation removed, but the exact result depends on the tool. If an address contains spaces, wrap it in `<...>` or write `%20`. GitHub Flavored Markdown also turns bare `https://` addresses into links automatically, and `<address>` is the explicit form that works everywhere.

## Images

An image is a link with a leading `!`. The text in brackets is the *alt text*, which screen readers read aloud and search engines index, so always write something meaningful.

````example title="Image syntax"
![A gradient banner](banner.png "Optional title")

Make an image clickable by wrapping it in a link:

[![Logo](logo.png)](https://example.com)
````

Markdown has no syntax for image size or alignment. Where HTML is allowed, an `<img src="logo.png" width="120" alt="Logo">` tag is the usual workaround. In Quilldown you can also paste, drop or upload an image straight into the editor, and it is stored with the document. See the [feature overview](/features).

## Horizontal rules

Three or more hyphens, asterisks or underscores on their own line make a divider.

````example title="Horizontal rule"
Above the line

---

Below the line
````

Leave a blank line above `---`. Directly under a line of text it turns that text into a level-2 heading instead of drawing a line.

<div class="group-bar" id="extended-syntax" data-title="Extended syntax"><b>Extended syntax</b><span>These work in GitHub Flavored Markdown and in many tools, but check yours.</span></div>

## Tables

Separate columns with pipes and add a row of hyphens under the header. Colons in that row set alignment: left, centered or right. Tables come from GitHub Flavored Markdown, and there is a full walkthrough in the [Markdown table guide](/docs/markdown-table-generator).

````example title="Table with alignment"
| Item     | Qty |  Price |
| :------- | :-: | -----: |
| Notebook |  2  |   4.50 |
| Pen      | 10  |   1.20 |
````

A few rules keep tables from breaking:

- The header row and the separator row must have the same number of columns, or the table is not recognized at all.
- Cells hold inline Markdown only: bold, links, code, images. Lists and paragraphs do not work inside a cell. Use `<br>` to force a line break within one.
- To put a literal pipe in a cell, escape it with a backslash before the pipe.
- Aligning the pipes in your source is optional and only makes the source easier to read.

````example title="Formatting and line breaks inside cells"
| Command | What it does |
| --- | --- |
| `git status` | Shows **changed** files |
| `a \| b` | A pipe inside code |
| Two lines | First line<br>Second line |
````

## Footnotes

Add a marker in the text and define the note anywhere in the document. Footnotes are numbered automatically and collected at the bottom. They are an extension, not part of the CommonMark or GFM specifications, so check that your target supports them.

````example title="Footnotes"
Markdown was released in 2004.[^1] It is now everywhere.[^2]

[^1]: Created by John Gruber, with contributions from Aaron Swartz.
[^2]: From READMEs to documentation sites and note apps.
````

## Math

Wrap LaTeX in single dollar signs for inline math and double for a block. Learn more in [math in Markdown](/docs/math-in-markdown).

````example title="Inline and block math"
The area of a circle is $A = \pi r^2$.

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$
````

In Quilldown, inline math needs no space just inside the dollar signs: `$x^2$` is math, `$ x^2 $` is not. If a paragraph mixes prices and math, escape the price as `\$5`.

## Diagrams

Put Mermaid code in a fenced block tagged `mermaid` and supporting editors draw it as a diagram. Quilldown renders it live. See [diagrams in Markdown](/docs/diagrams-in-markdown) for every diagram type.

````example title="Mermaid flowchart source"
```mermaid
flowchart LR
  A[Write] --> B[Preview] --> C[Export]
```
````

## Callouts (alerts)

Start a blockquote with `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` or `[!CAUTION]` to get a highlighted box. The marker goes alone on the first line, and the text follows on the next.

````example title="Callouts"
> [!NOTE]
> Useful information, even when skimming.

> [!WARNING]
> Urgent info that needs attention.
````

A tool that does not understand callouts shows them as an ordinary blockquote that begins with the literal text `[!NOTE]`. The content is still readable, which makes them a safe choice.

## Emoji

Type an emoji shortcode between colons. In Quilldown, typing a colon and the first letters, such as `:roc`, opens an autocomplete list. See the full [emoji shortcode list](/docs/emoji-in-markdown).

````example title="Emoji shortcodes"
Ship it :rocket: and celebrate :tada:
````

## HTML inside Markdown

When Markdown has no syntax for what you need, you can mix in HTML. Many platforms sanitize it, so tags such as `<script>` and inline styles are often removed.

````example title="Useful HTML tags"
Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.

H<sub>2</sub>O and E = mc<sup>2</sup>, with <mark>highlighted</mark> and <u>underlined</u> text.

<details>
<summary>Click to expand</summary>

Hidden content, with **Markdown** still working inside.

</details>
````

Leave a blank line after the `</summary>` line (as above) if you want Markdown inside a `<details>` block to render.

<div class="group-bar" id="reference" data-title="Reference"><b>Reference</b><span>Escapes, limits, support tables and fixes.</span></div>

## Escaping and comments

Put a backslash before a symbol to show it literally. Comments are invisible in the rendered result but still visible to anyone who reads the source, so keep secrets out of them.

````example title="Escapes and comments"
\*Not italic\* and \# not a heading.

<!-- This comment does not appear in the preview. -->

Visible text.
````

Symbols worth escaping when you mean them literally:

| Character | When it causes trouble |
| --- | --- |
| `*` and `_` | Wrapped around text, they become emphasis |
| `#` | At the start of a line, it becomes a heading |
| `-`, `+` and `1.` | At the start of a line, they become list items |
| `>` | At the start of a line, it becomes a quote |
| `` ` `` | Pairs up into inline code |
| `[` and `]` | With parentheses after them, they form a link |
| <code>&#124;</code> | Inside a table row, it splits the cell |
| `$` | Around text with no spaces, it can form math |

## Things Markdown can't do, and what to do instead

Markdown describes structure, not appearance, so it has no syntax for a few things people often ask about. For most of them the answer is a small piece of raw HTML, which works only where the tool allows HTML. Many platforms strip inline styles and some tags, so test in the place you're publishing.

| What you want | What to use | Notes |
| --- | --- | --- |
| Text color | <span class="tag-n">No syntax</span> | A styled HTML tag can work, but many platforms strip inline styles |
| Centered text | <span class="tag-h">HTML needed</span> `<div align="center">` | GitHub honors it, but check how your target treats HTML |
| Underline | <span class="tag-h">HTML needed</span> `<u>text</u>` | In Quilldown, use the toolbar or Ctrl+U |
| Highlight | <span class="tag-h">HTML needed</span> `<mark>text</mark>` | Also a toolbar button |
| Superscript and subscript | <span class="tag-h">HTML needed</span> `<sup>2</sup>` and `<sub>2</sub>` | Also toolbar buttons |
| Keyboard key | <span class="tag-h">HTML needed</span> `<kbd>Ctrl</kbd>` | Also a toolbar button |
| Image size | <span class="tag-h">HTML needed</span> `<img src="logo.png" width="120" alt="Logo">` | No Markdown syntax for size or alignment |
| Collapsible section | <span class="tag-h">HTML needed</span> `<details>` with a `<summary>` line | Leave a blank line after the summary line so Markdown inside renders |
| Comment | <span class="tag-h">HTML needed</span> `<!-- hidden -->` | Invisible when rendered, but visible in the source |
| Line break inside a table cell | <span class="tag-h">HTML needed</span> `<br>` | Cells hold inline Markdown only |
| Page break | <span class="tag-n">No syntax</span> | Use your export target's settings, such as the print dialog when you convert Markdown to PDF |

In Quilldown, most of these are one-click toolbar snippets: underline, highlight, superscript, subscript, keyboard key, collapsible section, centered block and hidden comment. See the guides on [Markdown to PDF](/docs/markdown-to-pdf) and [Markdown to HTML](/docs/markdown-to-html) for what happens to raw HTML on export.

## What works where

The core syntax works everywhere. The rest depends on the dialect, so check this before you publish somewhere new.

| Feature | Core CommonMark | GFM specification | GitHub.com | Quilldown |
| --- | --- | --- | --- | --- |
| Headings, emphasis, lists, links, images, code, quotes | <span class="ok">Yes</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> |
| Tables | <span class="no">No</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> |
| Task lists | <span class="no">No</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> |
| Strikethrough | <span class="no">No</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> |
| Footnotes | <span class="no">No</span> | <span class="na">Not in the spec</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> |
| Math (`$…$`) | <span class="no">No</span> | <span class="na">Not in the spec</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> |
| Mermaid diagrams | <span class="no">No</span> | <span class="na">Not in the spec</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> |
| Callouts (`> [!NOTE]`) | <span class="no">No</span> | <span class="na">Not in the spec</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> |
| Emoji shortcodes | <span class="no">No</span> | <span class="na">Not in the spec</span> | <span class="ok">Yes</span> | <span class="ok">Yes</span> |

The GFM specification defines only tables, task lists, strikethrough and autolinks on top of CommonMark. GitHub.com adds further features of its own, and other platforms differ again, so test where you publish. "Not in the spec" means the written specification does not define it. For the background on these dialects, read [what Markdown is](/docs/what-is-markdown).

## Common problems and fixes

Open a row to see the broken source, the fixed source, and how each one renders.

````fix title="Heading shows # characters" fix="Add a space after the #."
#Heading
---fixed---
# Heading
````

````fix title="List renders as one paragraph" fix="Add a blank line before the list."
Shopping:
- Apples
- Pears
---fixed---
Shopping:

- Apples
- Pears
````

````fix title="Line break is ignored" fix="End the line with two spaces or a backslash."
Roses are red,
violets are blue.
---fixed---
Roses are red,\
violets are blue.
````

````fix title="Table does not render" fix="Make sure the --- separator row is present and has the same number of columns as the header."
| Name | Role |
| Ada | Engineer |
---fixed---
| Name | Role |
| --- | --- |
| Ada | Engineer |
````

````fix title="A pipe splits a table cell" fix="Escape it with a backslash before the pipe."
| Command | Meaning |
| --- | --- |
| a | b | pipe |
---fixed---
| Command | Meaning |
| --- | --- |
| a \| b | pipe |
````

````fix title="A * or _ makes text italic by accident" fix="Escape it with a backslash."
2 * 3 * 4 and *1
---fixed---
2 \* 3 \* 4 and \*1
````

````fix title="Nested list does not indent" fix="Line the child up with the first character of the parent's text: two spaces after - and three after 1."
1. Step one
  - Detail
---fixed---
1. Step one
   - Detail
````

````fix title="A code block never ends" fix="The closing fence is missing or shorter than the opening one."
Some text

~~~~
code
~~~
---fixed---
Some text

~~~~
code
~~~~
````

````fix title="Text above --- became a big heading" fix="Leave a blank line above the rule."
Some text
---
---fixed---
Some text

---
````

````fix title="Markdown inside an HTML block is not rendered" fix="Leave a blank line after the opening tag."
<details>
<summary>More</summary>
**Bold** text
</details>
---fixed---
<details>
<summary>More</summary>

**Bold** text

</details>
````

````fix title="A price like $5 turns into math" fix="Escape the dollar sign."
It costs $5 or $6.
---fixed---
It costs \$5 or \$6.
````

````fix title="Footnote appears as plain text" fix="Check that the marker and the [^1]: definition use the same label."
Text.[^1]

[^one]: The note.
---fixed---
Text.[^1]

[^1]: The note.
````

## Write faster in Quilldown

The toolbar inserts the right syntax with one click, and the shortcuts work in the editor. Ctrl+F opens find and Ctrl+H opens replace. For tables, the visual Table editor lets you build, edit or convert a table and paste one from Excel or Google Sheets, so you never align pipes by hand.

<ul class="faq-keys"><li><span>Bold</span><span><kbd>Ctrl</kbd><kbd>B</kbd></span></li><li><span>Italic</span><span><kbd>Ctrl</kbd><kbd>I</kbd></span></li><li><span>Inline code</span><span><kbd>Ctrl</kbd><kbd>E</kbd></span></li><li><span>Link</span><span><kbd>Ctrl</kbd><kbd>K</kbd></span></li><li><span>Find</span><span><kbd>Ctrl</kbd><kbd>F</kbd></span></li><li><span>Replace</span><span><kbd>Ctrl</kbd><kbd>H</kbd></span></li></ul>

## Frequently asked questions

### What is the difference between `*` and `_` for italics?

They are interchangeable for whole words. Use asterisks when you want to italicize *part* of a word, because underscores inside words are usually ignored, which also keeps names like `snake_case_name` intact.

### How do I make text a different color in Markdown?

Markdown has no color syntax. If your tool allows raw HTML you can use a styled tag, but many platforms strip inline styles. Formatting like color is deliberately outside Markdown's scope, and that is what keeps the files portable.

### How do I add a page break or center text?

Neither has Markdown syntax. Many renderers, including GitHub, honor `<div align="center">` for centering, but check how your target treats HTML. For page breaks, use your export target's settings, such as the print dialog when you [convert Markdown to PDF](/docs/markdown-to-pdf).

### How do I show backticks or a code fence inside code?

For inline code, wrap it in double backticks and put a space inside each end. For a fenced block that contains another fence, use four backticks on the outside and three on the inside. The outer fence just has to be longer than any fence inside it.

### Does every Markdown editor support tables, task lists and footnotes?

Tables, task lists and strikethrough come from GitHub Flavored Markdown and are widely supported. Footnotes, math, diagrams and callouts are extensions, so support varies. Quilldown supports all of them.

### How do I create a line break without starting a new paragraph?

End the line with two spaces or with a backslash, or write `<br>`. The backslash is the most reliable because editors often strip trailing spaces.

### Where can I practice?

Open the [Quilldown editor](/), press **New → Sample document** for a guided tour, or use the **Open in editor** button on any example above.

### How do I make a table in Markdown?

Separate columns with pipes and add a row of hyphens under the header row. Colons in that row set alignment. The header and separator rows must have the same number of columns. In Quilldown, click Table to build one in a visual grid instead. See the [Markdown tables guide](/docs/markdown-table-generator).

### How do I make a checkbox or task list?

Start a line with a hyphen, a space, then `[ ]` for an empty box or `[x]` for a checked one, followed by a space and the task text. Task lists come from GitHub Flavored Markdown, so check your tool supports them.

### How do I link to a heading in the same document?

Write a link whose address is a hash sign followed by the heading's anchor, for example `[Jump to headings](#headings)`. The anchor is usually the heading text in lowercase with hyphens instead of spaces and most punctuation removed, but the exact result depends on the tool.

### How do I change the size of an image in Markdown?

Markdown has no syntax for image size or alignment. Where HTML is allowed, use an `img` tag with a `width` attribute. In Quilldown you can also paste, drop or upload an image straight into the editor.

### How do I make a collapsible section?

Use an HTML `details` element with a `summary` line inside it. Leave a blank line after the summary line if you want Markdown to render inside the block. In Quilldown, the collapsible section is a toolbar snippet.

### How do I add a comment that doesn't show in the output?

Write it between the markers for an HTML comment. It's invisible when rendered, but anyone who reads the source can see it, so keep secrets out of comments.

### How do I underline text in Markdown?

There's no Markdown syntax for underline. Use an HTML `u` tag where HTML is allowed. In Quilldown, use the toolbar button or press Ctrl+U.

### What is the difference between basic and extended Markdown syntax?

Basic syntax covers headings, emphasis, lists, links, images, code and quotes, and works in almost every tool. Extended syntax covers tables, task lists, strikethrough, footnotes, math, diagrams and callouts, and support varies by tool. The "What works where" table shows which is which.
