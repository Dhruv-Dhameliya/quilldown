---
title: What Is Markdown? A Beginner's Guide with Examples
h1: What is Markdown? A beginner's guide
short: What is Markdown?
card: The plain-text writing format behind READMEs, docs and notes — explained with examples you can try.
description: Markdown is a simple way to format text using plain characters. Learn what it is, where it's used, how the syntax works and how to start writing in 5 minutes.
lead: Markdown is a simple way to format text using ordinary characters — # for headings, ** for bold, - for lists. This guide explains what it is, where it's used and how to write your first document in minutes.
category: learn
order: 1
home: true
published: 2026-09-29
updated: 2026-09-29
related: markdown-cheat-sheet, markdown-to-word, readme-template
cta: Write your first Markdown document
ctaText: Open the free editor and type on the left — the formatted result appears on the right instantly. No sign-up, nothing to install.
---

## Markdown in one minute

**Markdown is a lightweight markup language for writing formatted text in a plain-text file.** Instead of clicking toolbar buttons, you type a few simple symbols next to your words. A Markdown *editor* or *converter* turns those symbols into headings, bold text, lists, links, tables and more.

The result is a document that is readable even before it is converted — and that can be turned into HTML, PDF, Word, an e-book or a web page whenever you need.

````example title="Plain text in, formatted text out"
# My first document

Markdown is **easy** to learn and *quick* to write.

- Type a symbol
- See the formatting
- Move on with your day

