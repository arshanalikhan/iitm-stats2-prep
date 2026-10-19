# Architecture

The site is a single static page with no framework and no build dependencies. `tools/build_site.py` assembles it from `src/`.

## Build

| Output | Built from |
|---|---|
| `site/index.html` | `src/pages/*.html` in filename order, wrapped in the `<head>` defined in `build_site.py` |
| `site/assets/css/style.css` | `src/styles/*.css` concatenated in filename order (the numbers set the cascade order) |
| `site/assets/js/app.js` | the files in `SCRIPTS` (top of `build_site.py`), concatenated in that order |

Each asset URL gets a content hash (`?v=…`), so a new deploy never mixes with cached files. The build refuses to run if a `.js` file in `src/` is missing from `SCRIPTS` or listed but absent.

Third-party code is loaded from CDNs at runtime: KaTeX (maths), Lucide (icons), canvas-confetti, and Google Fonts.

## Script load order

All scripts are plain browser scripts that share globals, so order matters:

1. **Data**: `data/questions/helpers.js` defines `R` (String.raw), `T()` / `L()` table helpers and the empty `QS` array; each `week*.js` pushes its questions; `mocks.js` defines `MOCKS`; `patterns-data.js` defines `PAT`.
2. **`js/core.js`**: storage helpers (`loadJSON`, `saveJSON`), DOM helpers (`el`, `html`), seeded random numbers (`rng`), KaTeX typesetting with a queue (`typeset`, `typesetPage`), numeric answer parsing (`parseAns`, `numOk`), and `questionCard()`, which renders every question on the site.
3. **`js/drills/`**: `helpers.js` has maths and table helpers and the empty `DRILLS` array; each week file pushes generators.
4. **Page modules**: `practice.js`, `drills-ui.js`, `mock.js`, `patterns.js`, `notes.js`, `home.js`, `share.js`. They define render functions and wire their own buttons (`share.js` fills the share links and fetches the GitHub star count).
5. **`js/shell.js`** (last): theme toggle, phone helpers, the router (`route`, `go`) and the boot sequence.

KaTeX loads with `defer`, so it arrives after the app scripts; its `onload` calls `window.s2MathReady()`, which typesets anything that was queued.

## Routing

Pages are `<section class="page">` elements; the router shows one and hides the rest. Routes are URL hashes:

| Hash | Shows |
|---|---|
| `#home`, `#notes`, `#formulas`, `#worked`, `#patterns`, `#practice`, `#drills`, `#mock`, `#traps`, `#resources` | that page |
| `#w0` … `#w4` | the notes page at that week |
| `#d-<drillId>` | the drills page with that drill selected |
| `#plan`, `#about` | the home page, scrolled to the study plan or the About section |

Navigation never depends on the hash actually changing (some embedded viewers ignore it); `go()` routes first and then updates the URL when it can.

## State

Everything is kept in `localStorage` in the visitor's browser:

| Key | Holds |
|---|---|
| `s2prep-v1` | practice answers, keyed by a hash of each question's content |
| `s2prep-v1-f` | the selected practice filter |
| `s2prep-v1-drills` | current drill, seeds and per-drill stats |
| `s2prep-v1-exam`, `-best`, `-dur` | the mock in progress, best scores, chosen timer |
| `s2prep-v1-weeks`, `-curweek` | reviewed weeks and the open week |
| `s2prep-theme` | light or dark override |

Because practice progress is keyed on question content, editing a question's text resets its saved answer, and two identical questions would share one (the data check rejects duplicates).

## Answers and tolerance

Numeric questions store `n: [value, tolerance]`. Two-decimal answers use 0.006 and three-decimal answers 0.0006, so any correctly rounded entry is accepted. Drills declare the decimals they ask for (`dp`) and the tolerance follows from it (`dpTol` in `core.js`). Entries may be decimals or fractions such as `3/8`.
