# Convert Markdown to Word (.docx) and Google Docs

> Convert Markdown to Word (.docx) or paste it into Google Docs with real headings, tables and footnotes. Free, private, nothing uploaded. Includes fixes.

Source: <https://quilldown.vercel.app/docs/markdown-to-word>  
Updated: 2026-09-30

<div class="route-box"><b>Where is it going?</b><a href="#method-1-export-a-word-docx-file"><span>A new Word file to send or store</span><em>Export → Word (.docx)</em></a><a href="#method-2-paste-into-google-docs-with-copy-for-docs"><span>A section for an existing Google Doc</span><em>Copy for Docs</em></a><a href="#method-1-export-a-word-docx-file"><span>A file for Pages or LibreOffice</span><em>Export a .docx and open it there</em></a></div>

> [!NOTE]
> **Why no upload matters.** Many online converters send your file to a server to process it. Quilldown doesn't. The Word file is created inside your browser and saved straight to your device, and Copy for Docs uses your clipboard, so a draft contract, a client report or private notes never leave your computer. It also works offline once the page has loaded.

## Two ways to convert Markdown to Word

Quilldown gives you a file route and a clipboard route. Pick by where the content needs to end up.

| | **Export → Word (.docx)** | **Copy for Docs** |
| --- | --- | --- |
| **Result** | A real `.docx` file you can open in Word, Google Docs, Pages or LibreOffice | Formatted text on your clipboard |
| **Best for** | Sending or storing a finished document | Pasting into an existing Google Doc or Word file |
| **Footnotes** | Real Word footnotes | Whatever the destination app makes of them |
| **Where** | Export menu → Word (.docx) | Preview pane → Copy for Docs |

If you are new to the syntax, [what is Markdown](/docs/what-is-markdown) is a five-minute primer.

## Method 1: export a Word (.docx) file

<ol class="steps">
<li><strong>Open <a href="/">Quilldown</a></strong> and paste, type or open your Markdown. Have a .md file? Press Ctrl+O, or drag the file onto the page, and each file opens in its own tab.</li>
<li><strong>Check the preview</strong> on the right.</li>
<li><strong>Choose Export → Word (.docx).</strong> The file downloads straight away.</li>
<li><strong>Open it in Word</strong>, or upload it to Google Drive and open it with Google Docs.</li>
</ol>

The file is a genuine Word document, not a web page in disguise. Word may open a freshly downloaded file in Protected View; click **Enable Editing** to work on it.

### What becomes what

| In Markdown | In the Word file |
| --- | --- |
| `#` to `######` headings | Real Heading 1 to 6 styles, sized **23, 17, 14 and 12 pt**, so the Navigation Pane and a table of contents work |
| `-` and `1.` lists, nested lists | Bulleted and numbered lists with their nesting |
| `- [x]` and `- [ ]` task lists | Checked (☑) and unchecked (☐) items |
| Tables | Word tables with borders and a shaded header row |
| `[text](url)` | Clickable hyperlinks |
| Bold, italic, underline, strikethrough, highlight, superscript, subscript | The matching character formatting |
| `` `code` `` and fenced code | Monospace text with a shaded background |
| `> [!NOTE]` callouts | Bordered paragraphs |
| Images and Mermaid diagrams | Pictures embedded in the document |
| `[^1]` footnotes | Real Word footnotes |

## What does not carry over

A Word file cannot hold everything Markdown can express. Know these before you send the file.

| Content | What you get in Word | What to do |
| --- | --- | --- |
| **LaTeX math** (`$…$`, `$$…$$`) | The TeX source as plain text, not a native equation | Retype key equations in Word's equation editor, or send a [PDF](/docs/markdown-to-pdf) |
| **Mermaid diagrams** | A picture, so you cannot edit the nodes in Word | Keep the Markdown as the source and re-export after changes |
| **Merged table cells** | Not possible; Markdown tables have none | Merge cells in Word afterwards |
| **Fonts and colors** | Word's defaults for the styles above | Change the styles once in Word (see below) |

> [!NOTE]
> Equations are the most common surprise. A line such as `$E = mc^2$` arrives as those literal characters. If your document is mostly math, a PDF is the safer format; see [LaTeX math in Markdown](/docs/math-in-markdown).

**Also worth knowing**

