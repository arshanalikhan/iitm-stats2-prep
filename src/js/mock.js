/* ---------- Mock quizzes ---------- */
const PAPERS = [{ id: "P", name: "Predicted paper", note: "Built from the past-paper pattern analysis: the most likely patterns, weighted to the usual week split, with fresh numbers" }].concat(MOCKS.map(m => ({ id: m.id, name: m.name, note: m.note })), [{ id: "R", name: "Random paper", note: "14 fresh drill questions, new numbers every time" }]);
const MODES = { learn: "Practice mode", exam: "Exam mode" };
const EXAM_KEY = KEY + "-exam", BEST_KEY = KEY + "-best";
let exam = loadJSON(EXAM_KEY, null);
let best = loadJSON(BEST_KEY, {});
let reviewAll = false, mockDur = loadJSON(KEY + "-dur", 60);
function buildRandomItems() {
  const r = rng(newSeed());
  const picks = shuf(DRILLS, r).slice(0, 14);
  const items = picks.map((d, i) => { const q = drillToQ(d, d.gen(rng(newSeed()))); q.m = i < 12 ? 3 : 2; return q; });
  return items.sort((a, b) => a.w - b.w);
}
function examItems(ex) { return ex.items || (MOCKS.find(m => m.id === ex.id) || MOCKS[0]).items; }
function fmt(sec) { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0"); }
function remaining() { return exam && exam.dur ? exam.dur - (Date.now() - exam.start) / 1000 : Infinity; }
function paperName(id) { const p = PAPERS.find(p => p.id === id); return p ? p.name : id; }
function itemSt(pos) { return exam.st[pos] || (exam.st[pos] = { sel: [], val: "", done: false }); }
function itemRight(pos) { const st = exam.st[pos]; if (!st || st.rev) return false; const q = examItems(exam)[pos]; return q.t === "num" ? numOk(q.n, parseAns(st.val)) : (st.sel || []).length > 0 && same(st.sel, q.a); }
function answered(pos) { const st = exam.st[pos]; if (!st) return false; return examItems(exam)[pos].t === "num" ? isFinite(parseAns(st.val)) : (st.sel || []).length > 0; }
function score(ex) {
  const items = examItems(ex); let got = 0, total = 0, right = 0; const byWeek = {};
  items.forEach((q, pos) => { const ok = itemRight(pos); total += q.m; if (ok) { got += q.m; right++; } byWeek[q.w] = byWeek[q.w] || [0, 0]; byWeek[q.w][1] += q.m; if (ok) byWeek[q.w][0] += q.m; });
  return { got, total, right, n: items.length, pct: Math.round(got * 100 / total), byWeek };
}
function startExam(id, mode) {
  exam = { id, mode, st: {}, flag: {}, cur: 0, start: Date.now(), dur: mockDur ? mockDur * 60 : 0, done: false };
  if (id === "R") exam.items = buildRandomItems();
  if (id === "P") exam.items = buildPredictedItems();
  saveJSON(EXAM_KEY, exam); renderMock(); focusQuestion();
}
function submitExam() {
  if (!exam || exam.done) return;
  exam.done = true; exam.end = Date.now();
  const s = score(exam), k = exam.id + "|" + exam.mode;
  if (!best[k] || s.got > best[k].got) { best[k] = { got: s.got, total: s.total, at: exam.end }; saveJSON(BEST_KEY, best); }
  saveJSON(EXAM_KEY, exam); reviewAll = false; renderMock(); window.scrollTo({ top: 0, behavior: "instant" });
  if (s.pct >= 70 && window.confetti && !REDUCE) setTimeout(() => window.confetti({ particleCount: 140, spread: 80, startVelocity: 42, origin: { y: 0.3 } }), 250);
}
function persist() { saveJSON(EXAM_KEY, exam); renderMock(); }
function focusQuestion() {
  const go = () => {
    const c = document.querySelector("#mockArea .q"); if (!c) return;
    const bar = document.querySelector(".exambar");
    const off = (document.querySelector(".topbar") || { offsetHeight: 0 }).offsetHeight + (bar ? bar.offsetHeight : 0) + 12;
    const top = c.getBoundingClientRect().top;
    if (top < off || top > window.innerHeight * 0.5) window.scrollTo({ top: Math.max(0, window.scrollY + top - off), behavior: "instant" });
  };
  go(); requestAnimationFrame(go);
}
function renderMock() {
  const root = document.getElementById("mockArea"); if (!root) return;
  root.innerHTML = "";
  if (!exam) root.appendChild(renderPapers());
  else if (!exam.done) root.appendChild(renderExam());
  else root.appendChild(renderResult());
}
function renderPapers() {
  const wrap = el("div", "result");
  const dp = el("div", "durpick"); dp.appendChild(el("span", null, "Timer:"));
  [[45, "45 min"], [60, "60 min"], [90, "90 min"], [0, "No timer"]].forEach(([v, l]) => {
    const b = el("button", "chip", l); b.type = "button"; b.setAttribute("aria-pressed", String(mockDur === v));
    b.addEventListener("click", () => { mockDur = v; saveJSON(KEY + "-dur", v); renderMock(); });
    dp.appendChild(b);
  });
  const papers = el("div", "papers");
  PAPERS.forEach(p => {
    const c = el("div", "paper");
    const items = MOCKS.find(m => m.id === p.id); const n = items ? items.items.length : p.id === "P" ? patBlueprint().length : 14;
    c.append(el("p", "eyebrow", p.name), el("h3", null, p.id === "R" ? "Fresh paper from the drills" : p.id === "P" ? "What Quiz 1 will most likely ask" : "Fixed paper " + p.id), el("p", "src", p.note), el("p", "meta", n + " items · 40 marks"));
    ["learn", "exam"].forEach(m => {
      const b = best[p.id + "|" + m], bl = el("p", "best");
      bl.append(document.createTextNode(MODES[m] + ": "));
      if (b) bl.append(el("b", null, "best " + b.got + "/" + b.total)); else bl.append(document.createTextNode("not attempted"));
      c.appendChild(bl);
    });
    const row = el("div", "startrow");
    const l = el("button", "btn primary", "Practice mode"); l.type = "button"; l.addEventListener("click", () => startExam(p.id, "learn"));
    const x = el("button", "btn", "Exam mode"); x.type = "button"; x.addEventListener("click", () => startExam(p.id, "exam"));
    row.append(l, x); c.appendChild(row); papers.appendChild(c);
  });
  wrap.append(dp, papers);
  wrap.appendChild(html("p", "callout", "<b>Also do Seek's own mock.</b> If you took the course in the Jun 2026 term, its Seek page has \"Mock For Quiz 1\" (graded instantly, with answers after you submit). This term's page usually gets one closer to the quiz."));
  return wrap;
}
function renderExam() {
  const learn = exam.mode === "learn", items = examItems(exam), N = items.length;
  const box = el("div", "result");
  const bar = el("div", "exambar");
  const timer = el("span", "timer"); timer.id = "timer"; timer.textContent = exam.dur ? fmt(remaining()) : "No timer";
  const prog = el("span", "who", learn ? Object.keys(exam.st).filter(k => exam.st[k].done).length + "/" + N + " checked" : items.filter((_, i) => answered(i)).length + "/" + N + " answered");
  const sub = el("button", "btn primary", "Finish & see score"); sub.type = "button";
  armButton(sub, "Finish & see score", "Tap again to finish", submitExam);
  bar.append(el("span", "who name", paperName(exam.id) + " · " + MODES[exam.mode]), timer, prog, sub);
  const grid = el("div", "exam-grid");
  const pos = exam.cur, q = items[pos], st = itemSt(pos);
  const locked = learn && st.done;
  const card = questionCard(q, st, {
    show: locked,
    meta: ["Question " + (pos + 1) + " of " + N, ["mk", q.m + (q.m === 1 ? " mark" : " marks")], "Week " + q.w].concat(q.pat ? [["pq", q.pat]] : []).concat(exam.flag[pos] ? [["k", "Marked for review"]] : []),
    checkLabel: learn ? "Check" : "Save",
    onPick(k) {
      if (q.t === "mcq") { st.sel = st.sel.includes(k) && !learn ? [] : [k]; if (learn) { st.done = true; st.ok = itemRight(pos); } }
      else st.sel = st.sel.includes(k) ? st.sel.filter(x => x !== k) : st.sel.concat(k);
      persist();
    },
    onVal(v) { st.val = v; saveJSON(EXAM_KEY, exam); },
    onCheck() { if (learn) { st.done = true; st.ok = itemRight(pos); } persist(); }
  });
  if (learn && !locked) {
    const foot = card.querySelector(".q-foot") || card.appendChild(el("div", "q-foot"));
    const rv = el("button", "btn", "Reveal answer"); rv.type = "button";
    rv.addEventListener("click", () => { st.done = true; st.rev = true; st.ok = false; persist(); });
    foot.appendChild(rv);
  }
  if (!learn && q.t === "num") { const hint = el("p", "hintfmt", "Your typed answer is kept automatically; you can change it until you finish."); card.appendChild(hint); }
  const nav = el("div", "navbtns"), left = el("div"), rgt = el("div");
  const prev = el("button", "btn", "← Previous"); prev.type = "button"; prev.disabled = pos === 0;
  prev.addEventListener("click", () => { exam.cur--; persist(); focusQuestion(); });
  const flag = el("button", "btn", exam.flag[pos] ? "Unmark" : "Mark for review"); flag.type = "button";
  flag.addEventListener("click", () => { exam.flag[pos] = !exam.flag[pos]; persist(); });
  left.append(prev, flag);
  if (!locked) { const clr = el("button", "btn", "Clear"); clr.type = "button"; clr.addEventListener("click", () => { exam.st[pos] = { sel: [], val: "", done: false }; persist(); }); left.appendChild(clr); }
  const next = el("button", "btn primary", "Next →"); next.type = "button"; next.disabled = pos === N - 1;
  next.addEventListener("click", () => { exam.cur++; persist(); focusQuestion(); });
  rgt.append(next); nav.append(left, rgt); card.appendChild(nav);
  const side = el("div", "side");
  side.appendChild(el("p", "eyebrow", "Questions"));
  const pal = el("div", "palette");
  items.forEach((_, i) => {
    const b = el("button", "pal", String(i + 1)); b.type = "button";
    const s = exam.st[i];
    if (learn && s && s.done) b.classList.add(s.rev ? "rev" : itemRight(i) ? "ok" : "no");
    else if (answered(i)) b.classList.add("ans");
    if (exam.flag[i]) b.classList.add("flag");
    if (i === pos) { b.classList.add("cur"); b.setAttribute("aria-current", "true"); }
    b.addEventListener("click", () => { exam.cur = i; persist(); focusQuestion(); });
    pal.appendChild(b);
  });
  const lg = el("p", "legend");
  (learn ? ["Teal = right", "Red = wrong", "Gold = revealed", "Solid green = answered", "Outline = current"] : ["Solid green = answered", "Gold underline = marked", "Outline = current"]).forEach(t => lg.appendChild(el("span", null, t)));
  const quit = el("button", "btn", "Quit paper"); quit.type = "button";
  armButton(quit, "Quit paper", "Tap again to discard", () => { exam = null; saveJSON(EXAM_KEY, null); renderMock(); });
  side.append(pal, lg, quit);
  grid.append(card, side); box.append(bar, grid);
  return box;
}
function renderResult() {
  const s = score(exam), items = examItems(exam);
  const box = el("div", "result");
  box.appendChild(el("p", "eyebrow", paperName(exam.id) + " · " + MODES[exam.mode] + " · finished"));
  const tiles = el("div", "tiles");
  const t = (v, l) => { const d = el("div", "tile"); d.append(el("span", "l", l), el("span", "v", v)); return d; };
  const used = ((exam.end || Date.now()) - exam.start) / 1000;
  tiles.append(t(s.got + "/" + s.total, "Marks"), t(s.pct + "%", "Score"), t(s.right + "/" + s.n, "Items right"), t(fmt(exam.dur ? Math.min(exam.dur, used) : used), "Time used"));
  const verdict = el("p");
  verdict.append(el("span", "pill " + (s.pct >= 60 ? "ok" : "no"), s.pct >= 80 ? "Quiz-ready" : s.pct >= 60 ? "Good" : "Keep practising"),
    document.createTextNode(s.pct >= 60 ? "  Review the misses below, then try another paper." : "  Redo the weeks with the lowest score below, then retake."));
  const wk = el("div", "tbl"), tb = document.createElement("table");
  tb.innerHTML = "<thead><tr><th>Week</th><th>Marks</th><th>Share</th></tr></thead>";
  const body = document.createElement("tbody");
  Object.keys(s.byWeek).map(Number).sort((a, b) => a - b).forEach(w => {
    const [g, n] = s.byWeek[w], tr = document.createElement("tr");
    ["Week " + w, g + "/" + n, Math.round(g / n * 100) + "%"].forEach(v => tr.appendChild(el("td", null, v)));
    body.appendChild(tr);
  });
  tb.appendChild(body); wk.appendChild(tb);
  const acts = el("div", "navbtns"), a1 = el("div");
  const again = el("button", "btn primary", exam.id === "R" || exam.id === "P" ? "New paper, fresh numbers" : "Retake this paper"); again.type = "button";
  again.addEventListener("click", () => startExam(exam.id, exam.mode));
  const back = el("button", "btn", "Back to papers"); back.type = "button";
  back.addEventListener("click", () => { exam = null; saveJSON(EXAM_KEY, null); renderMock(); });
  const tog = el("button", "btn", reviewAll ? "Show only mistakes" : "Show all questions"); tog.type = "button";
  tog.addEventListener("click", () => { reviewAll = !reviewAll; renderMock(); });
  a1.append(again, back); acts.append(a1, tog);
  const list = el("div", "qlist");
  items.forEach((q, pos) => {
    const ok = itemRight(pos); if (ok && !reviewAll) return;
    const st = Object.assign({ sel: [], val: "" }, exam.st[pos] || {}); st.done = true; st.ok = ok;
    list.appendChild(questionCard(q, st, { show: true, meta: ["Q" + (pos + 1), ["mk", q.m + (q.m === 1 ? " mark" : " marks")], "Week " + q.w, answered(pos) ? (ok ? "" : "") : ["k", "Not answered"]].filter(Boolean) }));
  });
  if (!list.childNodes.length) list.appendChild(el("p", "callout", "No mistakes on this paper."));
  box.append(tiles, verdict, wk, acts, list);
  return box;
}
setInterval(() => {
  if (!exam || exam.done || !exam.dur) return;
  const r = remaining(), tEl = document.getElementById("timer");
  if (tEl) { tEl.textContent = fmt(r); tEl.classList.toggle("low", r < 300); }
  if (r <= 0) submitExam();
}, 1000);
