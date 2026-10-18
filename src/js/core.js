/* Core: storage and DOM helpers, maths typesetting, numeric answers, the shared question card. Loaded first. */
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
