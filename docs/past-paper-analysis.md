# Past-paper analysis

The "Past quiz patterns" page is built from every Stats 2 Quiz 1 paper since June 2022. This note explains the method so the numbers can be checked or extended.

## Data

- **13 sittings**, June 2022 to July 2026: 82 paper sets collected on [quizpractice.space](https://quizpractice.space/), cross-checked against the answer-keyed Feb 2026 and Jun 2026 papers that IIT Madras publishes on Seek.
- Sets within a sitting are mostly the same Stats 2 paper. Questions were de-duplicated first by content hash, then by an image fingerprint of each question and its comprehension setup. That left **233 distinct questions** (Oct 2022 had two different papers).
- The papers themselves are not in this repository; only counts and my own descriptions are published.

## Tagging

Each distinct question was read and tagged with one pattern code. Fill-in-the-blank sets are counted under the topic they test.

| Week | Codes |
|---|---|
| 1 | J1 probability from a joint table · J2 joint PMF given by a formula · J3 counting experiment · J4 conditional distribution · J5 chain rule · J6 random number of trials |
| 2 | I1 independence · F1 function of one variable · F2 function of two variables · F3 sum of named variables · F4 conditioning on a sum · M1 max, min, i.i.d. samples |
| 3 | E1 expectation from a PMF · E2 linearity and indicators · V1 variance · C1 covariance from a table · C2 covariance algebra · B1 Markov · B2 Chebyshev |
| 4 | D1 discrete CDF · P1 normalising a PDF · P2 probability from a PDF/CDF · P3 uniform, exponential, normal · P5 mean/variance of a continuous variable |
| 0 | W0 Week 0 distributions |

The catalogue (names, descriptions, traps and the drill each pattern links to) is `CAT` in `tools/analysis/qp_stats.py`, which writes `src/data/patterns-data.js`.

## Measures

- **Marks scaled to 40.** Each sitting's marks are scaled to a 40-mark paper so the two-paper Oct 2022 sitting does not count double.
- **Chance.** A recency-weighted frequency: the sitting `k` papers ago has weight 0.85^k, and the estimate is (weighted appearances + 0.5) / (total weight + 1). It is a guide to emphasis, not a forecast.
- **Blueprint.** For each week, take patterns in order of chance (only those above 30%) until the week's usual marks are reached: Week 1 9, Week 2 10, Week 3 11, Week 4 8. Marks per item follow the pattern's average and are nudged so the paper totals 40.
- **Predicted paper.** One fresh drill problem per blueprint row, with the row's marks.

## Findings (Oct 2026)

- Six patterns appear in 11–12 of 13 papers: P1, E1, M1, P2, V1, B2.
- Week 3 carries 9–14 marks in every paper; Week 4 averages about 8.
- No question was repeated verbatim across sittings, but setups recur with new numbers.
- Every paper since Oct 2025 has a fill-in-the-blanks solution set worth about 3 marks.
- Seek's "Mock For Quiz 1" (Jun 2026 course page) is the Oct 2023 paper.

## Adding a sitting

Collect the new paper, tag each distinct question with a code from the table, re-run `tools/analysis/qp_stats.py`, rebuild and push. The page, chances and blueprint update automatically.
