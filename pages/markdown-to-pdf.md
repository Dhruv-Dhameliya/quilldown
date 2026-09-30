---
title: Markdown to PDF: Free, Private Online Converter (No Upload)
h1: How to convert Markdown to PDF
h1em: Markdown to PDF
short: Markdown to PDF
card: A clean PDF without uploading anything.
description: Convert Markdown to PDF free in your browser. Check the preview, set the print options and save a selectable PDF. No upload, no sign-up, works offline.
lead: To convert Markdown to PDF, paste it into Quilldown, choose Export → PDF and pick "Save as PDF" in the print dialog. It's free, needs no account, and your text is never uploaded. The rest of this guide covers the settings that make the result look right.
category: convert
order: 4
home: true
published: 2026-09-29
updated: 2026-09-30
scripts: /js/pdf.js
related: markdown-to-word, markdown-to-html, markdown-cheat-sheet
cta: Convert your Markdown to PDF now
ctaText: Paste or open your Markdown, then choose Export → PDF. It runs in your browser, so your text never leaves your device.
---

> [!NOTE]
> **Why no upload matters.** Most online converters send your file to a server to process it. Quilldown doesn't. The PDF is created inside your browser and saved straight to your device, so a résumé, a contract draft or private notes never leave your computer. It also works offline once the page has loaded.

## Convert Markdown to PDF in five steps

Quilldown creates PDFs with your browser's built-in "Save as PDF". That produces sharp, searchable text rather than a blurry picture of the page. Nothing is uploaded: the whole conversion happens on your device.

<ol class="steps">
<li><strong>Open the editor.</strong> Go to <a href="/">Quilldown</a>. Paste your Markdown, type it fresh, or use <strong>Open</strong> to load a <code>.md</code> file. Have a .md file? Press Ctrl+O, or drag the file onto the page, and each file opens in its own tab.</li>
<li><strong>Check the preview.</strong> The right-hand pane shows how the document will look. Fix headings, tables or images now, because it is much quicker than fixing them in a PDF.</li>
<li><strong>Choose Export → PDF.</strong> Your browser's print dialog opens with the document laid out for paper.</li>
<li><strong>Pick “Save as PDF”.</strong> In the dialog, set the destination to <em>Save as PDF</em> (in Chrome and Edge) and adjust paper size and margins if you like.</li>
<li><strong>Save.</strong> Name the file and you're done. The PDF keeps selectable text, headings, tables, code blocks, images and diagrams.</li>
</ol>

If you have never written Markdown before, [what is Markdown](/docs/what-is-markdown) explains the basics in five minutes.

## Save as PDF in your browser

Quilldown hands the document to your browser's print dialog, so the last step looks slightly different depending on where you are. The settings are the ones described in the table below.

| Where you are | What to choose |
| --- | --- |
| Chrome or Edge | Set Destination to "Save as PDF," then click More settings for paper size, margins and Background graphics |
| Firefox | Set the destination to "Save to PDF." The background option may be labeled "Print backgrounds" |
| Mac (Safari or other browsers) | Use the PDF menu at the bottom of the print dialog. The background option may be labeled "Print backgrounds" |
| Phone or tablet | The print sheet usually offers "Save as PDF" or a share menu, and the wording depends on your device |

If the dialog only offers a printer, the destination is set wrong. Change it to Save as PDF.

## What the PDF looks like

The PDF always uses a clean, light, print-friendly theme, even if you write in dark mode. It is easy to read and cheap to print.

- **Headings, lists and tables** keep their structure, with header rows shaded.
- **Code blocks** keep monospace formatting, wrap long lines and use syntax colors.
- **Images and diagrams** are embedded. Mermaid diagrams are drawn in the light theme.
- **Math** written in LaTeX is typeset (see [math in Markdown](/docs/math-in-markdown)).
- **Page breaks** avoid splitting a code block, table, image or quote across two pages, and headings stay with the text that follows.
- **Links** stay clickable in the saved PDF in Chrome and Edge.

## Print-dialog settings that matter

Everything below lives in your browser's print dialog, not in Quilldown, so the labels differ slightly between browsers. In Chrome and Edge, click **More settings** to see all of them.

