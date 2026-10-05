/* Content for /how-to-use. Imported by tools/build-pages.mjs, which turns it into:
     - the clickable replica of the editor (buttons are generated from TOP_LAYOUT and SNIP_LAYOUT),
     - the scroll tour (TOUR),
     - the "every feature, explained" reference (FEATURES, grouped by GROUPS).
   The popups on the page are cloned from the reference articles, so there is one source of truth.
   Edit the words here, then run: node tools/build-pages.mjs
   Fields: id, g (group), name, icon | badge, chev (dropdown arrow), keys, lead, body[], steps[], ex {title, md}, tip, docs [href, label]. */

export const GROUPS = [
  { id: 'tabs', name: 'Tabs', blurb: 'Several documents, side by side, like browser tabs.' },
  { id: 'file', name: 'Open, copy and share', blurb: 'Getting files in, and getting your writing out.' },
  { id: 'view', name: 'View and layout', blurb: 'Find, outline, split view, scroll sync, theme and full screen.' },
  { id: 'history', name: 'Undo and redo', blurb: 'Take back a change, or bring it back.' },
  { id: 'style', name: 'Text styles', blurb: 'Bold, italic, code and the small inline touches.' },
  { id: 'blocks', name: 'Headings and blocks', blurb: 'Headings, quotes, code blocks and dividers.' },
  { id: 'lists', name: 'Lists', blurb: 'Bullets, numbers and to-dos.' },
  { id: 'insert', name: 'Links, images and tables', blurb: 'Things you point to, show or tabulate.' },
  { id: 'math', name: 'Math and diagrams', blurb: 'Equations and charts, written as plain text.' },
  { id: 'extras', name: 'Callouts and extras', blurb: 'Notes, collapsible sections, footnotes and emoji.' },
  { id: 'panes', name: 'Editor and preview', blurb: 'The two panes, the divider and the copy buttons.' },
  { id: 'status', name: 'Status bar', blurb: 'Counts, cursor position and saving.' }
];

/* Title bar buttons: each inner array is one cluster, '|' draws a divider, 'seg' is the three view buttons. */
export const TOP_LAYOUT = [
  { id: 'files', items: ['open', 'new'] }, '|',
  { id: 'out', items: ['copy', 'export', 'share', 'install'] }, '|',
  { id: 'tools', items: ['find', 'outline', 'seg', 'sync', 'theme', 'full'] }
];
export const SEG = ['view-editor', 'view-split', 'view-preview'];

/* Snippet toolbar: clusters in order. The id of a cluster matches its group in GROUPS. */
export const SNIP_LAYOUT = [
  { id: 'history', items: ['undo', 'redo'] },
  { id: 'style', items: ['bold', 'italic', 'underline', 'strike', 'code', 'highlight', 'sup', 'sub', 'kbd'] },
  { id: 'blocks', items: ['headings', 'quote', 'codeblock', 'hr'] },
  { id: 'lists', items: ['ul', 'ol', 'task'] },
  { id: 'insert', items: ['link', 'image', 'table'] },
  { id: 'math', items: ['mathi', 'mathb', 'formulas', 'diagram'] },
  { id: 'extras', items: ['callouts', 'details', 'center', 'comment', 'footnote', 'emoji'] }
];

