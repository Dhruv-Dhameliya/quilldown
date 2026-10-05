# Quilldown

**Write Markdown. Watch it come alive.**

Quilldown is a calm, private Markdown editor that runs entirely in your browser. Type on the left, see the finished page on the right, then paste it into Google Docs or export it as a PDF, Word file, image or e-book.

**Live app:** <https://quilldown.vercel.app>  ·  **Source:** <https://github.com/Dhruv-Dhameliya/quilldown>

---

## Highlights

- **Private by design.** Nothing is uploaded. Your documents stay in your browser.
- **Live preview** with synced scrolling that stays aligned block by block.
- **Tabs** for as many documents as you like, saved automatically.
- **Copy for Docs.** One click pastes into Google Docs or Word with clean heading sizes.
- **Export** to PDF, Word, PNG, EPUB, HTML, Markdown and plain text.
- **Math and diagrams** with KaTeX and Mermaid.
- **Works offline** and installs as an app on your computer or phone.
- **Homepage first, editor one click away** — Quilldown opens on its homepage (with the editor built in); press **Open editor** for full screen and `Esc` to come back. Prefer to land straight in the editor? Turn on **Start in editor** in the header.

---

## Writing

### Editor

- **Views:** editor only, split, or preview only. Drag the divider to resize; it stacks vertically on small screens.
- **Sync scroll:** scrolling either side moves the other, aligned to the same block of text.
- **Themes:** light and dark. Exports always use a clean, print-friendly light theme.
- **Status bar:** words, characters, reading time, cursor position and save state.

### Toolbar

48 one-click snippets, grouped so the toolbar stays calm:

| Group | What's in it |
| --- | --- |
| Text | Bold, italic, underline, strikethrough, inline code, highlight, superscript, subscript, keyboard key |
| Structure | Headings 1–6, quote, code block, horizontal rule, bullet / numbered / task lists |
| Insert | Link, image (upload, URL, paste or drop), table, footnote, emoji |
| Math | Inline math, math block, formula templates (fraction, sum, integral, quadratic, matrix) |
| Diagrams | Flowchart, sequence, class, state, ER, Gantt, pie, mind map |
| Callouts | Note, tip, important, warning, caution |
| Layout | Collapsible section, centered block, hidden comment |

Smart editing: `Enter` continues a list (and ends it on an empty item), `Tab` / `Shift+Tab` indent, pasting a link over selected text turns it into a link, and applying a snippet twice removes it.

### Find & replace

Press `Ctrl+F` to find or `Ctrl+H` to replace. Every match is highlighted as you type. Options for **match case**, **whole word** and **regular expressions** (with `$1` groups in the replacement). *Replace all* is a single undo step.

### Outline

The list icon in the top bar opens a sidebar of every heading. Click one to jump there; the current section follows your scroll.

### Tables

The **Table** button opens a visual grid editor:

- **Inside an existing table** it edits that table, keeping its alignment.
- **With spreadsheet text selected** it converts the rows into a table.
- **Anywhere else** it inserts a new table.

Move with `Tab`, `Enter` and the arrow keys, paste rows straight from Excel or Google Sheets, set each column's alignment, and add or remove rows and columns. The result is tidy, evenly padded Markdown.

### Emoji

- **Picker:** search by name, browse categories, choose a skin tone, and reuse your recent picks.
- **Shortcodes:** type a colon and a few letters (`:roc`) to get suggestions. A finished `:tada:` becomes 🎉 as you type the closing colon. Shortcodes in imported documents render as emoji too.
- Suggestions stay out of the way inside code, times like `10:30`, and web addresses. You can switch them off in the picker.

### Images

Paste a screenshot, drop an image onto the editor, or use **Image → Upload**. Images are resized, stored with the document, and included in every export. Saving or copying the Markdown embeds them so the file is self-contained.

---

## Documents

### Tabs

Each document lives in its own tab: add one with **+**, drag to reorder, double-click to rename, middle-click or **×** to close. Closed one by accident? **Undo** appears in the message.

### Opening and saving

- **Open** several files at once, or drag and drop them anywhere on the page. Supports `.md`, `.markdown`, `.mdown`, `.mkd`, `.txt` and `.text`.
- In Chrome and Edge, files you open stay **linked**: the tab shows a dot (orange when there are unsaved changes) and `Ctrl+S` saves straight back to the file, keeping its original line endings. In other browsers `Ctrl+S` downloads a `.md`.
- **Installed as an app,** Quilldown appears in your system's **Open with** menu for Markdown files, so you can double-click a `.md` file to edit it.

### Templates

**New → Templates** opens a ready-made starting point in a new tab:

| Template | Includes |
| --- | --- |
| README | Description, features, install and usage code, configuration table, roadmap, license |
| Meeting notes | Attendees, agenda, discussion, decisions, action items |
| Résumé / CV | Header, summary, experience, education, skills |
| Blog post | Headline, sections, quote, callout, takeaways, call to action |
| Email | Subject, greeting, the ask, details, sign-off |
| Tables | Comparison, schedule, budget and status tables |
| To-do list | Top 3, today, this week, later, waiting on, done |
| Notes | Key points, questions, links, summary |

### Autosave

Every tab is saved in your browser as you type. Clearing your browser's site data removes saved tabs, so export anything important.

---

## Copy, export and share

### Copy

Copy buttons sit right on each pane:

- **Copy Markdown** copies the source.
- **Copy** copies the formatted text exactly as it looks in the preview.
- **Copy for Docs** copies with point sizes Google Docs and Word understand: **H1 23 pt, H2 17 pt, H3 14 pt, body 12 pt**. No font is set, so pasted text takes on the font of your document.
- **Copy HTML** (in the top-bar Copy menu) copies clean markup.

