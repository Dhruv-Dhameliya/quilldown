/* Quilldown — document templates offered in New ▾ → Templates.
   Each entry: { id, name, desc, icon, file, text() }. `text()` runs when the template is opened so dates are current.
   Templates should use only features Quilldown renders (and ideally exercise a few of them). */
(function () {
  var F = '```'; // fence, kept out of the template literals below
  var today = function () { return new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); };
  var iso = function (days) { var d = new Date(); d.setDate(d.getDate() + (days || 0)); return d.toISOString().slice(0, 10); };

  window.QUILLDOWN_TEMPLATES = [
    {
      id: 'readme', name: 'README', desc: 'Project readme with install, usage and license', icon: 'md', file: 'README.md',
      text: function () { return String.raw`# Project name

> One sentence that explains what this project does and who it is for.

## Features

- ✅ Feature one — what it gives you
- ✅ Feature two — why it matters
- 🚧 Feature three — coming soon

## Getting started

### Requirements

- Node.js 20 or newer
- A free API key from [example.com](https://example.com)

### Installation

` + F + String.raw`bash
git clone https://github.com/your-name/project-name.git
cd project-name
npm install
` + F + String.raw`

### Usage

` + F + String.raw`js
import { greet } from "project-name";

console.log(greet("world"));
` + F + String.raw`

## Configuration

| Option    | Type      | Default   | Description                  |
| :-------- | :-------- | :-------- | :--------------------------- |
| ` + '`name`' + String.raw`    | ` + '`string`' + String.raw`  | ` + '`"world"`' + String.raw`  | Who to greet                 |
| ` + '`loud`' + String.raw`    | ` + '`boolean`' + String.raw` | ` + '`false`' + String.raw`    | Shout the greeting           |

## Roadmap

- [x] First release
- [ ] Plugin system
- [ ] Documentation site

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

> [!TIP]
> Run the tests with ` + '`npm test`' + String.raw` before opening a pull request.

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).
`; }
    },
    {
      id: 'meeting', name: 'Meeting notes', desc: 'Agenda, decisions and action items', icon: 'tabs', file: 'meeting-notes.md',
      text: function () { return String.raw`# Meeting notes — Project sync

**Date:** ${today()}
**Time:** 10:00 – 10:45
**Location:** Video call / Room 2
**Facilitator:** Name · **Note-taker:** Name

## Attendees

- Name — role
- Name — role
- Name — role

## Agenda

1. Status updates *(10 min)*
2. Blockers and risks *(15 min)*
3. Decisions needed *(15 min)*
4. Wrap-up *(5 min)*

## Discussion

### 1. Status updates

-

### 2. Blockers and risks

-

> [!NOTE]
> Capture the *why* behind a decision, not only the outcome.

## Decisions

| #   | Decision | Owner | Date |
| --- | -------- | ----- | ---- |
| 1   |          |       | ${iso(0)} |

## Action items

- [ ] **Name** — describe the task — due ${iso(7)}
- [ ] **Name** — describe the task — due ${iso(7)}
- [ ] **Name** — describe the task — due ${iso(14)}

## Next meeting

${iso(7)} · same time · same place
`; }
    },
    {
      id: 'resume', name: 'Résumé / CV', desc: 'Clean one-page layout', icon: 'docs', file: 'resume.md',
      text: function () { return String.raw`<div align="center">

# Your Name

City, Country · you@example.com · +00 000 000 000 · [linkedin.com/in/you](https://linkedin.com/in/you)

</div>

## Summary

Results-driven professional with X years of experience in ____. Known for ____, ____ and ____. Looking to ____.

## Experience

### Job Title — Company Name
*Month Year – Present · City*

- Led ____, resulting in a **30% improvement** in ____
- Built ____ used by ____ people every week
- Mentored ____ colleagues and introduced ____

### Job Title — Company Name
*Month Year – Month Year · City*

- Delivered ____ on time and under budget
- Reduced ____ by ____% through ____

## Education

### Degree, Subject — University Name
*Year – Year* · Grade / honors

## Skills

| Area       | Skills                                  |
| :--------- | :-------------------------------------- |
| Core       | Skill · Skill · Skill                   |
| Tools      | Tool · Tool · Tool                      |
| Languages  | English (native) · Language (fluent)    |

## Projects & extras

- **Project name** — one line about what it is and the impact ([link](https://example.com))
- **Certification** — issuer, year
`; }
    },
    {
      id: 'blog', name: 'Blog post', desc: 'Title, intro, sections and call to action', icon: 'pen', file: 'blog-post.md',
      text: function () { return String.raw`# A clear, specific headline that promises something

*By Your Name · ${today()} · 5 min read*

Start with a hook: a surprising fact, a question, or a short story. In two or three sentences, say what this post covers and why the reader should care.

## The problem

Describe the situation your reader is in. Use plain words and one concrete example.

> "A short, quotable line that captures the point of the post."

## The approach

Explain your idea step by step:

1. **First step** — what to do and why
2. **Second step** — what to do and why
3. **Third step** — what to do and why

> [!TIP]
> Use callouts for advice readers might otherwise skim past.

## What happened

Share results, numbers or lessons. A small table can say it faster than a paragraph:

| Before | After  |
| :----- | :----- |
| Slow   | Fast   |
| Messy  | Tidy   |

Sources and extra detail can live in a footnote.[^1]

## Key takeaways

- The most important point
- The second most important point
- One thing to try today

## What's next?

End with a single, clear call to action — reply, subscribe, try it, or read the next post: [link text](https://example.com).

[^1]: Add the source or a longer explanation here.
`; }
    },
    {
      id: 'email', name: 'Email', desc: 'Subject, greeting, clear ask and sign-off', icon: 'mail', file: 'email.md',
      text: function () { return String.raw`**Subject:** A short, specific subject — say what you need and by when

Hi Name,

I hope you're well. I'm writing to ____ (one sentence: the purpose of this email).

**Some context**
Two or three lines of background so they don't have to look anything up.

**What I need from you**

- A decision on ____ by **${iso(3)}**
- Feedback on the attached ____
- A quick reply if the timing doesn't work

**Key details**

| Item | Detail |
| :--- | :----- |
| Date | ${today()} |
| Where | Location or link |
| Owner | Name |

Please let me know if you have any questions — happy to jump on a quick call.

Thank you,
Your Name
Your title · Company
you@example.com · +00 000 000 000
`; }
    },
    {
      id: 'tables', name: 'Tables', desc: 'Comparison, schedule, budget and status tables', icon: 'table', file: 'tables.md',
      text: function () { return String.raw`# Tables

Copy the layout you need, then edit the cells. Colons in the divider row set alignment: ` + '`:---`' + String.raw` left, ` + '`:---:`' + String.raw` center, ` + '`---:`' + String.raw` right.

## Comparison

| Feature        | Basic | Pro  | Team |
| :------------- | :---: | :--: | :--: |
| Documents      | 5     | 50   | ∞    |
| Export to PDF  | ✅    | ✅   | ✅   |
| Shared folders | —     | ✅   | ✅   |
| Support        | Email | Chat | 24/7 |

## Weekly schedule

| Time  | Mon      | Tue      | Wed      | Thu      | Fri      |
| :---- | :------- | :------- | :------- | :------- | :------- |
| 09:00 | Stand-up | Stand-up | Stand-up | Stand-up | Stand-up |
| 10:00 | Focus    | Review   | Focus    | Planning | Focus    |
| 14:00 | 1:1      | Focus    | Demo     | Focus    | Retro    |

## Budget

| Item        | Qty | Unit price | Total     |
| :---------- | --: | ---------: | --------: |
| Design      |   1 |    1,200.00 |  1,200.00 |
| Development |   3 |      950.00 |  2,850.00 |
| Hosting     |  12 |       25.00 |    300.00 |
| **Total**   |     |             | **4,350.00** |

## Project status

| Task            | Owner | Due        | Status        |
| :-------------- | :---- | :--------- | :------------ |
| Write brief     | Ana   | ${iso(2)}  | ✅ Done       |
| First draft     | Ben   | ${iso(6)}  | 🟡 In progress |
| Review          | Cara  | ${iso(9)}  | ⚪ Not started |
| Launch          | Dev   | ${iso(14)} | ⚪ Not started |

> [!TIP]
> Need a bigger table? Use the **Table** button in the toolbar for a fresh 3 × 3 grid.
`; }
    },
    {
      id: 'todo', name: 'To-do list', desc: 'Today, this week, later — with checkboxes', icon: 'task', file: 'todo.md',
      text: function () { return String.raw`# To-do — ${today()}

## 🎯 Top 3 today

- [ ] The one thing that matters most
- [ ] Second priority
- [ ] Third priority

## Today

- [ ] Reply to emails
- [ ] Prepare for the meeting
- [ ] 30 minutes of exercise
- [x] Plan the day

## This week

- [ ] Finish the report
  - [ ] Draft
  - [ ] Review
  - [ ] Send
- [ ] Book the appointment
- [ ] Call back Name

## Later / someday

- [ ] Learn something new
- [ ] Tidy the files
- [ ] Plan the trip

## Waiting on

| Who  | What          | Asked on |
| :--- | :------------ | :------- |
| Name | Approval      | ${iso(-1)} |

## Done ✔

- [x] Example of a finished task
`; }
    },
    {
      id: 'notes', name: 'Notes', desc: 'Topic, key points, questions and summary', icon: 'file', file: 'notes.md',
      text: function () { return String.raw`# Notes — Topic

**Date:** ${today()} · **Source:** lecture / book / call · **Tags:** #idea #study

## Key points

- Main idea, in your own words
- Supporting detail or example
  - A sub-point
  - Another sub-point
- Something surprising

## Details

Write freely here. Use **bold** for terms, *italics* for emphasis, and ` + '`code`' + String.raw` for anything technical.

> "A quote worth remembering." — Author

## Questions

- [ ] What is still unclear?
- [ ] What should I look up next?
- [ ] Who could I ask?

## Links & references

- [Useful article](https://example.com)
- Book or paper — author, year

## Summary

Write two or three sentences that you could explain to someone else without looking at these notes.
`; }
    }
  ];
})();