export const FEATURES = [
  /* ============================== TABS ============================== */
  { id: 'logo', g: 'tabs', name: 'Quilldown logo', icon: 'logo',
    lead: 'Back to the homepage.',
    body: ['Click the logo to leave the full-screen editor and return to the Quilldown homepage. Nothing is lost when you do. Your tabs and text stay exactly as they are, so you can step back in whenever you like.'] },

  { id: 'tab', g: 'tabs', name: 'Document tabs', icon: 'tabs', keys: ['Ctrl', 'Alt', '\u2190 / \u2192'],
    lead: 'Keep several documents open at once.',
    body: ['Every document lives in its own tab, just like browser tabs. Click a tab to switch to it, and each one remembers its own cursor and scroll position. You can keep up to 30 open.'],
    steps: ['<b>Switch:</b> click a tab, or press <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>\u2190</kbd> or <kbd>\u2192</kbd>.', '<b>Rename:</b> double-click the tab name, type, then press <kbd>Enter</kbd>. <kbd>Esc</kbd> cancels.', '<b>Reorder:</b> drag a tab left or right.', '<b>Close:</b> press the \u00d7, middle-click, or press <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>W</kbd>.'],
    tip: 'A small dot before a name means the tab is linked to a file on your computer. It turns orange when you have unsaved changes. Undo history resets when you switch tabs, so finish a thought before you move on.' },

  { id: 'tab-x', g: 'tabs', name: 'Close a tab', icon: 'x',
    lead: 'Close it, and bring it back if you slip.',
    body: ['Press the \u00d7 on a tab to close it. You can also middle-click the tab, or press <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>W</kbd>. If the tab had writing in it, a message appears with an <b>Undo</b> button that restores it exactly as it was.', 'Close the very last tab and Quilldown gives you a fresh blank one, so you are never left with nothing to type in.'] },

  { id: 'tab-new', g: 'tabs', name: 'New tab', icon: 'plus', keys: ['Ctrl', 'Alt', 'N'],
    lead: 'Start a blank document.',
    body: ['The <b>+</b> at the end of the tab strip opens a new, empty document in its own tab. If you would rather start from a ready-made layout, use the <b>New</b> menu next to the Open button instead.'] },

  /* ============================== FILE ============================== */
  { id: 'open', g: 'file', name: 'Open a file', icon: 'open', keys: ['Ctrl', 'O'],
    lead: 'Bring an existing Markdown file into the editor.',
    body: ['Pick one or more files and each opens in its own tab. Quilldown reads <code>.md</code>, <code>.markdown</code>, <code>.mdown</code>, <code>.mkd</code>, <code>.txt</code> and <code>.text</code> files. You can also drag files from your desktop and drop them anywhere on the page.', 'In Chrome and Edge the tab stays linked to the file on your computer, so <kbd>Ctrl</kbd> <kbd>S</kbd> saves your changes straight back to it. In other browsers, Save downloads a fresh copy instead.'],
    tip: 'Files are read inside your browser. Nothing is uploaded.',
    docs: ['/faq#open-md-file', 'Open a .md file: the full answer'] },

  { id: 'new', g: 'file', name: 'New document', icon: 'newfile', chev: true,
    lead: 'A blank page, a sample, or a ready-made template.',
    body: ['The New menu opens a document in a fresh tab. Choose <b>Blank document</b> for an empty page, or <b>Sample document</b> for a tour of everything Markdown can do.', 'Under <b>Templates</b> you will find eight starters: README, Meeting notes, R\u00e9sum\u00e9, Blog post, Email, Tables, To-do list and Notes. Each one opens in its own tab, ready to edit.'],
    docs: ['/docs/readme-template', 'The README template guide'] },

  { id: 'copy', g: 'file', name: 'Copy menu', icon: 'copy', chev: true,
    lead: 'Four ways to copy your document.',
    body: ['Open the menu and pick what ends up on your clipboard:'],
    steps: ['<b>Formatted text</b> is the rich text you see in the preview. Paste it into an email or a document.', '<b>Copy for Docs</b> uses point sizes Google Docs and Word understand: H1 23, H2 17, H3 14 and body text 12. It sets no font, so pasted text takes on the font of your document.', '<b>Markdown</b> is the raw source.', '<b>HTML</b> is clean markup, ready to paste into a website or CMS.'],
    tip: 'When the copy works, the button swaps its icon for a green check mark. If your browser blocks it, you get a red cross instead.',
    docs: ['/docs/markdown-to-word', 'Copy into Word and Google Docs'] },

  { id: 'export', g: 'file', name: 'Export menu', icon: 'download', chev: true, keys: ['Ctrl', 'S'],
    lead: 'Turn the document into a file.',
    body: ['Export builds the file inside your browser. Nothing is sent anywhere.'],
    steps: ['<b>Save</b> writes back to the file you opened, or downloads a <code>.md</code>.', '<b>PDF</b> opens your browser\u2019s print dialog. Choose \u201cSave as PDF\u201d.', '<b>Word (.docx)</b> is a real Word file with real footnotes. It opens in Word, Google Docs and Pages.', '<b>Image (.png)</b> is the whole document as one picture.', '<b>E-book (.epub)</b> works in Apple Books, Kobo and Kindle apps.', '<b>HTML file</b> is a standalone, styled page. <b>Markdown</b> and <b>Plain text</b> download the source or the rendered words.'],
    tip: 'Word cannot draw KaTeX or Mermaid, so equations arrive as TeX text and diagrams as pictures. If equations must look typeset, export to PDF. Very long documents are too tall for one PNG, so use PDF for those.',
    docs: ['/docs/markdown-to-pdf', 'Markdown to PDF'] },

  { id: 'share', g: 'file', name: 'Share as a link', icon: 'share',
    lead: 'A link that carries the whole document.',
    body: ['Share packs your document into the link itself. Nothing is uploaded, and whoever opens the link gets their own private copy in a new tab.'],
    steps: ['Press <b>Share</b> and copy the link from the box.', 'Tick <b>Open in preview-only mode</b> if the reader should see the finished page rather than the editor.', 'Send the link however you like.'],
    tip: 'Long documents make long links. Quilldown warns you above about 8,000 characters and will not make a link past 64,000. Pasted images are left out of share links, so use a web address for pictures you want to share.' },

  { id: 'install', g: 'file', name: 'Install as an app', icon: 'download',
    lead: 'Put Quilldown on your computer or phone.',
    body: ['This button appears when your browser is ready to install Quilldown, which usually means Chrome or Edge. Once installed, it opens in its own window, works without a connection, and appears in your system\u2019s <b>Open with</b> menu for Markdown files.', 'Do not see the button? Look in your browser menu for \u201cInstall Quilldown\u201d. Some browsers keep that option there instead.'] },

  /* ============================== VIEW ============================== */
  { id: 'find', g: 'view', name: 'Find and replace', icon: 'search', keys: ['Ctrl', 'F'],
    lead: 'Search the document, and change many things at once.',
    body: ['Press <kbd>Ctrl</kbd> <kbd>F</kbd> to open the search bar. Matches light up behind your text and the counter tells you how many there are. <kbd>Enter</kbd> jumps to the next one, <kbd>Shift</kbd> <kbd>Enter</kbd> to the previous one.', 'Press <kbd>Ctrl</kbd> <kbd>H</kbd>, or the small arrow on the left, to add a Replace box. <b>Replace</b> changes the current match and <b>All</b> changes every one.'],
    steps: ['<b>Aa</b> matches case (<kbd>Alt</kbd> <kbd>C</kbd>).', '<b>ab</b> matches whole words (<kbd>Alt</kbd> <kbd>W</kbd>).', '<b>.*</b> treats your search as a regular expression (<kbd>Alt</kbd> <kbd>R</kbd>).'] },

  { id: 'outline', g: 'view', name: 'Outline', icon: 'outline',
    lead: 'A map of your headings.',
    body: ['The outline opens a sidebar listing every heading in the current document, indented by level. Click one to jump straight to it. The current section is highlighted as you scroll.', 'It is the quickest way to move around a long document, and a good check that your headings make sense when read on their own.'] },

  { id: 'view-editor', g: 'view', name: 'Editor only', icon: 'pen',
    lead: 'Just the writing pane.',
    body: ['Hides the preview so the editor takes the whole width. Good for drafting when you do not need to see the result yet. Switch back any time.'] },

  { id: 'view-split', g: 'view', name: 'Split view', icon: 'cols',
    lead: 'Write on the left, see it on the right.',
    body: ['The default layout. Markdown on one side, the finished page on the other, updating as you type. Drag the divider between them to change the balance.', 'On a phone the panes stack instead, and you switch between writing and preview with the view buttons.'] },

  { id: 'view-preview', g: 'view', name: 'Preview only', icon: 'eye',
    lead: 'Just the finished page.',
    body: ['Shows only the rendered document, as a reader would see it. The snippet toolbar fades out because there is no editor to apply it to. It is a good way to proofread, or to present your document.'] },

  { id: 'sync', g: 'view', name: 'Sync scroll', icon: 'sync',
    lead: 'Keep both panes at the same place.',
    body: ['When this is on, scrolling the editor scrolls the preview to the matching spot, and the other way round. It lines up block by block, not by a rough percentage, so a long table or code block does not throw it off.', 'Switch it off if you want to read one pane while staying put in the other.'] },

  { id: 'theme', g: 'view', name: 'Light and dark theme', icon: 'sun',
    lead: 'Pick the one that is easier on your eyes.',
    body: ['Switches the whole page between light and dark. Quilldown remembers your choice, and the first time you visit it follows your device setting.', 'Exports always use the clean, light style, so they look right on paper and in other apps whichever theme you write in.'] },

  { id: 'full', g: 'view', name: 'Full screen', icon: 'max', keys: ['Esc'],
    lead: 'Give the editor the whole window.',
    body: ['Expands the editor to fill the browser window so there is nothing else on screen. Press <kbd>Esc</kbd> or the same button to come back to the page.', 'If you prefer Quilldown to open straight into the editor, switch on <b>Start in editor</b> in the header of the homepage.'] },

  /* ============================== HISTORY ============================== */
  { id: 'undo', g: 'history', name: 'Undo', icon: 'undo', keys: ['Ctrl', 'Z'],
    lead: 'Take back the last change.',
    body: ['Steps backwards through your edits, including the ones made by toolbar buttons. Press it several times to go back further.'],
    tip: 'Each tab starts a fresh undo history when you switch to it.' },

  { id: 'redo', g: 'history', name: 'Redo', icon: 'redo', keys: ['Ctrl', 'Y'],
    lead: 'Bring back what you just undid.',
    body: ['If you went back one step too far, Redo moves forward again. <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>Z</kbd> works too.'] },

  /* ============================== TEXT STYLES ============================== */
  { id: 'bold', g: 'style', name: 'Bold', icon: 'bold', keys: ['Ctrl', 'B'],
    lead: 'Make important words stand out.',
    body: ['Select some text and press Bold to wrap it in double asterisks. With nothing selected, Quilldown inserts a placeholder you can type over. Press it again on bold text to take the bold off.'],
    ex: { title: 'Bold', md: 'This is **very important** news.' } },

  { id: 'italic', g: 'style', name: 'Italic', icon: 'italic', keys: ['Ctrl', 'I'],
    lead: 'Add emphasis, a title or a foreign word.',
    body: ['Wraps the selection in underscores. Use it for gentle emphasis, book titles or terms you are introducing.'],
    ex: { title: 'Italic', md: 'She read _The Left Hand of Darkness_ twice.' } },

  { id: 'underline', g: 'style', name: 'Underline', icon: 'underline', keys: ['Ctrl', 'U'],
    lead: 'Underline a word or phrase.',
    body: ['Markdown has no underline of its own, so Quilldown uses a small HTML tag, <code>&lt;u&gt;</code>. It displays correctly in the preview and in your exports.'],
    tip: 'Underlined text looks like a link to many readers. Use it sparingly.',
    ex: { title: 'Underline', md: 'Please <u>read this first</u>.' } },

  { id: 'strike', g: 'style', name: 'Strikethrough', icon: 'strike', keys: ['Ctrl', 'Shift', 'X'],
    lead: 'Cross something out.',
    body: ['Wraps the selection in double tildes. Useful for edits, finished items and prices that changed.'],
    ex: { title: 'Strikethrough', md: 'The meeting is ~~Tuesday~~ Thursday.' } },

  { id: 'code', g: 'style', name: 'Inline code', icon: 'code', keys: ['Ctrl', 'E'],
    lead: 'Show a command, file name or snippet.',
    body: ['Wraps the selection in backticks and sets it in a monospace font. Use it for anything the reader might type or copy exactly.'],
    ex: { title: 'Inline code', md: 'Run `npm install` to get started.' } },

  { id: 'highlight', g: 'style', name: 'Highlight', icon: 'highlight',
    lead: 'Mark a phrase like a highlighter pen.',
    body: ['Wraps the selection in <code>&lt;mark&gt;</code>, which shows as a soft yellow background. It is handy for study notes and review comments.'],
    ex: { title: 'Highlight', md: 'Remember the <mark>deadline is Friday</mark>.' } },

  { id: 'sup', g: 'style', name: 'Superscript', badge: 'x\u00b2',
    lead: 'Raise a character above the line.',
    body: ['Uses <code>&lt;sup&gt;</code>. Good for powers, ordinals and footnote-style marks.'],
    ex: { title: 'Superscript', md: 'The area is 25 m<sup>2</sup>, on the 3<sup>rd</sup> floor.' } },

  { id: 'sub', g: 'style', name: 'Subscript', badge: 'x\u2082',
    lead: 'Lower a character below the line.',
    body: ['Uses <code>&lt;sub&gt;</code>. Good for chemical formulas and indices.'],
    ex: { title: 'Subscript', md: 'Water is H<sub>2</sub>O.' } },

  { id: 'kbd', g: 'style', name: 'Keyboard key', icon: 'kbd',
    lead: 'Show a key as a little keycap.',
    body: ['Wraps the selection in <code>&lt;kbd&gt;</code> so a key looks like a key. Perfect for instructions and shortcut lists.'],
    ex: { title: 'Keyboard key', md: 'Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.' } },

  /* ============================== BLOCKS ============================== */
  { id: 'headings', g: 'blocks', name: 'Headings', icon: 'heading', chev: true,
    lead: 'Six levels, plus normal text.',
    body: ['Open the menu and choose Heading 1 to 6. The number of <code>#</code> signs at the start of the line sets the level. Picking a different level on a heading changes it rather than stacking symbols, and <b>Normal text</b> removes the heading.', 'Headings also feed the Outline, so give every section a clear one.'],
    ex: { title: 'Headings', md: '# Heading 1\n\n## Heading 2\n\n### Heading 3' },
    docs: ['/docs/markdown-cheat-sheet', 'The Markdown cheat sheet'] },

  { id: 'quote', g: 'blocks', name: 'Quote', icon: 'quote',
    lead: 'Set a passage apart.',
    body: ['Puts a <code>&gt;</code> at the start of each selected line. Press it again to remove the quote.'],
    ex: { title: 'Quote', md: '> Simplicity is the ultimate sophistication.\n>\n> A note on design' } },

  { id: 'codeblock', g: 'blocks', name: 'Code block', icon: 'codeblock',
    lead: 'A fenced block for several lines of code.',
    body: ['Wraps the selection in three backticks. Type a language name straight after the opening fence, for example <code>js</code> or <code>python</code>, and the preview colors the code. Every block in the preview gets a Copy button.'],
    ex: { title: 'Code block', md: '```js\nconst total = items.length;\nconsole.log(total);\n```' } },

  { id: 'hr', g: 'blocks', name: 'Horizontal rule', icon: 'hr',
    lead: 'A divider between sections.',
    body: ['Inserts <code>---</code> on its own line, which draws a thin line across the page. It separates topics without needing a heading.'],
    ex: { title: 'Horizontal rule', md: 'Above the line\n\n---\n\nBelow the line' } },

  /* ============================== LISTS ============================== */
  { id: 'ul', g: 'lists', name: 'Bullet list', icon: 'ul',
    lead: 'Unordered items.',
    body: ['Adds a <code>-</code> to every selected line. Press <kbd>Enter</kbd> at the end of an item to start the next one, and <kbd>Enter</kbd> on an empty item to finish the list. <kbd>Tab</kbd> indents an item into a sub-list, <kbd>Shift</kbd> <kbd>Tab</kbd> brings it back.'],
    ex: { title: 'Bullet list', md: '- Fruit\n  - Apples\n  - Pears\n- Bread\n- Milk' } },

  { id: 'ol', g: 'lists', name: 'Numbered list', icon: 'ol',
    lead: 'Items in order.',
    body: ['Numbers the selected lines. As you press <kbd>Enter</kbd>, the next number appears for you. If you reorder items later, Markdown renumbers them in the preview.'],
    ex: { title: 'Numbered list', md: '1. Preheat the oven\n2. Mix the batter\n3. Bake for 30 minutes' } },

  { id: 'task', g: 'lists', name: 'Task list', icon: 'task',
    lead: 'A to-do list with checkboxes.',
    body: ['Starts each line with <code>- [ ]</code>. The preview shows a checkbox. To mark something done, type an <code>x</code> between the brackets, like <code>[x]</code>.'],
    ex: { title: 'Task list', md: '- [ ] Write the draft\n- [ ] Check the numbers\n- [ ] Send it off' } },

  /* ============================== INSERT ============================== */
  { id: 'link', g: 'insert', name: 'Link', icon: 'link', keys: ['Ctrl', 'K'],
    lead: 'Point to a web page.',
    body: ['Select the words you want to turn into a link and press <kbd>Ctrl</kbd> <kbd>K</kbd>. Quilldown wraps them as <code>[text](https://)</code> and puts your cursor where the address goes.'],
    tip: 'There is a faster way. Select some text, then paste a web address over it. Quilldown makes the link for you.',
    ex: { title: 'Link', md: 'Read the [Markdown cheat sheet](https://quilldown.vercel.app/docs/markdown-cheat-sheet).' } },

  { id: 'image', g: 'insert', name: 'Image', icon: 'image', chev: true,
    lead: 'Add a picture three ways.',
    body: ['Open the menu to <b>upload from your computer</b>, or add an <b>image from a web address</b>. You can also just <b>paste or drop</b> a picture straight into the editor, for example a screenshot.', 'Pictures you add are stored inside the document in your browser, and they are included when you export to Word, EPUB, PNG or a Markdown file with images.'],
    ex: { title: 'Image from a web address', md: '![A short description](https://example.com/picture.png)' },
    tip: 'Always fill in the description in the square brackets. Screen readers read it out, and it shows if the picture cannot load.' },

  { id: 'table', g: 'insert', name: 'Table', icon: 'table',
    lead: 'Build a table in a grid, not with pipes.',
    body: ['Opens a visual editor. Type into the cells and use <kbd>Tab</kbd> and <kbd>Enter</kbd> to move around. You can paste rows straight from a spreadsheet, add rows and columns, and set each column to left, center or right alignment. Press <b>Insert table</b> and tidy Markdown lands in your document.', 'If your cursor is already inside a table, the same button opens that table for editing.'],
    ex: { title: 'Table', md: '| Plan | Price |\n| :--- | ---: |\n| Editor | Free |\n| Exports | Free |' },
    docs: ['/docs/markdown-table-generator', 'The Markdown table guide'] },

  /* ============================== MATH + DIAGRAMS ============================== */
  { id: 'mathi', g: 'math', name: 'Inline math', icon: 'math',
    lead: 'A formula inside a sentence.',
    body: ['Wraps the selection in single dollar signs. Write LaTeX between them and it renders with KaTeX in the preview.'],
    ex: { title: 'Inline math', md: 'The area of a circle is $\\pi r^2$.' },
    docs: ['/docs/math-in-markdown', 'Math in Markdown'] },

  { id: 'mathb', g: 'math', name: 'Math block', icon: 'mathblock',
    lead: 'A formula on its own line, centered.',
    body: ['Wraps the selection in double dollar signs, on separate lines. Use it for larger equations that deserve their own space.'],
    ex: { title: 'Math block', md: '$$\n\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}\n$$' } },

  { id: 'formulas', g: 'math', name: 'Formula templates', badge: '\u0192x', chev: true,
    lead: 'Start from a ready-made equation.',
    body: ['Pick a template and it drops in as a math block you can edit: <b>Fraction</b>, <b>Sum</b>, <b>Integral</b>, <b>Quadratic formula</b> or <b>Matrix</b>. It is the easiest way to learn the LaTeX for each.'],
    ex: { title: 'Quadratic formula', md: '$$\nx = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}\n$$' } },

  { id: 'diagram', g: 'math', name: 'Diagrams', icon: 'diagram', chev: true,
    lead: 'Draw charts from plain text.',
    body: ['Choose a type and Quilldown inserts a starter diagram written in Mermaid. Change the words and the picture redraws in the preview. There are eight types: <b>Flowchart</b>, <b>Sequence</b>, <b>Class</b>, <b>State</b>, <b>Entity relationship</b>, <b>Gantt chart</b>, <b>Pie chart</b> and <b>Mind map</b>.'],
    ex: { title: 'Flowchart', md: '```mermaid\nflowchart LR\n  A[Write] --> B[Preview] --> C[Export]\n```' },
    docs: ['/docs/diagrams-in-markdown', 'Diagrams in Markdown'] },

  /* ============================== EXTRAS ============================== */
  { id: 'callouts', g: 'extras', name: 'Callouts', icon: 'note', chev: true,
    lead: 'Highlight a note, tip or warning.',
    body: ['Choose Note, Tip, Important, Warning or Caution. Each inserts a GitHub-style callout with its own color and title. Select text first and it moves inside the callout.'],
    ex: { title: 'Callout', md: '> [!TIP]\n> Press Ctrl+B to make selected text bold.' } },

  { id: 'details', g: 'extras', name: 'Collapsible section', icon: 'chevr',
    lead: 'Hide detail until the reader asks for it.',
    body: ['Inserts a <code>&lt;details&gt;</code> block with a clickable summary. The content inside stays folded until the reader opens it. It suits FAQs and long optional notes.'],
    ex: { title: 'Collapsible section', md: '<details>\n<summary>Show the answer</summary>\n\nIt is 42.\n\n</details>' } },

  { id: 'center', g: 'extras', name: 'Centered block', icon: 'center',
    lead: 'Center something on the page.',
    body: ['Wraps the selection in a centered <code>div</code>. Handy for a title line or a logo at the top of a README.'],
    ex: { title: 'Centered block', md: '<div align="center">\n\n**Project name**\n\n</div>' } },

  { id: 'comment', g: 'extras', name: 'Hidden comment', badge: '//',
    lead: 'A note only you can see.',
    body: ['Wraps the selection in an HTML comment. It stays in your Markdown but never shows in the preview or in exports. Use it for reminders to yourself.'],
    ex: { title: 'Hidden comment', md: 'Visible text.\n\n<!-- Check this figure before publishing -->' } },

  { id: 'footnote', g: 'extras', name: 'Footnote', badge: '[\u00b9]',
    lead: 'Add a reference at the bottom of the page.',
    body: ['Puts a numbered marker at your cursor and a matching note at the end of the document, then selects the note so you can type it straight away. Numbers are handled for you. In a Word export they become real footnotes.'],
    ex: { title: 'Footnote', md: 'Markdown is easy to learn.[^1]\n\n[^1]: John Gruber created it in 2004.' } },

  { id: 'emoji', g: 'extras', name: 'Emoji', icon: 'smile',
    lead: 'Pick one, or type a shortcode.',
    body: ['The picker has search, categories, skin tones and a list of the ones you used recently. Click an emoji to insert it.', 'You can also type a colon and the first letters of a name, such as <code>:roc</code>, to see suggestions. Finish with a closing colon, as in <code>:tada:</code>, and it turns into \ud83c\udf89.'],
    ex: { title: 'Emoji shortcodes', md: 'Shipped :rocket: and it works :tada:' },
    docs: ['/docs/emoji-in-markdown', 'Emoji shortcodes'] },

  /* ============================== PANES ============================== */
  { id: 'editor', g: 'panes', name: 'The editor', icon: 'pen',
    lead: 'Where you write.',
    body: ['Type or paste Markdown here. A few small helpers keep you moving:'],
    steps: ['<kbd>Enter</kbd> on a list item starts the next one.', '<kbd>Tab</kbd> indents a list item, or adds two spaces anywhere else.', 'Paste a screenshot and it becomes an image in your document.', 'Select text and paste a web address to make it a link.', 'Drop a <code>.md</code> file anywhere on the page to open it.'],
    tip: 'Nothing here needs saving. Every tab is stored in your browser as you type.' },

  { id: 'preview', g: 'panes', name: 'The preview', icon: 'eye',
    lead: 'What your document will look like.',
    body: ['The right-hand pane draws the finished page and updates as you type. Tables, equations, task lists, callouts and diagrams all appear as they will in the final document, so you catch mistakes while you write.', 'Hover over a code block to reveal its own Copy button.'] },

  { id: 'gutter', g: 'panes', name: 'Pane divider', icon: 'cols',
    lead: 'Drag to give one side more room.',
    body: ['Drag the line between the panes to change how much space each gets. Double-click it to reset to an even split. If it has keyboard focus, the left and right arrow keys nudge it. Your choice is remembered.'] },

  { id: 'copy-md', g: 'panes', name: 'Copy Markdown', icon: 'copy',
    lead: 'Copy the raw source.',
    body: ['Copies the Markdown exactly as you typed it, ready to paste into a README, a note or another editor. Images you added are included in the copy.', 'The icon turns into a green check mark so you know it worked.'] },

  { id: 'copy-rich', g: 'panes', name: 'Copy formatted text', icon: 'copy',
    lead: 'Copy the preview as rich text.',
    body: ['Copies the document the way it looks in the preview: headings, bold, lists and tables. Paste it into an email, a chat or a word processor and the formatting comes along.', 'Equations and diagrams are copied as images so they survive the trip.'] },

  { id: 'copy-docs', g: 'panes', name: 'Copy for Docs', icon: 'docs',
    lead: 'Paste cleanly into Google Docs or Word.',
    body: ['Copies with exact point sizes Google Docs and Word understand: <b>H1 23 pt, H2 17 pt, H3 14 pt, body 12 pt</b>. No font is set, so what you paste takes on the font already used in your document.'],
    docs: ['/docs/markdown-to-word', 'Markdown to Word and Google Docs'] },

  /* ============================== STATUS ============================== */
  { id: 'stats', g: 'status', name: 'Word count', icon: 'text',
    lead: 'Words, characters and reading time.',
    body: ['The counts update as you type. Reading time assumes about 220 words a minute, and rounds up to at least one minute for anything you have written.'] },

  { id: 'cursor', g: 'status', name: 'Cursor position', icon: 'pen',
    lead: 'Which line and column you are on.',
    body: ['Ln is the line number and Col is how far along the line your cursor sits. It is useful when a tool or a teammate refers to a specific line. It is hidden in preview-only view.'] },

  { id: 'offline', g: 'status', name: 'Works offline', icon: 'zap',
    lead: 'Everything is already on your device.',
    body: ['This badge tells you Quilldown is ready to run without a connection. After your first visit the site caches itself, so it loads, previews and exports with no internet. It makes no third-party requests while you write.'] },

  { id: 'saved', g: 'status', name: 'Saved locally', icon: 'check',
    lead: 'Autosave, in your browser.',
    body: ['A moment after you stop typing, the active tab is saved to your browser\u2019s local storage. It says \u201cSaving\u2026\u201d, then \u201cSaved locally\u201d. If the browser runs out of space it tells you so.'],
    tip: 'Clearing your browser\u2019s site data removes saved tabs. Export anything you cannot afford to lose.' }
];

