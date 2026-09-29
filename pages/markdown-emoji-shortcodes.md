---
title: Emoji in Markdown — Shortcodes and Cheat Sheet
h1: Emoji in Markdown: shortcodes and cheat sheet
short: Emoji shortcodes
card: A cheat sheet of :shortcodes:.
description: Emoji shortcodes explained: how :rocket: works in Markdown, where it renders, shortcode vs Unicode, a cheat sheet of popular codes and common fixes.
lead: An emoji shortcode is a name between two colons, like :rocket:, that turns into 🚀. Here is how shortcodes work, where they don't, and a cheat sheet of the codes worth knowing.
category: learn
order: 3
published: 2026-09-29
updated: 2026-09-29
related: markdown-cheat-sheet, readme-template, what-is-markdown
cta: Try emoji shortcodes in the editor
ctaText: Type a colon and a few letters — like :roc — in Quilldown and pick from the suggestions. A finished :tada: turns into 🎉 as you type.
---

## How do emoji shortcodes work in Markdown?

An **emoji shortcode** is a lowercase name wrapped in colons: `:rocket:` stands for 🚀, `:tada:` for 🎉. The shortcode is not part of the Markdown standard. It is a convention that a tool applies *after* it reads your text: the renderer spots `:name:`, looks the name up in a table, and swaps in the emoji character. If the name is not in the table, the text stays exactly as you typed it.

That is why shortcodes are popular in READMEs and chat. They are easy to type on any keyboard, they read sensibly in the raw file (`:warning:` still says "warning" if the emoji never appears), and they are easy to search for.

````example title="Shortcodes in Markdown"
Ship it :rocket: and celebrate :tada:

- :white_check_mark: Tests pass
- :warning: One deprecation
- :bug: Fixed the crash
````

The catch is the same reason they are convenient: they only work where something converts them. The next sections cover where that is, and when to paste the real character instead.

## Where emoji shortcodes work (and where they don't)

| Where | Shortcodes render? | What to know |
| --- | --- | --- |
| **GitHub** (READMEs, issues, pull requests, comments) | Yes | Also has a few GitHub-only names, such as `:shipit:`, that are custom images with no Unicode equivalent |
| **GitLab** | Yes | Uses the same familiar names for standard emoji |
| **Slack and Discord** | Yes, in messages | Each app keeps its own name list, so a few names differ from GitHub's |
| **Static site generators** (Jekyll, Hugo, MkDocs, Docusaurus) | Only when enabled | Usually a config option or plugin; without it the colons show literally |
| **Plain CommonMark converters, email, Word and PDF converters** | No | The text stays as `:rocket:` unless the tool adds emoji support |

If your document leaves the place where it was written, the real character is the safer choice. Quilldown converts valid shortcodes in the preview, so what you see there is what an emoji-aware renderer will show. Before publishing anywhere else, check that platform once.

## Using emoji in Quilldown

Quilldown gives you three ways to add emoji:

<ol class="steps">
<li><strong>Type a shortcode.</strong> Enter a colon and a few letters — for example <code>:roc</code> — and suggestions appear. Use <kbd>↑</kbd> <kbd>↓</kbd> and <kbd>Enter</kbd> (or click) to insert one. Autocomplete can be switched off if you would rather type freely.</li>
<li><strong>Use the picker.</strong> The emoji picker lets you search by name, choose a skin tone and reuse your recently used emoji.</li>
<li><strong>Write shortcodes in your text.</strong> Any valid <code>:name:</code> shows as the emoji in the preview, so documents copied from GitHub look right straight away.</li>
</ol>

Everything happens in your browser, and your text is autosaved locally. Nothing is uploaded, so you can draft a README full of emoji and never create an account.

## Shortcode or emoji character: which should you use?

| | **Shortcode** (`:tada:`) | **Emoji character** (🎉) |
| --- | --- | --- |
| **Portability** | Only where a tool converts it | Works in any text field, file or app that has an emoji font |
| **Readable in the raw file** | Yes, even without an emoji font | Only if the editor displays emoji |
| **Search and diffs** | Easy to search by name | Hard to type and search for |
| **Consistent appearance** | Depends on the site's emoji set | Depends on the viewer's device and font |
| **Custom platform emoji** | Yes (`:shipit:`) | No |

A practical rule:

- **Use shortcodes** in files that live on GitHub or GitLab, in commit-style changelogs, and anywhere a teammate may grep for `:bug:`.
- **Use the character** when the document is bound for Word, Google Docs, PDF, email or a site that does not convert shortcodes. See the guides on [Markdown to PDF](/guides/markdown-to-pdf) and [Markdown to Word](/guides/markdown-to-word) for how exports behave.
- **Never mix styles randomly** inside one document. Pick one and stick with it so a search finds everything.

## Emoji shortcode cheat sheet

Every code below is valid in Quilldown. Type it between two colons, or start typing and let autocomplete finish it.

### Hands, reactions and people

The most-used codes in reviews and comments. Note that `+1` and `-1` are real names, plus signs and all.

