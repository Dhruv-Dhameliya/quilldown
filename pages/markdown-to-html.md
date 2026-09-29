---
title: Markdown to HTML — Convert and Copy Clean HTML Online
h1: Convert Markdown to HTML
short: Markdown to HTML
card: Clean markup or a standalone page.
description: Convert Markdown to HTML online, free. Copy clean markup for your CMS or export a standalone page, plus the tag map, raw HTML rules and sanitising advice.
lead: Paste Markdown, copy clean HTML for your site or CMS, or download a complete styled page. Below is what each element becomes, how raw HTML behaves, and how to keep the output safe and accessible.
category: convert
order: 6
published: 2026-09-29
updated: 2026-09-29
related: markdown-cheat-sheet, markdown-to-pdf, what-is-markdown
cta: Convert Markdown to HTML now
ctaText: Paste your Markdown, then use Copy → HTML or Export → HTML file. It runs in your browser and nothing is uploaded.
---

## How to convert Markdown to HTML

To convert Markdown to HTML, paste it into a converter and copy the result. In [Quilldown](/) that takes three steps, and you choose between two outputs: markup for a page that already exists, or a whole page of its own.

<ol class="steps">
<li><strong>Open <a href="/">Quilldown</a></strong> and paste or type your Markdown.</li>
<li><strong>Preview it</strong> on the right to make sure it looks right.</li>
<li><strong>Get the HTML</strong> in one of two ways:
<ul>
<li><strong>Copy → HTML</strong> (top-bar Copy menu) copies clean markup to your clipboard — ideal for pasting into a website, CMS or email template.</li>
<li><strong>Export → HTML file</strong> downloads a complete, standalone web page with its own styles.</li>
</ul></li>
</ol>

If you would rather paste into a visual editor than a code view, **Copy formatted** in the same menu puts rich text on the clipboard instead of markup. Use **Copy HTML** whenever the destination has a source or code view.

## What the HTML looks like

Each piece of Markdown becomes the matching HTML tag. Here is a small example of the markup you get:

````example title="Markdown in, HTML out" file=html-example.md
# Hello, Quilldown