/* The scroll tour. `t` is f:<feature id> or g:<cluster id>. Words are shown in the caption next to the pointer. */
export const TOUR = [
  { t: 'f:open', title: 'Open a file', text: 'Start here if you already have something written. Pick one or several Markdown files, or drag them onto the page.' },
  { t: 'f:new', title: 'Start something new', text: 'A blank page, a sample, or a template such as a README, r\u00e9sum\u00e9 or meeting notes.' },
  { t: 'f:tab', title: 'Tabs for every document', text: 'Each document gets its own tab. Double-click a name to rename it, and drag to reorder.' },
  { t: 'f:tab-new', title: 'Add another tab', text: 'The plus opens a fresh blank document without touching the ones you already have open.' },
  { t: 'f:copy', title: 'Copy it the way you need', text: 'Formatted text, a clean paste for Google Docs, raw Markdown or HTML. The icon turns into a check when it works.' },
  { t: 'f:export', title: 'Export to a file', text: 'PDF, Word, PNG, EPUB, HTML, Markdown or plain text. Every file is made in your browser.' },
  { t: 'f:share', title: 'Share with a link', text: 'The whole document is packed into the link. Nothing is uploaded to a server.' },
  { t: 'f:find', title: 'Find and replace', text: 'Search the document, match case or whole words, or use a regular expression.' },
  { t: 'f:outline', title: 'Jump around with the outline', text: 'A list of every heading. Click one to go straight there.' },
  { t: 'g:seg', title: 'Choose your layout', text: 'Editor only, split view or preview only. Pick whatever suits the moment.' },
  { t: 'f:sync', title: 'Scrolling in step', text: 'Scroll one pane and the other follows, matched block by block.' },
  { t: 'f:theme', title: 'Light or dark', text: 'Switch the theme. Quilldown remembers which one you like.' },
  { t: 'f:full', title: 'Full screen', text: 'Fill the window with the editor. Press Esc to come back.' },
  { t: 'g:history', title: 'Undo and redo', text: 'Take back a change, or bring it back again.', hint: true },
  { t: 'g:style', title: 'Text styles', text: 'Bold, italic, underline, strikethrough, code, highlight, superscript, subscript and keyboard keys.', hint: true },
  { t: 'g:blocks', title: 'Headings and blocks', text: 'Six heading levels, quotes, code blocks and dividers.', hint: true },
  { t: 'g:lists', title: 'Lists', text: 'Bullets, numbers and to-do lists. Press Enter to keep going.', hint: true },
  { t: 'g:insert', title: 'Links, images and tables', text: 'Add a link, drop in a picture or build a table in a grid.', hint: true },
  { t: 'g:math', title: 'Math and diagrams', text: 'Equations written in LaTeX and charts written as text, drawn live as you type.', hint: true },
  { t: 'g:extras', title: 'Callouts and extras', text: 'Notes and warnings, collapsible sections, footnotes and emoji.', hint: true },
  { t: 'f:editor', title: 'This is where you write', text: 'Type or paste Markdown. Lists continue on Enter, and a pasted picture becomes an image.' },
  { t: 'f:gutter', title: 'Resize the panes', text: 'Drag the divider to give either side more room. Double-click it to reset.' },
  { t: 'f:preview', title: 'The finished page', text: 'Headings, tables, equations and diagrams appear as they will in your document.' },
  { t: 'f:copy-md', title: 'Copy the source', text: 'One click puts your Markdown on the clipboard, and the icon confirms it.' },
  { t: 'g:previewcopy', title: 'Copy the result', text: 'Copy formatted text, or use Copy for Docs for exact heading sizes in Google Docs and Word.', hint: true },
  { t: 'f:stats', title: 'Counts as you go', text: 'Words, characters and an estimated reading time.' },
  { t: 'f:saved', title: 'Saved for you', text: 'Every tab is stored in your browser as you type. Nothing leaves your device.' },
  { t: 'f:full', title: 'That is the whole tool', text: 'Now try it for real. Open the editor and write your first line.', cta: true }
];