<div class="fx-limits word-limits"><ul><li><b>No Word import.</b> Quilldown opens Markdown and text files, not Word files. It exports to .docx, but it doesn't import one.</li><li><b>Review changes don't flow back.</b> Comments and tracked changes made in Word don't flow back to your Markdown. If reviewers mark up the .docx, apply their edits to the Markdown yourself, then export again.</li><li><b>No contents page.</b> A contents page isn't generated in the file, but Word can build one from the real headings (References → Table of Contents).</li><li><b>Task-list boxes are symbols.</b> They become ☑ and ☐ symbols, not clickable checkboxes.</li></ul></div>

## Method 2: paste into Google Docs with Copy for Docs

Google Docs uses point sizes, and it applies your own font to anything that does not specify one. **Copy for Docs** is built around that: it copies your formatted document using point sizes and *no font family*, so the text picks up your document's font.

| Element | Size copied |
| --- | --- |
| Heading 1 | **23 pt**, bold |
| Heading 2 | **17 pt**, bold |
| Heading 3 | **14 pt**, bold |
| Heading 4 to 6 | 12 pt, bold |
| Body text, lists and tables | **12 pt** |
| Code | 11 pt monospace |

<ol class="steps">
<li><strong>Write your Markdown</strong> in <a href="/">Quilldown</a>.</li>
<li>On the <strong>Preview</strong> pane, click <strong>Copy for Docs</strong>.</li>
<li><strong>Click into your Google Doc</strong> where the content should go.</li>
<li>Press <kbd>Ctrl</kbd> + <kbd>V</kbd> (<kbd>⌘</kbd> + <kbd>V</kbd> on a Mac). Use the normal paste, <em>not</em> “paste without formatting”, which would strip the styling.</li>
</ol>

Headings are copied as real heading elements, so Google Docs usually maps them to its own Heading styles and the document outline on the left works.

### Why no font is set

Web pages and word processors handle fonts differently. If the copied text named a font, Google Docs would keep it, and your pasted section would sit in a different typeface from the rest of the document. Leaving the font out lets the destination decide, so the paste blends in with the surrounding text.

<div class="docs-demo" aria-label="The same pasted text in two documents"><div class="dd-doc dd-serif">A document in a serif font<div class="dd-h">Project update</div><p>The launch is on track. Two items need a decision.</p></div><div class="dd-doc dd-sans">A document in a sans font<div class="dd-h">Project update</div><p>The launch is on track. Two items need a decision.</p></div></div>

The same copied text takes on each document's font, while the sizes stay the same: headings at 23, 17 and 14 pt, body text at 12 pt.

> [!TIP]
> Pasting into an existing document? Set that document's Normal text and heading styles first. The pasted text then follows them, and you can update every heading later with the **Update … to match** option under **Format → Paragraph styles**.

## Pasting into Word or Pages

Copy for Docs is designed for Google Docs, but the clipboard content is ordinary formatted text, so you can also paste it into other apps. Results vary by app and paste option: in Word, the paste-options button that appears after pasting lets you choose whether to keep source formatting or match the destination. For anything you plan to keep or send, the `.docx` export is more predictable because it uses real Word styles.

The **Copy** menu has other routes too. **Copy formatted** puts rich text on the clipboard for general use, **Copy HTML** gives you the markup for a web page or email template, and **Copy Markdown** gives back the source. See [Markdown to HTML](/docs/markdown-to-html) if the destination is a web page.

## Opening a .docx in Google Docs

<ol class="steps">
<li>Go to <strong>drive.google.com</strong> and choose <strong>New → File upload</strong>, then pick the exported <code>.docx</code>.</li>
<li>Right-click the file and choose <strong>Open with → Google Docs</strong>.</li>
<li>Optionally use <strong>File → Save as Google Docs</strong> to keep a native copy.</li>
</ol>

## Which route should I use?

| Situation | Best route |
| --- | --- |
| Sending a finished document to a colleague or client | Export a **.docx** |
| Sending something no one will edit | Export a [PDF](/docs/markdown-to-pdf) |
| Adding a section to an existing Google Doc | **Copy for Docs** |
| Document has footnotes | **.docx** (real footnotes) |
| Document is full of equations | [PDF](/docs/markdown-to-pdf) |
| Content is going onto a web page | **Copy HTML** or the [HTML guide](/docs/markdown-to-html) |
| Working in Pages or LibreOffice | Export a **.docx** and open it there |

## Four common jobs, fastest route for each

