---
title: What Is Markdown? A Beginner's Guide with Examples
h1: What is Markdown? A beginner's guide
short: What is Markdown?
card: Plain-text formatting, explained.
description: What is Markdown? A plain-text way to write headings, lists, links and tables. See how it works, where it's used, how flavors differ and how to start.
lead: Markdown is a way to format text using ordinary characters: # for headings, ** for bold, - for lists. This guide explains what it is, how it works, where it's used and how to write your first document in minutes.
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

**Markdown is a lightweight markup language: you write formatted text as plain text, using a few symbols next to your words.** A `#` at the start of a line makes a heading, `**` around a phrase makes it bold, and a `-` starts a bullet. A Markdown editor or converter reads those symbols and produces headings, bold text, lists, links, tables and more.

The file stays readable before it is converted, and the same file can become a web page, a PDF, a Word document or an e-book whenever you need one.

````example title="Plain text in, formatted text out"
# My first document

Markdown is **easy** to learn and *quick* to write.

- Type a symbol
- See the formatting
- Move on with your day

Read more on the [Quilldown cheat sheet](https://quilldown.vercel.app/guides/markdown-cheat-sheet).
````

Files written in Markdown usually end in **`.md`** or **`.markdown`**. Any text editor can open them, and a Markdown editor such as [Quilldown](/) shows them formatted.

## How Markdown works

Markdown is two things: a set of writing conventions, and a program (a *parser*) that applies them. The parser reads your text, recognises the patterns and outputs HTML, the language browsers display. PDF, Word and e-book exports are normally built from that same parsed structure.

| You type | The parser produces |
| --- | --- |
| `# Title` | `<h1>Title</h1>` |
| `**bold**` | `<strong>bold</strong>` |
| `- item` | `<ul><li>item</li></ul>` |
| `[text](https://example.com)` | `<a href="https://example.com">text</a>` |
| `` `code` `` | `<code>code</code>` |

Markdown does not decide how the result *looks*. Fonts, colors and spacing come from a stylesheet or template applied afterwards. That is why one `.md` file looks different on GitHub, on a documentation site and in an editor, and why Markdown is deliberately weak at page layout. It describes structure (this is a heading, this is a list) and leaves appearance to whatever displays it.

## Why people use Markdown

- **It is fast.** Your hands stay on the keyboard. Formatting is a symbol or two, not a trip to a menu.
- **It is portable.** A `.md` file is plain text, so it opens on any system with any editor and does not depend on one program surviving.
- **It is readable as-is.** Even unconverted, a Markdown document reads like a tidy plain-text note.
- **It works with version control.** Tools such as Git show exactly which lines changed between versions and can merge two people's edits. A Word file is a zipped bundle of XML, so the same comparison is far less useful.
- **It separates writing from styling.** You focus on the words; the look is applied when you publish or export.
- **It converts to many formats.** HTML, PDF, Word, EPUB, slides and more, from one source.

## A realistic example: meeting notes

Here is what everyday Markdown looks like. It takes about two minutes to type and uses headings, a numbered list, a table, a task list and a quote.

````example title="Meeting notes in Markdown"
# Weekly sync

**Attendees:** Ada, Grace, Linus

## Decisions

1. Ship the beta on Friday.
2. Move the design review to Monday.

## Action items

| Owner | Task | Due |
| --- | --- | --- |
| Ada | Update the changelog | Thu |
| Grace | Book the review room | Fri |

- [x] Send the agenda
- [ ] Share the notes

> Next meeting: same time, next week.
````

Read the left side without the preview and you can still follow every line. That is the design goal. Quilldown has a meeting-notes template under **New → Templates**, along with README, résumé, blog post, email, tables, to-do list and notes.

## Where Markdown is used

| Where | What it's used for |
| --- | --- |
| **GitHub and GitLab** | `README.md` files, issues, pull requests and wikis |
| **Documentation sites** | Static-site generators such as Jekyll and Hugo, and docs tools such as MkDocs and Docusaurus, build pages from `.md` files |
| **Note-taking apps** | Apps such as Obsidian and Joplin keep notes as Markdown text |
| **Blogs and websites** | Posts are written in Markdown and published as HTML |
| **Chat and forums** | Reddit, Discord and Stack Overflow support Markdown or a subset of it |
| **Notebooks** | Jupyter notebooks use Markdown cells for the explanatory text |
| **AI assistants** | Chat assistants commonly format their answers in Markdown |
| **Books and papers** | Authors write manuscripts in Markdown and export to PDF, Word or EPUB |

Support is not uniform. A chat app may understand only bold, italic, code and quotes, while a docs tool may add tabs, diagrams and admonitions. If you are writing a project description, our guide to [writing a great README](/guides/readme-template) has a structure that works.

## A short history

Markdown was created by **John Gruber**, with contributions from Aaron Swartz, and released in **2004** together with a Perl script that converted it to HTML. The goal was a format that reads naturally as plain text and converts cleanly to web pages.

The original description left details open, and different tools handled the edge cases differently: does a list need a blank line before it, how deep can a list nest, what happens to `_` inside a word? In **2014** the **CommonMark** project began work on a precise, testable specification to end the guesswork. In 2016 the `text/markdown` media type was registered as RFC 7763, and in 2017 GitHub published a specification for **GitHub Flavored Markdown (GFM)**, defined as a strict superset of CommonMark. GFM added tables, task lists, strikethrough and automatic links, and it is what most people now mean by "Markdown".

## Markdown flavors and why files render differently

"Markdown" is a family of closely related dialects. The core (headings, emphasis, lists, links, images, code, quotes) is the same everywhere. The differences are at the edges.

| Flavor | What it is | What you notice |
| --- | --- | --- |
| **Original Markdown** | The 2004 baseline | No tables, no fenced code blocks, ambiguous edge cases |
| **CommonMark** | A strict specification of the baseline | Same syntax, but every tool behaves the same way |
| **GitHub Flavored Markdown** | CommonMark plus tables, task lists, strikethrough and autolinks | The de facto standard for READMEs and issues |
| **Extended flavors** | Footnotes, math, diagrams and callouts, depending on the tool | Powerful, but a document may look different in another tool |

Some formats only *resemble* Markdown. Slack's message formatting, for example, uses a single asterisk for bold, where Markdown uses two. Do not assume a habit from one app transfers to another.

Quilldown supports GitHub Flavored Markdown plus footnotes, [LaTeX math](/guides/latex-math-in-markdown), [Mermaid diagrams](/guides/mermaid-diagrams-in-markdown), GitHub-style callouts and emoji shortcodes.

## Markdown vs Word, Google Docs and HTML

| | Markdown | Word / Google Docs | HTML |
| --- | --- | --- | --- |
| **Learning curve** | A few symbols | Familiar toolbar | Tags and attributes |
| **File type** | Plain text (`.md`) | Binary or zipped XML | Plain text (`.html`) |
| **Readable unrendered** | Yes | No | Hard |
| **Works with Git** | Excellent | Poor | Good |
| **Page layout control** | Limited (by design) | Excellent | Excellent |
| **Track changes and comments** | Through other tools | Built in | Through other tools |
| **Best for** | Writing, docs, notes, READMEs | Formatted, shared documents | Web pages |

You do not have to choose. Write in Markdown, then [convert it to Word or Google Docs](/guides/markdown-to-word), [to PDF](/guides/markdown-to-pdf) or [to HTML](/guides/markdown-to-html) when you need a finished document.

## When Markdown is the right tool, and when it is not

**Markdown fits well when:**

- The content is mostly text: documentation, notes, articles, READMEs, drafts, meeting minutes, study notes.
- You want a plain file that will still open in ten years.
- The document will be versioned, reviewed line by line, or published in more than one format.
- You would rather write than fiddle with formatting.

**Choose something else when:**

- Exact page layout matters: brochures, multi-column newsletters, forms, custom fonts.
- A large group of non-technical reviewers needs to mark up the same file with tracked changes.
- The content is really data. Use a spreadsheet, and put a summary table in Markdown.

There is a middle path that works for many people: draft in Markdown, export a Word file for reviewers who insist on Word, and do any final layout there.

## How to start writing Markdown in five minutes

<ol class="steps">
<li><strong>Open an editor.</strong> Use <a href="/">Quilldown</a>. It runs in your browser, so there is nothing to install or sign up for.</li>
<li><strong>Type on the left.</strong> Start a line with <code>#</code> and a space to make a heading, wrap a word in <code>**</code> to make it bold, start lines with <code>-</code> for a bullet list.</li>
<li><strong>Watch the preview.</strong> The formatted document updates as you type on the right.</li>
<li><strong>Use the toolbar if you forget a symbol.</strong> One click inserts the right Markdown, and shortcuts such as Ctrl+B for bold, Ctrl+I for italic and Ctrl+K for a link work as you type.</li>
<li><strong>Copy or export.</strong> Copy the formatted text into Google Docs, or export to PDF, Word, HTML, EPUB or an image.</li>
</ol>

> [!NOTE]
> Quilldown autosaves your text in your browser's local storage, which is cleared if you clear the site's data. For anything you cannot afford to lose, press Ctrl+S to save a `.md` file.

## Habits that keep Markdown tidy

1. **Use one `#` heading as the title and `##` for sections.** Do not skip levels, and do not pick a heading because you like its size. Headings describe structure, and tools build outlines and tables of contents from them.
2. **Leave a blank line around lists, tables, code blocks and quotes.** Most rendering surprises come from a missing blank line.
3. **Write link text that makes sense alone.** `[setup guide](url)` beats `[here](url)`, because readers and screen readers often see links out of context. Add alt text to every image.
4. **Name files in lowercase with hyphens**, such as `project-notes.md`. It avoids problems with spaces and capital letters in links and on case-sensitive systems.
5. **Preview where it will be published.** A document can look different on GitHub, on your blog and in your editor, especially for tables, footnotes and math.

## Mistakes beginners make

- **Using Markdown for layout.** There is no syntax for columns, margins or fonts, and adding tricks to force them makes the file fragile. If layout is the point, export to Word or PDF and adjust there.
- **Assuming every app renders the same.** Anything beyond the core syntax is an extension. Check what your target supports before relying on it.
- **Writing a wall of text.** Without blank lines, single line breaks are treated as spaces and everything merges into one paragraph.
- **Forgetting the space after a symbol.** `#Heading` is plain text, and `# Heading` is a heading.

For the exact syntax and a troubleshooting table, keep the [Markdown cheat sheet](/guides/markdown-cheat-sheet) open while you write.

## Frequently asked questions

### What is Markdown used for?

Markdown is used to write formatted text quickly in plain text. Developers use it for README files, documentation and issues, while writers use it for blog posts, notes, manuscripts and study material. Because it converts to HTML, PDF, Word and EPUB, one Markdown file can serve several purposes.

### Is Markdown a programming language?

No. Markdown is a markup language, a way to describe how text should be structured and formatted. It has no logic, variables or loops. Tools read the symbols and produce formatted output such as HTML.

### What is a .md file and how do I open it?

A `.md` file is a plain-text document written in Markdown. You can open it in any text editor to see the raw text, or in a Markdown editor such as Quilldown (use **Open** or drag the file onto the page) to see it formatted.

### Is Markdown the same everywhere?

The core syntax is: headings, bold, italic, lists, links, images, code and quotes work the same in nearly every tool. Tables, task lists, footnotes, math, diagrams and callouts are extensions, so support varies. The [Markdown cheat sheet](/guides/markdown-cheat-sheet) shows which features belong to the core and which come from GitHub Flavored Markdown.

### What is the difference between Markdown and HTML?

HTML describes web pages with tags such as `<h1>` and `<strong>`. Markdown is a shorter, friendlier way to write the same structure: `# Title` instead of `<h1>Title</h1>`. Most Markdown tools convert to HTML, and many let you mix raw HTML into a Markdown document when you need something extra.

### Can I convert Markdown to Word or PDF?

Yes. In Quilldown, use Export to save a PDF (through your browser's print dialog) or a Word (.docx) file, or use Copy for Docs to paste formatted text into Google Docs. See the guides on [Markdown to PDF](/guides/markdown-to-pdf) and [Markdown to Word](/guides/markdown-to-word).

### Is Markdown free, and do I need to install anything?

Markdown is an open, free format, and any plain-text editor can write it. Quilldown is a free online Markdown editor that needs no account and no installation, and it can also be installed as an app and used offline after your first visit.