Every copy button turns into a green check mark for a moment once the text is on your clipboard, and into a red cross if the browser blocked it.

### Export

| Format | Notes |
| --- | --- |
| **PDF** | Opens your browser's print dialog; choose *Save as PDF*. Text stays selectable. |
| **Word (.docx)** | A real Word document with heading styles, lists, tables, links, code, callouts, images, diagrams and footnotes. Equations appear as their TeX text. |
| **PNG image** | The whole document as one picture. Very long documents are better as PDF. |
| **EPUB e-book** | One chapter per top-level heading, with a table of contents. Works in Apple Books, Kobo and other readers. |
| **HTML** | A standalone, styled web page. |
| **Markdown (.md)** | The source, with images embedded. |
| **Plain text (.txt)** | The rendered text without formatting. |

### Share by link

**Share** packs the whole document into the link itself. Nothing is uploaded or stored on a server, and anyone who opens the link gets their own copy in a new tab. There's an option to open it in preview-only mode. Long documents make long links: you'll get a warning above about 8,000 characters and the link is refused above 64,000. Pasted images aren't included.

---

## Guides

Free tutorials live alongside the app at <https://quilldown.vercel.app/guides>. Every example opens in the editor with one click.

New here? Take the interactive tour at <https://quilldown.vercel.app/docs/how-to-use>. As you scroll, a pointer walks around a copy of the editor, and you can click any button in the copy to see what it does, with an example.

- [What is Markdown?](https://quilldown.vercel.app/docs/what-is-markdown) — a beginner's guide
- [Markdown cheat sheet](https://quilldown.vercel.app/docs/markdown-cheat-sheet) — every piece of syntax with live examples
- [Markdown to PDF](https://quilldown.vercel.app/docs/markdown-to-pdf), [to Word and Google Docs](https://quilldown.vercel.app/docs/markdown-to-word) and [to HTML](https://quilldown.vercel.app/docs/markdown-to-html)
- [Markdown tables](https://quilldown.vercel.app/docs/markdown-table-generator), [math with LaTeX](https://quilldown.vercel.app/docs/math-in-markdown) and [Mermaid diagrams](https://quilldown.vercel.app/docs/diagrams-in-markdown)
- [Emoji shortcodes](https://quilldown.vercel.app/docs/emoji-in-markdown) and a [README template](https://quilldown.vercel.app/docs/readme-template)

## Works offline

Everything Quilldown needs, including fonts and libraries, is bundled with the app, so it never depends on a third-party server. Visit once and it keeps working without a connection; a small **Works offline** note appears in the status bar. Use the **Install** button in Chrome or Edge to run it in its own window.

## Privacy

Quilldown has no accounts, no analytics and no server-side storage. Documents, images and settings live in your browser on your device. Share links carry the document inside the link itself.

---

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl/⌘ + B` / `I` / `U` | Bold / italic / underline |
| `Ctrl/⌘ + Shift + X` | Strikethrough |
| `Ctrl/⌘ + E` | Inline code |
| `Ctrl/⌘ + K` | Link |
| `Ctrl/⌘ + F` / `H` | Find / find and replace |
| `Ctrl/⌘ + S` | Save (to the linked file, or download a `.md`) |
| `Ctrl/⌘ + O` | Open files |
| `Ctrl/⌘ + Alt + ← / →` | Previous / next tab |
| `Ctrl/⌘ + Alt + N` / `W` | New tab / close tab |
| `Esc` | Close a menu, then leave full screen |

## Markdown reference

- **GitHub-flavored Markdown:** tables with alignment, task lists, strikethrough, autolinks, reference links, fenced code with syntax highlighting.
- **Math:** `$inline$` and `$$block$$` with KaTeX.
- **Diagrams:** Mermaid code blocks (` ```mermaid `).
- **Callouts:** `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`.
- **Footnotes:** `[^1]` with `[^1]: text`. They are numbered automatically, linked both ways, and become real footnotes in Word.
- **Emoji:** `:shortcodes:`.
- **Inline HTML:** `<u>`, `<mark>`, `<kbd>`, `<sub>`, `<sup>`, `<details>`, and `align` on blocks.

## Good to know

- Files up to 5 MB each; up to 30 tabs open at once.
- Saved data lives in the browser (roughly 5 MB in total), so very large images may not persist. You'll be warned.
- Switching tabs clears the editor's undo history for that tab.
- Linked files and installing as an app need a Chromium-based browser (Chrome, Edge). Everything else works in current Firefox and Safari.

---

## Built with

Plain HTML, CSS and JavaScript, with no build step. Libraries, all bundled: [marked](https://marked.js.org) (Markdown), [DOMPurify](https://github.com/cure53/DOMPurify) (sanitizing), [highlight.js](https://highlightjs.org) (code), [KaTeX](https://katex.org) (math), [Mermaid](https://mermaid.js.org) (diagrams), [docx](https://docx.js.org) (Word), [html2canvas](https://html2canvas.hertzen.com) (PNG) and [Emojibase](https://emojibase.dev) (emoji data). Fonts: Nunito, Fraunces and JetBrains Mono.

```text
index.html     the landing page and the editor
docs/          the generated documentation pages (do not edit)
pages/         the sources of the site pages and guides
tools/         the page generator and site checks
LICENSE        the MIT License
css/           styles
js/            app logic, sample document, templates, preview typography
vendor/        bundled libraries, fonts and emoji data
icons/         app icons
sw.js          offline support
```

## License

Quilldown is released under the [MIT License](LICENSE). The bundled libraries and fonts keep their own licenses.