```emoji-table
+1, -1, thumbsup, thumbsdown, clap, pray, raised_hands, ok_hand, muscle, wave, point_right, handshake, fist, v, eyes, thinking, technologist
```

### Status and symbols

Best for checklists, feature tables and callouts. Pair each one with a word.

```emoji-table
white_check_mark, heavy_check_mark, ballot_box_with_check, x, no_entry_sign, no_entry, warning, rotating_light, question, exclamation, information_source, bulb, fire, sparkles, star, zap, hourglass, alarm_clock, red_circle, green_circle, new, soon, sos
```

### Development and docs

The vocabulary of changelogs, pull requests and project boards.

```emoji-table
rocket, bug, construction, wrench, hammer_and_wrench, gear, package, memo, books, book, computer, test_tube, lock, key, shield, recycle, wastebasket, truck, label, chart_with_upwards_trend, bar_chart, robot, art, lipstick
```

### Objects and everyday things

```emoji-table
coffee, calendar, clipboard, pushpin, paperclip, bookmark, link, mag, bell, envelope, camera, floppy_disk, file_folder, page_facing_up, globe_with_meridians, speech_balloon, loudspeaker, gift, trophy, gem
```

### Faces and feelings

```emoji-table
smile, grinning, joy, sweat_smile, wink, blush, heart_eyes, sunglasses, star_struck, partying_face, slightly_smiling_face, upside_down_face, relieved, sob, angry, scream, nerd_face, hugs
```

### Celebration and hearts

```emoji-table
tada, confetti_ball, balloon, birthday, champagne, clinking_glasses, 100, heart, orange_heart, yellow_heart, green_heart, blue_heart, purple_heart, black_heart, broken_heart, sparkling_heart
```

Forgotten the name? In Quilldown type a colon and a few letters, or search in the picker. Elsewhere, search for "emoji shortcodes" plus the platform name, since lists differ slightly.

## Emoji conventions for READMEs and changelogs

Emoji earn their place as **status markers with a fixed meaning**. A widely copied convention (the gitmoji project popularised it for commit messages) assigns one emoji per kind of change:

| Meaning | Shortcode | Renders as |
| --- | --- | --- |
| New feature | `:sparkles:` | ✨ |
| Bug fix | `:bug:` | 🐛 |
| Documentation | `:memo:` | 📝 |
| Performance | `:zap:` | ⚡ |
| Security fix | `:lock:` | 🔒 |
| Refactor | `:recycle:` | ♻️ |
| Work in progress | `:construction:` | 🚧 |
| Tests | `:white_check_mark:` | ✅ |
| Breaking change | `:boom:` | 💥 |

Use them like this in a release note:

````example title="A changelog entry with status emoji"
- :sparkles: Added dark mode to the settings page
- :bug: Fixed a crash when the file name contains a space
- :boom: Removed the deprecated `--legacy` flag
- :memo: Documented all environment variables
````

Two cautions for README files. First, **emoji do not replace badges.** An emoji is static, so a ✅ next to "build" will still be there after the build breaks. Use a live badge for build status, version and coverage, and emoji for things that are true when you write them. Second, keep emoji out of headings you link to: GitHub builds heading anchors from the text and drops the emoji, so `## 🚀 Usage` typically becomes `#-usage`, which is easy to mistype. For the full picture see the [README template guide](/guides/readme-template).

## Skin tones, ZWJ sequences and other Unicode quirks

Behind every emoji is one or more Unicode code points, and that explains most of the odd behaviour.

- **Skin tones are modifiers.** A hand emoji such as 👋 followed by one of five modifier characters becomes 👋🏽 and so on. Standard shortcodes, including those on GitHub, name only the default yellow version. To get another tone, pick it from the emoji picker or paste the character. Slack and Discord each have their own tone syntax for shortcodes; Slack, for example, uses `:wave::skin-tone-3:`.
- **ZWJ sequences glue emoji together.** 🧑‍💻 is a person, an invisible zero-width joiner and a laptop. A platform that does not know the sequence shows the parts side by side (🧑💻). Newer emoji reach devices at different times, so an emoji you see may appear as a box or two separate symbols elsewhere.
- **Some symbols have two forms.** Characters such as ✔ and ⚠ can show as plain text symbols or as coloured emoji, depending on an invisible variation selector after them. Shortcodes such as `:heavy_check_mark:` and `:warning:` use the emoji form, which is why they look consistent.
- **Flags are letters in disguise.** A flag is two regional-indicator letters, so `:us:` gives 🇺🇸. Windows does not draw country flags in most fonts and shows two letters instead. If flags matter, say the country name in text too.
- **Appearance varies by platform.** The same emoji looks different on Apple, Google, Microsoft and GitHub. Do not rely on a fine detail of one design.

## Accessibility: making emoji work for everyone

Screen readers announce emoji by their official Unicode name. That is helpful in small doses and noisy in large ones.

