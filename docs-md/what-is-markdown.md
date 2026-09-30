# What is Markdown? A beginner's guide

> What is Markdown? Learn who created it, why it exists, how it beats plain text, where it's used and how to write your first document in minutes.

Source: <https://quilldown.vercel.app/docs/what-is-markdown>  
Updated: 2026-09-30

## Markdown in one minute

**Markdown is a lightweight markup language: you write formatted text as plain text, using a few symbols next to your words.** A `#` at the start of a line makes a heading, `**` around a phrase makes it bold, and a `-` starts a bullet. A Markdown editor or converter reads those symbols and produces headings, bold text, lists, links, tables and more.

The file stays readable before it is converted, and the same file can become a web page, a PDF, a Word document or an e-book whenever you need one.

**Plain text in, formatted text out**

````markdown
# My first document

Markdown is **easy** to learn and *quick* to write.

- Type a symbol
- See the formatting
- Move on with your day

Read more on the [Quilldown cheat sheet](https://quilldown.vercel.app/docs/markdown-cheat-sheet).
````

Files written in Markdown usually end in **`.md`** or **`.markdown`**. Any text editor can open them, and a Markdown editor such as [Quilldown](/) shows them formatted.

Markdown is still plain text. What it adds is a set of small conventions that people and programs both recognize, so the same file reads naturally as a note and converts cleanly into formatted output.

## Where Markdown came from

**The problem it solved.** In the early 2000s, writing for the web meant writing HTML: text wrapped in tags for headings, bold and links. It worked, but a paragraph full of tags is hard to read and tedious to type. A writer who just wants to write a post shouldn't have to look at markup while doing it.

**Who made it.** Markdown was created by John Gruber, a writer and designer who has run the blog Daring Fireball since 2002, where he writes about Apple, software and interfaces. He developed the syntax with the programmer Aaron Swartz, the co-author of the RSS 1.0 specification. Gruber described Swartz as his sole beta-tester and credited him with many of the syntax decisions. Swartz also wrote html2text, a tool that converts HTML back into Markdown. Swartz died in 2013.

<div class="credits" aria-label="Credits"><div><b>Author</b><span>John Gruber</span></div><div><b>With</b><span>Aaron Swartz</span></div><div><b>Released</b><span>15 March 2004</span></div><div><b>Source</b><span><a href="https://daringfireball.net/projects/markdown/">daringfireball.net/projects/markdown</a></span></div></div>

**When it appeared.** Gruber announced Markdown on 15 March 2004 as a text-to-HTML tool for web writers. It shipped as a plug-in for the Movable Type and Blosxom blogging systems, and as a standalone Perl script that could also be used as a text filter in the BBEdit editor. The last update to the original tool was version 1.0.1, in December 2004.

**What inspired it.** Gruber has said the biggest source of inspiration was the format of plain-text email. Anyone who wrote email in the 1990s already put asterisks around a word for emphasis, started quoted lines with a `>` sign, and separated paragraphs with blank lines. Markdown codified habits people already had. It also drew on earlier lightweight formats, including Setext, atx, Textile and reStructuredText. The hash marks used for headings, for instance, trace back to atx, a format Swartz had created.

**The design rule.** His overriding goal was readability.

<blockquote class="quote-card"><p>Publishable as-is, as plain text.</p><cite>John Gruber, <a href="https://daringfireball.net/projects/markdown/">Markdown project page</a></cite></blockquote>

A Markdown document should be publishable as-is, as plain text, without looking like it has been covered in tags or formatting instructions. That rule explains most of Markdown's choices, including why it stays small. Gruber has said he kept the syntax compact on purpose and left out features like strikethrough, because the primary goal is to remain readable as plain text.

**How it grew, and why files render differently.** Because the original description was informal, different tools handled edge cases in different ways, and development of the original tool stopped in 2004. Ports appeared almost immediately (PHP Markdown within days), and behavior drifted apart. Gruber has argued that full standardization would be a mistake, since different sites and people have different needs.

<ol class="timeline">
<li><b>15 March 2004</b>Gruber announces Markdown on Daring Fireball.</li>
<li><b>December 2004</b>Version 1.0.1, the last update to the original tool.</li>
<li><b>2014</b>CommonMark begins, a strict, testable specification. Gruber objects to "Markdown" appearing in the effort's original name, and it is renamed CommonMark in September.</li>
<li><b>2016</b>The <code>text/markdown</code> media type is registered as RFC 7763.</li>
<li><b>2017</b>GitHub publishes a specification for GitHub Flavored Markdown, defined as a superset of CommonMark.</li>
</ol>

Today, "Markdown" usually means CommonMark or GitHub Flavored Markdown, often with extras. See the flavors section below.

## How Markdown works

Markdown is two things: a set of writing conventions, and a program (a *parser*) that applies them. The parser reads your text, recognizes the patterns and outputs HTML, the language browsers display. PDF, Word and e-book exports are normally built from that same parsed structure.

| You type | The parser produces |
| --- | --- |
| `# Title` | `<h1>Title</h1>` |
| `**bold**` | `<strong>bold</strong>` |
| `- item` | `<ul><li>item</li></ul>` |
| `[text](https://example.com)` | `<a href="https://example.com">text</a>` |
| `` `code` `` | `<code>code</code>` |

Markdown does not decide how the result *looks*. Fonts, colors and spacing come from a stylesheet or template applied afterwards. That is why one `.md` file looks different on GitHub, on a documentation site and in an editor, and why Markdown is deliberately weak at page layout. It describes structure (this is a heading, this is a list) and leaves appearance to whatever displays it.

This is also why the same file can become a web page, a PDF, a Word document or an e-book. The structure carries through, and each format supplies its own look.

## Markdown vs plain text: what do the extra symbols buy you?

A Markdown file is a plain-text file, and both open in any editor. The difference is what a program can understand. Plain text stores words. Markdown stores words and their structure.

| | Plain text (.txt) | Markdown (.md) |
| --- | --- | --- |
| **Headings and structure** | Just lines. A program can't tell a title from a sentence | A `#` marks a heading, so tools can build outlines and tables of contents |
| **Bold and italics** | Only by habit (capitals, asterisks), with no shared meaning | `**` and `*` are recognized and displayed as bold and italics |
| **Links** | A pasted address at best | `[text](url)` becomes a clickable link with readable wording |
| **Lists** | Hyphens and numbers by habit, with no real list underneath | Recognized as real bullet and numbered lists, including nested ones |
| **Tables** | Spaces and alignment that break easily | Pipe tables that render as real tables |
| **Code** | Nothing sets it apart | Backticks and fenced blocks, with syntax highlighting in most tools |
| **Images** | Not possible | `![alt](url)` shows an image |
| **Turning it into HTML, PDF or Word** | Everything comes out as body text | Structure carries through to every format |
| **Readable before conversion** | Yes | Yes |
| **Opens in any editor** | Yes | Yes |
| **Learning curve** | None | A handful of symbols |

**A worked example.** Take a short set of meeting notes. As plain text, the title, the attendee line and the action items are all just lines, so a converter has no way to know which is the title or which lines form a list. As Markdown, the same notes start with `# Weekly sync`, mark decisions as a numbered list and mark action items as a table. Suddenly the document has a title, sections and a table, and it converts to a web page or a PDF with real headings.

<div class="compare">
<div><p class="cmp-h">notes.txt: a program sees only lines</p><pre>Weekly sync
Attendees: Ada, Grace, Linus
Decisions
1. Ship the beta on Friday.
2. Move the design review to Monday.
Action items
Ada - update the changelog - Thu
Grace - book the review room - Fri</pre></div>
<div><p class="cmp-h">notes.md: title, sections and a table</p><pre># Weekly sync
&#8203;
**Attendees:** Ada, Grace, Linus
&#8203;
## Decisions
&#8203;
1. Ship the beta on Friday.
2. Move the design review to Monday.
&#8203;
## Action items
&#8203;
| Owner | Task | Due |
| --- | --- | --- |
| Ada | Update the changelog | Thu |
| Grace | Book the review room | Fri |</pre></div>
</div>

**When plain text is still the better choice.** Plain `.txt` wins when nothing needs formatting or conversion: log files, configuration files, quick throwaway notes, a shopping list. There's no syntax to learn, and no chance that a stray asterisk or underscore gets interpreted as formatting. If you'll never publish, export or structure the document, keep it plain.

If you might ever want headings, links, a table or a PDF from your notes, Markdown gives you those without giving up the plain file.

## Why people use Markdown

- **It doesn't get in the way of reading.** The source looks like a tidy note, even before it's converted. That was the reason Markdown was designed in the first place.
- **It is fast.** Your hands stay on the keyboard. Formatting is a symbol or two, not a trip to a menu.
- **It is portable.** A `.md` file is plain text, so it opens on any system with any editor and does not depend on one program surviving.
- **It is readable as-is.** Even unconverted, a Markdown document reads like a tidy plain-text note.
- **It works with version control.** Tools such as Git show exactly which lines changed between versions and can merge two people's edits. A Word file is a zipped bundle of XML, so the same comparison is far less useful.
- **It separates writing from styling.** You focus on the words; the look is applied when you publish or export.
- **It converts to many formats.** HTML, PDF, Word, EPUB, slides and more, from one source.

## The Markdown basics at a glance

You only need a handful of symbols to start. The full list is in the [cheat sheet](/docs/markdown-cheat-sheet).

| You type | You get |
| --- | --- |
| `# Heading` | A large heading (use `##` and `###` for smaller ones) |
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `- item` | A bullet point |
| `1. item` | A numbered list item |
| `[text](https://example.com)` | A link |
| `![description](image-address)` | An image |
| `` `code` `` | Inline code |
| `> quote` | A quoted block |
| `---` | A horizontal line |
| `- [ ] task` | A checkbox item (GitHub Flavored Markdown) |
| `~~strike~~` | ~~Strikethrough~~ (GitHub Flavored Markdown) |

Tables, footnotes, math and diagrams are extensions. See the [Markdown cheat sheet](/docs/markdown-cheat-sheet) for every one, with live examples.

## A realistic example: meeting notes

Here is what everyday Markdown looks like. It takes about two minutes to type and uses headings, a numbered list, a table, a task list and a quote.

**Meeting notes in Markdown**

````markdown
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

Support is not uniform. A chat app may understand only bold, italic, code and quotes, while a docs tool may add tabs, diagrams and admonitions. If you are writing a project description, our guide to [writing a great README](/docs/readme-template) has a structure that works.

## Markdown flavors, standards and why files render differently

Markdown is a family of closely related dialects, not one strict standard. The core (headings, emphasis, lists, links, images, code, quotes) is the same everywhere. The differences are at the edges, which is why one file can look slightly different on GitHub, on a docs site and in an editor.

**Is Markdown an official standard?** Not in a single, official sense. The original description was informal prose. The CommonMark specification later made the core precise and testable. The `text/markdown` media type is registered as RFC 7763, and GitHub Flavored Markdown builds on CommonMark by adding tables, task lists, strikethrough and automatic links. Most tools follow CommonMark or GFM, then add their own extras.

| Flavor | What it is | What you notice |
| --- | --- | --- |
| **Original Markdown** | The 2004 baseline | No tables, no fenced code blocks, ambiguous edge cases |
| **CommonMark** | A strict specification of the baseline | Same syntax, but every tool behaves the same way |
| **GitHub Flavored Markdown** | CommonMark plus tables, task lists, strikethrough and autolinks | The de facto standard for READMEs and issues |
| **Extended flavors** | Footnotes, math, diagrams and callouts, depending on the tool | Powerful, but a document may look different in another tool |

Some formats only *resemble* Markdown. Slack's message formatting, for example, uses a single asterisk for bold, where Markdown uses two. Do not assume a habit from one app transfers to another. Gruber himself omitted strikethrough from the original syntax on purpose. It arrived later through GitHub Flavored Markdown.

Quilldown supports GitHub Flavored Markdown plus footnotes, [LaTeX math](/docs/math-in-markdown), [Mermaid diagrams](/docs/diagrams-in-markdown), GitHub-style callouts and emoji shortcodes.

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

You do not have to choose. Write in Markdown, then [convert it to Word or Google Docs](/docs/markdown-to-word), [to PDF](/docs/markdown-to-pdf) or [to HTML](/docs/markdown-to-html) when you need a finished document.

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
- The document will never need headings, links, tables or conversion. Plain text is enough.

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

For the exact syntax and a troubleshooting table, keep the [Markdown cheat sheet](/docs/markdown-cheat-sheet) open while you write.

## Sources and further reading

The history above comes from the creators' own writing and public references.

<ul class="sources">
<li>Daring Fireball, <a href="https://daringfireball.net/2004/03/introducing_markdown">"Introducing Markdown"</a> (15 March 2004)</li>
<li>Daring Fireball, <a href="https://daringfireball.net/linked/2015/11/05/markdown-strikethrough-slack">"Markdown, Strikethrough, and Slack"</a> (2015)</li>
<li>Daring Fireball, <a href="https://daringfireball.net/projects/markdown/">the original Markdown project page</a></li>
<li><a href="https://en.wikipedia.org/wiki/Markdown">Markdown on Wikipedia</a></li>
<li><a href="https://commonmark.org/">CommonMark</a>, the strict Markdown specification</li>
<li><a href="https://www.rfc-editor.org/rfc/rfc7763">RFC 7763</a>, the <code>text/markdown</code> media type</li>
<li><a href="https://github.github.io/gfm/">GitHub Flavored Markdown specification</a></li>
</ul>

## Frequently asked questions

### Who invented Markdown?

John Gruber created Markdown in 2004, with major input from the programmer Aaron Swartz, who tested it and helped shape the syntax.

### When was Markdown created?

Gruber announced it on 15 March 2004 on his blog Daring Fireball, together with a Perl tool that converts it to HTML. The original tool was last updated in December 2004.

### Why was Markdown created?

To let people write for the web in readable plain text instead of typing HTML tags, and then convert it to HTML automatically. Readability of the unconverted text was the main design goal.

### Is Markdown better than plain text?

For anything with structure, such as headings, lists, links or tables, yes. A Markdown file is still plain text, but its conventions let a program turn it into formatted output. For a quick note with no formatting, plain .txt is fine.

### Is Markdown an official standard?

There isn't one single official standard. The original description was informal. The CommonMark specification later made the core precise, GitHub Flavored Markdown builds on it, and the text/markdown media type is registered as RFC 7763. Most tools follow one of these, plus their own extras.

### Is Markdown worth learning?

It takes an afternoon to learn the basics, and the same symbols work across GitHub, documentation sites, note-taking apps and many chat tools, so the skill carries over. You don't need to be a developer.

### What is Markdown used for?

Markdown is used to write formatted text quickly in plain text. Developers use it for README files, documentation and issues, while writers use it for blog posts, notes, manuscripts and study material. Because it converts to HTML, PDF, Word and EPUB, one Markdown file can serve several purposes.

### Is Markdown a programming language?

No. Markdown is a markup language, a way to describe how text should be structured and formatted. It has no logic, variables or loops. Tools read the symbols and produce formatted output such as HTML.

### What is a .md file and how do I open it?

A `.md` file is a plain-text document written in Markdown. You can open it in any text editor to see the raw text, or in a Markdown editor such as Quilldown (use **Open** or drag the file onto the page) to see it formatted.

### Is Markdown the same everywhere?

The core syntax is: headings, bold, italic, lists, links, images, code and quotes work the same in nearly every tool. Tables, task lists, footnotes, math, diagrams and callouts are extensions, so support varies. The [Markdown cheat sheet](/docs/markdown-cheat-sheet) shows which features belong to the core and which come from GitHub Flavored Markdown.

### What is the difference between Markdown and HTML?

HTML describes web pages with tags such as `<h1>` and `<strong>`. Markdown is a shorter, friendlier way to write the same structure: `# Title` instead of `<h1>Title</h1>`. Most Markdown tools convert to HTML, and many let you mix raw HTML into a Markdown document when you need something extra.

### Can I convert Markdown to Word or PDF?

Yes. In Quilldown, use Export to save a PDF (through your browser's print dialog) or a Word (.docx) file, or use Copy for Docs to paste formatted text into Google Docs. See the guides on [Markdown to PDF](/docs/markdown-to-pdf) and [Markdown to Word](/docs/markdown-to-word).

### Is Markdown free, and do I need to install anything?

Markdown is an open, free format, and any plain-text editor can write it. Quilldown is a free online Markdown editor that needs no account and no installation, and it can also be installed as an app and used offline after your first visit.
