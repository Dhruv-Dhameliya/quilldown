---
title: How to Write a Great README.md — With a Free Template
h1: How to write a great README.md (with a free template)
short: README template
card: A copy-ready README.
description: How to write a README.md: the sections to include, a free copy-ready Markdown template, formatting tips and common mistakes — with a live editor.
lead: A README is your project's front door. This guide shows what to include, how to format it in Markdown, and gives you a template you can copy or open in the editor in one click.
category: write
order: 10
home: true
published: 2026-09-29
updated: 2026-09-29
related: markdown-cheat-sheet, markdown-table-generator, markdown-emoji-shortcodes
cta: Start your README now
ctaText: In Quilldown choose New → Templates → README for a ready-made starting point, and see the formatted result as you type.
---

## What is a README.md?

A **README** is the first file people read in a project. On GitHub, GitLab and most code hosts, a file called `README.md` in the root of your repository is displayed automatically on the project's front page. The `.md` means it is written in [Markdown](/guides/what-is-markdown), so it can include headings, lists, code blocks, tables and images.

A good README answers four questions in seconds: **What is this? Why should I care? How do I use it? How can I help?**

## What to include

| Section | What it covers | Priority |
| --- | --- | --- |
| **Title and tagline** | The project name and one sentence about what it does | Essential |
| **Features** | A short bulleted list of what it offers | Recommended |
| **Screenshot or demo** | Shows the result before anyone reads the details | Recommended |
| **Getting started** | Requirements, installation and a first example | Essential |
| **Usage** | Common tasks with copy-ready code | Essential |
| **Configuration** | Options in a table | If relevant |
| **Contributing** | How to report issues and send changes | For open source |
| **License** | Which terms the code is shared under | Essential |
| **Contact or links** | Docs, website, support | Optional |

## A copy-ready README template

Copy this into your project, or open it in the editor and fill in the blanks. The right-hand side shows how GitHub-style Markdown will render it.

`````example title="README.md template" file=README.md
# Project name

> One sentence that explains what this project does and who it is for.

## Features

- ✅ Feature one — what it gives you
- ✅ Feature two — why it matters
- 🚧 Feature three — coming soon

## Getting started

### Installation

```bash
git clone https://github.com/your-name/project-name.git
cd project-name
npm install
```

### Usage

```js
import { greet } from "project-name";

console.log(greet("world"));
```

## Configuration

| Option | Type      | Default   | Description       |
| :----- | :-------- | :-------- | :---------------- |
| `name` | `string`  | `"world"` | Who to greet      |
| `loud` | `boolean` | `false`   | Shout the greeting |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).
`````

> [!TIP]
> Quilldown includes this template: choose **New → Templates → README**. It opens in a new tab so your current document is untouched.

## Formatting tips that make a README easier to read

- **Lead with the value.** Put what the project does in the first two lines, before install steps.
- **Use headings consistently.** One `#` title, `##` sections, `###` sub-steps — GitHub builds a clickable outline from them.
- **Show code in fenced blocks with a language** (```` ```bash ````, ```` ```js ````) so it is highlighted and easy to copy.
- **Prefer tables for options and comparisons.** Use the [table editor](/guides/markdown-table-generator) instead of typing pipes.
- **Add images with alt text:** `![Screenshot of the dashboard](docs/screenshot.png)`.
- **Use task lists for a roadmap:** `- [x] Done` and `- [ ] Planned`.
- **Add emoji sparingly** as status markers — see the [emoji shortcode cheat sheet](/guides/markdown-emoji-shortcodes).
- **Link to longer docs** instead of putting everything in the README.

## Optional extras

- **Badges** — small status images for build status, version or license, placed under the title.
- **A table of contents** — helpful once the README passes a few screens; link to headings such as `[Usage](#usage)`.
- **A demo GIF or screenshot** — worth more than a paragraph of description.
- **A changelog link** — keep release notes in their own file.

## Common README mistakes

- **No description at all**, only install commands.
- **Outdated instructions.** Test your steps on a clean machine now and then.
- **Walls of text.** Break content up with headings, lists and tables.
- **Missing license.** Without one, others can't legally reuse your code.
- **Broken image links.** Use paths relative to the repository root or full URLs.

Not sure about the syntax? Keep the [Markdown cheat sheet](/guides/markdown-cheat-sheet) open while you write.

## Frequently asked questions

### What should a README.md contain?

At minimum: the project name and a one-line description, how to install and use it, and the license. Add features, a screenshot, configuration options and contribution guidelines as the project grows.

### Where do I put the README file?

In the root folder of your repository, named `README.md`. GitHub, GitLab and Bitbucket show it automatically on the project page.

### Is README.md written in Markdown?

Yes — the `.md` extension stands for Markdown, so you can use headings, lists, links, images, tables and code blocks.

### How long should a README be?

As long as needed and no longer. Cover the essentials near the top, and link to separate documentation for details.

### Can I preview my README before pushing it?

Yes. Paste it into Quilldown to see the formatted result as you type, then copy the Markdown back. It uses GitHub-style Markdown, so tables, task lists and fenced code render as they will on GitHub.

### Do I need a README for a private project?

It's still worthwhile. A README helps teammates (and future you) understand and run the project.
