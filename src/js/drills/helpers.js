/* ---------- Number drills: random problems with computed answers and working ---------- */
// Each generator takes a random() function and returns
// { w, q (HTML with $TeX$), v (answer), dp (decimals asked for), steps: [HTML] }.
// The page checks the typed number against v with a tolerance that matches dp.

function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
function pk(r, arr) { return arr[Math.floor(r() * arr.length)]; }
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; }
function fr(n, d) { const g = gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? String(n) : "\\tfrac{" + n + "}{" + d + "}"; }
function nf(x, d) { if (d == null) d = 4; const s = (+x).toFixed(d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
function fact(n) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }
function C(n, k) { if (k < 0 || k > n) return 0; let c = 1; for (let i = 1; i <= k; i++) c = c * (n - k + i) / i; return Math.round(c); }
function pois(l, k) { return Math.exp(-l) * Math.pow(l, k) / fact(k); }
function dpText(dp) { return dp === 0 ? "Enter the exact value." : "Enter the answer correct to " + ["", "one", "two", "three", "four"][dp] + " decimal place" + (dp > 1 ? "s" : "") + "."; }
// Split S units over k cells (each between lo and hi) at random.
function parts(r, k, S, lo, hi) {
  const a = Array(k).fill(lo); let left = S - k * lo, guard = 0;
  while (left > 0 && guard++ < 10000) { const i = Math.floor(r() * k); if (a[i] < hi) { a[i]++; left--; } }
  return a;
}
// Joint table HTML. cell(i, j) returns the text for row xs[i], column ys[j].
function jtable(xs, ys, cell, rowName, colName) {
  let h = '<div class="ptwrap"><table class="pt"><tr><th>' + (rowName || "X") + " \\ " + (colName || "Y") + "</th>";
  ys.forEach(y => { h += "<th>" + y + "</th>"; });
  h += "</tr>";
  xs.forEach((x, i) => { h += "<tr><th>" + x + "</th>"; ys.forEach((y, j) => { h += "<td>" + cell(i, j) + "</td>"; }); h += "</tr>"; });
  return h + "</table></div>";
}
// "X_1,X_2" / "X_1,X_2,X_3" / "X_1,\dots,X_n"
function seq(n, v) { v = v || "X"; return n === 2 ? v + "_1," + v + "_2" : n === 3 ? v + "_1," + v + "_2," + v + "_3" : v + "_1,\\dots," + v + "_" + n; }
function pmfTable(vals, probs, name) {
  let h = '<div class="ptwrap"><table class="pt"><tr><th>' + (name || "x") + "</th>";
  vals.forEach(v => { h += "<td>" + v + "</td>"; });
  h += "</tr><tr><th>P(" + (name ? name.toUpperCase() : "X") + " = " + (name || "x") + ")</th>";
  probs.forEach(p => { h += "<td>" + p + "</td>"; });
  return h + "</tr></table></div>";
}

// Every week file appends its generators here, in display order.
const DRILLS = [];
