/* ---------- Week notes: one week at a time, reviewed flags, week footers ---------- */
const WEEKS_KEY = KEY + "-weeks", CURWEEK_KEY = KEY + "-curweek";
let reviewed = loadJSON(WEEKS_KEY, {});
let curWeek = loadJSON(CURWEEK_KEY, "w1");
const WEEK_IDS = [...document.querySelectorAll("#notes .week")].map(a => a.id);
if (!WEEK_IDS.includes(curWeek)) curWeek = "w1";
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

/* ---------- Worked examples: open all ---------- */
(function () {
  const b = document.getElementById("openAll"); if (!b) return;
  b.addEventListener("click", () => {
    const all = [...document.querySelectorAll("#worked details.wsol")], open = all.some(d => !d.open);
    all.forEach(d => { d.open = open; }); b.textContent = open ? "Close all workings" : "Open all workings";
  });
})();