This is **bold** and *italic*, with a [link](https://example.com).

- One
- Two
````

```html
<h1 id="hello-quilldown">Hello, Quilldown</h1>
<p>This is <strong>bold</strong> and <em>italic</em>, with a <a href="https://example.com">link</a>.</p>
<ul>
<li>One</li>
<li>Two</li>
</ul>
```

Headings get `id` attributes so you can link straight to them, and the output is plain semantic HTML with no wrapper tags or inline clutter. That is the point of Markdown: you describe structure, and styling stays with your site's CSS.

## Markdown to HTML: the tag map

| Markdown | HTML |
| --- | --- |
| `# Title` … `###### Title` | `<h1>` … `<h6>` |
| A paragraph of text | `<p>` |
| `**bold**` | `<strong>` |
| `*italic*` | `<em>` |
| `~~struck~~` | `<del>` |
| `[text](url "title")` | `<a href="url" title="title">` |
| `![alt](src)` | `<img src="src" alt="alt">` |
| `- item` | `<ul><li>` |
| `1. item` | `<ol><li>` |
| `- [x] done` | `<li>` with a disabled checkbox `<input>` |
| `> quote` | `<blockquote>` |
| `` `code` `` | `<code>` |
| Fenced code block | `<pre><code>` |
| Pipe table | `<table>` with `<thead>` and `<tbody>` |
| `---` | `<hr>` |
| `[^1]` footnote | A superscript link plus a footnote list at the end |
| `<https://example.com>` or a bare URL | `<a>` (autolink) |

A few details are worth knowing:

- **Line breaks.** A single newline inside a paragraph stays a newline in the HTML, and browsers display it as a space. To force a `<br>`, end the line with two spaces or a backslash, or leave a blank line for a new paragraph.
- **Special characters.** `&`, `<` and `>` in ordinary text are converted to `&amp;`, `&lt;` and `&gt;`, so they display correctly.
- **Table alignment.** Colons in the delimiter row become alignment on the cells. Some converters write an `align` attribute and others an inline `text-align` style, so check the output if your CSS depends on it. The [table guide](/guides/markdown-table-generator) covers the syntax.
- **Extensions.** Footnotes, math, diagrams and callouts are not part of original Markdown. Another converter may not understand them, so preview the result wherever it will end up.

## Copy HTML vs Export HTML

| | **Copy → HTML** | **Export → HTML file** |
| --- | --- | --- |
| **Output** | Just the content markup | A complete page with `<html>`, `<head>` and styles |
| **Styling** | None — your site's CSS applies | Built-in, print-friendly typography |
| **Use it for** | Blog posts, CMS custom-HTML blocks, email templates | Sharing a page, archiving, opening in any browser |
| **Math** | MathML | MathML |
| **Diagrams** | Inline SVG | Inline SVG |
| **Images** | Embedded as data if you pasted or uploaded them | Embedded as data if you pasted or uploaded them |

Math written with [LaTeX syntax](/guides/latex-math-in-markdown) and [Mermaid diagrams](/guides/mermaid-diagrams-in-markdown) are converted for you, so the HTML does not need a script to draw them.

> [!NOTE]
> Images you paste or upload are embedded in the HTML, which keeps a file self-contained but makes the markup long. For a website, upload the pictures to your media library and swap in their URLs.

## Fragment or full page?

The choice depends on what receives the HTML.

- **A fragment** (Copy → HTML) is only the body content: headings, paragraphs, lists. It belongs inside a page that already has a layout, such as a CMS post, a template partial or an email body.
- **A full page** (Export → HTML file) is a complete document you can open by double-clicking it, email as an attachment or host as a single file.

A valid standalone page needs more than content: a `<!doctype html>` declaration, an `<html lang="…">` element, `<meta charset="utf-8">`, a viewport meta tag for phones and a `<title>`. Without the doctype, browsers fall back to quirks mode and render some things differently. If you paste a fragment into a blank `.html` file, add those pieces yourself, or export the file instead and let the exporter do it.

## Using raw HTML inside Markdown

Markdown was designed to sit alongside HTML. Anything Markdown cannot express, you can write as HTML directly, and it passes through to the output.

````example title="Raw HTML inside Markdown"
Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save. H<sub>2</sub>O and E = mc<sup>2</sup>.

<mark>Highlighted</mark> text still supports **Markdown** inside inline tags.

<details>
<summary>Click to expand</summary>

Hidden **Markdown** content goes here, after a blank line.

</details>
````

The rules that trip people up:

- **Inline tags mix freely.** Markdown still works inside `<kbd>`, `<mark>`, `<span>`, `<sub>` and `<sup>`.
- **Block tags switch Markdown off.** Content directly inside a block-level tag such as `<div>` is treated as raw HTML until a blank line ends the block. `<div>**bold**</div>` shows literal asterisks. Put a blank line after the opening tag and before the closing tag to get Markdown processing back, as in the `<details>` example above.
- **Indentation matters.** A line indented four spaces or more turns into a code block, even inside your HTML. Keep raw HTML flush left.
- **Blank lines end HTML blocks.** A blank line inside a `<table>` or `<ul>` ends the block, and what follows is parsed as Markdown again. Write HTML tables without blank lines.
- **Attributes are yours to add.** Plain Markdown has no syntax for classes, widths or targets. To size an image, write `<img src="photo.jpg" alt="…" width="480">`.

> [!TIP]
> If you find yourself writing more HTML than Markdown, the document probably wants a template or a layout system rather than a longer Markdown file.

## Headings, ids and anchor links

Anchor links let a reader land on the exact section. In Quilldown's output, headings carry an `id`, so `page.html#hello-quilldown` jumps to the heading in the example above.

- **Ids follow the heading text.** If you rename a heading, its `id` changes and old links to it break. Keep headings stable once other pages link to them.
- **Duplicate headings need care.** Two headings with the same text cannot share one `id`. Give repeated headings distinct wording, such as "Setup for Mac" and "Setup for Windows".
- **Custom ids need HTML.** GitHub Flavored Markdown has no syntax for choosing an id. Some converters, such as Pandoc and kramdown, accept `{#custom-id}` after a heading. For portable output, write `<h2 id="custom-id">Title</h2>` yourself.

Use one `<h1>` per page and do not skip levels, for example jumping from `##` to `####`. Both help search engines and screen-reader users understand the outline. If your CMS already renders the post title as an `<h1>`, start your Markdown at `##`.

## Images and links

- **Alt text is required.** `![A bar chart of monthly signups](signups.png)` becomes an `<img>` with a real `alt`. An empty `![](…)` tells screen readers the image is decorative, so use it only for that.
- **Relative paths stay relative.** `![Logo](img/logo.png)` remains `img/logo.png` in the HTML, so the file must exist at that path relative to the page. Pasted or uploaded images in Quilldown are embedded, so they work anywhere.
- **Link text should make sense alone.** "Read the migration guide" beats "click here" for readers and for search engines.
- **External links** can be marked `target="_blank"` in raw HTML. If you do, add `rel="noopener noreferrer"`. Markdown itself has no syntax for either attribute.
- **Link titles** (`[text](url "Tooltip")`) become a `title` attribute. Treat it as a hint, not as a place for important information.

## Code blocks and syntax highlighting

A fenced block becomes `<pre><code>`. Add a language after the opening fence, such as `js` or `python`, and a highlighter can colour it. Quilldown marks tokens with CSS classes (for example `hljs-keyword`). The exported page includes the colours. If you paste the markup into your own site, add a highlight.js-compatible theme to get them.

Whitespace inside `<pre>` is preserved, and HTML characters in code are escaped for you, so you can show `<div>` in a code block without it being treated as a tag. When you need to show a fenced block inside another fence, make the outer fence longer, using four backticks around three.

## Pasting the HTML into a CMS or email

1. Create a **Custom HTML** block (WordPress and Ghost both offer one) or switch the editor to its source or code view.
2. Paste the markup from **Copy → HTML**.
3. Preview the post before publishing.

Things that commonly go wrong:

- **Stray line breaks.** Some editors add their own paragraph or line-break processing to pasted HTML. Compare the published page with the preview and use the block or view meant for raw HTML.
- **Stripped tags.** Many platforms remove `<script>`, `<style>` or `<iframe>` for some user roles. Standard content tags survive.
- **Unstyled output.** The markup has no inline styles, so it inherits the theme's typography. That is usually what you want on a website.
- **Email is different.** Email clients ignore most external and embedded CSS. Paste the markup into your email tool, which typically inlines styles for you, or use **Copy formatted** in a visual editor.

## Sanitising Markdown you did not write

Markdown converters generally pass raw HTML through. That is a feature when you write the text and a hole when a stranger does. If your site turns user-submitted Markdown into HTML, treat the output as untrusted.

- **Sanitise after conversion, not before.** Run the finished HTML through an allowlist-based sanitiser, such as DOMPurify in the browser or sanitize-html and bleach on servers, that keeps known-safe tags and attributes and drops the rest.
- **Watch URLs, not just tags.** `[click](javascript:alert(1))` needs no `<script>`. Allow only `http`, `https` and `mailto` schemes.
- **Strip event handlers.** Attributes like `onerror` and `onclick` can run code from an ordinary `<img>`.
- **Mark user links.** Add `rel="nofollow ugc noopener"` to links in user content so your site does not vouch for them.
- **Do not rely on escaping in the editor.** Turning off raw HTML in the converter helps, but a sanitiser is the safeguard that holds.

Quilldown's own output is sanitised: scripts and event-handler attributes are stripped. That covers Markdown you paste into it, not the pipeline on your site, which still needs its own defences.

## Making the HTML accessible

Semantic output gives you a good start. What you write decides the rest.

- **Heading order.** One `<h1>`, then `<h2>`, then `<h3>`, without gaps.
- **Alt text** on every meaningful image, and nothing redundant like "image of".
- **Real table headers.** A pipe table's first row becomes `<th>` cells, which lets screen readers announce column names. Never use a table for layout. Markdown tables have no `<caption>`, so add a sentence before the table or write an HTML table when you need one.
- **Do not depend on colour** alone in highlighted code or emoji status columns. Add a word.
- **Set the page language** with `<html lang="en">` in standalone pages.
- **Keep link text distinct.** Screen-reader users often scan a list of links out of context.

## Common Markdown to HTML problems

| Problem | Cause and fix |
| --- | --- |
| Markdown inside a `<div>` is not converted | Block-level HTML switches Markdown off. Leave a blank line after the opening tag and before the closing tag |
| A list renders as one paragraph | Leave a blank line before the list, and start each item with `-`, `*` or `1.` followed by a space |
| Code colours disappear on your site | The classes need a stylesheet. Add a highlight.js-compatible theme |
| Images are broken after upload | Relative paths point to files that are not on the server. Upload the images and use their URLs |
| `<br>` or a heading shows as text | It sits in a code span or an indented code block. Remove backticks or indentation |
| Anchor links jump nowhere | The heading text changed, so its `id` changed. Update the link |
| A table is not a table | The delimiter row is missing or misaligned, see the [table guide](/guides/markdown-table-generator) |

## When to use a static site generator instead

A converter is the right tool for a single post, a snippet or a one-off page. When Markdown becomes the source for a whole site, generators such as Jekyll, Hugo, Eleventy or Astro do the conversion at build time. They add templates, navigation, front matter, feeds and consistent styling, and they publish every page in one step.

Keep using a browser converter for drafting and previewing a post before it goes into the generator's `content` folder, or for copying markup into a system that only accepts HTML. If your goal is a printable file instead of a web page, see [Markdown to PDF](/guides/markdown-to-pdf) or [Markdown to Word](/guides/markdown-to-word). New to the syntax? Start with [what is Markdown](/guides/what-is-markdown) or keep the [cheat sheet](/guides/markdown-cheat-sheet) open.

## Frequently asked questions

### How do I convert Markdown to HTML online for free?

Paste your Markdown into Quilldown and use **Copy → HTML** for markup or **Export → HTML file** for a full page. It is free, needs no account, and your text stays in your browser.

### Does the HTML include CSS?

**Copy → HTML** gives you the markup only, so your website's own CSS styles it. **Export → HTML file** includes styles so the page looks good on its own. Code colours need a highlight.js-compatible theme if you paste the markup into your own site.

### Can I use the HTML in WordPress, Ghost or another CMS?

Yes. Paste the copied HTML into a custom-HTML block or the CMS's source editor. Because the markup is standard HTML, it works in any platform that accepts HTML. If you pasted images into Quilldown they are embedded, so upload them to the CMS and use their URLs for a lighter page.

### Can I put raw HTML inside Markdown?

Yes. Tags such as `<details>`, `<kbd>`, `<mark>`, `<sub>` and `<sup>` pass through to the output. Inline tags still process Markdown inside them, but content inside block-level tags such as `<div>` is left alone unless you add blank lines around it.

### Is it safe to convert Markdown from other people?

Not by default. Converters generally allow raw HTML and link URLs that can run script, so run any HTML built from untrusted Markdown through an allowlist sanitiser before publishing it. Quilldown strips scripts and event-handler attributes from its own output.

### Which Markdown features are supported?

GitHub Flavored Markdown (tables, task lists, strikethrough, autolinks and fenced code), plus footnotes, math, Mermaid diagrams and callouts. See the [Markdown cheat sheet](/guides/markdown-cheat-sheet).

### Is the conversion done on a server, and can I convert HTML back to Markdown?

The conversion runs entirely in your browser, so your document is never uploaded. Quilldown converts Markdown to HTML only. For the reverse, use a dedicated HTML-to-Markdown converter.
