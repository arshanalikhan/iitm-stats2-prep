// Generated from src/ by tools/build_site.py. Edit the source, not this file.
/* ---------- Shared helpers ---------- */
const KEY = "s2prep-v1";
const LET = "ABCDEFGH";
const QUIZ_DATE = Date.UTC(2026, 10, 15); // Sun 15 Nov 2026
const REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
function loadJSON(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
function saveJSON(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function html(tag, cls, h) { const e = el(tag, cls); e.innerHTML = h; return e; }
function istToday() { return new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10); }
function daysToQuiz() { const ist = new Date(Date.now() + 5.5 * 3600e3); return Math.round((QUIZ_DATE - Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate())) / 86400000); }
function same(a, b) { return a.slice().sort().join() === b.slice().sort().join(); }
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
function qid(q) { return "q" + hashStr(q.w + "|" + (q.c || "") + "|" + q.q); }
function armButton(btn, label, armedLabel, action) {
  let t = null;
  btn.addEventListener("click", () => {
    if (!t) { btn.textContent = armedLabel; t = setTimeout(() => { t = null; btn.textContent = label; }, 3000); return; }
    clearTimeout(t); t = null; btn.textContent = label; action();
  });
}
function rng(seed) {
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuf(arr, r) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function newSeed() { return (Date.now() ^ Math.floor(Math.random() * 1e9)) & 0x7fffffff; }

/* ---------- Maths typesetting (KaTeX loads with defer; queue until it is ready) ---------- */
const KOPTS = { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }, { left: "$", right: "$", display: false }], throwOnError: false, ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "input"] };
let mathQueue = [];
function typeset(node) {
  if (!node) return;
  if (window.renderMathInElement) { try { window.renderMathInElement(node, KOPTS); } catch (e) {} }
  else mathQueue.push(node);
}
const typesetDone = new Set();
function typesetPage(id) { if (typesetDone.has(id)) return; const s = document.getElementById(id); if (!s) return; if (window.renderMathInElement) { typesetDone.add(id); typeset(s); } }
window.s2MathReady = function () {
  const q = mathQueue; mathQueue = [];
  q.forEach(n => { if (n.isConnected) typeset(n); });
  if (currentPage) typesetPage(currentPage);
};

/* ---------- Numeric answers ---------- */
function parseAns(s) {
  s = String(s || "").trim().replace(/[−–]/g, "-").replace(/\s+/g, "").replace(/,/g, "");
  if (!s) return NaN;
  const m = s.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/);
  if (m) return Number(m[1]) / Number(m[2]);
  if (!/^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(s)) return NaN;
  return Number(s);
}
function numOk(n, v) { return isFinite(v) && Math.abs(v - n[0]) <= n[1] + 1e-9; }
function numText(n) { const v = n[0], t = n[1]; const r = x => +x.toFixed(6); return t >= 0.01 && Number.isInteger(r(v)) ? String(r(v)) : r(v) + " (accepted " + r(v - t) + " to " + r(v + t) + ")"; }
function dpTol(dp) { return [0.01, 0.051, 0.0051, 0.00051, 0.000051][dp]; }
function drillToQ(d, gen) { return { w: gen.w, t: "num", q: gen.q, n: [gen.v, dpTol(gen.dp)], e: "<ol class=\"steps\">" + gen.steps.map(s => "<li>" + s + "</li>").join("") + "</ol>", drill: d.id }; }

