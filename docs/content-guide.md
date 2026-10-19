# Content guide

How to add or change study content. After any change run the checks and rebuild:

```bash
node tests/check_data.js && node tests/check_drills.js && python tools/build_site.py
```

## Ground rules

- **Original questions only.** Use course or past-paper questions as models, but change the numbers and the setting. Never paste their text.
- **Verify every number** before committing (a quick Python check is enough). The answer in `n` and the working in `e` must agree.
- Write maths in TeX between `$…$` (inline) or `\[…\]` (display). Use `\lt` and `\gt` instead of `<` and `>` inside HTML.

## Practice questions (`src/data/questions/weekN.js`)

Each week file calls `QS.push(...)` with question objects:

```js
{ w: 2, t: "num",
  q: R`$X\sim$ Poisson($2$) and $Y\sim$ Poisson($3$) are independent. Find $P(X+Y=2)$. Enter the answer correct to three decimal places.`,
  n: [0.0842, 0.0006],
  e: R`$X+Y\sim$ Poisson(5): $e^{-5}5^2/2!=0.0842$.` }
```

| Field | Meaning |
|---|---|
| `w` | week, 0–4 |
| `t` | `"num"`, `"mcq"` (one answer) or `"msq"` (select all) |
| `c` | optional shared setup shown above the question (comprehension sets reuse one constant) |
| `q` | question text (HTML allowed; `T("X \\ Y|0|1", "0|0.1|0.2")` builds a table) |
| `o`, `a` | options and the indexes of the correct ones (`mcq`/`msq`) |
| `n` | `[answer, tolerance]` (`num`) |
| `e` | explanation shown after answering |

`R` is `String.raw`, so backslashes need no escaping.

## Drills (`src/js/drills/weekN.js`)

Each drill is an object pushed onto `DRILLS`:

```js
{ id: "pdfk", w: 4, name: "Normalising constants", desc: "Find k so a PDF integrates to 1",
  gen(r) { /* r() returns a seeded random number in [0, 1) */
    return { w: 4, q: "…", v: answer, dp: 3, steps: ["…", "…"] };
  } }
```

`dp` is the number of decimals the question asks for (0 for an exact value); `steps` is the worked solution. Use the helpers in `drills/helpers.js` (`ri`, `pk`, `nf`, `fr`, `C`, `pois`, `parts`, `jtable`, `pmfTable`, `dpText`, `seq`). Add a new file to `SCRIPTS` in `tools/build_site.py` and to `tests/load.js`.

To link a past-paper pattern to a drill, set its `drill` id in `CAT` in `tools/analysis/qp_stats.py`.

## Mock papers (`src/data/mocks.js`)

Each paper has `id`, `name`, `note` and `items`. Items are question objects plus `m` (marks). Items sharing the same `c` form a comprehension set. A paper must total 40 marks (the data check enforces it).

## Graded assignments (`src/data/ga.js`)

One entry per week: `w`, `title`, `due` (ISO in IST, e.g. `2026-10-25T23:59:00+05:30`), `tentative` while the date is not on Seek yet, `topics`, and `items`.

- **Add a week's items only after its deadline has passed.** The repository is public, so answers in it are published. `tests/check_data.js` fails if a week has items before its `due` time, which blocks the deploy.
- Never copy the question text. Each item gives `q` (question number(s) on Seek), `mk` (marks), `p` (past-quiz pattern code, optional), `topic`, `idea`, `work` and `ans`. Quote the accepted range for numeric answers.
- `twin` is an optional original practice question in the practice-bank format (new numbers and settings), with a verified answer.

## Notes, formulas, worked examples

Edit the HTML in `src/pages/`. Each week of notes is an `<article class="week" id="wN">`; boxes use `defn`, `ex` and `warn` classes. Worked examples are `<article class="wx">` cards with a `<details class="wsol">` working.

## Styles

Files in `src/styles/` are numbered in cascade order; add new rules to the file for that area, or at the end of the last file if they must override earlier ones. Colours always come from the tokens in `01-tokens-and-base.css`, which define light and dark values.
