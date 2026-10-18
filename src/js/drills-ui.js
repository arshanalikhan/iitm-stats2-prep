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