/* ---------- Question card (practice, patterns and mocks) ---------- */
// st: { sel: [], val: "", done, ok, rev }. h: { onPick(k), onCheck(), onVal(v), show, meta: [..], extra }
function questionCard(q, st, h) {
  const show = !!h.show;
  const card = el("article", "q");
  const meta = el("div", "q-meta");
  (h.meta || []).forEach(m => { if (typeof m === "string") meta.appendChild(el("span", null, m)); else meta.appendChild(el("span", m[0], m[1])); });
  meta.appendChild(el("span", null, q.t === "num" ? "Numeric answer" : q.t === "msq" ? "Select all that apply" : "One answer"));
  card.appendChild(meta);
  if (q.c) { const cm = html("div", "common", q.c); cm.prepend(el("b", "cl", "Common data")); card.appendChild(cm); }
  card.appendChild(html("div", "q-text", q.q));
  if (q.t === "num") {
    const row = el("div", "numrow");
    const inp = el("input"); inp.type = "text"; inp.inputMode = "decimal"; inp.autocomplete = "off"; inp.spellcheck = false;
    inp.setAttribute("aria-label", "Your answer"); inp.placeholder = "Your answer";
    inp.value = st.val || "";
    if (show) { inp.disabled = true; if (st.done && !st.rev) inp.classList.add(st.ok ? "ok" : "no"); }
    else {
      inp.addEventListener("input", () => { h.onVal && h.onVal(inp.value); if (chk) chk.disabled = !isFinite(parseAns(inp.value)); });
      inp.addEventListener("keydown", e => { if (e.key === "Enter" && isFinite(parseAns(inp.value)) && h.onCheck) { e.preventDefault(); h.onCheck(); } });
    }
    row.appendChild(inp);
    let chk = null;
    if (!show && h.onCheck) { chk = el("button", "btn primary", h.checkLabel || "Check"); chk.type = "button"; chk.disabled = !isFinite(parseAns(inp.value)); chk.addEventListener("click", () => h.onCheck()); row.appendChild(chk); }
    if (!show) row.appendChild(el("span", "hintfmt", "decimal or fraction, e.g. 0.375 or 3/8"));
    card.appendChild(row);
  } else {
    const box = el("div", "opts");
    q.o.forEach((o, k) => {
      const b = el("button", "opt"); b.type = "button";
      b.append(el("span", "key", LET[k]), html("span", null, o));
      const picked = (st.sel || []).includes(k);
      if (show) {
        b.disabled = true;
        if (q.a.includes(k)) b.classList.add("correct"); else if (picked) b.classList.add("wrong");
      } else {
        b.setAttribute("aria-pressed", String(picked));
        b.addEventListener("click", () => h.onPick && h.onPick(k));
      }
      box.appendChild(b);
    });
    card.appendChild(box);
  }
  const foot = el("div", "q-foot");
  if (!show && q.t === "msq" && h.onCheck) { const c = el("button", "btn primary", h.checkLabel || "Check"); c.type = "button"; c.disabled = !(st.sel || []).length; c.addEventListener("click", () => h.onCheck()); foot.appendChild(c); }
  if (h.extra) h.extra.forEach(x => foot.appendChild(x));
  if (st.done && h.verdict !== false) foot.appendChild(el("span", "verdict " + (st.rev ? "rev" : st.ok ? "ok" : "no"), st.rev ? "Revealed" : st.ok ? "Correct" : "Not quite"));
  if (foot.childNodes.length) card.appendChild(foot);
  if (show) {
    const why = el("div", "why");
    why.appendChild(el("b", null, q.t === "num" ? "Answer " + numText(q.n) : "Answer " + q.a.map(a => LET[a]).join(", ")));
    why.appendChild(html("div", null, q.e || ""));
    card.appendChild(why);
  }
  typeset(card);
  return card;
}
function isCorrect(q, st) {
  if (q.t === "num") return numOk(q.n, parseAns(st.val));
  return same(st.sel || [], q.a);
}

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
      store[id] = st; savePractice(); redrawPractice(i);
    },
    onVal(v) { st.val = v; store[id] = st; },
    onCheck() { st.done = true; st.ok = isCorrect(q, st); store[id] = st; savePractice(); redrawPractice(i); if (q.t === "num") buildChips(); }
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