| Setting | Recommended | Why |
| --- | --- | --- |
| **Destination** | *Save as PDF* (Chrome, Edge). In Firefox pick *Save to PDF*; on a Mac use the *PDF* menu at the bottom of the dialog | Choosing a real printer sends the document to paper instead |
| **Layout** | Portrait for text; landscape for wide tables | Landscape gives a wide table roughly 30 to 40% more width |
| **Paper size** | A4 or Letter, whichever you will print on | Changing it later re-flows every page |
| **Margins** | *Default* for most documents; *Minimum* for dense pages; *None* only if you add your own padding | Text touching the edge of the sheet is hard to read and may be clipped by a printer |
| **Headers and footers** | On for page numbers, date and title; off for a clean page | Contracts, letters and covers usually look better without them |
| **Background graphics** | On | Off removes table-header shading and code-block backgrounds |
| **Scale** | *Default* (100%); try *Fit to printable area* or a value near 80% for a stubborn wide table | Below about 70% body text gets hard to read on paper |

> [!TIP]
> Change one setting at a time and watch the preview on the left of the print dialog. It shows the real page breaks, so you can spot a split table or an orphaned heading before you save.

## Paper size, margins and orientation

Use **A4** for most of the world and **Letter** for the United States and Canada. A PDF made for one size will still open and print on the other, but it will be scaled or cropped, so choose before you save rather than after.

For margins, *Default* suits reports, letters and essays. *Minimum* fits noticeably more per page, which helps a cheat sheet or a long table. Avoid *None* unless you know the printer can reach the edge of the sheet.

Orientation is per PDF, not per page, so you cannot mix portrait and landscape pages in one export. If only one table is wide, it is usually easier to shrink that table than to switch the whole document.

## Three quick ways to use it

Real documents people make with this workflow, with the fastest route for each.

- **A résumé.** Open New → Templates → Résumé / CV, replace the placeholder text, and check the preview. Keep the margins on Default, turn Headers and footers off for a clean page, and export. One page of clean Markdown becomes a one-page PDF.
- **A report or essay with equations and tables.** Write equations in LaTeX between dollar signs, and they're typeset in the PDF. Keep tables to six columns or fewer (or use landscape), and add a page break before each new chapter. Turn Headers and footers on if you want page numbers.
- **Notes or a README as a handout.** Start from the Meeting notes or README template. Turn Background graphics on so code blocks and table headers keep their shading, and use the preview to spot a table that splits awkwardly across pages.

Not sure about the syntax? Keep the [Markdown cheat sheet](/docs/markdown-cheat-sheet) open.

## Try it in 30 seconds

Open a ready-made sample and export it yourself. It has a title and short intro, one small table, a code block, one equation and a page break, so you can see how each element looks in the PDF.

````example title="A sample to export" file=pdf-sample.md
# Quarterly notes

A short intro paragraph, so you can see body text on the page.

| Task | Owner | Due |
| --- | --- | --- |
| Draft the report | Priya | 4 Nov |
| Review figures | Marcus | 8 Nov |

```js
const total = items.reduce((sum, item) => sum + item.price, 0);
```

The area of a circle is $A = \pi r^2$.

<div style="break-after: page"></div>

## Page two

This heading starts on a new page.
````

Click **Open in editor** on the sample, then choose Export → PDF, pick "Save as PDF," and open the file.

## Add your own page breaks

The PDF already avoids splitting code blocks, tables, images and quotes where a page has room to spare. Markdown has no page-break syntax, but you can add a tiny piece of HTML wherever you want a new page to start:

```html
<div style="break-after: page"></div>
```

Put it on its own line with a blank line above and below. Typical uses are a title page, a chapter opening and an appendix.

<div class="pb-mock" role="img" aria-label="Two pages with a page break between them"><div class="pb-page"><b>Page 1</b><i></i><i></i><i></i><i class="s"></i></div><div class="pb-cut"><span>&lt;div style="break-after: page"&gt;&lt;/div&gt;</span></div><div class="pb-page"><b>Page 2</b><i></i><i></i><i class="s"></i></div></div>

- **Do not add one at the very end.** In some browsers it leaves a blank last page.
- **A single block taller than a page must still split.** A very long table or code block cannot be kept whole, so cut it into two blocks yourself.
- **The empty div adds no visible content**, so nothing appears in the text where you place it.

## Long tables and wide code blocks

Tables are where most PDF problems start. A table with six columns or fewer fits portrait paper; beyond that, cell text wraps into narrow, tall columns.

````example title="A table that fits on the page"
| Task | Owner | Due |
| --- | --- | --- |
| Draft the report | Priya | 4 Nov |
| Review figures | Marcus | 8 Nov |
| Send to client | Ana | 11 Nov |
````

Three ways to fix a wide table, in order of effort:

1. **Shorten the headings and cells.** `Q1 revenue` beats `Revenue for the first quarter`.
2. **Switch to landscape** in the print dialog.
3. **Reduce the scale** to 80–90%, or use *Fit to printable area*.