- **Send a draft to a colleague or client who uses Word.** Export a .docx and send the file. Headings arrive as real Word styles, tables keep their borders, and footnotes are real footnotes. If they see a yellow bar when they open it, tell them to click Enable Editing, which is Word's Protected View for downloaded files.
- **Add a section to a Google Doc you already have.** Click Copy for Docs, click into the document where the section belongs, and paste with Ctrl+V. Set the document's Normal text and heading styles first, because the pasted text then follows them.
- **Clean up text copied from an AI chat.** If a chat assistant gave you an answer full of # signs, asterisks and pipe characters, paste it into Quilldown and the preview turns it into real headings, bold text, lists and tables. Then use Copy for Docs for Google Docs, or export a .docx for Word. Check tables and equations in the preview first, since equations arrive in Word as TeX text.
- **Turn meeting notes or a report into a Word file.** Start from the Meeting notes template (New → Templates), write your notes, and export a .docx. Use a heading for each section, keep tables to short cells, and add a contents page in Word if the document is long.

## What a document that converts well looks like

Word conversions go best when the Markdown is structured the way a Word document would be: headings for sections, real lists, and simple tables.

**A memo that converts cleanly**

````markdown
# Launch memo

## Project update

The launch is on track. Two items need a decision.[^1]

| Item | Owner | Status |
| --- | --- | --- |
| Pricing page | Sam | Done |
| Onboarding email | Lee | In review |

- [x] Confirm the date
- [ ] Sign off the budget

[^1]: Decisions are due by Friday.
````

In the `.docx` this becomes a Heading 1 title, a Heading 2 section, a paragraph with a real footnote at the bottom of the page, a table with a shaded header row, and a two-item checklist. Open it in the editor, choose Export → Word (.docx), and compare the result with the preview.

## Tables, task lists and footnotes

**Tables** convert to Word tables with borders and a shaded header row. Keep cells short, because long paragraphs inside cells make a Word table hard to read. Build or reshape one with the [table editor guide](/docs/markdown-table-generator), which also covers pasting from a spreadsheet.

**Task lists** convert to ☑ and ☐ characters. They are text symbols, not clickable checkboxes, so ticking a box later means replacing the symbol.

**Footnotes** written as `[^1]` and defined with `[^1]: text` become real Word footnotes, numbered by Word. In Google Docs they follow the same route when you open the `.docx`. The full syntax is in the [Markdown cheat sheet](/docs/markdown-cheat-sheet).

## Style the document once you have it

Because headings are real Word styles, you restyle the whole document by changing the style, not each heading.

1. In Word, right-click **Heading 1** in the Styles gallery on the Home tab and choose **Modify**.
2. Set your font, size and color, and apply it.
3. Repeat for Heading 2, Heading 3 and Normal text.
4. To add a contents page, use **References → Table of Contents**. It works because the headings are real headings.

If one heading does not follow the change, reapply the style to it from the Styles gallery. To keep your settings for next time, save the styled file as a template and paste or open new exports into it.

<div class="round-trip" role="img" aria-label="Markdown becomes a Word file, reviewers edit it, and you apply their edits back to the Markdown">Markdown<i>→</i>Word file<i>→</i>Reviewers<em>apply their edits back to the Markdown, then export again</em></div>

## Other ways to convert Markdown to Word

| Method | Good for | Trade-offs |
| --- | --- | --- |
| **Quilldown (browser)** | Quick, private conversions with a live preview; real headings, tables and footnotes | Uses its own default styles, so restyle in Word afterwards |
| **Pandoc** | Scripted or batch conversions, and applying your own Word template | Command line, so it needs installing and some setup |
| **Online converter websites** | One-off files with no setup | Many upload your file to a server, so check the privacy policy before using one for private text |
| **Copy and paste into Word or Docs** | A few paragraphs | Results vary by app and paste option, and you tidy up by hand |

If you need a branded template applied automatically, use a tool that accepts one, or export from Quilldown once and save your restyled file as a template for next time.

## Common problems and fixes

