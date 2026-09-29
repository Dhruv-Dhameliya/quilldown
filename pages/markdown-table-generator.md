---
title: Markdown Table Generator and Syntax Guide
h1: Markdown table generator and syntax guide
short: Markdown tables
card: Build Markdown tables in a visual grid, paste from Excel or Sheets, and learn the syntax.
description: Create Markdown tables without typing pipes. Use the visual table editor, paste from Excel or Google Sheets, set alignment — plus the full table syntax explained.
lead: Build Markdown tables in a visual grid — no pipes to count — paste rows straight from Excel or Google Sheets, and get neatly aligned Markdown back. Includes the full syntax if you'd rather type it.
category: write
order: 6
home: true
published: 2026-09-29
updated: 2026-09-29
related: markdown-cheat-sheet, markdown-to-word, readme-template
cta: Build a table in the visual editor
ctaText: Click the Table button in Quilldown, type or paste your data, and get clean Markdown. Free and private — nothing is uploaded.
---

## Make a Markdown table in the visual editor

Typing pipes and dashes by hand gets tedious fast. Quilldown's table editor lets you fill in a grid instead, and writes the Markdown for you.

<ol class="steps">
<li><strong>Open <a href="/">Quilldown</a></strong> and click the <strong>Table</strong> button in the toolbar.</li>
<li><strong>Type into the grid.</strong> The first row is the header. Press <kbd>Tab</kbd> or <kbd>Enter</kbd> to move between cells — pressing Tab in the last cell adds a new row.</li>
<li><strong>Set alignment.</strong> Click the icon above a column to cycle default, left, centre and right.</li>
<li><strong>Add or remove</strong> rows and columns with <em>+ Row</em>, <em>+ Column</em> and the × buttons.</li>
<li><strong>Click Insert table.</strong> Neatly padded Markdown appears in your document.</li>
</ol>

The same button also **edits an existing table**: put your cursor inside any Markdown table and click **Table** to reopen it in the grid, change what you need and choose **Update table**.

## Turn Excel, Google Sheets or CSV into a Markdown table

You don't need to retype spreadsheet data:

- **Paste into the grid.** Copy cells in Excel or Google Sheets, open the table editor, click the first cell and paste — the grid grows to fit.
- **Convert selected text.** Paste tab-separated (or consistently comma-separated) rows into the editor, select them, and click **Table**. The button offers **Convert to table**.

## Markdown table syntax

A table is a header row, a separator row of dashes, and any number of body rows. Pipes (`|`) separate the columns.

````example title="The basic table"
| Name  | Role     | Team    |
| ----- | -------- | ------- |
| Ada   | Engineer | Core    |
| Lin   | Designer | Product |
````

The separator row is required. The dashes don't need to line up — only the number of columns has to match — but aligning them makes the source easier to read (the table editor does this for you).

### Column alignment

Colons in the separator row set the alignment of each column: `:---` left, `:---:` centre and `---:` right.

````example title="Left, centre and right alignment"
| Product  | Qty |   Price |
| :------- | :-: | ------: |
| Notebook |  2  |    4.50 |
| Pen      | 10  |    1.20 |
| **Total**|     | **6.70**|
````

### Formatting inside cells

Cells can contain inline Markdown: bold, italic, code, links, images, emoji and math.

````example title="Inline formatting in cells"
| Feature | Status | Notes |
| ------- | :----: | ----- |
| **Sync scroll** | :white_check_mark: | Follows the *block* you're editing |
| `Ctrl + F` | :white_check_mark: | [Find and replace](/) |
````

### Pipes, line breaks and empty cells

- **A literal pipe** inside a cell must be escaped as `\|`.
- **A line break** inside a cell needs the HTML tag `<br>`.
- **An empty cell** is simply two pipes with nothing (or spaces) between them.

````example title="Escaped pipe and line break"
| Command | Meaning |
| ------- | ------- |
| `a \| b` | Either a **or** b |
| Steps | First<br>Second |
| Empty |  |
````

## Limits of Markdown tables (and workarounds)

| You want… | Markdown can… | Workaround |
| --- | --- | --- |
| Merged or spanning cells | No | Use an HTML `<table>` with `colspan` / `rowspan`, or merge cells in Word after export |
| Bullet lists inside a cell | No | Use `<br>` and a bullet character, or use HTML |
| A table with no header | No | Leave the header cells empty: `\| \| \|` |
| Column widths | No | Keep text short, or use HTML for fixed widths |
| Sortable or interactive tables | No | Markdown tables are static |

## Common table problems

| Problem | Cause and fix |
| --- | --- |
| The table shows as plain text | The separator row is missing or has fewer dashes than columns — add `\| --- \| --- \|` |
| A row has the wrong number of cells | Every row should have the same number of pipes as the header |
| The table won't start | Leave a blank line before it |
| A pipe character splits a cell unexpectedly | Put a backslash in front of the pipe to show it literally |
| Wide table runs off the page | Shorten headings, drop a column, or export in landscape from the print dialog |

Need to use the table elsewhere? Read how to [convert Markdown to Word or Google Docs](/guides/markdown-to-word) or [to HTML](/guides/markdown-to-html).

## Frequently asked questions

### How do I make a table in Markdown?

Write a header row with pipes, add a separator row of dashes under it, then add body rows. Or click the **Table** button in Quilldown and fill in a grid — it writes the Markdown for you.

### How do I align columns in a Markdown table?

Add colons to the separator row: `:---` for left, `:---:` for centre and `---:` for right alignment.

### Can I paste from Excel or Google Sheets?

Yes. Open the table editor and paste — the cells fill the grid. You can also paste rows into the document, select them and choose **Table → Convert to table**.

### Do tables work on GitHub?

Yes. Tables are part of GitHub Flavored Markdown, so they render in READMEs, issues and pull requests. See our [README guide](/guides/readme-template).

### Can a Markdown table have merged cells?

No. Standard Markdown tables can't span rows or columns. Use an HTML table when you need that.

### Does the table editor upload my data?

No. It runs entirely in your browser — your data never leaves your device.
