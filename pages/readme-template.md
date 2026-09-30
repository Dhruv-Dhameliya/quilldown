---
title: README Template: Write a Great README.md (Free, Copy-Ready)
h1: How to write a great README.md (with a free template)
h1em: (with a free template)
short: README template
card: A copy-ready starting point.
description: How to write a README.md: what to include, section order, a free copy-ready Markdown template, badges, formatting tips and common mistakes to avoid.
lead: A README is your project's front door. This guide shows what to put in it and in what order, gives you a complete template to copy, and covers badges, screenshots and the mistakes that cost you users. You can draft and preview it in your browser, and nothing is uploaded.
category: write
order: 10
home: true
published: 2026-09-29
updated: 2026-09-30
scripts: /js/tools.js
related: markdown-cheat-sheet, markdown-table-generator, emoji-in-markdown
cta: Start your README now
ctaText: In Quilldown choose New → Templates → README for a ready-made starting point, and see the formatted result as you type.
---

> [!TIP]
> **Quick answer.** A good README answers four questions in order: what is this, why should I care, how do I use it, and how can I help or get help. Put the project name and a one-sentence description at the top, then a screenshot or short example, install steps, usage, and finish with contributing and the license. Save it as `README.md` in the root of your repository, and GitHub shows it on the project page automatically.

<section class="tool" data-tool="readme" aria-label="README generator"></section>

<div class="cs-jump"><a href="#a-copy-ready-readme-template">Copy the template</a><a href="#a-minimal-readme-for-small-projects">Minimal README</a><a href="#a-starter-for-your-github-profile-readme">Profile README</a><a href="#badges-which-ones-are-worth-adding">Badges</a><a href="#screenshots-gifs-and-diagrams">Screenshots</a><a href="#common-readme-mistakes-and-how-to-fix-them">Fix common mistakes</a><a href="#a-quick-checklist-before-you-commit">Checklist</a></div>

## What is a README.md, and what should it do?

A **README** is the first file people read in a project. On GitHub, GitLab, Bitbucket and most code hosts, a file called `README.md` in the root of your repository is displayed automatically on the project's front page. GitHub also looks in a `.github` folder and a `docs` folder. If there is more than one, it shows the `.github` one first, then the root, then `docs`. The `.md` means it is written in [Markdown](/docs/what-is-markdown), so it can hold headings, lists, code blocks, tables and images.

A README has one job: help a stranger decide, within about thirty seconds, whether your project is for them, and then get them to a working result. It should answer four questions in this order:

1. **What is this?** One sentence, no jargon.
2. **Why should I care?** What problem it solves or what makes it different.
3. **How do I use it?** Install, run, first result.
4. **How can I help, or get help?** Contributing, issues, license.

If the top of your README does not answer the first two, most visitors leave before they reach the rest.

## What to include in a README, and in what order

The order follows the reader's decision path: understand, trust, try, dig deeper, contribute. Put what everyone needs first and what only a few need last.

| Order | Section | What it covers | Why it sits here | Priority |
| --- | --- | --- | --- | --- |
| 1 | **Title and tagline** | Project name and one sentence about what it does | Readers decide instantly | Essential |
| 2 | **Badges** | Build status, version, license | Quick proof it is maintained | Optional |
| 3 | **Screenshot or demo** | An image, GIF or short code sample | Shows the result before the text does | Strongly recommended |
| 4 | **Features** | Three to six bullets | Confirms it fits the need | Recommended |
| 5 | **Quick start / installation** | Requirements, install, first run | Gets a working result fast | Essential |
| 6 | **Usage** | Common tasks with copy-ready code | The reason people came | Essential |
| 7 | **Configuration** | Options in a table | Reference for returning users | If relevant |
| 8 | **Documentation** | Links to full docs, API, examples | Keeps the README short | If you have docs |
| 9 | **Roadmap and changelog** | What is planned, where release notes live | Signals whether it is alive | Recommended |
| 10 | **Contributing** | How to report bugs and send changes | Turns users into contributors | Open source |
| 11 | **License** | The terms the code is shared under | Others cannot reuse code without it | Essential |
| 12 | **Credits and contact** | Authors, thanks, support channel | Optional context | Optional |

## A copy-ready README template

Copy this into your project, or open it in the editor and replace the placeholders. The right-hand side shows how GitHub-style Markdown renders it. Delete any section that does not apply rather than leaving it empty.

````example title="README.md template" file=README.md
# Project name

