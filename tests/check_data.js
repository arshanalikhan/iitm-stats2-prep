// Validates the practice bank, the mock papers and the pattern statistics.
// Run: node tests/check_data.js
const load = require("./load");
const { QS, MOCKS, PAT } = load();
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

function checkQuestion(q, where) {
  if (![0, 1, 2, 3, 4].includes(q.w)) fail(where, `bad week ${q.w}`);
  if (!q.q || typeof q.q !== "string") fail(where, "missing question text");
  if (!q.e) fail(where, "missing explanation");
  if (/undefined|NaN/.test(q.q + (q.c || "") + q.e)) fail(where, "text contains undefined/NaN");
  if (q.t === "num") {
    if (!Array.isArray(q.n) || q.n.length !== 2 || !isFinite(q.n[0]) || !(q.n[1] > 0)) fail(where, "numeric answer must be [value, tolerance > 0]");
  } else if (q.t === "mcq" || q.t === "msq") {
    if (!Array.isArray(q.o) || q.o.length < 2) fail(where, "needs at least two options");
    if (!Array.isArray(q.a) || !q.a.length || q.a.some(k => k < 0 || k >= q.o.length)) fail(where, "answer index out of range");
    if (q.t === "mcq" && q.a.length !== 1) fail(where, "an MCQ has exactly one answer");
  } else fail(where, `unknown type ${q.t}`);
}

QS.forEach((q, i) => checkQuestion(q, `QS[${i}] (week ${q.w})`));
const seen = new Map();
QS.forEach((q, i) => { const key = q.w + "|" + (q.c || "") + "|" + q.q; if (seen.has(key)) fail(`QS[${i}]`, `duplicate of QS[${seen.get(key)}] (progress is keyed on content)`); seen.set(key, i); });

MOCKS.forEach(m => {
  m.items.forEach((q, i) => { checkQuestion(q, `Mock ${m.id} item ${i + 1}`); if (!(q.m > 0)) fail(`Mock ${m.id} item ${i + 1}`, "missing marks"); });
  const total = m.items.reduce((a, q) => a + q.m, 0);
  if (total !== 40) fail(`Mock ${m.id}`, `totals ${total} marks, expected 40`);
});

if (!PAT || !Array.isArray(PAT.sittings) || !PAT.patterns.length) fail("PAT", "pattern data missing");
else PAT.patterns.forEach(p => {
  Object.keys(p.m).forEach(d => { if (!PAT.sittings.includes(d)) fail(`PAT ${p.c}`, `unknown sitting ${d}`); });
  if (p.n !== Object.keys(p.m).length) fail(`PAT ${p.c}`, "count does not match sittings");
});

const byWeek = QS.reduce((a, q) => (a[q.w] = (a[q.w] || 0) + 1, a), {});
if (errors.length) { console.error(errors.join("\n")); console.error(`\n${errors.length} problem(s)`); process.exit(1); }
console.log(`OK: ${QS.length} practice questions ${JSON.stringify(byWeek)}, ${MOCKS.length} mocks of 40 marks, ${PAT.patterns.length} patterns over ${PAT.sittings.length} sittings`);
