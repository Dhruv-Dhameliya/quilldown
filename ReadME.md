# Quilldown

A calm, private, browser-only Markdown editor with live preview — plus the landing page that presents it.
No build step, no backend: open `index.html` (or drop the folder on any static host).

> **Working agreement:** whenever the tool changes, the landing page (`index.html`) and this README change with it.
> See [Keeping everything in sync](#keeping-everything-in-sync) at the bottom.

---

## Project structure

```text
Markdown/
├── index.html              Markup only: nav, hero + the tool, features, syntax, steps, privacy, FAQ, footer
├── css/
│   └── styles.css          Design tokens (light/dark), landing page, editor chrome, tabs, menus, dialogs
├── js/
│   ├── document-style.js   Typography of the rendered document (preview + HTML/PDF export). Injected as <style id="md-css">
│   ├── sample.js           The default "feature tour" document
│   ├── templates.js        The eight document templates (New ▾ → Templates)
│   └── app.js              Everything interactive (see sections below)
├── vendor/                 Every third-party file, bundled (libraries, KaTeX + app fonts, emoji data) — generated
├── icons/                  App icons (SVG + PNG) used by the manifest and the favicon set
├── manifest.webmanifest    Installable-app metadata
├── sw.js                   Service worker (offline cache)
├── sw-assets.js            Pre-cache list + version hash for sw.js — generated
├── tools/
│   ├── fetch-vendor.mjs    Downloads / upgrades everything in vendor/
│   └── list-assets.mjs     Regenerates sw-assets.js
└── ReadME.md
```

**Third-party libraries** (all bundled in `vendor/`; `mermaid`, `docx` and `html2canvas` are loaded lazily, only when needed):
marked 12 (Markdown) · DOMPurify (sanitising) · highlight.js (code) · KaTeX (math) · Mermaid 11 (diagrams) · docx 8 (Word export) · html2canvas 1.4 (PNG export) · emojibase-data (emoji list, trimmed).

**Fonts:** Inter, Instrument Serif, JetBrains Mono — self-hosted (latin + latin-ext) in `vendor/fonts/`.

### Working offline & installing

- Nothing is loaded from a third-party host: `index.html` only references files in this folder, so the app works **offline even when opened straight from disk** (`file://`).
- When hosted over **https** (or `http://localhost`), `sw.js` pre-caches every file on the first visit (a "Works offline" indicator appears in the status bar) and browsers offer **Install** (button in the top bar and landing nav). Own files use stale-while-revalidate, `vendor/` is cache-first.
- **After changing any file, run `node tools/list-assets.mjs`** — it regenerates `sw-assets.js` (file list + content hash), which makes installed copies update. To upgrade libraries: edit the versions in `tools/fetch-vendor.mjs`, run it, then run `list-assets`.
- Installed copies also register as a handler for Markdown files — see *Open with Quilldown* under Files.
- Service workers do not run from `file://`; the offline pill there just reflects that the bundled files are local.

---

## The tool

The tool is **full screen by default**. **Esc** (or the button, top-right) collapses it into the landing page, where it sits under the hero; **Open editor** brings it back.

### Editor

| Feature | Details |
| --- | --- |
| Live preview | GitHub-flavoured Markdown, sanitised, syntax-highlighted code |
| Sync scroll | Block-aware and wrapped-line-aware (not just a percentage); toggle in the top bar |
| Views | Editor only · Split · Preview only; draggable divider (double-click to reset); stacks vertically on phones |
| Themes | Light / dark; exports always use a clean light theme |
| Status bar | Words, characters, reading time, line/column, save state |

### Tabs (multiple documents)

- Each document is a tab (up to 30). **+** adds a blank tab; **New ▾** offers a blank document, the sample document and the eight templates.
- Drag tabs to **reorder**, double-click a tab to **rename**, middle-click or **×** to close. Closing shows an **Undo** toast.
- **Open** accepts several files at once; dropping several files onto the page opens each in its own tab. An untouched blank tab is reused.
- Shortcuts: `Ctrl/⌘+Alt+←/→` switch tabs · `Ctrl/⌘+Alt+N` new tab · `Ctrl/⌘+Alt+W` close tab.
- Storage: every tab is autosaved to `localStorage` (`quilldown:tabs`, `quilldown:doc:<id>`, `quilldown:active`). A previous single-document save is migrated automatically, and so is data saved under the app's former name (Inkdown): on first load every `inkdown:*` key is moved to `quilldown:*`. Note that switching tabs resets the editor's undo history.

### Snippet toolbar (48 snippets)

Undo / redo · **Bold, Italic, Underline, Strikethrough, Inline code, Highlight, Superscript, Subscript, Keyboard key** ·
**Headings 1–6** (dropdown) · Quote · Code block · Horizontal rule · Bullet / Numbered / Task list ·
Link · Image · Table · **Inline math · Math block · Formula templates** (fraction, sum, integral, quadratic, matrix) ·
**Diagrams** (flowchart, sequence, class, state, ER, Gantt, pie, mind map) · **Callouts** (Note, Tip, Important, Warning, Caution) ·
Collapsible section · Centered block · Hidden comment · **Footnote** (inserts `[^n]` and a definition at the end of the document).

**Image** is a dropdown: upload from your computer, insert from a URL, or just paste / drop an image. **Table** opens the visual table editor and **Emoji** opens the emoji picker (both below).

Smart editing: `Enter` continues lists (and ends them on an empty item), `Tab`/`Shift+Tab` indent, pasting a URL over selected text makes a link, snippets toggle off when re-applied.

| Shortcut | Action |
| --- | --- |
| `Ctrl/⌘ + B / I / U` | Bold / Italic / Underline |
| `Ctrl/⌘ + Shift + X` | Strikethrough |
| `Ctrl/⌘ + E` | Inline code |
| `Ctrl/⌘ + K` | Link |
| `Ctrl/⌘ + S` | Save — back to the linked file, or download a `.md` |
| `Ctrl/⌘ + O` | Open file(s) |
| `Ctrl/⌘ + F` / `Ctrl/⌘ + H` | Find / Find & replace |
| `Esc` | Close menu → leave full screen |

### Copy

Buttons sit directly on each pane (and in the top-bar **Copy ▾** menu):

- **Markdown pane → Copy Markdown** — the raw source.
- **Preview pane → Copy** — rich text as shown in the preview (inline styles, light theme).
- **Preview pane → Copy for Docs** — rich text with explicit point sizes for Google Docs / Word:
  **H1 23 pt · H2 17 pt · H3 14 pt · H4–H6 and body text 12 pt**, no font family or text colour is set, so the text takes the font of the destination document (only code blocks keep Courier New). Headings stay real `<h1>`–`<h6>` so Docs keeps its outline.

- **Top-bar menu → HTML** — clean markup (math as MathML, diagrams as inline SVG).
- Diagrams are converted to PNG on copy so they survive pasting; task-list checkboxes become ☑ / ☐.

### Export

| Format | How it works |
| --- | --- |
| **PDF** | Opens the print dialog with a print-styled document; choose *Save as PDF* (text stays selectable) |
| **Word (.docx)** | A real Word document built with `docx`: Heading 1–6 styles at 23/17/14/12 pt, lists, tables, links, code blocks, callouts, images and diagrams (as PNG). Equations are exported as their TeX text (not native Word equations) |
| **PNG image (.png)** | The whole document as one picture (2× where it fits): rendered off-screen with `html2canvas`, math as KaTeX, diagrams as images, light theme. Documents taller than ~15,000 px are refused with a hint to use PDF |
| **EPUB e-book (.epub)** | EPUB 3 built in the browser (own zip writer): one chapter per top-level heading (H1), a table of contents from H1/H2, images extracted into files (WebP converted to PNG), math as MathML, diagrams as PNG, footnote links rewritten across chapters |
| **HTML** | Standalone styled page (math as MathML) |
| **Markdown (.md)** | The raw source |
| **Plain text (.txt)** | Rendered text with simple list/table structure |

### Table editor

The **Table** button opens a grid editor and does the right thing for where your cursor is:

- **Inside an existing Markdown table** → *Edit table*: the table is parsed (alignment included), you edit it, and **Update** rewrites just that table, neatly padded.
- **With spreadsheet text selected** (tab-separated, or comma-separated with a consistent column count) → *Convert to table*.
- **Anywhere else** → *Insert table* (3 × 3 to start).

In the grid: `Tab` / `Shift+Tab` / `Enter` / arrow keys move between cells (Tab or Enter past the last cell adds a row); paste TSV/CSV from Excel or Sheets to fill cells (the grid grows); the icon above each column cycles alignment (default → left → centre → right); × deletes a row or column; **+ Row / + Column / Clear cells**; `Ctrl+Enter` applies. A collapsible **Markdown preview** shows the output. Pipes inside cells are escaped, line breaks become `<br>`.

### Emoji shortcodes

Type a colon and two or more letters at the start of a word (`:roc`) and a suggestion list opens at the caret — `↑ ↓` choose, `Enter` / `Tab` insert, `Esc` dismisses (without leaving full screen), or click. Ranking: exact match, prefix, contains, then name/keywords; your recent picks and common emoji come first among equals. Typing the closing colon of a complete shortcode (`:tada:`) converts it immediately (one undo step). It does **not** trigger inside inline code or fenced blocks, in times like `10:30`, or in URLs.

- **In documents:** `:name:` renders as the emoji (GitHub-style; unknown names such as `:notacode:` stay as typed) — handy for imported READMEs. Exports contain the emoji character.
- The suggestions can be switched off with the **`:` suggestions** checkbox at the bottom of the emoji picker (remembered).
- Data: 1,870 emoji with GitHub + Slack-style shortcodes in `vendor/emoji.js` (regenerate with `tools/fetch-vendor.mjs`).

### Emoji picker

The smiley button (end of the toolbar) opens a picker with **search** (name and keywords), **categories**, **skin tones** (remembered) and **recently used** (last 24, remembered). Click inserts at the cursor and closes; **Shift+click** keeps it open; `Esc` closes. The emoji list is bundled (`vendor/emoji.js`, ~1,900 emoji up to Unicode 15).

### Find & replace

- `Ctrl/⌘+F` (find) or `Ctrl/⌘+H` (replace), or the magnifier in the top bar. Every match is highlighted behind the text and the current one is emphasised; `Enter` / `Shift+Enter` (or `F3`) step through matches.
- Options: **match case** (`Alt+C`), **whole word** (`Alt+W`), **regular expression** (`Alt+R`, with `$1` groups in the replacement). Invalid patterns are flagged.
- **Replace** changes one match; **All** replaces everything as a single undo step (`Ctrl+Z`). Selected text pre-fills the search. `Esc` closes.

### Outline

The list icon in the top bar toggles a sidebar with every heading (H1–H6, indented, ignoring code blocks). Click to jump the editor and preview to it; the current section follows your scroll. State is remembered.

### Images

Paste a screenshot, drop an image file onto the editor, or use **Image → Upload**. Images are downscaled (max 1600 px, WebP/JPEG; SVG/GIF kept as-is up to 400 KB), stored **with the document** in browser storage, and referenced in the text as `![alt](img:abc123)`.

- HTML / PDF / Word exports include the pictures; **Save .md** and **Copy Markdown** embed them as data URIs so the file is self-contained.
- Storage is limited by the browser (~5 MB total); you are warned if an image can't be saved. Unreferenced images are cleaned up on the next load.

### Templates

**New ▾ → Templates** opens each in a new tab (your current document is untouched). Dates in the templates are filled in when you open them.

| Template | File name | Contents |
| --- | --- | --- |
| README | `README.md` | Description, features, install / usage code, config table, roadmap, contributing, license |
| Meeting notes | `meeting-notes.md` | Date / attendees, agenda, discussion, decisions table, action-item checkboxes, next meeting |
| Résumé / CV | `resume.md` | Centred header, summary, experience, education, skills table, projects |
| Blog post | `blog-post.md` | Headline, hook, sections, quote, callout, results table, takeaways, footnote, call to action |
| Email | `email.md` | Subject, greeting, context, the ask, details table, sign-off |
| Tables | `tables.md` | Comparison, weekly schedule, budget (right-aligned numbers) and project-status tables |
| To-do list | `todo.md` | Top 3, today, this week (nested), later, waiting-on table, done |
| Notes | `notes.md` | Key points, details, questions as tasks, links, summary |

To add a template, append an entry to `window.QUILLDOWN_TEMPLATES` in `js/templates.js` — it appears in the menu automatically.

### Share link

**Share** (top bar) opens a dialog with a link that contains the whole document — compressed (deflate) and base64url-encoded into the URL **fragment** (`#d=…`). Nothing is uploaded, and fragments are never sent to a server.

- Opening a link creates a **new tab** with a copy of the document (your own documents are never overwritten); the fragment is then removed from the address bar so a refresh doesn't open it twice. Pasting a link while the app is open works too.
- Option **Open in preview-only mode** adds `&p=1` (applied for that session only; it doesn't change the saved view mode).
- Limits: a note appears above ~8,000 characters (some chat apps truncate long links); above 64,000 characters the link is refused with advice to export instead; when opened, a link may expand to at most 3 MB. Pasted images are replaced by a placeholder (too large for a link).
- If the page is opened from disk (`file://`) the dialog warns that links only work on this computer until the site is hosted.
- Needs `CompressionStream` (all current browsers); otherwise an uncompressed (longer) link is produced.

### Files

Open (button or `Ctrl+O`, multi-select) and drag & drop anywhere on the page. Accepts `.md .markdown .mdown .mkd .txt .text`, up to 5 MB each.

**Linked files (Chrome / Edge, secure context).** Files opened with the **Open** button, dropped onto the page, or launched from the OS keep a *file handle*: the tab shows a dot (grey = in sync, **orange = unsaved changes**) and `Ctrl+S` / **Export → Save** writes straight back to that file (after a one-time permission prompt), keeping its original line endings (LF / CRLF). Opening the same file again switches to its tab. **Export → Markdown** always downloads a copy. If writing fails you get a downloaded copy instead. Elsewhere (Firefox, Safari, `file://` without picker support) `Ctrl+S` downloads a `.md`. The link lasts for the session — after a reload the tab keeps its text but must be re-opened to relink.

**Open with Quilldown (installed app).** `manifest.webmanifest` declares `file_handlers` for `.md .markdown .mdown .mkd`, so after installing, Quilldown appears in the OS **Open with** list and can be made the default. Files arrive through the `launchQueue` API, open as linked tabs, and further launches reuse the existing window (`launch_handler: focus-existing`). **If Quilldown was installed before this feature, uninstall and reinstall it** so the OS registers the handler. Needs a hosted (https) copy or `localhost`.

### Markdown support

GFM (tables with alignment, task lists, strikethrough, autolinks, reference links) · KaTeX math (`$…$`, `$$…$$`) ·
Mermaid diagrams · GitHub-style callouts (`> [!NOTE]`) · inline HTML (`<u>`, `<mark>`, `<kbd>`, `<sub>`, `<sup>`, `<details>`, `align`) · heading anchors.
Footnotes: `[^1]` references with `[^1]: text` definitions — numbered automatically, collected at the end of the page with back-links, and exported as **real footnotes** in Word.

---

## The landing page

Sections: hero + embedded tool → highlights strip → **Features** → **Syntax** → How it works → Privacy → FAQ → final call to action.

To keep the page short, secondary content sits behind **"Show more" expanders** (`data-expand` buttons controlling `.expander` panels):

- **Features:** 8 main cards visible; 8 more (Copy for Docs, keyboard, callouts, diagram types, code, layout, autosave, themes) behind *Show all features*.
- **Syntax:** 4 cheat-sheet cards visible; the rest behind *Show all syntax*. The cheat sheet is rendered live by the same engine as the tool; each card has a **Try it** button that inserts the example into the editor. Examples live in the `CHEATS` array in `js/app.js`.

---

## Keeping everything in sync

When a tool feature is added, changed or removed, update **all** of these in the same change:

1. **Tool code** — `js/app.js` (actions in `A`, toolbar in `BAR`, menus in `MENUS`) and styles in `css/styles.css`.
2. **Sample document** — `js/sample.js` should exercise every feature (it is the guided tour).
3. **Landing page** — `index.html`: a card in *Features* (visible if it is a headline feature, otherwise in the expander), the *FAQ* if users will ask about it, the counts ("45+ snippets", export formats), and the cheat sheet (`CHEATS`) for new syntax.
4. **This README** — feature tables, shortcuts and snippet list.
5. **Verify** — reload, check the console is clean, click through the new feature, and check the landing page in light and dark.

---