| Problem | Likely cause | Fix |
| --- | --- | --- |
| A heading shows `## Title` as plain text | No space after the `#` marks | Write `## Title` with a space |
| Bullets appear as one paragraph | No blank line before the list | Add an empty line above it |
| Equation appears as `$x^2$` | Math is exported as TeX text | Retype it with Word's equation editor |
| Pasted text is a different font in Google Docs | The copied text carried its own font, for example from a different copy route or source | Use **Copy for Docs**, which sets no font |
| Formatting is missing after pasting into Docs | You used *Paste without formatting* | Use the normal paste (Ctrl+V) |
| An image did not come through with Copy for Docs | The destination did not accept it | Use the Word export, or insert the picture manually |
| File opens read-only in Word | Protected View for downloaded files | Click **Enable Editing** |
| Page layout differs between Word and Google Docs | Each app has its own defaults | Set page size and margins in the app you will share from |
| I edited the Word file, and now the Markdown is out of date | The .docx doesn't sync back to the Markdown | Make edits in the Markdown and export again, or copy changes across by hand |
| The document has no contents page | The export doesn't generate one | Use References → Table of Contents in Word, which works because the headings are real headings |

## Tips for the best result

- **Start each section with a heading** (`##`). They become real headings in Word and Docs.
- **Use one `#` heading as the title** and `##` for sections so the outline is sensible.
- **Add alt text to images**: `![Describe the image](photo.png)`. It is preserved.
- **Keep tables simple**, and merge cells in Word afterwards if you must.
- **Keep the Markdown as your source.** Edit there, then export again, rather than editing the `.docx` and the Markdown separately.

You can also [read how the app works and who builds it](/about).

## Frequently asked questions

### Can I convert Markdown to Word for free?

Yes. Quilldown's Word export is free, needs no account and runs in your browser, so your Markdown is never uploaded. Paste or open your text, choose **Export → Word (.docx)** and the file downloads. It also works offline after your first visit.

### Will headings, bold text, lists and tables survive?

Yes. Headings become real Word heading styles, and bold, italic, lists, links and tables are all preserved as native formatting. Footnotes become real Word footnotes, and images and diagrams are embedded in the file.

### How do I paste Markdown into Google Docs with formatting?

Click **Copy for Docs** on the preview pane, then paste normally into Google Docs with Ctrl+V. The headings arrive at 23, 17 and 14 pt with body text at 12 pt, in your document's own font. Do not use *Paste without formatting*, because that removes the styling.

### Why does my equation look wrong in Word?

Word exports include math as its TeX source text, not as a Word equation. Retype the equation with Word's equation editor, or share a [PDF](/docs/markdown-to-pdf) instead, where the math is typeset. The [LaTeX math guide](/docs/math-in-markdown) covers the syntax.

### Should I export a .docx or use Copy for Docs?

Export a `.docx` when you want a finished file to send, store or open in Word, Pages or LibreOffice. Use Copy for Docs when you are adding content to a Google Doc that already exists, because it sets no font and so takes on that document's styling.

### Can I open the .docx in Pages or LibreOffice?

Yes. The file is a standard Office Open XML document, so Word, Google Docs, Apple Pages and LibreOffice can all open it. Small layout differences between apps are normal, so check the result in the app you will share from.

### Do diagrams stay editable in Word?

No. Mermaid diagrams are exported as pictures, so you cannot edit their nodes in Word. Keep the Mermaid source in your Markdown, change it there and export again. The [Mermaid guide](/docs/diagrams-in-markdown) shows the syntax.

### How do I convert a .md file to .docx?

Open the file in Quilldown (Ctrl+O, or drag it onto the page), then choose Export → Word (.docx). The .md, .markdown and .txt formats all open, and the file downloads straight to your device.

### Can I convert Word to Markdown?

Quilldown opens Markdown and text files, so it doesn't import .docx files. To convert a Word document to Markdown, use a converter that reads Word files, such as Pandoc.

### Is my document uploaded when I convert it?

No. The .docx is created in your browser and saved to your device, and Copy for Docs uses your clipboard. You can check by opening your browser's network panel while you export, and you'll see nothing carrying your text.

### Does the Word file include a table of contents?

No, but the headings are real Word headings, so Word can build a contents page for you. Choose References → Table of Contents.

### Will tracked changes and comments work if reviewers edit the file?

They work inside Word like in any Word file, but they don't flow back to your Markdown. Apply the accepted edits to the Markdown yourself, then export again if you need a fresh file.

### Can I paste text from an AI chat into Google Docs with proper formatting?

Yes. Paste the Markdown into Quilldown so the symbols become real headings, lists and tables in the preview, then click Copy for Docs and paste into your document.

### Can I change the fonts, colors and margins of the Word file?

Change the styles in Word after exporting. Because headings are real Word styles, changing Heading 1 once restyles every Heading 1 in the document. Save the styled file as a template to reuse.