/* ---------- Drills ---------- */
const DRILL_KEY = KEY + "-drills";
let dstate = loadJSON(DRILL_KEY, { cur: "jointcond", seeds: {}, stats: {}, val: {} });
function saveDrills() { saveJSON(DRILL_KEY, dstate); }
function drillStats(id) { return dstate.stats[id] || { tries: 0, right: 0, streak: 0, best: 0 }; }
function drillById(id) { return DRILLS.find(d => d.id === id) || DRILLS[0]; }
function drillGen(d) { if (!dstate.seeds[d.id]) { dstate.seeds[d.id] = newSeed(); saveDrills(); } return d.gen(rng(dstate.seeds[d.id])); }
function renderDrillGrid() {
  const g = document.getElementById("drillgrid"); if (!g) return;
  g.innerHTML = "";
  DRILLS.forEach(d => {
    const s = drillStats(d.id);
    const b = el("button", "drillpick"); b.type = "button"; b.setAttribute("aria-pressed", String(d.id === dstate.cur));
    b.append(el("span", "dw", "Week " + d.w + (s.best >= 3 ? " · ✓ 3 in a row" : s.tries ? " · " + s.right + "/" + s.tries + " right" : "")), el("b", null, d.name), el("small", null, d.desc));
    b.addEventListener("click", () => { dstate.cur = d.id; saveDrills(); renderDrillGrid(); renderDrill(true); });
    g.appendChild(b);
  });
}
function renderDrill(scroll) {
  const box = document.getElementById("drillbox"); if (!box) return;
  const d = drillById(dstate.cur), gen = drillGen(d), q = drillToQ(d, gen), s = drillStats(d.id);
  const st = (dstate.cur === d.id && dstate.res && dstate.res.id === d.id && dstate.res.seed === dstate.seeds[d.id]) ? dstate.res : { val: (dstate.val || {})[d.id] || "", done: false };
  box.innerHTML = "";
  const head = el("div", "sec-head");
  head.append(el("p", "eyebrow", "Week " + d.w + " drill"), el("h3", null, d.name));
  const streak = el("p", "streak"); streak.innerHTML = "Streak <b>" + s.streak + "</b> · best <b>" + s.best + "</b> · <b>" + s.right + "</b>/" + s.tries + " right";
  head.appendChild(streak);
  const nextBtn = el("button", "btn primary", st.done ? "Next problem →" : "Skip → new problem"); nextBtn.type = "button";
  nextBtn.addEventListener("click", () => { dstate.seeds[d.id] = newSeed(); dstate.res = null; (dstate.val || {})[d.id] = ""; saveDrills(); renderDrill(false); const inp = document.querySelector("#drillbox input"); if (inp) inp.focus({ preventScroll: true }); });
  const extra = [];
  if (!st.done) { const rv = el("button", "btn", "Show working"); rv.type = "button"; rv.addEventListener("click", () => { dstate.res = { id: d.id, seed: dstate.seeds[d.id], val: st.val, done: true, ok: false, rev: true }; const ss = drillStats(d.id); ss.streak = 0; dstate.stats[d.id] = ss; saveDrills(); renderDrill(false); renderDrillGrid(); }); extra.push(rv); }
  extra.push(nextBtn);
  const card = questionCard(q, st, {
    show: st.done, meta: ["Week " + d.w, ["mk", "Fresh numbers"]], extra,
    onVal(v) { dstate.val = dstate.val || {}; dstate.val[d.id] = v; st.val = v; saveDrills(); },
    onCheck() {
      const ok = isCorrect(q, st), ss = drillStats(d.id);
      ss.tries++; if (ok) { ss.right++; ss.streak++; ss.best = Math.max(ss.best, ss.streak); } else ss.streak = 0;
      dstate.stats[d.id] = ss; dstate.res = { id: d.id, seed: dstate.seeds[d.id], val: st.val, done: true, ok };
      saveDrills(); renderDrill(false); renderDrillGrid();
      if (ok && ss.streak === 3 && window.confetti && !REDUCE) window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.4 } });
    }
  });
  box.append(head, card);
  if (scroll) box.scrollIntoView({ block: "start", behavior: REDUCE ? "auto" : "smooth" });
}

