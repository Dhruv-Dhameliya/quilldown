---
title: Markdown Table Generator: Free Visual Editor and Syntax Guide
h1: Markdown table generator and syntax guide
h1em: syntax guide
short: Markdown tables
card: Build them in a grid, paste from Excel.
description: Make a Markdown table without typing pipes: use the visual editor, paste from Excel or Sheets, set alignment. Full syntax, fixes and when to skip tables.
lead: Build a Markdown table in a visual grid, paste rows from Excel or Google Sheets, and get neatly aligned Markdown back. The full syntax, common mistakes and limits are below. It runs in your browser, so your data is never uploaded.
category: write
order: 7
home: true
published: 2026-09-29
updated: 2026-09-30
scripts: /js/tools.js
related: markdown-cheat-sheet, markdown-to-word, readme-template
cta: Build a table in the visual editor
ctaText: Click the Table button in Quilldown, type or paste your data, and get clean Markdown. Free and private, nothing is uploaded.
---

> [!TIP]
> **Quick answer.** A Markdown table is a header row, a delimiter row of dashes, and any number of body rows, with pipes separating the columns. The first line is the column names between pipes, the second line is dashes between pipes, and each line after that is a row. Colons in the dashes set alignment. Or skip the typing: click the Table button in Quilldown, fill in a grid, and it writes the Markdown for you.

<section class="tool" data-tool="table" aria-label="Markdown table generator"></section>

````example title="The basic table"
| Name  | Role     | Team    |
| ----- | -------- | ------- |
| Ada   | Engineer | Core    |
| Lin   | Designer | Product |
````

<div class="cs-jump"><a href="#make-a-markdown-table-in-the-visual-editor">Use the visual editor</a><a href="#turn-excel-google-sheets-or-csv-into-a-markdown-table">Paste from Excel or Sheets</a><a href="#column-alignment">Align columns</a><a href="#common-table-problems">Fix a broken table</a><a href="#handling-wide-tables">Wide tables</a><a href="#limits-of-markdown-tables-and-workarounds">Merged cells</a></div>

## Make a Markdown table in the visual editor

The quickest way to make a Markdown table is to skip the pipes and dashes. Quilldown's table editor lets you fill in a grid and writes the Markdown for you.

<ol class="steps">
<li><strong>Open <a href="/">Quilldown</a></strong> and click the <strong>Table</strong> button in the toolbar.</li>
<li><strong>Type into the grid.</strong> The first row is the header. Press <kbd>Tab</kbd> or <kbd>Enter</kbd> to move between cells. Pressing Tab in the last cell adds a new row.</li>
<li><strong>Set alignment.</strong> Click the icon above a column to cycle default, left, center and right.</li>
<li><strong>Add or remove</strong> rows and columns with <em>+ Row</em>, <em>+ Column</em> and the × buttons.</li>
<li><strong>Click Insert table.</strong> Neatly padded Markdown appears in your document.</li>
</ol>

The same button also **edits an existing table**: put your cursor inside any Markdown table and click **Table** to reopen it in the grid, change what you need and choose **Update table**. That is far easier than adding a column by hand, which means touching every row.

If you want a starting point, **New → Templates** includes a tables template you can adapt.

## Turn Excel, Google Sheets or CSV into a Markdown table

You don't need to retype spreadsheet data.

- **Paste into the grid.** Copy cells in Excel or Google Sheets, open the table editor, click the first cell and paste. The grid grows to fit.
- **Convert selected text.** Paste tab-separated (or consistently comma-separated) rows into the editor, select them, and click **Table**. The button offers **Convert to table**.

A few things to check before you copy from a spreadsheet:

- **Unmerge cells.** Markdown has no merged cells, so a merged header has to become separate cells. Repeat or leave blank as needed.
- **Copy values, not formulas.** What you see in the cells is what carries over, so round or format numbers first.
- **Remove line breaks inside cells** or plan to replace them with `<br>`, described below.
- **Watch commas in CSV.** A comma inside a quoted CSV field, such as `"Smith, Jo"`, looks like a column break to any tool that splits blindly. Open the CSV in a spreadsheet and copy the cells instead of pasting the raw file.
- **Trim to what matters.** A 40-column export is unreadable as Markdown. Copy the columns your reader needs.

