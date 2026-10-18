/* ---------- Shell: theme, phone helpers, page routing and boot. Loaded last. ---------- */
let currentPage = null;
const PAGE_ORDER = ["home", "notes", "formulas", "worked", "patterns", "practice", "drills", "mock", "traps", "resources"];
const PAGE_NAMES = { home: "Home", notes: "Week notes", formulas: "Formula sheet", worked: "Worked examples", patterns: "Past quiz patterns", practice: "Practice", drills: "Number drills", mock: "Mock quizzes", traps: "Last-minute traps", resources: "Resources" };
const ALIAS = { plan: ["home", "plan"] };
const MORE_PAGES = ["formulas", "worked", "patterns", "traps", "resources"];

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
    if (page === "patterns") renderPatterns();
    heroAnim(page === "home");
    document.title = (page === "home" ? "" : PAGE_NAMES[page] + " · ") + "Stats 2 Quiz 1 Prep";
    const t = target ? document.getElementById(target) : null;
    if (t) t.scrollIntoView(); else window.scrollTo({ top: 0, behavior: "instant" });
  };
  if (useVT) { try { const vt = document.startViewTransition(apply); [vt.ready, vt.finished, vt.updateCallbackDone].forEach(pr => pr && pr.catch(() => {})); setTimeout(() => { if (!applied) { try { vt.skipTransition(); } catch (e) {} apply(); } }, 400); } catch (e) { apply(); } }
  else apply();
}


/* ---------- Boot ---------- */
buildWeekFooters();
buildChips();
updateCountdowns();
window.addEventListener("hashchange", () => route());
window.addEventListener("popstate", () => route());
route();
window.s2Icons && window.s2Icons();