[![Build status](https://github.com/your-name/project-name/actions/workflows/ci.yml/badge.svg)](https://github.com/your-name/project-name/actions)
[![Latest version](https://img.shields.io/npm/v/project-name)](https://www.npmjs.com/package/project-name)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> One sentence that says what this project does and who it is for.

![Screenshot of Project name showing the main screen](docs/screenshot.png)

## Features

- ✅ Feature one — what it gives you
- ✅ Feature two — the problem it removes
- 🚧 Feature three — in progress

## Quick start

```bash
npm install project-name
```

```js
import { greet } from "project-name";

console.log(greet("world")); // Hello, world!
```

## Installation

### Requirements

- Node.js 18 or later
- npm 9 or later

### Install from source

```bash
git clone https://github.com/your-name/project-name.git
cd project-name
npm install
npm test
```

## Usage

### Greet someone loudly

```js
greet("Ada", { loud: true }); // HELLO, ADA!
```

### Read the name from the command line

```bash
project-name greet "Ada" --loud
```

## Configuration

| Option  | Type      | Default   | Description                    |
| :------ | :-------- | :-------- | :----------------------------- |
| `name`  | `string`  | `"world"` | Who to greet                   |
| `loud`  | `boolean` | `false`   | Shout the greeting             |
| `lang`  | `string`  | `"en"`    | Language of the greeting       |

## Documentation

Full guides and the API reference are in the [docs folder](docs/README.md).

## Roadmap

- [x] Greeting in English
- [ ] More languages
- [ ] Browser build

## Contributing

Bug reports and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first, and open an issue before starting large changes.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## License

Released under the [MIT License](LICENSE).
````

> [!TIP]
> Quilldown includes a README template: choose **New → Templates → README**. It opens in a new tab so your current document is untouched.

## A minimal README for small projects

Not every project needs twelve sections. If yours is small, or you just want a solid start, these five are enough.

1. **A title (H1)** with your project name, followed by one sentence saying what it does and who it's for.
2. **H2 Install:** the command a reader pastes to get started.
3. **H2 Usage:** the smallest working example, with the expected output.
4. **H2 Contributing:** one sentence and a link to your issues page.
5. **H2 License:** one line naming the license, linked to your LICENSE file.

Grow it later. Add a screenshot, a features list and a configuration table when the project needs them, not before.

````example title="A minimal README" file=README.md
# Project name

One sentence that says what this does and who it is for.

## Install

```bash
npm install project-name
```

## Usage

```js
import { greet } from 'project-name';

console.log(greet('Ada'));
// Hello, Ada!
```

## Contributing

Bug reports and ideas are welcome on the [issues page](https://github.com/your-name/project-name/issues).

## License

[MIT](LICENSE)
````

## Write the top of your README for scanning

The first screen decides whether people keep reading, so spend most of your effort there.

| Weak | Strong | Why |
| --- | --- | --- |
| "A tool for things" | "A command-line tool that renames photos by the date they were taken" | Names the thing and the job |
| "Fast, modern, powerful" | "Parses a 50 MB CSV file in under a second on a laptop" | A claim a reader can check |
| "Easy to use" | Three lines of code that produce a result | Show it instead of saying it |
| "Please see the wiki" | Install and first run right on the page | Do not make people leave to start |

Write the tagline as a plain sentence, not a slogan. Say what it does, for whom, and, if it has a close competitor, how it differs. Then show the install command or a screenshot straight after.

## Badges: which ones are worth adding

Badges are small images, usually served live from a service, that report build status, version, downloads or license. They are proof that something is maintained, but they turn into noise past four or five.

| Badge | Worth it when | Notes |
| --- | --- | --- |
| **Build or CI status** | You run automated tests | Links to the workflow run; a red badge is honest and useful |
| **Latest version** | You publish to npm, PyPI, crates.io or similar | Saves you editing the version by hand |
| **License** | Always | Readers scan for it |
| **Coverage** | You track it and keep it healthy | Skip it if the number is embarrassing |
| **Downloads or stars** | Rarely | Vanity metrics; they add little |

A badge is a linked image: `[![Alt text](image-url)](link-url)`. Always write meaningful alt text, since screen readers and broken images fall back to it. Prefer live badges over static ones for anything that changes, and read the [Markdown cheat sheet](/docs/markdown-cheat-sheet) if the nesting of brackets looks odd.

## Screenshots, GIFs and diagrams

A single good image tells a visitor more than a paragraph. A few rules keep it useful:

- **Show the result, not the setup.** A terminal after the command ran, or the app with sample data.
- **Keep files in the repository,** in a folder such as `docs/` or `assets/`, and link with a relative path: `![Dashboard with three charts](docs/dashboard.png)`.
- **Keep GIFs short and small.** Under ten seconds and a few megabytes; long recordings slow the page and look worse than a still with a caption.
- **Control the size** when the image is huge: use HTML, such as `<img src="docs/dashboard.png" width="600" alt="Dashboard with three charts">`.
- **Offer a dark-mode version** if the screenshot has a white background. GitHub supports a `<picture>` element with a `prefers-color-scheme` source, so one image shows in light mode and another in dark.
- **Draw architecture, do not describe it.** A [Mermaid diagram](/docs/diagrams-in-markdown) in a fenced block renders on GitHub and stays editable as text.

Package pages on registries such as npm and PyPI display your README away from the repository. Relative image paths often break there, so use full URLs for images if the README doubles as a package page.

## Installation, usage and configuration

These three sections do the most work, and they go wrong in predictable ways.

**Installation.** List the requirements with versions ("Node.js 18 or later"), then give commands a reader can paste in order. Include the command that proves it worked, such as `npm test` or `project-name --version`, and say what the output should look like.

**Usage.** Start with the smallest working example, then add one heading per common task. Show the input and the expected output together, so readers can compare.

```bash
project-name greet "Ada" --loud
# HELLO, ADA!
```

**Configuration.** Use a table with one row per option and columns for the name, type, default and description. Tables scan far better than paragraphs, and the [table editor and generator guide](/docs/markdown-table-generator) shows how to build one without typing pipes by hand. Document the default of every option; people read this section when something behaves unexpectedly.

## README structure by project type

The template above is a starting point. Different projects lead with different things.

| Project type | Lead with | Must include | Watch out for |
| --- | --- | --- | --- |
| **Library or package** | The install command and a five-line example | Supported versions, API overview, link to full reference | Examples that do not match the current API |
| **Web or desktop app** | Screenshot and what it is for | Install or hosting steps, environment variables, how to run locally | Missing setup for secrets and databases |
| **Command-line tool** | A copy-paste command and its output | Every flag in a table, exit codes, install methods | Help text and README that disagree |
| **Data or research project** | What the data is, its source and its license | Column descriptions, collection dates, how to reproduce results, citation | No license for the data, no note on limitations |

## A starter for your GitHub profile README

A profile README is a special README that appears at the top of your GitHub profile. Create a public repository named exactly like your username, add a `README.md`, and GitHub shows it. Keep it short and personal.

- **A greeting** with your name and a single line about what you do.
- **What I'm working on now,** with two or three linked bullets.
- **Tools I use,** as a short list (a wall of badges slows the page and hides the point).
- **Find me,** with links to your site, social profiles and email.
- **Optionally,** a note pointing to one pinned project you're proud of.

Tips: write meaningful alt text for any image, keep GIFs small, and avoid loading many third-party widgets, since each one slows the page and can break.

## Formatting that makes a README easier to read

Small details of Markdown formatting make a long README easy to navigate.

- **One `#` title, then `##` sections and `###` steps.** GitHub builds a clickable outline from your headings.
- **Link to sections with anchors.** GitHub turns a heading into a lowercase, hyphenated anchor: `## Getting started` becomes `#getting-started`. A short table of contents helps once the file is longer than a couple of screens.
- **Use relative links for files in the repository:** `[Contributing guide](CONTRIBUTING.md)` keeps working on forks and branches.
- **Tag code fences with a language,** such as `bash` or `js`, for highlighting and a copy button.
- **Hide the long parts** in collapsible sections, and keep the main path short.
- **Use callouts** for the one warning readers must not miss.
- **Use task lists** for a roadmap.

````example title="Callouts, collapsible sections, links and task lists"
> [!NOTE]
> Requires Node.js 18 or later.

Jump to [Configuration](#configuration) or read the [contributing guide](CONTRIBUTING.md).

<details>
<summary>Troubleshooting</summary>

**Port already in use?** Set `PORT=4000` and run the command again.

</details>

- [x] Import from CSV
- [ ] Export to JSON
````

Leave a blank line after `<summary>` and before `</details>`, otherwise the Markdown inside will not render. Emoji work well as small status markers in feature lists; the [emoji shortcode cheat sheet](/docs/emoji-in-markdown) has the codes and the pitfalls.

## Versions, changelogs and keeping the README current

A README describes one moment in time, so decide what belongs in it and what does not.

- **Keep release history out of the README.** Put it in `CHANGELOG.md` and link to it. The README should describe how the current version works.
- **Use a changelog format people recognize.** The Keep a Changelog convention groups entries under Added, Changed, Deprecated, Removed, Fixed and Security, with newest first.
- **Follow semantic versioning if you publish releases:** `MAJOR.MINOR.PATCH`, where a major bump signals a breaking change.
- **Let a badge carry the version number** instead of writing it in text that goes stale.
- **Say which versions the instructions apply to** whenever they depend on one.

````example title="CHANGELOG.md in Keep a Changelog style"
## [1.2.0] - 2026-09-29

### Added
- `--format` option for JSON output

### Fixed
- Crash when the config file is empty

## [1.1.0] - 2026-08-14

### Changed
- Default greeting is now "Hello"
````

Treat the README as code. Follow your own install steps on a clean machine (a fresh container works) before each release, and update the README in the same pull request that changes the behavior.

## Common README mistakes and how to fix them

| Mistake | Why it hurts | Fix |
| --- | --- | --- |
| **No description, only install commands** | Visitors cannot tell what the project is | Add a one-sentence tagline at the very top |
| **Outdated instructions** | The first thing a new user tries fails | Test on a clean machine; update with each release |
| **Walls of text** | Nobody reads them | Use headings, lists, tables and a short first screen |
| **Missing license** | Without one, others have no legal permission to reuse your code | Add a `LICENSE` file and name it in the README |
| **Broken image links** | Screenshots vanish on forks and package pages | Use paths relative to the repository, or full URLs for registries |
| **Assuming knowledge** | Newcomers give up at step one | State requirements and explain unfamiliar terms once |
| **Copy-paste commands that need edits** | Readers paste them and get errors | Mark placeholders clearly, such as `your-name` |
| **Everything in one file** | The README becomes a manual | Link to docs for depth |
| **Ignoring contribution rules** | Pull requests arrive in the wrong shape | Add a short Contributing section and a `CONTRIBUTING.md` |

On choosing a license: MIT and Apache-2.0 are permissive, so others can reuse your code with few conditions, while the GPL family requires derivative work to stay open. Pick one deliberately, and if the project belongs to an employer, check with them first.

## A real example: Quilldown's own README

Quilldown is a hosted app, so its README leads a little differently from a code library. It's a good example of the ideas in this guide.

- **A tagline first.** It opens with a short line and one paragraph saying what the app is, with links to the live app and the source.
- **Highlights instead of an install step.** Because you use the app in a browser, it leads with a short bulleted list of what it offers.
- **Tables for reference.** The toolbar groups, export formats, templates and keyboard shortcuts are all in tables, which scan far faster than paragraphs.
- **Limits are stated plainly.** A "Good to know" section lists the file size, tab and storage limits.
- **A "Built with" section.** It lists the libraries and a map of the folders, which helps contributors find their way.

[See Quilldown's README on GitHub](https://github.com/Dhruv-Dhameliya/quilldown#readme)

A README isn't finished until it names its license. Once your repository has a LICENSE file, add a License section that names it and links to the file, as the template above does.

## A quick checklist before you commit

<ul class="checklist"><li>A one-sentence description at the very top</li><li>A screenshot, GIF or short code sample near the top</li><li>Requirements with versions, and install commands you've tested on a clean machine</li><li>The smallest working usage example, with the expected output</li><li>A configuration table, with defaults, if there are options</li><li>Links to fuller documentation instead of everything on one page</li><li>Alt text on every image, and relative paths for images stored in the repository</li><li>No more than four or five badges</li><li>A Contributing section</li><li>A LICENSE file, named in the README</li><li>Placeholders such as <code>your-name</code> replaced or clearly marked</li></ul>

## Draft and preview your README in Quilldown

You can write a README without installing anything. In Quilldown, choose **New → Templates → README**, then use the live preview with synced scrolling to see the formatted result as you type. Some features help specifically here:

- **Find & replace** swaps every `project-name` and `your-name` placeholder in one go.
- **The outline** lets you jump between sections in a long README.
- **The visual Table editor** builds the configuration table, so you never count pipes.
- **Tabs** keep the README open next to `CONTRIBUTING.md` and notes.
- **Export** as `.md` when you are ready to commit, or use a **Share link** to send a draft for review. Nothing is uploaded either way.

If you paste, drop or upload an image while drafting, check the image link in your Markdown before committing and replace it with a relative path such as `docs/screenshot.png`. Then confirm the layout once on the host, since GitHub, GitLab and package registries differ slightly. Not sure about the syntax? Keep the [Markdown cheat sheet](/docs/markdown-cheat-sheet) open while you write.

## Other ways to start a README

| Method | Good for | Trade-offs |
| --- | --- | --- |
| **Quilldown's README template** | Drafting and previewing in your browser, with the table editor for configuration | You copy the file into your repository yourself |
| **Creating the file on your code host** | A quick start when you create a new repository | You edit in a plain text box with a limited preview |
| **README generator websites** | Filling in a form to get a first draft | Check that they run in your browser before you enter private details |
| **Copying a well-loved project's README** | Seeing what good looks like | You still have to adapt it, and never copy text you don't have permission to reuse |

## Frequently asked questions

### What should a README.md contain?

At minimum: the project name and a one-line description, how to install and use it, and the license. As the project grows, add features, a screenshot, configuration options, a roadmap and contribution guidelines. Keep the essentials at the top and link to separate documentation for detail.

### Where do I put the README file?

Put it in the root folder of your repository and name it `README.md`. GitHub, GitLab and Bitbucket show it automatically on the project page. GitHub will also find a README in a `.github` or `docs` folder. If there is more than one, it shows the `.github` one first, then the root, then `docs`.

### Is README.md written in Markdown?

Yes. The `.md` extension stands for Markdown, so you can use headings, lists, links, images, tables, task lists and fenced code blocks. Code hosts use GitHub Flavored Markdown or a close variant. If you are new to it, read [What is Markdown?](/docs/what-is-markdown) first.

### How long should a README be?

As long as it needs to be to get a new user to a working result, and no longer. A small library may need one screen; a larger app may need several, with a table of contents. When a section grows past a page, move it into a separate document and link to it.

### Can I preview my README before pushing it?

Yes. Paste it into Quilldown to see the formatted result as you type, then copy the Markdown back. It supports GitHub Flavored Markdown, so tables, task lists, callouts and fenced code render much as they will on GitHub. Check the final page on your host, because small differences exist between platforms.

### Do I need a README for a private project?

It is still worthwhile. A README helps teammates and your future self remember what the project is, how to run it and how to deploy it. For private work, put more emphasis on setup steps, environment variables and who to ask for help.

### What is a profile README on GitHub?

It is a special README that appears at the top of your GitHub profile page. Create a public repository whose name matches your username exactly, add a `README.md`, and GitHub shows it on your profile. Use it for a short introduction, current projects and links, written in the same Markdown as any other README.

### How do I make a README file?

Create a file named `README.md` in the root folder of your repository, write it in Markdown, and commit it. On most code hosts you can also create it from the repository page. In Quilldown, choose New, then Templates, then README, edit it, and export it as a .md file.

### What is a README template?

A README template is a ready-made structure with the usual sections filled with placeholders, such as a title, description, install steps, usage, license and contributing. You replace the placeholders with your own details and delete the sections you don't need.

### How do I add a table of contents to a README?

GitHub builds a clickable outline from your headings automatically. If you want a written one, add a list of links to your headings, using each heading's lowercase, hyphenated anchor, for example `[Usage](#usage)`. It helps once the file is longer than a couple of screens.

### How do I add badges to a README?

A badge is a linked image: `[![Alt text](image-url)](link-url)`. Use live badges for anything that changes, such as build status and version, and keep to four or five. Always write alt text, since it's shown when the image doesn't load.

### How do I add an image to a README?

Store the image in your repository, such as in a `docs` folder, and link it with a relative path: `![Dashboard with three charts](docs/dashboard.png)`. Use full URLs instead if the README will also appear on a package registry page, where relative paths often break.

### How do I add a license to my README?

Add a LICENSE file to the repository, then add a License section to the README that names the license and links to the file. Pick one deliberately. MIT and Apache-2.0 are permissive, and the GPL family requires derivative work to stay open.

### How do I center text or an image in a README?

Markdown has no centering syntax, so use HTML, such as a `div` with `align="center"`. GitHub honors it, but check how other platforms treat HTML.

### Should I put the changelog in the README?

No. Keep release history in a `CHANGELOG.md` file and link to it from the README. The README should describe how the current version works.