/* ---------- Mock quizzes ---------- */
const PAPERS = MOCKS.map(m => ({ id: m.id, name: m.name, note: m.note })).concat([{ id: "R", name: "Random paper", note: "14 fresh drill questions, new numbers every time" }]);
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
    const items = p.id === "R" ? null : MOCKS.find(m => m.id === p.id).items;
    c.append(el("p", "eyebrow", p.name), el("h3", null, p.id === "R" ? "Fresh paper from the drills" : "Fixed paper " + p.id), el("p", "src", p.note), el("p", "meta", (items ? items.length + " items" : "14 items") + " · 40 marks"));
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
  wrap.appendChild(html("p", "callout", "<b>Also do Seek's own mock.</b> The Jun 2026 course page on Seek has \"Mock For Quiz 1\" (graded instantly, with answers after you submit). Your Sep 2026 page will likely get one closer to the quiz."));
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
    meta: ["Question " + (pos + 1) + " of " + N, ["mk", q.m + (q.m === 1 ? " mark" : " marks")], "Week " + q.w].concat(exam.flag[pos] ? [["k", "Marked for review"]] : []),
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
  (learn ? ["Green = right", "Red = wrong", "Amber = revealed", "Purple = answered", "Outline = current"] : ["Purple = answered", "Amber underline = marked", "Outline = current"]).forEach(t => lg.appendChild(el("span", null, t)));
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
  const again = el("button", "btn primary", exam.id === "R" ? "New random paper" : "Retake this paper"); again.type = "button";
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