- **✅ is spoken as "check mark button"**, and ❌ as "cross mark". Fine on its own, wordy when it opens every row of a 20-line list.
- **A run of five 🎉 is read five times.** Use one.
- **Colour is not a message.** 🟢 and 🔴 alone tell colour-blind readers nothing, and screen-reader users hear only "green circle". Write "Passing" or "Failing" next to them.
- **Put the emoji after the meaning, or between words,** rather than replacing a word: "Fixed :bug: login crash" is fine; "Fixed the 🐛 in the 🔑 flow" is not.
- **Give image-based icons alt text.** Real emoji characters do not need it, but badge or logo images do: `![Build passing](badge.svg)`.
- **Keep them out of formal documents,** such as contracts, papers and anything a translation tool or a text-to-speech pipeline will process.

## Common emoji shortcode problems and fixes

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `:thumbs_up:` stays as text | That name does not exist; the standard names are `:+1:` and `:thumbsup:` | Type `:thu` and pick from the suggestions |
| `:check_mark:` or `:checkmark:` stays as text | Not a standard name | Use `:white_check_mark:` (✅) or `:heavy_check_mark:` (✔️) |
| Colons show instead of an emoji on a website | The site's Markdown engine does not convert shortcodes | Enable the emoji plugin or paste the real character |
| A shortcode inside a code span is not converted | Code spans are meant to show text literally | This is correct; write it outside backticks if you want the emoji |
| You want to show a shortcode without converting it | The renderer converts every valid name | Wrap it in backticks, as in `:rocket:` |
| A time like `10:30` looks fine, but `1:100:5` changes | `:100:` is a real shortcode (💯); a shortcode needs a valid name between two colons | Put the text in a code span, or add spaces around the colons |
| A space breaks the code | `: rocket :` is not `:rocket:` | Remove the spaces; names never contain them |
| An emoji shows as an empty box | The viewer's font has no glyph for it (often a very new emoji) | Use an older, widely supported emoji or add a word for the meaning |
| Emoji vanish from a PDF or Word file | The device or font used to open the file has no emoji font | Check the export on the device where it will be read |

Colons in ordinary prose are safe: a shortcode needs a valid name between two colons, with nothing else inside, so `Note: see below` or `10:30` is never converted.

## Emoji, in moderation

Use emoji as signals, not decoration, choose one emoji per meaning across a project, and think about the reader. A README for a friendly open-source tool can carry a few; a report to a client rarely should. When you are unsure, write the sentence without the emoji first, then add one only if it makes the meaning quicker to scan.

Ready to write more? The [Markdown cheat sheet](/guides/markdown-cheat-sheet) covers the rest of the syntax, and [What is Markdown?](/guides/what-is-markdown) explains the format from the beginning. If you publish to the web, the [Markdown to HTML guide](/guides/markdown-to-html) shows how the output looks as a page.

## Frequently asked questions

### How do I add emoji to Markdown?

Type an emoji shortcode such as `:smile:`, paste the emoji character itself, or use an emoji picker. Shortcodes work only where the renderer converts them (GitHub, GitLab, Slack and Discord do), while the character works almost anywhere. In Quilldown you can also type a colon and a few letters, such as `:roc`, and choose from the suggestions.

### What is the shortcode for a checkmark?

`:white_check_mark:` gives ✅ (a white check on a green square) and `:heavy_check_mark:` gives ✔️ (a plain black check). `:ballot_box_with_check:` gives ☑️. For a cross, use `:x:` (❌). Names such as `:checkmark:` are not standard and stay as text.

### Do emoji shortcodes work on GitHub?

Yes. GitHub renders shortcodes such as `:rocket:` in README files, issues, pull requests and comments. It also has a few custom names, like `:shipit:`, that are images rather than Unicode characters, so they will not appear in other tools.

### Why isn't my shortcode turning into an emoji?

Usually the name is wrong or the platform does not convert shortcodes. Names must match exactly and contain no spaces: use `:+1:` or `:thumbsup:`, not `:thumbs_up:`. Unknown names are left as typed. If the name is right, the site's Markdown engine probably needs an emoji plugin, or you can paste the emoji character instead.

### Can I change the skin tone of an emoji?

Yes, but not with a standard shortcode, which names only the default tone. Choose a tone in Quilldown's emoji picker or paste the character with the tone you want. Slack and Discord have their own syntax for tones inside shortcodes, and it is different in each.

### Are emoji accessible to screen readers?

Screen readers read each emoji by its Unicode name, for example "rocket" or "check mark button", so a few are fine and many become noisy. Never use emoji as the only carrier of meaning, especially colour-coded ones like 🟢 and 🔴, and write the word next to the symbol.

### Do emoji work in PDF and Word exports?

Emoji are ordinary characters, so they appear in an export as long as the device or font that opens the file has an emoji font. If you plan to export, the character is a safer choice than a shortcode that a converter may not understand. See the guides to [Markdown to PDF](/guides/markdown-to-pdf) and [Markdown to Word](/guides/markdown-to-word).