If the table is still too wide, ask whether it should be two tables. The [table editor guide](/docs/markdown-table-generator) shows how to build and reshape tables, including pasting from a spreadsheet.

Code blocks wrap long lines in the PDF, so nothing is cut off at the right edge. A single very long unbroken string, such as a token or URL, may still be clipped, so break it across lines in the source if it matters. Keep code examples short: a block taller than a page has to split.

## Images and diagrams

Images you paste, drop or upload are stored with the document and end up in the PDF. A few habits keep the output tidy:

- **Resize photos before you add them.** Very large images make very large PDFs.
- **Prefer PNG for screenshots and JPEG for photos.**
- **Write alt text**: `![Bar chart of monthly sign-ups](signups.png)`. It costs nothing and helps anyone using a screen reader on the finished document.
- **Expect an image to move to the next page** if it does not fit in the space that is left, because images are not split.

Mermaid diagrams are drawn in the light theme for print. If a diagram looks cramped, split it into two smaller ones; see [Mermaid diagrams in Markdown](/docs/diagrams-in-markdown).

## Fonts, colors and branding

Quilldown's PDF uses its own print theme: Nunito for text and a monospace font for code, in light colors. Every PDF looks the same on every machine, which is a strength for sharing and a limit if you need a corporate typeface, a cover page or a colored header. For that, [export to Word](/docs/markdown-to-word), apply your template there, and save the PDF from Word.

## Add a table of contents

Quilldown does not generate one for you, but for a long document you can write it by hand with links to your headings:

````example title="A hand-written contents list"
## Contents