Spreadsheets put tab-separated text on the clipboard when you copy cells, which is why pasting them works so smoothly. Pipes in your data, such as `a|b`, are the exception: check for them after converting, because each one needs escaping.

## Four common jobs, fastest route for each

- **A spreadsheet range for a README or docs page.** Copy the cells in Excel or Google Sheets (values, not formulas, and unmerge any merged cells), open the table editor, click the first cell and paste. Set number columns to right-aligned, then insert. Read the [README guide](/docs/readme-template) for where a table earns its place.
- **A comparison table for a blog post.** Keep one subject per row and a few words per cell. If you need a paragraph per option, use short sections instead. Add a sentence before the table saying what it compares, since Markdown has no caption.
- **Add a column to a table you already have.** Put your cursor inside the table, click Table, choose + Column, fill it in and choose Update table. That's far quicker than touching every row by hand.
- **A status table with symbols.** Use emoji shortcodes such as the white check mark, and put a word beside each one (for example, "Passed") so the meaning doesn't depend on the symbol alone. See the [emoji shortcodes guide](/docs/emoji-in-markdown).

## Markdown table syntax

A table is a header row, a delimiter row of dashes, and any number of body rows. Pipes (<code>&#124;</code>) separate the columns, as in the basic table at the top of this page.

The rules that decide whether it renders as a table:

- **The delimiter row is required**, and it must sit directly under the header with no blank line between.
- **The number of header cells must equal the number of delimiter cells.** If they differ, the parser gives up and shows plain text.
- **Use at least three dashes per column** (`---`). GitHub Flavored Markdown accepts fewer, but some parsers do not.
- **Dashes do not need to line up.** Padding is cosmetic, and only the column count matters. Aligning the source makes it easier to read, and the table editor does it for you. Wide characters such as emoji or CJK text can throw off the visual alignment in a monospace editor without changing the output.
- **The outer pipes are optional** in GFM, so `Name | Role` works. Keep them anyway: they make tables easier to scan and work everywhere.
- **Body rows can vary.** In GFM, a short row is padded with empty cells and extra cells beyond the header count are dropped without warning. Other parsers are stricter, so keep every row the same length.
- **The table ends at the first blank line.** Leave one before the table and one after it.

### Column alignment

Colons in the delimiter row set the alignment of each column: `:---` left, `:---:` center and `---:` right. Without colons the column uses the default, which is usually left. Right-align numbers so digits line up, and center only short labels.

````example title="Left, center and right alignment"
| Product  | Qty |   Price |
| :------- | :-: | ------: |
| Notebook |  2  |    4.50 |
| Pen      | 10  |    1.20 |
| **Total**|     | **6.70**|
````

Alignment is set per column, not per cell, and it applies to the header cell as well. You cannot center one row and right-align another.

### Formatting inside cells

Cells can contain inline Markdown: bold, italic, code, links, images, emoji and math. Block-level Markdown is a different story.

````example title="Inline formatting in cells"
| Feature | Status | Notes |
| ------- | :----: | ----- |
| **Sync scroll** | :white_check_mark: | Follows the *block* you're editing |
| `Ctrl + F` | :white_check_mark: | [Find and replace](/) |
````

A cell **cannot** contain headings, bullet lists, code blocks, quotes or several paragraphs, because a table row must fit on one line of source text. See the limits table below for workarounds. If you want emoji in a status column, the [emoji shortcode guide](/docs/emoji-in-markdown) lists what is available.

### Pipes, line breaks and empty cells

- **A literal pipe** inside a cell must be escaped as `\|`. This applies inside code spans too.
- **A line break** inside a cell needs the HTML tag `<br>`. Pressing Enter in your source ends the row.
- **An empty cell** is simply two pipes with nothing (or spaces) between them.

````example title="Escaped pipe and line break"
| Command | Meaning |
| ------- | ------- |
| `a \| b` | Either a **or** b |
| Steps | First<br>Second |
| Empty |  |
````

## Handling wide tables

A table has no line wrapping in the source, so a wide one becomes a long, unreadable line in your editor and may overflow the page once rendered. In practice:

1. **Cut columns.** Ask what the reader would miss. Notes and IDs often can go.
2. **Shorten headings.** "Q3 revenue (USD)" can be "Q3 USD" if the title already says revenue.
3. **Turn it on its side.** A table with 10 columns and 3 rows often reads better as 3 columns and 10 rows.
4. **Split it.** Two 5-column tables with a heading each beat one 10-column table.
5. **Move detail out.** Put long text in a footnote or in the paragraph after the table, and keep cells to a few words. Reference-style links (`[text][1]`) also keep cells short.
6. **Check the destination.** Websites may scroll or squash a wide table. In a PDF or Word file the page width limits it, and landscape orientation can help (see [Markdown to Word](/docs/markdown-to-word)).

## When a table is the wrong choice

Use a table for data with rows and columns that a reader compares. For everything else, another structure works better.

| Your content | Better choice |
| --- | --- |
| Steps in order | A numbered list |
| A list of items with one description each | A bullet list, or bold labels followed by text |
| Two columns of key and long value | A heading per item, or a definition-style list |
| Feature comparison with paragraphs in cells | Short sections, one per option |
| Page layout or side-by-side text | CSS or your platform's layout blocks, not a table |
| One column of anything | A list |
| Numbers you want to chart | A chart, or a [Mermaid diagram](/docs/diagrams-in-markdown) if it is a flow rather than data |

A good table has one clear subject per row, a header that names each column, and cells that hold a word, a number or a short phrase.

## Limits of Markdown tables (and workarounds)

| You want… | Markdown can… | Workaround |
| --- | --- | --- |
| Merged or spanning cells | No | Use an HTML `<table>` with `colspan` / `rowspan`, or merge cells in Word after export |
| Bullet lists inside a cell | No | Use `<br>` and a bullet character, or use HTML |
| A table with no header | No | Leave the header cells empty: `\| \| \|` |
| A caption | No | Put a sentence or a heading above the table, or use an HTML `<caption>` |
| Column widths | No | Keep text short, or use HTML for fixed widths |
| Sortable or interactive tables | No | Markdown tables are static |
| Multi-line cells | Only with `<br>` | Write one line per cell, or use HTML |

If you switch to an HTML table for merged cells, write the tags flush left without blank lines between them. A blank line ends the HTML block, and indented lines after it can become a code block. The [Markdown to HTML guide](/docs/markdown-to-html) explains how raw HTML mixes with Markdown.

## Common table problems

| Problem | Cause and fix |
| --- | --- |
| The table shows as plain text | The delimiter row is missing, or has a different number of columns than the header. Add <code>&#124; --- &#124; --- &#124;</code> |
| A row has the wrong number of cells | Every row should have the same number of pipes as the header. Extra cells are dropped silently in GFM |
| The table won't start | Leave a blank line before it |
| A pipe character splits a cell unexpectedly | Put a backslash in front of the pipe to show it literally |
| Text after the table becomes a table row | Leave a blank line after the table |
| A `<br>` shows as text | It is inside a code span. Move it outside the backticks |
| A list or heading in a cell disappears | Cells only hold inline content. Rewrite it as text, or use HTML |
| Wide table runs off the page | Shorten headings, drop a column, or export in landscape from the print dialog |
| Columns look uneven in the editor | Padding is cosmetic. The rendered table is fine, or reopen it in the table editor to re-pad |

## Accessibility for tables

- **Keep the header row meaningful.** The first row becomes the header cells that screen readers announce with each value, so name every column. An empty header, though a valid trick, gives no context to someone who cannot see the layout.
- **Use tables only for data.** Layout tables confuse assistive technology.
- **Do not rely on color or emoji alone.** A green tick in a status column needs a word beside it, for example "✅ Passed".
- **Give the table a lead-in.** Markdown has no caption, so one sentence before it tells readers what they are about to see and helps everyone.
- **Keep cells short and tables small.** Long cells and many columns are hard to navigate with a screen reader or on a phone.

## What happens to your table when you export

A Markdown table is ordinary Markdown, so it comes along when you turn a document into another format. Here's what to expect in each.

| Where it ends up | What you get | Worth knowing |
| --- | --- | --- |
| **GitHub, issues and READMEs** | A rendered table | Part of GitHub Flavored Markdown |
| **Word (.docx)** | A Word table with borders and a shaded header row | Keep cells short. Merge cells in Word afterwards if you need to |
| **HTML** | A table element with a header and a body | Some converters write alignment as an attribute and others as an inline style |
| **PDF** | A table with a shaded header row | Turn on Background graphics in the print dialog, or the shading is dropped |

For the details, see [Markdown to Word](/docs/markdown-to-word), [Markdown to HTML](/docs/markdown-to-html) and [Markdown to PDF](/docs/markdown-to-pdf).

## Use your table elsewhere

Tables are part of GitHub Flavored Markdown, so they render in READMEs, issues and pull requests. The [README guide](/docs/readme-template) shows where a table earns its place. Tables are ordinary Markdown, so they come along when you turn a document into another format. [Markdown to Word](/docs/markdown-to-word) and [Markdown to HTML](/docs/markdown-to-html) explain both routes. For the rest of the syntax, keep the [Markdown cheat sheet](/docs/markdown-cheat-sheet) nearby.

## Other ways to make a Markdown table

| Method | Good for | Trade-offs |
| --- | --- | --- |
| **Quilldown's table editor** | A visual grid, pasting from spreadsheets, editing an existing table | Runs in the browser, and there's nothing to install |
| **Typing it by hand** | Small tables of two or three columns | Tedious to align and easy to get wrong as tables grow |
| **Editor plugins or extensions** | Reformatting tables inside your code editor | Depends on the plugin, and you set it up yourself |
| **Online generator websites** | One-off tables | Check that the tool runs in your browser before you paste private data |

## Frequently asked questions

### How do I make a table in Markdown?

Write a header row with pipes, add a delimiter row of dashes under it, then add body rows. For example, `| Name | Role |` on the first line and `| --- | --- |` on the second. Or click the **Table** button in Quilldown and fill in a grid, and it writes the Markdown for you.

### How do I align columns in a Markdown table?

Add colons to the delimiter row: `:---` for left, `:---:` for center and `---:` for right alignment. The setting applies to the whole column, header included. In Quilldown's table editor, click the icon above a column to cycle the options.

### Can I paste from Excel or Google Sheets?

Yes. Open the table editor and paste, and the cells fill the grid. You can also paste rows into the document, select them and choose **Table → Convert to table**. Unmerge any merged cells first, because Markdown tables cannot represent them.

### How do I put a line break or a pipe inside a table cell?

Use `<br>` for a line break, because pressing Enter would end the row. For a literal pipe, write `\|`. Both work in GitHub Flavored Markdown, and the pipe needs escaping inside code spans too.

### Can a Markdown table have merged cells or a list inside a cell?

No. Standard Markdown tables cannot span rows or columns, and cells only hold inline content. Use an HTML table when you need merged cells, or use `<br>` to stack short lines inside a cell.

### Do tables work on GitHub?

Yes. Tables are part of GitHub Flavored Markdown, so they render in READMEs, issues, pull requests and wikis. Other parsers vary slightly, so keep the outer pipes, three or more dashes, and equal-length rows for the widest compatibility. See our [README guide](/docs/readme-template).

### Does the table editor upload my data?

No. It runs entirely in your browser, so your data never leaves your device.

### How do I convert CSV to a Markdown table?

Paste consistently comma-separated or tab-separated rows into the Quilldown editor, select them and click Table, then choose Convert to table. If your CSV has quoted commas, such as a name written as "Smith, Jo" in quotes, open it in a spreadsheet first and copy the cells instead.

### How do I add a column to an existing Markdown table?

Put your cursor inside the table and click Table to reopen it in the grid. Choose + Column, fill it in, and choose Update table. It's much easier than editing every row by hand.

### How do I make a Markdown table without a header?

Markdown tables need a header row, so leave the header cells empty. The table then shows no visible headings, though screen readers get no column names, so use it sparingly.

### Can I put links, images or code in a table cell?

Yes for inline content: links, images, bold, italic, emoji and inline code all work. No for blocks such as code fences, headings and bullet lists, because a row has to fit on one line of source text.

### How do I copy a Markdown table into Word or Google Docs?

Export a Word (.docx) file and the table becomes a real Word table with borders and a shaded header row. For an existing Google Doc, click Copy for Docs on the preview and paste it in. See [Markdown to Word](/docs/markdown-to-word).

### Why isn't my Markdown table rendering?

The usual causes are a missing delimiter row, a different number of columns in the header and the delimiter row, or no blank line before the table. Check the common problems section above for the full list.

### Can I sort a Markdown table?

No. Markdown tables are static. Sort the data in a spreadsheet first, then paste it into the table editor.
