---
title: Convert Markdown to PDF — Free, Online and Private
h1: How to convert Markdown to PDF
short: Markdown to PDF
card: A clean PDF, no upload.
description: Convert Markdown to PDF online for free. Paste or open a .md file, check the preview and save a clean, selectable PDF — no upload, no sign-up, works offline.
lead: Turn Markdown into a clean, print-ready PDF in under a minute — free, private and without uploading your document anywhere.
category: convert
order: 4
home: true
published: 2026-09-29
updated: 2026-09-29
related: markdown-to-word, markdown-to-html, markdown-cheat-sheet
cta: Convert your Markdown to PDF now
ctaText: Paste or open your Markdown, then choose Export → PDF. It runs in your browser, so your text never leaves your device.
---

## Convert Markdown to PDF in five steps

Quilldown creates PDFs using your browser's built-in "Save as PDF", which produces sharp, searchable text (not a blurry picture of the page). Nothing is uploaded — the whole conversion happens on your device.

<ol class="steps">
<li><strong>Open the editor.</strong> Go to <a href="/">Quilldown</a>. Paste your Markdown, type it fresh, or use <strong>Open</strong> to load a <code>.md</code> file (you can also drag the file onto the page).</li>
<li><strong>Check the preview.</strong> The right-hand pane shows exactly how the document will look. Fix headings, tables or images now.</li>
<li><strong>Choose Export → PDF.</strong> Your browser's print dialog opens with the document laid out for paper.</li>
<li><strong>Pick “Save as PDF”.</strong> In the dialog, set the destination to <em>Save as PDF</em> (in Chrome and Edge) and adjust paper size and margins if you like.</li>
<li><strong>Save.</strong> Name the file and you're done — the PDF keeps selectable text, headings, tables, code blocks, images and diagrams.</li>
</ol>

## What the PDF looks like

The PDF always uses a clean, light, print-friendly theme — even if you write in dark mode — so it is easy to read and cheap to print.

- **Headings, lists and tables** keep their structure, with header rows shaded.
- **Code blocks** keep monospace formatting, wrap long lines and use syntax colors.
- **Images and diagrams** are embedded. Mermaid diagrams are drawn in the light theme.
- **Math** written in LaTeX is typeset (see [math in Markdown](/guides/latex-math-in-markdown)).
- **Page breaks** avoid splitting a code block, table, image or quote across two pages, and headings stay with the text that follows.
- **Links** stay clickable in the saved PDF in Chrome and Edge.

## Print-dialog settings worth knowing

| Setting | What to do |
| --- | --- |
| **Destination** | Choose *Save as PDF* (Chrome, Edge). In Firefox pick *Save to PDF*; on a Mac use the *PDF* menu at the bottom of the print dialog |
| **Paper size** | A4 or Letter — pick the one you'll print on |
| **Margins** | *Default* works well; choose *Minimum* for more space or *None* only if your content has its own padding |
| **Headers and footers** | Turn **on** to add page numbers, the date and the title; turn **off** for a clean page |
| **Background graphics** | Leave **on** so table headers and code blocks keep their shading |
| **Scale** | *Default* (100%) — reduce only for very wide tables |

## Add your own page breaks

Markdown has no page-break syntax, but you can add a tiny bit of HTML wherever you want a new page to start:

```html
<div style="break-after: page"></div>
```

## Tips for a better PDF

- **Use one `#` heading as the title** and `##` for sections, so the structure is clear.
- **Keep tables narrow.** Six columns or fewer fit on portrait paper. For wide tables, shorten the headings or switch to landscape in the print dialog.
- **Give images a sensible size** before you add them; very large images make big PDFs.
- **Add alt text** to images: `![What the image shows](photo.png)`.
- **Write a table of contents by hand** with links such as `[Introduction](#introduction)` if your document is long.

## Other ways to convert Markdown to PDF

| Method | Good for | Trade-offs |
| --- | --- | --- |
| **Quilldown (browser)** | Quick, private conversions; live preview | Uses the browser's print engine |
| **Pandoc** | Automated, scripted pipelines and books | Command line; PDF output usually needs LaTeX or another PDF engine installed |
| **Editor extensions** | Converting inside your code editor | Depends on the extension; often needs extra tools |
| **Word or Google Docs** | Documents that need heavy layout work | Extra step — see [Markdown to Word](/guides/markdown-to-word) |

## Frequently asked questions

### Is it really free and private?

Yes. Quilldown is free, needs no account, and runs entirely in your browser. Your Markdown is never sent to a server, and it even works offline once loaded.

### Is the text in the PDF selectable and searchable?

Yes. Because the PDF is generated from the page's text (not a screenshot), you can select, copy and search it. If you want a picture instead, Quilldown can also export a PNG image.

### How do I add page numbers to my PDF?

Turn on **Headers and footers** in the print dialog. Chrome and Edge then print the page number, date and document title on each page.

### Can I change the fonts or colors of the PDF?

The PDF uses Quilldown's print theme — Inter for text and a monospace font for code — so it looks the same everywhere. If you need custom branding, export to [Word](/guides/markdown-to-word) and style it there.

### Why is my PDF missing table shading or code backgrounds?

Enable **Background graphics** in the print dialog. Some browsers turn it off by default.

### What is the difference between exporting to PDF and to Word?

A PDF is a fixed layout for reading and printing. A Word (.docx) file is editable. Use PDF to share a finished document and Word when someone still needs to edit it.

### Does it work on my phone?

Yes, in current browsers. On phones the print sheet usually offers *Save as PDF* or a share menu; the exact wording depends on your device.
