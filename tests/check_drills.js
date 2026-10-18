// Runs every drill generator many times and checks each problem is well formed.
// Run: node tests/check_drills.js [runs-per-drill]
const load = require("./load");
const { DRILLS, PAT } = load();
const RUNS = Number(process.argv[2]) || 2000;
let seed = 12345;
const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
let problems = 0;

const ids = new Set();
DRILLS.forEach(d => {
  if (ids.has(d.id)) { console.error(`duplicate drill id ${d.id}`); problems++; }
  ids.add(d.id);
  let bad = 0, first = "";
  for (let i = 0; i < RUNS; i++) {
    let g;
    try { g = d.gen(random); } catch (e) { bad++; first = first || e.message; continue; }
    const text = g.q + g.steps.join(" ");
    if (!isFinite(g.v)) { bad++; first = first || `answer ${g.v}`; }
    else if (![0, 1, 2, 3, 4].includes(g.dp)) { bad++; first = first || `dp ${g.dp}`; }
    else if (!g.steps.length) { bad++; first = first || "no working"; }
    else if (/undefined|NaN|Infinity/.test(text)) { bad++; first = first || text.slice(0, 120); }
  }
  console.log(`${bad ? "FAIL" : "ok  "} ${d.id.padEnd(12)} week ${d.w}  ${RUNS - bad}/${RUNS}${bad ? "  e.g. " + first : ""}`);
  problems += bad;
});
// every drill a pattern links to must exist
PAT.patterns.forEach(p => { if (!ids.has(p.drill)) { console.error(`pattern ${p.c} links to missing drill ${p.drill}`); problems++; } });
if (problems) { console.error(`\n${problems} problem(s)`); process.exit(1); }
console.log(`OK: ${DRILLS.length} drills x ${RUNS} runs`);
