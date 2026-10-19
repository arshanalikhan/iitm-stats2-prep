/* ---------- Past quiz patterns (data in patterns-data.js) ---------- */
const SHORT = d => { const [y, m] = d.split("-"); return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+m - 1] + " " + y.slice(2); };
const LONG = d => { const [y, m, dd] = d.split("-"); return +dd + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+m - 1] + " " + y; };
// Each sitting's marks scaled to a 40-mark paper (Oct 2022 had two different papers).
const SIT_TOTAL = Object.fromEntries(PAT.sittings.map(d => [d, Object.values(PAT.weeks[d]).reduce((a, b) => a + b, 0)]));
const scale40 = (d, x) => x * 40 / SIT_TOTAL[d];
function patChance(p) {
  let num = 0.5, den = 1; const n = PAT.sittings.length;
  PAT.sittings.forEach((d, i) => { const w = Math.pow(0.85, n - 1 - i); den += w; if (p.m[d]) num += w; });
  return num / den;
}
PAT.patterns.forEach(p => { p.ch = patChance(p); const vals = Object.entries(p.m).map(([d, x]) => scale40(d, x)); p.avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0; });
function patBlueprint() {
  const target = { 1: 9, 2: 10, 3: 11, 4: 8 }, out = [];
  [1, 2, 3, 4].forEach(w => {
    let got = 0;
    PAT.patterns.filter(p => p.w === w && p.ch >= 0.3).sort((a, b) => b.ch - a.ch).forEach(p => {
      if (got >= target[w]) return;
      const m = Math.max(2, Math.min(5, Math.round(p.avg)));
      out.push({ p, m }); got += m;
    });
  });
  const tot = out.reduce((a, x) => a + x.m, 0);
  let diff = 40 - tot; // nudge marks so the paper totals 40
  for (let i = 0; diff !== 0 && i < 200; i++) { const x = out[i % out.length]; if (diff > 0 && x.m < 5) { x.m++; diff--; } else if (diff < 0 && x.m > 2) { x.m--; diff++; } }
  return out;
}
let patFilterW = "all", patRendered = false;
function weekTip(box) {
  let tip = box.querySelector(".vtip"); if (!tip) { tip = el("div", "vtip"); tip.hidden = true; box.appendChild(tip); }
  return tip;
}
function renderPatterns() {
  const tiles = document.getElementById("patTiles"); if (!tiles) return;
  if (!patRendered) {
    patRendered = true;
    const t = (v, l, s) => { const d = el("div", "tile"); d.append(el("span", "l", l), el("span", "v", v), el("span", "s", s)); return d; };
    const avgW = w => PAT.sittings.reduce((a, d) => a + scale40(d, PAT.weeks[d][w] || 0), 0) / PAT.sittings.length;
    tiles.append(t(String(PAT.sittings.length), "Sittings", "Jun 2022 to Jul 2026"), t(String(PAT.papers), "Paper sets read", "from quizpractice + Seek"), t(String(PAT.distinct), "Distinct questions", "after merging duplicate sets"),
      t(avgW(3).toFixed(1), "Week 3 marks", "average of 40"), t(avgW(4).toFixed(1), "Week 4 marks", "average of 40"));
    // week chart
    const wc = document.getElementById("weekChart");
    const names = { 1: "Week 1", 2: "Week 2", 3: "Week 3", 4: "Week 4", 0: "Week 0" };
    const lg = el("div", "wlegend"); [1, 2, 3, 4, 0].forEach(w => { const s = el("span"); const i = el("i"); i.style.background = "var(--w" + w + ")"; s.append(i, document.createTextNode(names[w])); lg.appendChild(s); });
    const bars = el("div", "wbars"), xl = el("div", "wxl"), tip = weekTip(wc);
    PAT.sittings.forEach(d => {
      const col = el("div", "wcol"); col.tabIndex = 0;
      const parts = [1, 2, 3, 4, 0].map(w => [w, scale40(d, PAT.weeks[d][w] || 0)]).filter(x => x[1] > 0);
      col.setAttribute("aria-label", LONG(d) + ": " + parts.map(([w, v]) => names[w] + " " + v.toFixed(1)).join(", "));
      parts.forEach(([w, v]) => { const s = el("div", "seg w" + w, v >= 4 ? String(Math.round(v)) : ""); s.style.background = "var(--w" + w + ")"; s.style.height = (v / 40 * 100) + "%"; col.appendChild(s); });
      const show = () => { tip.innerHTML = "<b>" + LONG(d) + "</b><br>" + parts.map(([w, v]) => names[w] + ": " + v.toFixed(1)).join("<br>"); tip.hidden = false; const r = col.getBoundingClientRect(), b = wc.getBoundingClientRect(); tip.style.left = Math.min(b.width - tip.offsetWidth - 8, Math.max(8, r.left - b.left + r.width / 2 - tip.offsetWidth / 2)) + "px"; tip.style.top = Math.max(4, r.top - b.top - tip.offsetHeight - 6) + "px"; };
      col.addEventListener("mouseenter", show); col.addEventListener("focus", show);
      col.addEventListener("mouseleave", () => { tip.hidden = true; }); col.addEventListener("blur", () => { tip.hidden = true; });
      bars.appendChild(col); xl.appendChild(el("span", null, SHORT(d)));
    });
    const plot = el("div", "wplot"), scroller = el("div", "wscroll");
    plot.append(bars, xl); scroller.appendChild(plot);
    wc.append(lg, scroller);
    // filter chips
    const fc = document.getElementById("patFilter");
    [["all", "All weeks"], ["1", "Week 1"], ["2", "Week 2"], ["3", "Week 3"], ["4", "Week 4"]].forEach(([id, l]) => {
      const b = el("button", "chip", l); b.type = "button"; b.dataset.w = id;
      b.addEventListener("click", () => { patFilterW = id; drawHeat(); });
      fc.appendChild(b);
    });
    // blueprint
    const bp = document.getElementById("blueprint"), plan = patBlueprint();
    plan.forEach(({ p, m }) => { const row = el("div", "bprow"); row.append(el("span", "bw", "W" + p.w), el("span", null, p.name), html("span", "bm", "<b>" + m + "</b> marks"), el("span", "bc", Math.round(p.ch * 100) + "% chance")); bp.appendChild(row); });
    bp.appendChild(el("p", "bptot", "Total " + plan.reduce((a, x) => a + x.m, 0) + " marks"));
    // pattern list
    const pl = document.getElementById("patList");
    PAT.patterns.forEach(p => {
      const d = el("details"), s = el("summary");
      s.append(el("b", null, p.name), el("span", "pmeta", "W" + p.w + " · " + p.n + "/" + PAT.sittings.length + " sittings · " + Math.round(p.ch * 100) + "% chance"));
      const body = el("div", "pbody");
      body.append(el("p", null, p.desc), el("p", "ptrap", "Trap: " + p.trap));
      const seen = el("span", "seen"); PAT.sittings.forEach(dd => seen.appendChild(el("span", p.m[dd] ? "on" : null, SHORT(dd)))); body.appendChild(seen);
      const a = el("a", "btn", "Drill this pattern →"); a.href = "#d-" + p.drill; body.appendChild(a);
      d.append(s, body); pl.appendChild(d);
    });
  }
  drawHeat();
}
// Heatmap cells mix the accent into the background. Pick the text colour that reads better on each mix, and
// where neither reaches 4.5:1 (the mid tones), deepen the cell until one does. Uses the current theme's tokens.
function heatShade() {
  const cs = getComputedStyle(document.documentElement);
  const rgb = v => { const h = cs.getPropertyValue(v).trim().replace("#", ""); return h.length === 6 ? [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255) : null; };
  const acc = rgb("--accent"), bg = rgb("--bg"), ink = rgb("--ink"), on = rgb("--on-accent");
  if (!acc || !bg || !ink || !on) return pct => ({ pct, on: pct >= 55 });
  const lum = c => c.map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  return pct => {
    for (let p = pct; ; p++) {
      const mix = acc.map((a, i) => a * p / 100 + bg[i] * (1 - p / 100)), ci = cr(mix, ink), co = cr(mix, on);
      if (Math.max(ci, co) >= 4.5 || p >= 100) return { pct: p, on: co > ci };
    }
  };
}
document.addEventListener("themechange", () => { if (patRendered) drawHeat(); });
function drawHeat() {
  document.querySelectorAll("#patFilter .chip").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.w === patFilterW)));
  const tb = document.getElementById("heat"); if (!tb) return;
  const shade = heatShade();
  let h = '<thead><tr><th class="pn">Pattern</th>' + PAT.sittings.map(d => "<th>" + SHORT(d).replace(" ", "<br>") + "</th>").join("") + "<th>Seen</th><th>Chance</th><th></th></tr></thead><tbody>";
  PAT.patterns.filter(p => patFilterW === "all" || String(p.w) === patFilterW).forEach(p => {
    h += '<tr><td class="pn">' + p.name + "<small>Week " + p.w + "</small></td>";
    PAT.sittings.forEach(d => {
      const v = p.m[d] ? scale40(d, p.m[d]) : 0;
      const s = shade(Math.round(Math.min(1, v / 8) * 85 + (v ? 15 : 0)));
      h += v ? '<td class="c' + (s.on ? ' on' : '') + '" style="background:color-mix(in srgb, var(--accent) ' + s.pct + '%, var(--bg))" title="' + p.name + ", " + LONG(d) + ": " + v.toFixed(1) + ' marks">' + (Math.round(v * 2) / 2) + "</td>" : '<td class="c" title="' + p.name + ", " + LONG(d) + ': not asked"></td>';
    });
    const c = Math.round(p.ch * 100);
    h += '<td class="seen">' + p.n + "/" + PAT.sittings.length + '</td><td class="ch ' + (c >= 70 ? "hi" : c >= 40 ? "md" : "lo") + '">' + c + '%</td><td class="dr"><a href="#d-' + p.drill + '">Drill →</a></td></tr>';
  });
  tb.innerHTML = h + "</tbody>";
}
// Some drills mix sub-types; for the predicted paper keep only problems that match the pattern.
const PAT_MATCH = { B1: /Markov/, B2: /Chebyshev/, E1: /E\[(X|\(X)/, V1: /Var|n\$\./ };
function buildPredictedItems() {
  return patBlueprint().map(({ p, m }) => {
    const d = DRILLS.find(x => x.id === p.drill) || DRILLS[0];
    let g = d.gen(rng(newSeed()));
    for (let i = 0; i < 30 && PAT_MATCH[p.c] && !PAT_MATCH[p.c].test(g.q); i++) g = d.gen(rng(newSeed()));
    const q = drillToQ(d, g); q.m = m; q.w = p.w; q.pat = p.name; return q;
  });
}