/* ---------- Light / dark toggle ---------- */
(function themeToggle() {
  const btns = [...document.querySelectorAll(".themebtn")], root = document.documentElement;
  const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const current = () => { const t = root.getAttribute("data-theme"); if (t === "light" || t === "dark") return t; return mq && mq.matches ? "dark" : "light"; };
  function paint() { const dark = current() === "dark"; btns.forEach(b => { b.innerHTML = (dark ? SUN : MOON) + "<span>" + (dark ? "Light mode" : "Dark mode") + "</span>"; b.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode"); }); }
  btns.forEach(b => b.addEventListener("click", () => { const n = current() === "dark" ? "light" : "dark"; root.setAttribute("data-theme", n); try { localStorage.setItem("s2prep-theme", n); } catch (e) {} paint(); document.dispatchEvent(new Event("themechange")); }));
  if (mq && mq.addEventListener) mq.addEventListener("change", () => { paint(); document.dispatchEvent(new Event("themechange")); });
  paint();
})();

/* ---------- Phone helpers ---------- */
(function phoneHelpers() {
  const nav = document.querySelector(".topbar");
  const setNavH = () => document.documentElement.style.setProperty("--navh", nav.offsetHeight + "px");
  setNavH(); window.addEventListener("resize", setNavH);
  const up = document.getElementById("totop");
  const onScroll = () => up.classList.toggle("show", window.scrollY > 900 && !(exam && !exam.done && currentPage === "mock"));
  window.addEventListener("scroll", onScroll, { passive: true });
  up.addEventListener("click", () => window.scrollTo({ top: 0 }));
  onScroll();
})();

/* ---------- Worked examples: open all ---------- */
(function () {
  const b = document.getElementById("openAll"); if (!b) return;
  b.addEventListener("click", () => {
    const all = [...document.querySelectorAll("#worked details.wsol")], open = all.some(d => !d.open);
    all.forEach(d => { d.open = open; }); b.textContent = open ? "Close all workings" : "Open all workings";
  });
})();

/* ---------- Pages & routing ---------- */
const PAGE_ORDER = ["home", "notes", "formulas", "worked", "patterns", "practice", "drills", "mock", "traps", "resources"];
const PAGE_NAMES = { home: "Home", notes: "Week notes", formulas: "Formula sheet", worked: "Worked examples", patterns: "Past quiz patterns", practice: "Practice", drills: "Number drills", mock: "Mock quizzes", traps: "Last-minute traps", resources: "Resources" };
const ALIAS = { plan: ["home", "plan"] };
const MORE_PAGES = ["formulas", "worked", "patterns", "traps", "resources"];
const WEEKS_KEY = KEY + "-weeks", CURWEEK_KEY = KEY + "-curweek";
let reviewed = loadJSON(WEEKS_KEY, {});
let curWeek = loadJSON(CURWEEK_KEY, "w1");
const WEEK_IDS = [...document.querySelectorAll("#notes .week")].map(a => a.id);
if (!WEEK_IDS.includes(curWeek)) curWeek = "w1";
let currentPage = null;
function paintWeekNav() {
  document.querySelectorAll("#notes .weeknav a").forEach(a => {
    const id = a.getAttribute("href").slice(1), on = id === curWeek;
    a.classList.toggle("on", on); a.classList.toggle("done", !!reviewed[id]);
    if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
  });
}
function showWeek(id) {
  const changed = id !== curWeek;
  curWeek = id; saveJSON(CURWEEK_KEY, id);
  document.querySelectorAll("#notes .week").forEach(a => { const on = a.id === id; a.hidden = !on; if (on && changed) { a.classList.remove("enter"); void a.offsetWidth; a.classList.add("enter"); } });
  paintWeekNav();
}
function weekLabel(id) { return id === "w0" ? "W0 recap" : "Week " + id.slice(1); }
function buildWeekFooters() {
  WEEK_IDS.forEach((id, i) => {
    const body = document.querySelector("#" + id + " .body");
    if (!body || body.querySelector(".weekfoot")) return;
    const foot = el("div", "weekfoot");
    const rv = el("button", "btn reviewbtn"); rv.type = "button";
    const paint = () => { const on = !!reviewed[id]; rv.textContent = on ? "✓ Week reviewed" : "Mark week as reviewed"; rv.setAttribute("aria-pressed", String(on)); };
    rv.addEventListener("click", () => { reviewed[id] = !reviewed[id]; saveJSON(WEEKS_KEY, reviewed); paint(); paintWeekNav(); });
    paint();
    const nav = el("div", "wkpager");
    if (i > 0) { const p = el("a", "btn", "← " + weekLabel(WEEK_IDS[i - 1])); p.href = "#" + WEEK_IDS[i - 1]; nav.appendChild(p); }
    const pr = el("a", "btn", "Practise " + weekLabel(id)); pr.href = "#practice"; pr.addEventListener("click", () => { filter = id.slice(1); qpage = 0; savePractice(); buildChips(); renderPractice(); });
    nav.appendChild(pr);
    const nx = el("a", "btn primary", i < WEEK_IDS.length - 1 ? weekLabel(WEEK_IDS[i + 1]) + " →" : "Formula sheet →");
    nx.href = i < WEEK_IDS.length - 1 ? "#" + WEEK_IDS[i + 1] : "#formulas";
    nav.appendChild(nx);
    foot.append(rv, nav); body.appendChild(foot);
  });
}
function renderHome() {
  const box = document.getElementById("stats"); if (!box) return;
  const done = QIDS.filter(id => store[id] && store[id].done), ok = done.filter(id => store[id].ok).length;
  const dstats = Object.values(dstate.stats || {}), mastered = DRILLS.filter(d => drillStats(d.id).best >= 3).length, dright = dstats.reduce((a, s) => a + s.right, 0);
  const bestMock = Object.values(best).reduce((m, b) => Math.max(m, b && typeof b.got === "number" ? b.got : -1), -1);
  const wk = WEEK_IDS.filter(id => reviewed[id]).length, nextWeek = WEEK_IDS.find(id => !reviewed[id]);
  const cards = [
    { icon: "calendar-check", href: "#" + (nextWeek || curWeek), label: "Weeks reviewed", v: wk + "/" + WEEK_IDS.length, sub: nextWeek ? "next up: " + weekLabel(nextWeek) : "all done", pct: wk / WEEK_IDS.length },
    { icon: "list-checks", href: "#practice", label: "Practice", v: done.length + "/" + QS.length, sub: done.length ? Math.round(ok * 100 / done.length) + "% correct so far" : "not started yet", pct: done.length / QS.length },
    { icon: "dices", href: "#drills", label: "Drills mastered", v: mastered + "/" + DRILLS.length, sub: dright ? dright + " drill problems solved" : "3 in a row masters a drill", pct: mastered / DRILLS.length },
    { icon: "timer", href: "#mock", label: "Best mock", v: bestMock >= 0 ? bestMock + "/40" : "—", sub: bestMock >= 0 ? (bestMock >= 32 ? "quiz-ready" : "aim for 32/40") : "no paper finished yet", pct: Math.max(0, bestMock) / 40, good: bestMock >= 32 }
  ];
  box.innerHTML = "";
  const Cc = 2 * Math.PI * 26, fills = [];
  cards.forEach(c => {
    const a = el("a", "stat" + (c.good ? " good" : "")); a.href = c.href;
    const ring = el("span", "ring");
    ring.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle class="rt" cx="32" cy="32" r="26"/><circle class="rf" cx="32" cy="32" r="26" stroke-dasharray="' + Cc.toFixed(2) + '" stroke-dashoffset="' + Cc.toFixed(2) + '"/></svg><i data-lucide="' + c.icon + '"></i>';
    const tx = el("span", "sx"); tx.append(el("span", "l", c.label), el("span", "v", c.v), el("span", "s", c.sub));
    a.append(ring, tx); box.appendChild(a); fills.push([ring.querySelector(".rf"), Math.min(1, c.pct)]);
  });
  window.s2Icons && window.s2Icons();
  requestAnimationFrame(() => requestAnimationFrame(() => fills.forEach(([f, p]) => { f.style.strokeDashoffset = (Cc * (1 - p)).toFixed(2); })));
  const today = istToday(), dayCards = [...document.querySelectorAll("#home .days .day")];
  let cur = -1;
  dayCards.forEach((d, i) => {
    const on = today >= d.dataset.from && today <= d.dataset.to; if (on) cur = i;
    d.classList.toggle("today", on);
    const w = d.querySelector(".when"); let badge = w.querySelector(".todaybadge");
    if (on && !badge) w.appendChild(el("span", "todaybadge", "Now"));
    if (!on && badge) badge.remove();
  });
  const tf = document.getElementById("todayFocus");
  if (tf) { tf.hidden = cur < 0; if (cur >= 0) { tf.innerHTML = ""; tf.append(el("span", "tf-l", "This week"), el("span", "tf-v", dayCards[cur].querySelector("h3").textContent + " — see the plan")); } }
  const cta = document.getElementById("cta-notes");
  if (cta) { const target = nextWeek || curWeek; cta.href = "#" + target; cta.textContent = wk === 0 && curWeek === "w1" ? "Start week notes" : "Continue: " + weekLabel(target); }
  const kp = document.getElementById("kit-practice"); if (kp) kp.textContent = QS.length + " questions";
  const kd = document.getElementById("kit-drills"); if (kd) kd.textContent = DRILLS.length + " drills · endless problems";
  const kw = document.getElementById("kit-worked"); if (kw) kw.textContent = document.querySelectorAll("#worked .wx").length + " problems";
}
function updateCountdowns() {
  const days = daysToQuiz();
  const set = (nId, lId) => {
    const n = document.getElementById(nId), l = document.getElementById(lId); if (!n || !l) return;
    if (days > 1) { n.textContent = days; l.textContent = "days to Quiz 1"; }
    else if (days === 1) { n.textContent = "1"; l.textContent = "day to Quiz 1"; }
    else if (days === 0) { n.textContent = "0"; l.textContent = "Quiz 1 is today"; }
    else { n.textContent = "✓"; l.textContent = "Quiz 1 is done"; }
  };
  set("cdnum", "cdlabel"); set("sidecd", "sidecdl");
  const c = document.getElementById("countdown");
  if (c) c.textContent = days > 1 ? days + " days to go" : days === 1 ? "Tomorrow" : days === 0 ? "Today" : "Done";
}
function renderPager(page) {
  let nav = document.getElementById("pager");
  if (!nav) { nav = el("nav", "wrap pager"); nav.id = "pager"; nav.setAttribute("aria-label", "Next and previous page"); document.querySelector("main").appendChild(nav); }
  nav.innerHTML = "";
  const i = PAGE_ORDER.indexOf(page);
  if (i > 0) { const p = el("a", "pg prev"); p.href = "#" + PAGE_ORDER[i - 1]; p.append(el("span", "l", "Previous"), el("span", "n", "← " + PAGE_NAMES[PAGE_ORDER[i - 1]])); nav.appendChild(p); }
  if (i < PAGE_ORDER.length - 1) { const n = el("a", "pg next"); n.href = "#" + PAGE_ORDER[i + 1]; n.append(el("span", "l", "Next"), el("span", "n", PAGE_NAMES[PAGE_ORDER[i + 1]] + " →")); nav.appendChild(n); }
}
function hashNow() { try { return decodeURIComponent((location.hash || "").slice(1)); } catch (e) { return ""; } }
function isRoute(h) { return PAGE_ORDER.includes(h) || !!ALIAS[h] || /^w[0-4]$/.test(h) || /^d-[a-z]+$/.test(h); }
function go(h) { route(h); try { if (hashNow() !== h) history.pushState({ h }, "", "#" + h); } catch (e) {} }
document.addEventListener("click", e => {
  const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
  const h = a.getAttribute("href").slice(1); if (!isRoute(h)) return;
  e.preventDefault(); go(h);
});
function openSheet() { const s = document.getElementById("moreSheet"); s.hidden = false; document.getElementById("moreBtn").setAttribute("aria-expanded", "true"); }
function closeSheet() { const s = document.getElementById("moreSheet"); if (!s || s.hidden) return; s.hidden = true; document.getElementById("moreBtn").setAttribute("aria-expanded", "false"); }
document.getElementById("moreBtn").addEventListener("click", () => { document.getElementById("moreSheet").hidden ? openSheet() : closeSheet(); });
document.getElementById("moreSheet").addEventListener("click", e => { if (e.target.id === "moreSheet") closeSheet(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

// Home hero: dots fall into bins and build up a bell-shaped histogram (sums of random steps, like a Galton board).
const heroAnim = (function () {
  const cv = document.querySelector(".hero-net");
  if (!cv || !cv.getContext) return () => {};
  const ctx = cv.getContext("2d");
  let raf = 0, running = false, W = 0, H = 0, x0 = 0, x1 = 0, bins = [], dots = [], col = "#5a3fb0", muted = "#5c5873";
  const NB = 13, ROWS = 12;
  const readColor = () => { const cs = getComputedStyle(document.documentElement); col = cs.getPropertyValue("--accent").trim() || col; muted = cs.getPropertyValue("--muted").trim() || muted; };
  function layout() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const hm = document.querySelector(".hero-main");
    x0 = hm ? hm.getBoundingClientRect().right - r.left + 36 : W * 0.62; x1 = W - 24;
    bins = Array(NB).fill(0); dots = [];
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    if (W < 760 || x1 - x0 < 150) { if (running) raf = requestAnimationFrame(frame); return; }
    const bw = (x1 - x0) / NB, base = H - 18, top = 18, unit = Math.max(2.2, (base - top) * 0.62 / 40);
    ctx.strokeStyle = muted; ctx.globalAlpha = 0.35; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, base + 0.5); ctx.lineTo(x1, base + 0.5); ctx.stroke();
    // bell curve guide
    ctx.strokeStyle = col; ctx.globalAlpha = 0.5; ctx.lineWidth = 1.6; ctx.beginPath();
    const mu = NB / 2, sd = Math.sqrt(ROWS) / 2 * (NB / (ROWS + 1)) * 1.05, total = Math.max(40, bins.reduce((a, b) => a + b, 0));
    for (let i = 0; i <= 80; i++) { const x = i / 80 * NB, y = total * Math.exp(-((x - mu) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI)); const px = x0 + x * bw, py = base - Math.min(base - top, y * unit); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke();
    ctx.fillStyle = col; ctx.globalAlpha = 0.28;
    bins.forEach((c, i) => { const h = Math.min(base - top, c * unit); ctx.fillRect(x0 + i * bw + 2, base - h, bw - 4, h); });
    if (running && dots.length < 10 && Math.random() < 0.18) { let k = 0; for (let j = 0; j < ROWS; j++) if (Math.random() < 0.5) k++; const b = Math.round(k * (NB - 1) / ROWS); dots.push({ b, y: top - 6, v: 0.6 + Math.random() * 0.4 }); }
    ctx.globalAlpha = 0.9;
    dots = dots.filter(d => {
      d.v += 0.12; d.y += d.v;
      const land = base - Math.min(base - top, bins[d.b] * unit);
      if (d.y >= land) { bins[d.b]++; if (bins.reduce((a, b) => a + b, 0) > 260) bins = bins.map(c => Math.floor(c * 0.55)); return false; }
      ctx.beginPath(); ctx.arc(x0 + (d.b + 0.5) * bw, d.y, 3, 0, Math.PI * 2); ctx.fill(); return true;
    });
    ctx.globalAlpha = 1;
    if (running) raf = requestAnimationFrame(frame);
  }
  function seed() { for (let n = 0; n < 120; n++) { let k = 0; for (let j = 0; j < ROWS; j++) if (Math.random() < 0.5) k++; bins[Math.round(k * (NB - 1) / ROWS)]++; } }
  function start() { readColor(); layout(); seed(); if (REDUCE) { stop(); frame(); return; } if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }
  window.addEventListener("resize", () => { if (currentPage === "home") start(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else if (currentPage === "home") start(); });
  document.addEventListener("themechange", () => { readColor(); if (!running) frame(); });
  return on => (on ? start() : stop());
})();

function route(hIn) {
  const h = hIn == null ? hashNow() : hIn;
  let page = h || "home", target = null, week = null, drill = null;
  if (/^w[0-4]$/.test(h)) { page = "notes"; week = h; }
  else if (/^d-[a-z]+$/.test(h)) { page = "drills"; drill = h.slice(2); }
  else if (ALIAS[h]) [page, target] = ALIAS[h];
  if (!PAGE_ORDER.includes(page)) page = "home";
  const pageChanged = currentPage !== page;
  const useVT = pageChanged && currentPage !== null && !!document.startViewTransition && !REDUCE && document.visibilityState === "visible";
  let applied = false;
  const apply = () => {
    if (applied) return; applied = true;
    if (page === "notes") showWeek(week || curWeek);
    if (drill && DRILLS.some(d => d.id === drill)) { dstate.cur = drill; saveDrills(); }
    document.querySelectorAll("main > section.page").forEach(s => { const on = s.id === page; s.hidden = !on; if (on && pageChanged && !useVT) { s.classList.remove("enter"); void s.offsetWidth; s.classList.add("enter"); } });
    document.querySelectorAll("[data-page]").forEach(a => { const on = a.dataset.page === page; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    const mb = document.getElementById("moreBtn"); if (mb) mb.classList.toggle("on", MORE_PAGES.includes(page));
    const tt = document.getElementById("topTitle"); if (tt) tt.textContent = PAGE_NAMES[page];
    closeSheet(); renderPager(page);
    currentPage = page;
    typesetPage(page);
    if (page === "home") renderHome();
    if (page === "practice") renderPractice();
    if (page === "drills") { renderDrillGrid(); renderDrill(false); }
    if (page === "mock") renderMock();
    heroAnim(page === "home");
    document.title = (page === "home" ? "" : PAGE_NAMES[page] + " · ") + "Stats 2 Quiz 1 Prep";
    const t = target ? document.getElementById(target) : null;
    if (t) t.scrollIntoView(); else window.scrollTo({ top: 0, behavior: "instant" });
  };
  if (useVT) { try { const vt = document.startViewTransition(apply); [vt.ready, vt.finished, vt.updateCallbackDone].forEach(pr => pr && pr.catch(() => {})); setTimeout(() => { if (!applied) { try { vt.skipTransition(); } catch (e) {} apply(); } }, 400); } catch (e) { apply(); } }
  else apply();
}

buildWeekFooters();
buildChips();
updateCountdowns();
window.addEventListener("hashchange", () => route());
window.addEventListener("popstate", () => route());
route();
window.s2Icons && window.s2Icons();
