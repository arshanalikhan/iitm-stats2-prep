/* ---------- Graded assignments: deadline status, answers and method notes after each deadline, practice twins ---------- */
let gaStore = loadJSON(KEY + "-ga", {});
const GA_OPEN = new Set();   // notes the reader has opened, kept across re-renders
const IST_DAY = { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" };

function gaDue(w) { return new Date(w.due); }
function gaDueText(w) { return gaDue(w).toLocaleDateString("en-IN", IST_DAY) + ", 23:59 IST"; }
function gaState(w) {
  const left = gaDue(w) - Date.now();
  if (left > 0) return { k: "open", days: Math.ceil(left / 864e5) };
  return { k: w.items.length ? "solved" : "closed" };
}
function gaMetaText(w) {
  const twins = w.items.filter(it => it.twin), st = it => gaStore[w.w + "-" + it.q] || {};
  const done = twins.filter(it => st(it).done).length, ok = twins.filter(it => st(it).ok).length;
  return w.items.reduce((a, it) => a + it.mk, 0) + " marks · " + w.items.length + " notes · twins solved " + ok + "/" + twins.length + (done > ok ? " (" + (done - ok) + " missed)" : "");
}
function gaMetaUpdate(w) { const m = document.getElementById("gameta" + w.w); if (m) m.textContent = gaMetaText(w); }
function gaPat(code) { return code && typeof PAT !== "undefined" ? PAT.patterns.find(p => p.c === code) : null; }

function renderGAStrip() {
  const box = document.getElementById("gaStrip"); if (!box) return;
  box.innerHTML = "";
  GA.forEach(w => {
    const s = gaState(w);
    const a = el("a", "ga-tile " + s.k); a.href = "#ga" + w.w;
    a.appendChild(el("span", "k", "Week " + w.w));
    a.appendChild(el("b", null, s.k === "open" ? (w.tentative ? "Expected " : "Due ") + gaDueText(w).replace(", 23:59 IST", "") : s.k === "solved" ? "Answers out" : "Answers soon"));
    a.appendChild(el("span", "st", s.k === "open" ? (s.days <= 1 ? "Due within a day" : s.days + " days left") : "Closed " + gaDue(w).toLocaleDateString("en-IN", IST_DAY)));
    box.appendChild(a);
  });
}

function gaTwin(w, it) {
  const id = w.w + "-" + it.q, q = it.twin;
  const st = gaStore[id] || { sel: [], val: "", done: false };
  const redraw = () => { const old = document.getElementById("gat" + id); if (old) old.replaceWith(gaTwin(w, it)); gaMetaUpdate(w); };
  const card = questionCard(q, st, {
    show: st.done,
    meta: ["Twin of Q" + it.q, "Week " + w.w],
    onPick(k) {
      if (q.t === "mcq") { st.sel = [k]; st.done = true; st.ok = k === q.a[0]; }
      else st.sel = st.sel.includes(k) ? st.sel.filter(x => x !== k) : st.sel.concat(k);
      gaStore[id] = st; saveJSON(KEY + "-ga", gaStore); redraw();
    },
    onVal(v) { st.val = v; gaStore[id] = st; },
    onCheck() { st.done = true; st.ok = isCorrect(q, st); gaStore[id] = st; saveJSON(KEY + "-ga", gaStore); redraw(); },
    extra: st.done ? [(() => { const b = el("button", "btn", "Try again"); b.type = "button"; b.addEventListener("click", () => { delete gaStore[id]; saveJSON(KEY + "-ga", gaStore); redraw(); }); return b; })()] : []
  });
  card.id = "gat" + id;
  return card;
}

function gaItem(w, it) {
  const id = w.w + "-" + it.q;
  const d = el("details", "ga-item");
  const sum = el("summary");
  sum.appendChild(el("span", "qn", "Q" + it.q));
  sum.appendChild(html("span", "tp", it.topic));
  sum.appendChild(el("span", "mk", it.mk === 1 ? "1 mark" : it.mk + " marks"));
  const p = gaPat(it.p);
  if (p) { const c = el("span", "pat", it.p + " · " + p.n + "/13 quizzes"); c.title = p.name + ": came in " + p.n + " of the 13 past Quiz 1 papers"; sum.appendChild(c); }
  d.appendChild(sum);
  const body = el("div", "ga-body");
  body.appendChild(html("p", null, "<b>Idea.</b> " + it.idea));
  body.appendChild(html("p", null, "<b>Working.</b> " + it.work));
  body.appendChild(html("p", "ga-ans", "<b>Answer</b> " + it.ans));
  if (it.twin) {
    const slot = el("div", "ga-twin");
    const b = el("button", "btn", "Practise a twin with new numbers"); b.type = "button";
    b.addEventListener("click", () => { b.remove(); slot.appendChild(gaTwin(w, it)); });
    if (gaStore[id]) { b.remove(); slot.appendChild(gaTwin(w, it)); } else body.appendChild(b);
    body.appendChild(slot);
  }
  d.appendChild(body);
  if (GA_OPEN.has(id)) d.open = true;
  d.addEventListener("toggle", () => { if (d.open) { GA_OPEN.add(id); typeset(body); } else GA_OPEN.delete(id); });
  typeset(sum);
  if (d.open) typeset(body);
  return d;
}

function gaWeek(w) {
  const s = gaState(w);
  const sec = el("div", "ga-week"); sec.id = "ga" + w.w;
  const head = el("div", "ga-head");
  head.appendChild(el("p", "eyebrow", "Week " + w.w + " · " + (w.tentative ? "expected " : "due ") + gaDueText(w)));
  head.appendChild(el("h3", null, w.title));
  head.appendChild(el("p", "ga-topics", w.topics));
  if (s.k === "solved") { const m = el("p", "ga-meta", gaMetaText(w)); m.id = "gameta" + w.w; head.appendChild(m); }
  sec.appendChild(head);
  if (s.k === "solved") {
    const list = el("div", "ga-list");
    w.items.forEach(it => list.appendChild(gaItem(w, it)));
    sec.appendChild(list);
  } else {
    const msg = s.k === "open"
      ? "This assignment is still open. Answers appear here after " + gaDueText(w) + (w.tentative ? " (date to be confirmed on Seek)" : "") + ". Until then, revise the topics:"
      : "The deadline has passed. Answers and method notes are being checked and will appear here soon. Meanwhile:";
    const p = el("div", "ga-wait");
    p.appendChild(el("p", null, msg));
    const links = el("div", "ga-links");
    [["#w" + w.w, "Week " + w.w + " notes"], ["#drills", "Number drills"], ["#practice", "Practice questions"], ["#worked", "Worked examples"]].forEach(([h, t]) => { const a = el("a", "btn", t); a.href = h; links.appendChild(a); });
    p.appendChild(links);
    sec.appendChild(p);
  }
  return sec;
}

function renderGA() {
  renderGAStrip();
  const box = document.getElementById("gaWeeks"); if (!box) return;
  box.innerHTML = "";
  GA.forEach(w => box.appendChild(gaWeek(w)));
}
