/* ---------- Shell: theme, phone helpers, page routing and boot. Loaded last. ---------- */
let currentPage = null;
const PAGE_ORDER = ["home", "notes", "ga", "formulas", "worked", "patterns", "practice", "drills", "mock", "traps", "resources"];
const PAGE_NAMES = { home: "Home", notes: "Week notes", ga: "Graded assignments", formulas: "Formula sheet", worked: "Worked examples", patterns: "Past quiz patterns", practice: "Practice", drills: "Number drills", mock: "Mock quizzes", traps: "Last-minute traps", resources: "Resources" };
const ALIAS = { plan: ["home", "plan"], about: ["home", "about"] };
const MORE_PAGES = ["ga", "formulas", "worked", "patterns", "traps", "resources"];

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
function isRoute(h) { return PAGE_ORDER.includes(h) || !!ALIAS[h] || /^w[0-4]$/.test(h) || /^d-[a-z]+$/.test(h) || /^ga[1-4]$/.test(h); }
function go(h) {
  const fromSheet = sheetEntry; sheetEntry = false;   // a page opened from the More sheet takes over the sheet's history entry
  route(h);
  try {
    if (hashNow() !== h) history[fromSheet ? "replaceState" : "pushState"]({ h }, "", "#" + h);
    else if (fromSheet) { skipPop = true; history.back(); }
  } catch (e) {}
}
document.addEventListener("click", e => {
  const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
  const h = a.getAttribute("href").slice(1); if (!isRoute(h)) return;
  e.preventDefault(); go(h);
});

/* ---------- More sheet (phones): opens above the tab bar; closes with More, ×, the backdrop, a swipe down, Esc or Back ---------- */
const sheetEl = document.getElementById("moreSheet"), sheetPanel = sheetEl.querySelector(".sheet-panel"), moreBtn = document.getElementById("moreBtn");
let sheetEntry = false, skipPop = false;   // sheetEntry: a history entry was pushed, so the phone's Back button closes the sheet
function openSheet() {
  sheetEl.hidden = false; moreBtn.setAttribute("aria-expanded", "true"); document.body.classList.add("sheet-open");
  sheetPanel.scrollTop = 0;
  try { history.pushState({ sheet: true }, ""); sheetEntry = true; } catch (e) {}
}
// how: "nav" (a page is opening and go() reuses the history entry), "pop" (Back already removed it), or nothing (dismissed: remove it)
function closeSheet(how) {
  if (sheetEl.hidden) return;
  sheetEl.hidden = true; sheetPanel.style.transform = ""; sheetPanel.style.transition = "";
  moreBtn.setAttribute("aria-expanded", "false"); document.body.classList.remove("sheet-open");
  if (sheetEntry && !how) { skipPop = true; try { history.back(); } catch (e) { skipPop = false; } }
  sheetEntry = false;
}
moreBtn.addEventListener("click", () => { sheetEl.hidden ? openSheet() : closeSheet(); });
sheetEl.addEventListener("click", e => { if (e.target === sheetEl) closeSheet(); });
document.getElementById("sheetClose").addEventListener("click", () => closeSheet());
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
(function sheetSwipe() {
  let y0 = null, dy = 0;
  sheetPanel.addEventListener("touchstart", e => {
    if (sheetPanel.scrollTop > 0 || e.touches.length > 1) { y0 = null; return; }
    y0 = e.touches[0].clientY; dy = 0; sheetPanel.style.transition = "none";
  }, { passive: true });
  sheetPanel.addEventListener("touchmove", e => {
    if (y0 == null) return;
    dy = e.touches[0].clientY - y0;
    if (dy > 0) { sheetPanel.style.transform = "translateY(" + dy + "px)"; if (e.cancelable) e.preventDefault(); }
  }, { passive: false });
  const end = () => {
    if (y0 == null) return;
    y0 = null; sheetPanel.style.transition = "";
    if (dy > 80) closeSheet(); else sheetPanel.style.transform = "";
  };
  sheetPanel.addEventListener("touchend", end);
  sheetPanel.addEventListener("touchcancel", () => { dy = 0; end(); });
})();


let routedHash = null;   // the hash last routed, so Back (popstate, then hashchange) renders the page once
function route(hIn) {
  const h = hIn == null ? hashNow() : hIn;
  routedHash = h;
  let page = h || "home", target = null, week = null, drill = null;
  if (/^w[0-4]$/.test(h)) { page = "notes"; week = h; }
  else if (/^d-[a-z]+$/.test(h)) { page = "drills"; drill = h.slice(2); }
  else if (/^ga[1-4]$/.test(h)) { page = "ga"; target = h; }
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
    closeSheet("nav"); renderPager(page);
    currentPage = page;
    typesetPage(page);
    if (page === "home") renderHome();
    if (page === "practice") renderPractice();
    if (page === "drills") { renderDrillGrid(); renderDrill(false); }
    if (page === "mock") renderMock();
    if (page === "patterns") renderPatterns();
    if (page === "ga") renderGA();
    heroAnim(page === "home");
    document.title = (page === "home" ? "" : PAGE_NAMES[page] + " · ") + "Stats 2 Quiz 1 Prep";
    const t = target ? document.getElementById(target) : null;
    // jump straight there when arriving from another page or a shared link; glide only within the same page
    if (t) t.scrollIntoView({ behavior: pageChanged ? "instant" : "smooth" }); else window.scrollTo({ top: 0, behavior: "instant" });
  };
  if (useVT) { try { const vt = document.startViewTransition(apply); [vt.ready, vt.finished, vt.updateCallbackDone].forEach(pr => pr && pr.catch(() => {})); setTimeout(() => { if (!applied) { try { vt.skipTransition(); } catch (e) {} apply(); } }, 400); } catch (e) { apply(); } }
  else apply();
}


/* ---------- Boot ---------- */
buildWeekFooters();
buildChips();
updateCountdowns();
window.addEventListener("hashchange", () => { if (hashNow() !== routedHash) route(); });
window.addEventListener("popstate", () => {
  if (skipPop) { skipPop = false; return; }       // our own history.back() after dismissing the sheet
  if (!sheetEl.hidden) { closeSheet("pop"); return; }   // Back closes the sheet before leaving the page
  if (hashNow() !== routedHash) route();
});
route();
window.s2Icons && window.s2Icons();
