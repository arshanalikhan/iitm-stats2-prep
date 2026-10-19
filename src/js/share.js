/* ---------- Share and star: WhatsApp / copy / native share buttons, live GitHub star count ---------- */
const SITE_URL = "https://arshanalikhan.github.io/iitm-stats2-prep/";
const REPO_API = "https://api.github.com/repos/arshanalikhan/iitm-stats2-prep";
const SHARE_TEXT = "Stats 2 Quiz 1 (15 Nov) prep site, a Saranda House initiative: week notes, every past Quiz 1 since 2022 analysed by pattern, 117 practice questions, number drills, timed mocks, and graded-assignment answers after each deadline. Free:";

(function shareButtons() {
  const wa = document.getElementById("shareWa");
  if (wa) wa.href = "https://wa.me/?text=" + encodeURIComponent(SHARE_TEXT + " " + SITE_URL);
  const copy = document.getElementById("shareCopy");
  if (copy) copy.addEventListener("click", async () => {
    const label = copy.querySelector("span");
    try { await navigator.clipboard.writeText(SITE_URL); label.textContent = "Link copied"; }
    catch (e) { label.textContent = SITE_URL; }
    setTimeout(() => { label.textContent = "Copy link"; }, 2500);
  });
  const native = document.getElementById("shareNative");
  if (native && navigator.share) {
    native.hidden = false;
    native.addEventListener("click", () => { navigator.share({ title: "Stats 2 Quiz 1 Prep", text: SHARE_TEXT, url: SITE_URL }).catch(() => {}); });
  }
})();

// Star count from the GitHub API (60 unauthenticated requests per hour per visitor), cached for an hour.
(async function starCount() {
  const paint = n => document.querySelectorAll(".starcount").forEach(b => { b.textContent = n; b.hidden = !(n > 0); });
  try {
    const c = JSON.parse(sessionStorage.getItem("s2prep-stars") || "null");
    if (c && Date.now() - c.at < 3600e3) { paint(c.n); return; }
  } catch (e) {}
  try {
    const r = await fetch(REPO_API, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) return;
    const n = (await r.json()).stargazers_count;
    paint(n);
    try { sessionStorage.setItem("s2prep-stars", JSON.stringify({ n, at: Date.now() })); } catch (e) {}
  } catch (e) {}
})();
