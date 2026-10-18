/* ---------- Home: progress rings, plan highlight, countdowns, hero animation ---------- */
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
