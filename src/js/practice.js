/* ---------- Practice ---------- */
let store = loadJSON(KEY, {});
let filter = loadJSON(KEY + "-f", "1");
let reveal = false, order = QS.map((_, i) => i), qpage = 0;
const QIDS = QS.map(qid);
const PER_PAGE = 10;
function savePractice() { saveJSON(KEY, store); saveJSON(KEY + "-f", filter); }
function inSet(i) {
  const q = QS[i], st = store[QIDS[i]];
  if (filter === "all") return true;
  if (filter === "num") return q.t === "num";
  if (filter === "todo") return !(st && st.done);
  if (filter === "wrong") return !!(st && st.done && !st.ok);
  return String(q.w) === filter;
}
function visible() { return order.filter(inSet); }
function buildChips() {
  const box = document.getElementById("chips"); if (!box) return;
  const defs = [["0", "W0 recap"], ["1", "Week 1"], ["2", "Week 2"], ["3", "Week 3"], ["4", "Week 4"], ["all", "All"], ["num", "Numeric only"], ["todo", "Not answered"], ["wrong", "Got wrong"]];
  box.innerHTML = "";
  defs.forEach(([id, label]) => {
    const n = QS.filter((_, i) => { const f = filter; filter = id; const r = inSet(i); filter = f; return r; }).length;
    const b = el("button", "chip"); b.type = "button"; b.setAttribute("aria-pressed", String(filter === id));
    b.innerHTML = label + " <small>" + n + "</small>";
    b.addEventListener("click", () => { filter = id; qpage = 0; savePractice(); buildChips(); renderPractice(); });
    box.appendChild(b);
  });
}
function practiceCard(i, n) {
  const q = QS[i], id = QIDS[i];
  const st = store[id] || { sel: [], val: "", done: false };
  const show = st.done || reveal;
  const card = questionCard(q, st, {
    show,
    meta: ["Q" + n, q.w === 0 ? "W0 recap" : "Week " + q.w],
    onPick(k) {
      if (q.t === "mcq") { st.sel = [k]; st.done = true; st.ok = k === q.a[0]; }
      else st.sel = st.sel.includes(k) ? st.sel.filter(x => x !== k) : st.sel.concat(k);
      store[id] = st; savePractice(); redrawPractice(i); if (st.done) buildChips();   // "Not answered" / "Got wrong" counts
    },
    onVal(v) { st.val = v; store[id] = st; },
    onCheck() { st.done = true; st.ok = isCorrect(q, st); store[id] = st; savePractice(); redrawPractice(i); buildChips(); }
  });
  card.id = "pq" + i; card.dataset.n = n;
  return card;
}
function redrawPractice(i) { const old = document.getElementById("pq" + i); if (old) old.replaceWith(practiceCard(i, Number(old.dataset.n))); updateScore(); }
function updateScore() {
  const ids = visible(); let done = 0, ok = 0;
  ids.forEach(i => { const s = store[QIDS[i]]; if (s && s.done) { done++; if (s.ok) ok++; } });
  const sc = document.getElementById("score"); if (!sc) return;
  sc.innerHTML = "<b>" + done + "</b>/" + ids.length + " answered · <b>" + ok + "</b> correct" + (done ? " (" + Math.round(ok * 100 / done) + "%)" : "");
}
function renderQPager(box, pages) {
  box.innerHTML = ""; if (pages <= 1) return;
  const mk = (label, to, cls) => { const b = el("button", "btn" + (cls ? " " + cls : ""), label); b.type = "button"; b.disabled = to < 0 || to >= pages; b.addEventListener("click", () => { qpage = to; renderPractice(); document.getElementById("qlist").scrollIntoView({ block: "start" }); }); return b; };
  const info = el("span", "score"); info.innerHTML = "Page <b>" + (qpage + 1) + "</b> of " + pages;
  box.append(mk("← Previous", qpage - 1), info, mk("Next →", qpage + 1, "primary"));
}
function renderPractice() {
  const list = document.getElementById("qlist"); if (!list) return;
  list.innerHTML = "";
  const ids = visible(), pages = Math.max(1, Math.ceil(ids.length / PER_PAGE));
  if (qpage >= pages) qpage = pages - 1;
  ids.slice(qpage * PER_PAGE, (qpage + 1) * PER_PAGE).forEach((i, n) => list.appendChild(practiceCard(i, qpage * PER_PAGE + n + 1)));
  if (!ids.length) list.appendChild(el("p", "callout", filter === "wrong" ? "No wrong answers in this browser. Nice." : "Nothing in this set."));
  renderQPager(document.getElementById("qpagerTop"), pages);
  renderQPager(document.getElementById("qpagerBot"), pages);
  updateScore();
}
document.getElementById("shuffle").addEventListener("click", e => {
  const b = e.currentTarget;
  order = QS.map((_, i) => i);
  if (b.dataset.on === "1") { b.dataset.on = "0"; b.textContent = "Shuffle"; }
  else { order = shuf(order, rng(newSeed())); b.dataset.on = "1"; b.textContent = "Original order"; }
  qpage = 0; renderPractice();
});
document.getElementById("reveal").addEventListener("click", e => {
  reveal = !reveal; e.currentTarget.setAttribute("aria-pressed", String(reveal));
  e.currentTarget.textContent = reveal ? "Hide answers" : "Show all answers"; renderPractice();
});
armButton(document.getElementById("reset"), "Reset this set", "Tap again to clear", () => { visible().forEach(i => delete store[QIDS[i]]); savePractice(); buildChips(); renderPractice(); });