Read more on the [Quilldown cheat sheet](https://quilldown.vercel.app/guides/markdown-cheat-sheet).
````

Files written in Markdown usually end in **`.md`** or **`.markdown`**. Any text editor can open them, and any Markdown editor — such as [Quilldown](/) — can show them formatted.

## Why people use Markdown

- **It is fast.** Your hands never leave the keyboard. Formatting is a symbol or two, not a menu.
- **It is portable.** A `.md` file is just text, so it opens everywhere and will still open in twenty years.
- **It is readable as-is.** Even unconverted, a Markdown document is easy to read.
- **It works with version control.** Because it is plain text, tools like Git can show exactly what changed between versions.
- **It separates writing from styling.** You focus on the words; the look is applied when you export.
- **It converts to almost anything.** HTML, PDF, Word, EPUB, slides and more.

## Where Markdown is used

| Where | What it's used for |
| --- | --- |
| **GitHub and GitLab** | `README.md` files, issues, pull requests and wikis |
| **Documentation sites** | Static-site generators and docs tools build web pages from Markdown files |
| **Note-taking apps** | Many notes apps let you write or export notes in Markdown |
| **Blogs and websites** | Posts are written in Markdown and published as HTML |
| **Chat and forums** | Communities such as Reddit and Discord support a subset of Markdown formatting |
| **Books and papers** | Authors write manuscripts in Markdown and export to PDF, Word or EPUB |

If you are writing a project description, see our guide to [writing a great README](/guides/readme-template).

## A short history

Markdown was created by **John Gruber**, with contributions from Aaron Swartz, and released in **2004**. The goal was a format that reads naturally as plain text and converts cleanly to HTML.

The original description left some details open, so different tools handled edge cases differently. In 2014 the **CommonMark** project published a precise specification to remove the ambiguity. **GitHub Flavored Markdown (GFM)**, later formalised as a strict superset of CommonMark, added tables, task lists, strikethrough and automatic links — and is now what most people mean by "Markdown".

## The ten things to learn first

You can write useful documents knowing only these. Our [Markdown cheat sheet](/guides/markdown-cheat-sheet) has the complete list.

````example title="Headings, emphasis and lists"
# Heading 1
## Heading 2

**Bold**, *italic* and ~~strikethrough~~

1. First
2. Second

- Bullet
- Bullet
````

````example title="Links, images, quotes and code"
[A link](https://commonmark.org)

![Alt text for an image](photo.jpg)

> A quotation

Inline `code` and a divider:

---
````

````example title="Tables and task lists"
| Name | Role |
| --- | --- |
| Ada | Engineer |

- [x] Learn the basics
- [ ] Write something great
````

## Markdown flavors explained

"Markdown" is a family of closely related dialects:

| Flavor | What it adds |
| --- | --- |
| **Original Markdown** | The 2004 baseline: headings, emphasis, lists, links, images, code, quotes |
| **CommonMark** | A strict, unambiguous specification of the baseline |
| **GitHub Flavored Markdown** | Tables, task lists, strikethrough, autolinks, fenced code |
| **Extended flavors** | Footnotes, math, diagrams and callouts, depending on the tool |

Quilldown supports GitHub Flavored Markdown plus footnotes, [LaTeX math](/guides/latex-math-in-markdown), [Mermaid diagrams](/guides/mermaid-diagrams-in-markdown), GitHub-style callouts and [emoji shortcodes](/guides/markdown-emoji-shortcodes).

## Markdown vs Word, Google Docs and HTML

| | Markdown | Word / Google Docs | HTML |
| --- | --- | --- | --- |
| **Learning curve** | A few symbols | Familiar toolbar | Tags and attributes |
| **File type** | Plain text (`.md`) | Binary or zipped XML | Plain text (`.html`) |
| **Readable unrendered** | Yes | No | Hard |
| **Works with Git** | Excellent | Poor | Good |
| **Page layout control** | Limited (by design) | Excellent | Excellent |
| **Best for** | Writing, docs, notes, READMEs | Formatted, shared documents | Web pages |

You do not have to choose. Write in Markdown, then [convert it to Word or Google Docs](/guides/markdown-to-word), [to PDF](/guides/markdown-to-pdf) or [to HTML](/guides/markdown-to-html) when you need a finished document.

## How to start writing Markdown in five minutes

<ol class="steps">
<li><strong>Open an editor.</strong> Use <a href="/">Quilldown</a> — it runs in your browser, so there is nothing to install or sign up for.</li>
<li><strong>Type on the left.</strong> Start a line with <code>#</code> and a space to make a heading, wrap a word in <code>**</code> to make it bold, start lines with <code>-</code> for a bullet list.</li>
<li><strong>Watch the preview.</strong> The formatted document updates as you type on the right.</li>
<li><strong>Use the toolbar if you forget a symbol.</strong> One click inserts the right Markdown and shows you the syntax.</li>
<li><strong>Copy or export.</strong> Copy the formatted text into Google Docs, or export to PDF, Word, HTML, EPUB or an image.</li>
</ol>

## Common beginner mistakes

- **No space after the symbol.** `#Heading` is plain text; `# Heading` is a heading.
- **No blank line before a list.** Leave an empty line between a paragraph and the list that follows.
- **Line breaks vanish.** A single new line joins into the same paragraph. End the line with two spaces, or leave a blank line, to start a new one.
- **Lists that will not nest.** Indent nested items by two or four spaces.
- **Special characters turning into formatting.** Put a backslash before a symbol to show it literally, for example `\*not italic\*`.

## Frequently asked questions

### Is Markdown a programming language?

No. Markdown is a markup language — a way to describe how text should be formatted. It has no logic, variables or loops. Tools read the symbols and produce formatted output such as HTML.

### What is a .md file and how do I open it?

A `.md` file is a plain-text document written in Markdown. You can open it in any text editor to see the raw text, or in a Markdown editor such as Quilldown (use **Open** or drag the file onto the page) to see it formatted.

### Is Markdown free to use?

Yes. Markdown itself is an open, free format, and Quilldown is a free online Markdown editor with no account required.

### Do I need to install anything to write Markdown?

No. Any plain-text editor works, and browser-based editors like Quilldown need no installation. Quilldown can also be installed as an app and works offline.

### What is the difference between Markdown and HTML?

HTML describes web pages with tags such as `<h1>` and `<strong>`. Markdown is a shorter, friendlier way to write the same structure — `# Title` instead of `<h1>Title</h1>`. Most Markdown tools convert to HTML, and you can even mix raw HTML into a Markdown document when you need something extra.

### Can I convert Markdown to Word or PDF?

Yes. In Quilldown, use Export to save a PDF or a real Word (.docx) file, or Copy for Docs to paste formatted text into Google Docs. See the guides on [Markdown to PDF](/guides/markdown-to-pdf) and [Markdown to Word](/guides/markdown-to-word).
