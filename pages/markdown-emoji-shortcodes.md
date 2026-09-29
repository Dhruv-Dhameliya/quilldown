---
title: Emoji in Markdown — Shortcodes and Cheat Sheet
h1: Emoji in Markdown: shortcodes and cheat sheet
short: Emoji shortcodes
card: A cheat sheet of :shortcodes:.
description: How to use emoji in Markdown: what :shortcodes: are, how autocomplete works, and a cheat sheet of popular codes like :rocket:, :tada: and :white_check_mark:.
lead: Add personality to READMEs, notes and docs with emoji. Type a colon and a few letters, pick from the suggestions — or use the popular shortcodes below.
category: learn
order: 3
published: 2026-09-29
updated: 2026-09-29
related: markdown-cheat-sheet, readme-template, what-is-markdown
cta: Try emoji shortcodes in the editor
ctaText: Type a colon and a few letters — like :roc — in Quilldown and pick from the suggestions. A finished :tada: turns into 🎉 as you type.
---

## What are emoji shortcodes?

An **emoji shortcode** is a short name between two colons that stands for an emoji: `:rocket:` means 🚀 and `:tada:` means 🎉. They were popularised by GitHub and chat apps because they are easy to type and remember, and readable even where emoji fonts are missing.

````example title="Shortcodes in Markdown"
Ship it :rocket: and celebrate :tada:

- :white_check_mark: Tests pass
- :warning: One deprecation
- :bug: Fixed the crash
````

## Using emoji in Quilldown

Quilldown gives you three ways to add emoji:

<ol class="steps">
<li><strong>Type a shortcode.</strong> Enter a colon and two or more letters — for example <code>:roc</code> — and suggestions appear at the cursor. Use <kbd>↑</kbd> <kbd>↓</kbd> and <kbd>Enter</kbd> (or click) to insert. If you type a complete code like <code>:tada:</code>, it turns into 🎉 the moment you type the closing colon.</li>
<li><strong>Use the picker.</strong> Click the smiley button in the toolbar to search by name, browse categories, choose a skin tone and reuse recently used emoji.</li>
<li><strong>Write shortcodes in your text.</strong> Any <code>:name:</code> with a valid name is shown as the emoji in the preview and in exports, so documents imported from GitHub look right.</li>
</ol>

The suggestions are careful not to get in your way: they don't appear inside code, in times like `10:30`, or in web addresses, and you can switch them off with the checkbox at the bottom of the emoji picker.

## Shortcodes vs. the emoji character

| | **Shortcode** (`:tada:`) | **Emoji character** (🎉) |
| --- | --- | --- |
| **Portability** | Only renders where the tool converts it (GitHub, GitLab, chat apps, Quilldown) | Works in any text field, file and app |
| **Readability in source** | Easy to read and type | Needs an emoji font to display |
| **Search and diffs** | Searchable by name | Harder to search |

Quilldown's autocomplete inserts the real emoji character, so the result travels safely into Word, Google Docs, PDF and HTML exports.

## Popular emoji shortcodes

### Reactions and hands

```emoji-table
+1, -1, clap, pray, raised_hands, ok_hand, muscle, wave, point_right, point_left, v, handshake, fist, eyes, thinking
```

### Faces

```emoji-table
smile, grinning, joy, rofl, sweat_smile, wink, blush, heart_eyes, sunglasses, star_struck, partying_face, sob, cry, angry, scream, nerd_face, slightly_smiling_face, upside_down_face, hugs, relieved
```

### Status and symbols

```emoji-table
white_check_mark, heavy_check_mark, x, warning, no_entry, question, exclamation, information_source, bulb, fire, sparkles, star, zap, boom, hourglass, alarm_clock, pushpin, bookmark, link, lock, key, mag, bell
```

### Work and development

```emoji-table
rocket, bug, construction, wrench, hammer, gear, package, memo, books, computer, keyboard, chart_with_upwards_trend, calendar, clipboard, art, robot, shield, hourglass_flowing_sand
```

### Celebration

```emoji-table
tada, confetti_ball, balloon, gift, trophy, crown, birthday, champagne, clinking_glasses, medal_sports
```

### Hearts

```emoji-table
heart, orange_heart, yellow_heart, green_heart, blue_heart, purple_heart, black_heart, broken_heart, sparkling_heart
```

### Nature and food

```emoji-table
coffee, pizza, beer, cake, apple, sunny, cloud, rainbow, seedling, herb, evergreen_tree, cat, dog, unicorn, snowflake, earth_africa
```

## Tips for using emoji well

- **Use them as signals, not decoration.** ✅ ⚠️ 🐛 work well as status markers in changelogs and checklists.
- **Don't rely on emoji alone.** Pair them with words so screen-reader users and people on limited fonts don't miss the meaning.
- **Keep it consistent.** Choose one emoji per meaning across your project.
- **Mind your audience.** In formal documents such as contracts or papers, leave emoji out.

Ready to write more? See the full [Markdown cheat sheet](/guides/markdown-cheat-sheet), or use emoji to liven up a [README](/guides/readme-template).

## Frequently asked questions

### How do I add emoji to Markdown?

Type an emoji shortcode such as `:smile:`, paste the emoji character itself, or use Quilldown's emoji picker. Quilldown also suggests emoji as you type a colon and a few letters.

### What is the shortcode for a checkmark?

`:white_check_mark:` gives ✅ and `:heavy_check_mark:` gives ✔️. For a cross use `:x:`.

### Do emoji shortcodes work on GitHub?

Yes. GitHub renders shortcodes such as `:rocket:` in READMEs, issues and comments. Quilldown uses the same GitHub-style names, plus extra Slack-style aliases.

### Why isn't my shortcode turning into an emoji?

Check the spelling — names must match exactly, for example `:thumbsup:` or `:+1:` rather than `:thumbs_up:`. Unknown names are left as typed. Start typing after a colon to see the correct names in the suggestion list.

### Can I change the skin tone?

Yes. In the emoji picker, choose a skin tone from the row at the top; emoji that support tones use it, and your choice is remembered.

### Do emoji work in the PDF and Word exports?

Yes. Emoji are exported as characters, so they appear as long as the viewing device has an emoji font.