- [Introduction](#introduction)
- [Results](#results)
- [Next steps](#next-steps)
````

Heading links are the heading text in lowercase with spaces replaced by hyphens. Test one link in the preview before you export; the links stay clickable in Chrome and Edge PDFs.

## Which format should I use: PDF, Word or HTML?

| You want to | Use | Notes |
| --- | --- | --- |
| Send a finished document that nobody edits | **PDF** | Looks the same for every reader |
| Let someone else edit or comment | **Word (.docx)** | See [Markdown to Word](/docs/markdown-to-word) |
| Publish on a website or in an email template | **HTML** | See [Markdown to HTML](/docs/markdown-to-html) |
| Print on paper | **PDF** | Set paper size and margins first |
| Share a single picture of the page | **PNG** | Not searchable; very long documents come out too tall |
| Read on an e-reader | **EPUB** | Reflows to the screen size |

## Troubleshooting a PDF that looks wrong

| What you see | Likely cause | Fix |
| --- | --- | --- |
| Table headers and code blocks have no shading | Background graphics is off | Turn it on in the print dialog |
| Date, title or web address printed on every page | Headers and footers is on | Turn it off |
| No page numbers | Headers and footers is off | Turn it on (Chrome and Edge print the page number there) |
| Table runs off the right edge | Too many columns for the paper | Landscape, a smaller scale or fewer columns |
| Blank page at the end | A page-break div is the last thing in the document | Delete it |
| Big gap before an image or table | The block did not fit, so it moved to the next page | Shrink the image or split the table |
| Formula appears as raw `$…$` text | A space right inside the dollar signs | Write `$x^2$`, not `$ x^2 $` (see [LaTeX math](/docs/math-in-markdown)) |
| Very large file | Large images | Resize the images and export again |
| Dialog offers only a printer | Wrong destination selected | Change the destination to *Save as PDF* |
| Layout looks slightly different from another browser | Each browser uses its own print engine | Check the print preview in the dialog before you save |
| Text is cut off at the right edge | A very long unbroken string, such as a token or web address | Break it across lines in the Markdown source |

## A quick checklist before you export

<ol class="steps">
<li><strong>Read the preview top to bottom.</strong> Look for headings that are really plain text (a missing space after <code>#</code>) and lists that did not start.</li>
<li><strong>Check tables and images</strong> for width.</li>
<li><strong>Add page breaks</strong> only where you need them.</li>
<li><strong>Set paper size, margins and background graphics</strong> in the print dialog.</li>
<li><strong>Save, then open the PDF</strong> and scroll it once before sending it.</li>
</ol>

Keep the syntax handy with the [Markdown cheat sheet](/docs/markdown-cheat-sheet).

## What this method can't do

<div class="fx-limits pdf-limits"><p class="fx-limits-intro">Knowing the limits saves time. If you need one of these, there's a route around it.</p><ul><li><b>Custom fonts, a cover page or a colored header.</b> The PDF uses Quilldown's print theme. Export to Word, apply your template, and save the PDF from there.</li><li><b>Mixed page orientation.</b> Orientation applies to the whole PDF, so you can't mix portrait and landscape pages.</li><li><b>An automatic table of contents.</b> Write one by hand with heading links.</li><li><b>Styled page numbers.</b> The print dialog controls headers and footers, and you can only turn them on or off.</li><li><b>Page breaks from Markdown alone.</b> There's no syntax, so add the small HTML snippet.</li><li><b>A block taller than a page.</b> A very long table or code block has to split across pages, so cut it in two yourself.</li><li><b>Identical output in every browser.</b> Each browser has its own print engine, so check the preview in the dialog.</li></ul></div>

## Other ways to convert Markdown to PDF

| Method | Good for | Trade-offs |
| --- | --- | --- |
| **Quilldown (browser)** | Quick, private conversions; live preview | Uses the browser's print engine, so there is no custom template |
| **Pandoc** | Automated, scripted pipelines and books | Command line; PDF output usually needs LaTeX or another PDF engine installed |
| **Editor extensions** | Converting inside your code editor | Depends on the extension; often needs extra tools |
| **Word or Google Docs** | Documents that need heavy layout work | Extra step; see [Markdown to Word](/docs/markdown-to-word) |
| **Online converter websites** | One-off files, no setup | Many upload your file to a server, so check the privacy policy before you use one for private text |

Quilldown keeps your text in your browser and nothing is uploaded. If you want to know who builds it, see the [About page](/about).

## Frequently asked questions

### How do I convert Markdown to PDF for free?

Open Quilldown, paste or open your Markdown, choose **Export → PDF**, and select *Save as PDF* in the print dialog that appears. It is free, needs no account and runs entirely in your browser, so your Markdown is never sent to a server. It also works offline once the page has loaded.

### Is the text in the PDF selectable and searchable?

Yes. The PDF is generated from the page's text, not from a screenshot, so you can select, copy and search it. If you want a picture of the document instead, Quilldown can also export a PNG image, but that image is not searchable.

### How do I add page numbers to my PDF?

Turn on **Headers and footers** in the print dialog. Chrome and Edge then print the page number, date and document title on each page. The dialog controls these, so you cannot format them, and you can turn them off for a clean page.

### Can I change the fonts or colors of the PDF?

The PDF uses Quilldown's print theme, with Nunito for text and a monospace font for code, so it looks the same everywhere. If you need custom branding, [export to Word](/docs/markdown-to-word), style it there and save a PDF from Word.

### Why is my PDF missing table shading or code backgrounds?

Enable **Background graphics** in the print dialog. Some browsers turn it off by default, and with it off, shaded table headers and code-block backgrounds are dropped. Firefox and Safari may label the option *Print backgrounds*.

### How do I start a new page in the middle of a document?

Markdown has no page-break syntax, so add an empty HTML `div` on its own line: `<div style="break-after: page"></div>`. Everything after it starts on a new page. Avoid putting one at the very end of the document, where it can leave a blank page.

### What is the difference between exporting to PDF and to Word?

A PDF is a fixed layout for reading and printing. A Word (.docx) file is editable. Use PDF to share a finished document and Word when someone still needs to edit it. The [Markdown to Word guide](/docs/markdown-to-word) covers that route in detail.

### Does it work on my phone?

Yes, in current browsers. On phones the print sheet usually offers *Save as PDF* or a share menu; the exact wording depends on your device. On a phone the editor shows one pane at a time, though writing is easier on a larger screen.

### How do I convert a .md file to PDF?

Open the file in Quilldown (Ctrl+O, or drag it onto the page), choose Export → PDF and pick "Save as PDF" in the print dialog. The .md, .markdown and .txt formats all open.

### Is it really private? Is my Markdown uploaded anywhere?

No. The PDF is generated in your browser and saved to your device. You can check by opening your browser's network panel while you export, and you'll see nothing carrying your text.

### Does it work offline?

Yes. After your first visit, the site is cached, so it loads and exports without a connection.

### Does it work on Mac and Windows?

Yes, in any current browser. On Windows, and in Chrome or Edge on a Mac, choose "Save as PDF" as the destination. Otherwise, use the PDF menu at the bottom of the Mac print dialog.

### Can I convert several Markdown files to PDF at once?

Each document is exported on its own, so open the file in its tab and export it. For automated or batch jobs, a command-line tool such as Pandoc is a better fit.

### How do I make the PDF file smaller?

Resize large images before you add them, since images are the usual reason a PDF is big. Then export again.

### Can I convert only part of a document?

Copy the section you want into a new tab (New, then paste) and export that tab.
