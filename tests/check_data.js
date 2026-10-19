// Validates the practice bank, the mock papers, the pattern statistics and the graded-assignment notes.
// Run: node tests/check_data.js
const load = require("./load");
const { QS, MOCKS, PAT, GA } = load();
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

// Graded assignments: answers may only exist once the deadline has passed (the repo is public).
const now = Date.now();
GA.forEach(w => {
  const where = `GA week ${w.w}`;
  const due = Date.parse(w.due);
  if (!isFinite(due) || !/\+05:30$/.test(w.due)) fail(where, "due must be an ISO date in IST, e.g. 2026-10-25T23:59:00+05:30");
  if (w.items.length && now < due) fail(where, `has answers before its deadline (${w.due}); remove them until it passes`);
  if (w.items.length && w.tentative) fail(where, "has answers but its due date is still marked tentative");
  w.items.forEach((it, i) => {
    const at = `${where} item ${i + 1} (Q${it.q})`;
    ["q", "topic", "idea", "work", "ans"].forEach(k => { if (!it[k]) fail(at, `missing ${k}`); });
    if (!(it.mk >= 0)) fail(at, "missing marks");
    if (it.p && !PAT.patterns.some(p => p.c === it.p)) fail(at, `unknown pattern ${it.p}`);
    if (/undefined|NaN/.test(it.idea + it.work + it.ans)) fail(at, "text contains undefined/NaN");
    if (it.twin) { checkQuestion(it.twin, `${at} twin`); if (it.twin.w !== w.w) fail(at, "twin week does not match"); }
  });
});

const byWeek = QS.reduce((a, q) => (a[q.w] = (a[q.w] || 0) + 1, a), {});
if (errors.length) { console.error(errors.join("\n")); console.error(`\n${errors.length} problem(s)`); process.exit(1); }
console.log(`OK: ${QS.length} practice questions ${JSON.stringify(byWeek)}, ${MOCKS.length} mocks of 40 marks, ${PAT.patterns.length} patterns over ${PAT.sittings.length} sittings, GA notes for weeks [${GA.filter(w => w.items.length).map(w => w.w)}] with ${GA.reduce((a, w) => a + w.items.filter(i => i.twin).length, 0)} twins`);
