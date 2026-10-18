// Generated from src/ by tools/build_site.py. Edit the source, not this file.
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

const DRILLS = [
  /* ---------- Week 1 ---------- */
  { id: "jointcond", w: 1, name: "Joint table questions", desc: "Event and conditional probabilities from a joint PMF table",
    gen(r) {
      const xs = [0, 1, 2], ys = pk(r, [[0, 1, 2], [1, 2, 3]]);
      let u; do { u = parts(r, 9, 20, 0, 6); } while (u.filter(x => x === 0).length > 2);
      const P = (i, j) => u[i * 3 + j] / 20;
      const tbl = jtable(xs, ys, (i, j) => nf(P(i, j), 2));
      const type = ri(r, 0, 3);
      if (type === 0) {
        const sums = [...new Set(xs.flatMap(x => ys.map(y => x + y)))];
        const s = pk(r, sums.slice(1, -1));
        const cells = [];
        xs.forEach((x, i) => ys.forEach((y, j) => { if (x + y === s) cells.push([x, y, P(i, j)]); }));
        const v = cells.reduce((a, c) => a + c[2], 0);
        return { w: 1, q: "The joint PMF of $X$ and $Y$ is" + tbl + "Find $P(X+Y=" + s + ")$. " + dpText(2), v, dp: 2,
          steps: ["Cells with $x+y=" + s + "$: " + cells.map(c => "$(" + c[0] + "," + c[1] + ")$").join(", ") + ".", "Add them: $" + cells.map(c => nf(c[2], 2)).join("+") + "=" + nf(v, 3) + "$."] };
      }
      if (type === 1) {
        let i; do { i = ri(r, 0, 2); } while (u[i * 3] + u[i * 3 + 1] + u[i * 3 + 2] === 0);
        const j = ri(r, 0, 2), row = P(i, 0) + P(i, 1) + P(i, 2), v = P(i, j) / row;
        return { w: 1, q: "The joint PMF of $X$ and $Y$ is" + tbl + "Find $f_{Y\\mid X=" + xs[i] + "}(" + ys[j] + ")$. " + dpText(2), v, dp: 2,
          steps: ["Row $X=" + xs[i] + "$ total: $f_X(" + xs[i] + ")=" + [0, 1, 2].map(k => nf(P(i, k), 2)).join("+") + "=" + nf(row, 2) + "$.", "$f_{Y\\mid X=" + xs[i] + "}(" + ys[j] + ")=\\dfrac{" + nf(P(i, j), 2) + "}{" + nf(row, 2) + "}=" + nf(v, 4) + "$."] };
      }
      if (type === 2) {
        const a = ri(r, 0, 1), b = ys[ri(r, 1, 2)];
        let num = 0, den = 0; const nc = [], dc = [];
        xs.forEach((x, i) => ys.forEach((y, j) => { if (y >= b) { den += P(i, j); dc.push(nf(P(i, j), 2)); if (x <= a) { num += P(i, j); nc.push(nf(P(i, j), 2)); } } }));
        if (den === 0) return this.gen(r);
        return { w: 1, q: "The joint PMF of $X$ and $Y$ is" + tbl + "Find $P(X\\le " + a + "\\mid Y\\ge " + b + ")$. " + dpText(2), v: num / den, dp: 2,
          steps: ["Given part: $P(Y\\ge" + b + ")=" + dc.join("+") + "=" + nf(den, 2) + "$.", "Both: $P(X\\le" + a + ",Y\\ge" + b + ")=" + (nc.join("+") || "0") + "=" + nf(num, 2) + "$.", "Ratio: $" + nf(num, 2) + "/" + nf(den, 2) + "=" + nf(num / den, 4) + "$."] };
      }
      const cells = []; let v = 0;
      xs.forEach((x, i) => ys.forEach((y, j) => { if (x === y) { cells.push(nf(P(i, j), 2)); v += P(i, j); } }));
      return { w: 1, q: "The joint PMF of $X$ and $Y$ is" + tbl + "Find $P(X=Y)$. " + dpText(2), v, dp: 2,
        steps: ["Cells on the diagonal $x=y$: $" + (cells.join("+") || "0") + "=" + nf(v, 2) + "$."] };
    } },

  { id: "formulak", w: 1, name: "Find k in a joint PMF", desc: "PMF given by a formula on a grid; find k, then a probability",
    gen(r) {
      const I = pk(r, [[0, 1, 2], [1, 2], [1, 2, 3]]), J = pk(r, [[1, 2, 3], [0, 1, 2], [1, 2]]);
      const a = ri(r, 1, 3), b = ri(r, 1, 3);
      const g = (i, j) => a * i + b * j;
      let k = 0; I.forEach(i => J.forEach(j => { k += g(i, j); }));
      const form = "P(X=i,Y=j)=\\dfrac{" + (a === 1 ? "" : a) + "i+" + (b === 1 ? "" : b) + "j}{k},\\quad i\\in\\{" + I.join(",") + "\\},\\ j\\in\\{" + J.join(",") + "\\}";
      const kstep = "Add $" + (a === 1 ? "" : a) + "i+" + (b === 1 ? "" : b) + "j$ over all " + I.length * J.length + " pairs: $k=" + k + "$.";
      const type = ri(r, 0, 2);
      if (type === 0) return { w: 1, q: "The joint PMF of $X$ and $Y$ is $" + form + "$. Find $k$.", v: k, dp: 0, steps: [kstep] };
      if (type === 1) {
        const i0 = pk(r, I); let s = 0; J.forEach(j => { s += g(i0, j); });
        return { w: 1, q: "The joint PMF of $X$ and $Y$ is $" + form + "$. Find $P(X=" + i0 + ")$. " + dpText(3), v: s / k, dp: 3,
          steps: [kstep, "$P(X=" + i0 + ")=\\dfrac{" + J.map(j => g(i0, j)).join("+") + "}{" + k + "}=\\dfrac{" + s + "}{" + k + "}=" + nf(s / k, 4) + "$."] };
      }
      const i0 = pk(r, I), j0 = pk(r, J); let s = 0; J.forEach(j => { s += g(i0, j); });
      if (s === 0) return this.gen(r);
      return { w: 1, q: "The joint PMF of $X$ and $Y$ is $" + form + "$. Find $P(Y=" + j0 + "\\mid X=" + i0 + ")$. " + dpText(3), v: g(i0, j0) / s, dp: 3,
        steps: ["k cancels in a conditional, so you do not need it.", "$P(Y=" + j0 + "\\mid X=" + i0 + ")=\\dfrac{" + g(i0, j0) + "}{" + J.map(j => g(i0, j)).join("+") + "}=\\dfrac{" + g(i0, j0) + "}{" + s + "}=" + nf(g(i0, j0) / s, 4) + "$."] };
    } },

  { id: "poisson", w: 1, name: "Poisson splitting", desc: "N ~ Poisson(λ), each item has a property with probability p",
    gen(r) {
      const l = pk(r, [4, 5, 6, 8, 10, 12, 15, 20]), p = pk(r, [0.1, 0.2, 0.25, 0.3, 0.4, 0.5]), q = +(1 - p).toFixed(2), lp = +(l * p).toFixed(4), lq = +(l * q).toFixed(4);
      const set = pk(r, [["customers enter a shop in an hour", "buys something", "buyers"], ["emails arrive in an hour", "is spam", "spam emails"], ["vehicles pass a signal in a day", "breaks a traffic rule", "rule-breakers"]]);
      const intro = "The number of " + set[0].split(" ")[0] + " $N$ that " + set[0].split(" ").slice(1).join(" ") + " is Poisson($" + l + "$). Each one independently " + set[1] + " with probability $" + p + "$. Let $X$ be the number of " + set[2] + ". ";
      const type = ri(r, 0, 3);
      if (type === 0) { const k = ri(r, 0, Math.min(6, Math.round(lp) + 2)); const v = pois(lp, k);
        return { w: 1, q: intro + "Find $P(X=" + k + ")$. " + dpText(4), v, dp: 4, steps: ["Splitting: $X\\sim\\text{Poisson}(\\lambda p)=\\text{Poisson}(" + lp + ")$.", "$P(X=" + k + ")=\\dfrac{e^{-" + lp + "}" + lp + "^{" + k + "}}{" + k + "!}=" + nf(v, 5) + "$."] }; }
      if (type === 1) { const n = ri(r, 2, 6), k = ri(r, 0, n + 2);
        if (k > n) return { w: 1, q: intro + "Find $f_{NX}(" + n + "," + k + ")$.", v: 0, dp: 0, steps: ["$X\\le N$ always: you cannot have " + k + " " + set[2] + " among " + n + ". So $f_{NX}(" + n + "," + k + ")=0$."] };
        const v = pois(l, n) * C(n, k) * Math.pow(p, k) * Math.pow(q, n - k);
        return { w: 1, q: intro + "Find $f_{NX}(" + n + "," + k + ")$. " + dpText(4), v, dp: 4, steps: ["$f_{NX}(n,k)=P(N=n)\\,P(X=k\\mid N=n)=\\dfrac{e^{-\\lambda}\\lambda^n}{n!}\\binom nk p^k(1-p)^{n-k}$.", "$=\\dfrac{e^{-" + l + "}" + l + "^{" + n + "}}{" + n + "!}\\cdot" + C(n, k) + "\\cdot" + p + "^{" + k + "}\\cdot" + q + "^{" + (n - k) + "}=" + nf(v, 5) + "$."] }; }
      if (type === 2) return { w: 1, q: intro + "Find $E[X]$. " + dpText(2), v: lp, dp: 2, steps: ["$X\\sim\\text{Poisson}(\\lambda p)$, so $E[X]=\\lambda p=" + l + "\\times" + p + "=" + lp + "$."] };
      const a = ri(r, 0, Math.round(lp) + 1), b = ri(r, Math.max(0, Math.round(lq) - 2), Math.round(lq) + 2); const v = pois(lp, a) * pois(lq, b);
      return { w: 1, q: intro + "Find the probability that exactly $" + a + "$ have the property and exactly $" + b + "$ do not. " + dpText(4), v, dp: 4,
        steps: ["$X\\sim\\text{Poisson}(" + lp + ")$ and $N-X\\sim\\text{Poisson}(" + lq + ")$ are independent.", "$P=\\dfrac{e^{-" + lp + "}" + lp + "^{" + a + "}}{" + a + "!}\\cdot\\dfrac{e^{-" + lq + "}" + lq + "^{" + b + "}}{" + b + "!}=" + nf(pois(lp, a), 5) + "\\times" + nf(pois(lq, b), 5) + "=" + nf(v, 5) + "$."] };
    } },

  { id: "chain", w: 1, name: "Chain rule, three variables", desc: "Given three of joint, marginal and two conditionals, find the fourth",
    gen(r) {
      const z = pk(r, [0.2, 0.3, 0.4, 0.5, 0.6, 0.8]), y = pk(r, [0.25, 0.4, 0.5, 0.6, 0.75]), x = pk(r, [0.2, 0.25, 0.4, 0.5, 0.6, 0.75]);
      const a = ri(r, 0, 1), b = ri(r, 0, 1), c = ri(r, 0, 1), j = x * y * z;
      const names = ["f_{X\\mid Y=" + b + ",Z=" + c + "}(" + a + ")", "f_{Y\\mid Z=" + c + "}(" + b + ")", "f_Z(" + c + ")", "f_{XYZ}(" + a + "," + b + "," + c + ")"];
      const vals = [x, y, z, j], ask = ri(r, 0, 3);
      const given = [0, 1, 2, 3].filter(i => i !== ask).map(i => "$" + names[i] + "=" + nf(vals[i], 4) + "$").join(", ");
      const rule = "$f_{XYZ}(" + a + "," + b + "," + c + ")=f_{X\\mid Y=" + b + ",Z=" + c + "}(" + a + ")\\cdot f_{Y\\mid Z=" + c + "}(" + b + ")\\cdot f_Z(" + c + ")$.";
      const solve = ask === 3 ? "$" + nf(x, 4) + "\\times" + nf(y, 4) + "\\times" + nf(z, 4) + "=" + nf(j, 4) + "$." : "$" + names[ask] + "=" + nf(j, 4) + "\\div(" + [0, 1, 2].filter(i => i !== ask).map(i => nf(vals[i], 4)).join("\\times") + ")=" + nf(vals[ask], 4) + "$.";
      return { w: 1, q: "$X, Y, Z$ take values in $\\{0,1\\}$. Given " + given + ", find $" + names[ask] + "$. " + dpText(3), v: vals[ask], dp: 3, steps: [rule, solve] };
    } },

  /* ---------- Week 2 ---------- */
  { id: "bernsum", w: 2, name: "Conditioning on a sum", desc: "Independent Bernoullis X, Y and Z = X + Y",
    gen(r) {
      const p1 = ri(r, 1, 9) / 10, p2 = ri(r, 1, 9) / 10, q1 = +(1 - p1).toFixed(1), q2 = +(1 - p2).toFixed(1);
      const intro = "$X\\sim\\text{Bernoulli}(" + p1 + ")$ and $Y\\sim\\text{Bernoulli}(" + p2 + ")$ are independent, and $Z=X+Y$. ";
      const a = p1 * q2, b = q1 * p2, type = ri(r, 0, 3);
      if (type === 0) return { w: 2, q: intro + "Find $f_{X\\mid Z=1}(1)$. " + dpText(2), v: a / (a + b), dp: 2, steps: ["$Z=1$ from $(1,0)$: $" + p1 + "\\cdot" + q2 + "=" + nf(a, 3) + "$, or $(0,1)$: $" + q1 + "\\cdot" + p2 + "=" + nf(b, 3) + "$.", "$f_{X\\mid Z=1}(1)=\\dfrac{" + nf(a, 3) + "}{" + nf(a, 3) + "+" + nf(b, 3) + "}=" + nf(a / (a + b), 4) + "$."] };
      if (type === 1) return { w: 2, q: intro + "Find $f_{X\\mid Z=1}(0)$. " + dpText(2), v: b / (a + b), dp: 2, steps: ["$P(X=0,Z=1)=P(X=0,Y=1)=" + nf(b, 3) + "$; $P(Z=1)=" + nf(a, 3) + "+" + nf(b, 3) + "=" + nf(a + b, 3) + "$.", "Ratio: $" + nf(b / (a + b), 4) + "$."] };
      if (type === 2) return { w: 2, q: intro + "Find $P(Z=1)$. " + dpText(2), v: a + b, dp: 2, steps: ["$P(Z=1)=p_1(1-p_2)+(1-p_1)p_2=" + nf(a, 3) + "+" + nf(b, 3) + "=" + nf(a + b, 3) + "$."] };
      const den = 1 - q1 * q2;
      return { w: 2, q: intro + "Find $P(X=1\\mid Z\\ge1)$. " + dpText(2), v: p1 / den, dp: 2, steps: ["$P(Z\\ge1)=1-P(X=0,Y=0)=1-" + q1 + "\\cdot" + q2 + "=" + nf(den, 3) + "$.", "$\\{X=1\\}\\subset\\{Z\\ge1\\}$, so $P=\\dfrac{" + p1 + "}{" + nf(den, 3) + "}=" + nf(p1 / den, 4) + "$."] };
    } },

  { id: "maxmin", w: 2, name: "Max and min", desc: "Max/min of i.i.d. uniforms, Bernoullis and geometrics",
    gen(r) {
      const type = ri(r, 0, 5);
      if (type <= 3) {
        const m = ri(r, 4, 8), n = pk(r, [2, 2, 3]), k = ri(r, 1, m);
        const intro = "$" + seq(n) + "$ are i.i.d. Uniform$\\{1,2,\\dots," + m + "\\}$. ";
        const pw = (a) => Math.pow(a / m, n);
        if (type === 0) { const v = pw(m - k + 1) - pw(m - k);
          return { w: 2, q: intro + "Find $P(\\min=" + k + ")$. " + dpText(3), v, dp: 3, steps: ["$P(\\min\\ge j)=\\left(\\frac{" + m + "-j+1}{" + m + "}\\right)^{" + n + "}$.", "$P(\\min=" + k + ")=P(\\min\\ge" + k + ")-P(\\min\\ge" + (k + 1) + ")=(" + (m - k + 1) + "/" + m + ")^{" + n + "}-(" + (m - k) + "/" + m + ")^{" + n + "}=" + nf(v, 4) + "$."] }; }
        if (type === 1) { const v = pw(k) - pw(k - 1);
          return { w: 2, q: intro + "Find $P(\\max=" + k + ")$. " + dpText(3), v, dp: 3, steps: ["$P(\\max\\le j)=(j/" + m + ")^{" + n + "}$.", "$P(\\max=" + k + ")=(" + k + "/" + m + ")^{" + n + "}-(" + (k - 1) + "/" + m + ")^{" + n + "}=" + nf(v, 4) + "$."] }; }
        if (type === 2) { const v = 1 - pw(m - k);
          return { w: 2, q: intro + "Find $P(\\min\\le" + k + ")$. " + dpText(3), v, dp: 3, steps: ["$P(\\min\\gt" + k + ")=P(\\text{all}\\gt" + k + ")=(" + (m - k) + "/" + m + ")^{" + n + "}$.", "$P(\\min\\le" + k + ")=1-" + nf(pw(m - k), 4) + "=" + nf(v, 4) + "$."] }; }
        const v = 1 - pw(k - 1);
        return { w: 2, q: intro + "Find $P(\\max\\ge" + k + ")$. " + dpText(3), v, dp: 3, steps: ["$P(\\max\\lt" + k + ")=P(\\text{all}\\le" + (k - 1) + ")=(" + (k - 1) + "/" + m + ")^{" + n + "}$.", "$P(\\max\\ge" + k + ")=1-" + nf(pw(k - 1), 4) + "=" + nf(v, 4) + "$."] };
      }
      if (type === 4) {
        const p = ri(r, 1, 9) / 10, n = ri(r, 2, 4), mx = r() < 0.5;
        const v = mx ? 1 - Math.pow(1 - p, n) : 1 - Math.pow(p, n);
        return { w: 2, q: "$" + seq(n) + "$ are i.i.d. Bernoulli($" + p + "$). Find $P(" + (mx ? "\\max=1" : "\\min=0") + ")$. " + dpText(3), v, dp: 3,
          steps: [mx ? "$\\max=0$ only if all are 0: $(" + nf(1 - p, 1) + ")^{" + n + "}$. So $P(\\max=1)=1-" + nf(Math.pow(1 - p, n), 4) + "=" + nf(v, 4) + "$." : "$\\min=1$ only if all are 1: $" + p + "^{" + n + "}$. So $P(\\min=0)=1-" + nf(Math.pow(p, n), 4) + "=" + nf(v, 4) + "$."] };
      }
      const a = pk(r, [[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 3], [3, 4]]), b = pk(r, [[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 3]]);
      const qa = (a[1] - a[0]) / a[1], qb = (b[1] - b[0]) / b[1], v = 1 - qa * qb;
      return { w: 2, q: "$X\\sim\\text{Geometric}(" + fr(a[0], a[1]) + ")$ and $Y\\sim\\text{Geometric}(" + fr(b[0], b[1]) + ")$ are independent. $\\min(X,Y)$ is Geometric$(p)$. Find $p$. " + dpText(3), v, dp: 3,
        steps: ["$P(\\min\\gt k)=P(X\\gt k)P(Y\\gt k)=\\big[(1-p_1)(1-p_2)\\big]^k$, the tail of a Geometric.", "$p=1-" + fr(a[1] - a[0], a[1]) + "\\cdot" + fr(b[1] - b[0], b[1]) + "=" + nf(v, 4) + "$."] };
    } },

  { id: "iid", w: 2, name: "i.i.d. samples", desc: "Exactly one, none, or all of n samples from a small PMF",
    gen(r) {
      const u = parts(r, 4, 10, 1, 5), pr = u.map(x => x / 10), n = ri(r, 3, 5), v0 = ri(r, 0, 3), p = pr[v0];
      const intro = "$" + seq(n) + "$ are i.i.d. samples of $X$ with PMF" + pmfTable([0, 1, 2, 3], pr.map(x => nf(x, 1)));
      const type = ri(r, 0, 3);
      if (type === 0) { const v = n * p * Math.pow(1 - p, n - 1);
        return { w: 2, q: intro + "Find the probability that the value " + v0 + " appears exactly once. " + dpText(3), v, dp: 3, steps: ["Each sample equals " + v0 + " with probability $" + nf(p, 1) + "$; the count is Binomial($" + n + "," + nf(p, 1) + "$).", "$" + n + "\\cdot" + nf(p, 1) + "\\cdot" + nf(1 - p, 1) + "^{" + (n - 1) + "}=" + nf(v, 4) + "$."] }; }
      if (type === 1) { const v = Math.pow(1 - p, n);
        return { w: 2, q: intro + "Find the probability that none of the samples equals " + v0 + ". " + dpText(3), v, dp: 3, steps: ["$P(X\\ne" + v0 + ")=" + nf(1 - p, 1) + "$, independently for each sample.", "$" + nf(1 - p, 1) + "^{" + n + "}=" + nf(v, 4) + "$."] }; }
      if (type === 2) { const F = pr.slice(0, v0 + 1).reduce((a, b) => a + b, 0), v = Math.pow(F, n);
        return { w: 2, q: intro + "Find $P(\\max(" + seq(n) + ")\\le" + v0 + ")$. " + dpText(3), v, dp: 3, steps: ["$P(X\\le" + v0 + ")=" + nf(F, 1) + "$.", "All samples must be $\\le" + v0 + "$: $" + nf(F, 1) + "^{" + n + "}=" + nf(v, 4) + "$."] }; }
      const v = C(n, 2) * p * p * Math.pow(1 - p, n - 2);
      return { w: 2, q: intro + "Find the probability that exactly two samples equal " + v0 + ". " + dpText(3), v, dp: 3, steps: ["Count of " + v0 + "s is Binomial($" + n + "," + nf(p, 1) + "$).", "$\\binom{" + n + "}{2}" + nf(p, 1) + "^2\\," + nf(1 - p, 1) + "^{" + (n - 2) + "}=" + nf(v, 4) + "$."] };
    } },

  { id: "funcsum", w: 2, name: "PMF of a sum", desc: "Sum of two throws of a die with repeated faces; sums of independent PMFs",
    gen(r) {
      if (r() < 0.5) {
        const c = parts(r, 3, 6, 1, 4), P = [0, c[0] / 6, c[1] / 6, c[2] / 6];
        const s = ri(r, 3, 5); const cells = [];
        for (let x = 1; x <= 3; x++) { const y = s - x; if (y >= 1 && y <= 3) cells.push([x, y]); }
        const v = cells.reduce((a, [x, y]) => a + P[x] * P[y], 0);
        return { w: 2, q: "A fair six-sided die has 1 on " + c[0] + " face" + (c[0] > 1 ? "s" : "") + ", 2 on " + c[1] + " face" + (c[1] > 1 ? "s" : "") + " and 3 on " + c[2] + " face" + (c[2] > 1 ? "s" : "") + ". It is thrown twice; $Z$ is the sum. Find $P(Z=" + s + ")$. " + dpText(3), v, dp: 3,
          steps: ["$P(1)=" + fr(c[0], 6) + ",\\ P(2)=" + fr(c[1], 6) + ",\\ P(3)=" + fr(c[2], 6) + "$.", "Pairs giving " + s + ": " + cells.map(([x, y]) => "$(" + x + "," + y + ")$").join(", ") + ".", "$P(Z=" + s + ")=" + cells.map(([x, y]) => fr(c[x - 1], 6) + "\\cdot" + fr(c[y - 1], 6)).join("+") + "=" + nf(v, 4) + "$."] };
      }
      const ua = parts(r, 3, 10, 1, 6), ub = parts(r, 3, 10, 1, 6), pa = ua.map(x => x / 10), pb = ub.map(x => x / 10), s = ri(r, 1, 3);
      const terms = []; let v = 0;
      for (let x = 0; x <= 2; x++) { const y = s - x; if (y >= 0 && y <= 2) { terms.push(nf(pa[x], 1) + "\\cdot" + nf(pb[y], 1)); v += pa[x] * pb[y]; } }
      return { w: 2, q: "$X$ and $Y$ are independent with PMFs" + pmfTable([0, 1, 2], pa.map(x => nf(x, 1))) + pmfTable([0, 1, 2], pb.map(x => nf(x, 1)), "y") + "Find $P(X+Y=" + s + ")$. " + dpText(2), v, dp: 2,
        steps: ["Convolution: $P(X+Y=" + s + ")=\\sum_x P(X=x)P(Y=" + s + "-x)$.", "$=" + terms.join("+") + "=" + nf(v, 3) + "$."] };
    } },

  /* ---------- Week 3 ---------- */
  { id: "expvar", w: 3, name: "Mean and variance", desc: "E[X], Var(X), E[(X − c)²] and linear changes from a PMF",
    gen(r) {
      let vals; do { vals = [ri(r, -2, 1), ri(r, 2, 3), ri(r, 4, 6)]; } while (new Set(vals).size < 3);
      const u = parts(r, 3, 10, 1, 6), pr = u.map(x => x / 10);
      const E = vals.reduce((a, x, i) => a + x * pr[i], 0), E2 = vals.reduce((a, x, i) => a + x * x * pr[i], 0), V = E2 - E * E;
      const tbl = pmfTable(vals, pr.map(x => nf(x, 1)));
      const eS = "$E[X]=" + vals.map((x, i) => "(" + x + ")(" + nf(pr[i], 1) + ")").join("+") + "=" + nf(E, 3) + "$.";
      const e2S = "$E[X^2]=" + vals.map((x, i) => x * x + "(" + nf(pr[i], 1) + ")").join("+") + "=" + nf(E2, 3) + "$.";
      const type = ri(r, 0, 3);
      if (type === 0) return { w: 3, q: "$X$ has PMF" + tbl + "Find $E[X]$. " + dpText(2), v: E, dp: 2, steps: [eS] };
      if (type === 1) return { w: 3, q: "$X$ has PMF" + tbl + "Find $\\mathrm{Var}(X)$. " + dpText(2), v: V, dp: 2, steps: [eS, e2S, "$\\mathrm{Var}(X)=E[X^2]-(E[X])^2=" + nf(E2, 3) + "-" + nf(E, 3) + "^2=" + nf(V, 4) + "$."] };
      if (type === 2) { const c = ri(r, 1, 3), v = vals.reduce((a, x, i) => a + (x - c) * (x - c) * pr[i], 0);
        return { w: 3, q: "$X$ has PMF" + tbl + "Find $E[(X-" + c + ")^2]$. " + dpText(2), v, dp: 2, steps: ["$E[(X-" + c + ")^2]=" + vals.map((x, i) => (x - c) * (x - c) + "(" + nf(pr[i], 1) + ")").join("+") + "=" + nf(v, 3) + "$.", "Check: $\\mathrm{Var}(X)+(E[X]-" + c + ")^2=" + nf(V, 3) + "+" + nf((E - c) * (E - c), 3) + "$."] }; }
      const a = pk(r, [-3, -2, 2, 3, 4]), b = ri(r, -5, 5);
      return { w: 3, q: "$X$ has PMF" + tbl + "Find $\\mathrm{Var}(" + a + "X" + (b < 0 ? "" : "+") + b + ")$. " + dpText(2), v: a * a * V, dp: 2, steps: [eS, e2S, "$\\mathrm{Var}(X)=" + nf(V, 4) + "$.", "$\\mathrm{Var}(aX+b)=a^2\\mathrm{Var}(X)=" + a * a + "\\times" + nf(V, 4) + "=" + nf(a * a * V, 4) + "$."] };
    } },

  { id: "bounds", w: 3, name: "Markov and Chebyshev", desc: "Upper and lower bounds from a mean and a variance",
    gen(r) {
      const type = ri(r, 0, 4);
      if (type === 0) { const mu = pk(r, [8, 10, 12, 15, 20, 25, 40]), c = mu * pk(r, [2, 3, 4, 5]);
        return { w: 3, q: "A non-negative random variable has mean $" + mu + "$. Use Markov's inequality to bound $P(X\\ge" + c + ")$. " + dpText(2), v: mu / c, dp: 2, steps: ["$P(X\\ge c)\\le\\mu/c=" + mu + "/" + c + "=" + nf(mu / c, 4) + "$."] }; }
      if (type === 1) { const mu = pk(r, [10, 12, 15, 20]), c = pk(r, [30, 40, 49, 50, 59]);
        return { w: 3, q: "The number of orders $X$ on a day has mean $" + mu + "$. Use Markov's inequality to bound $P(X\\gt" + c + ")$. " + dpText(3), v: mu / (c + 1), dp: 3, steps: ["$X$ is a whole number, so $P(X\\gt" + c + ")=P(X\\ge" + (c + 1) + ")$.", "$\\le" + mu + "/" + (c + 1) + "=" + nf(mu / (c + 1), 4) + "$."] }; }
      if (type === 2) { const mu = pk(r, [10, 15, 20, 30, 50]), s2 = pk(r, [4, 5, 6, 8, 9, 10]), c = pk(r, [3, 4, 5, 6, 8]);
        if (s2 >= c * c) return this.gen(r);
        return { w: 3, q: "$X$ has mean $" + mu + "$ and variance $" + s2 + "$. Use Chebyshev's inequality to find a lower bound on $P(" + (mu - c) + "\\lt X\\lt" + (mu + c) + ")$. " + dpText(2), v: 1 - s2 / (c * c), dp: 2, steps: ["The interval is $|X-" + mu + "|\\lt" + c + "$.", "$P\\ge1-\\dfrac{\\sigma^2}{c^2}=1-\\dfrac{" + s2 + "}{" + c * c + "}=" + nf(1 - s2 / (c * c), 4) + "$."] }; }
      if (type === 3) { const n = pk(r, [100, 200, 400]), d = pk(r, n === 100 ? [10, 15, 20] : n === 200 ? [15, 20, 25, 30] : [20, 25, 30, 40]), m = n / 2, s2 = n / 4;
        return { w: 3, q: "A fair coin is tossed $" + n + "$ times. Use Chebyshev's inequality to bound the probability that the number of heads is at least $" + (m + d) + "$ or at most $" + (m - d) + "$. " + dpText(3), v: s2 / (d * d), dp: 3, steps: ["Heads $\\sim$ Binomial($" + n + ",0.5$): $\\mu=" + m + "$, $\\sigma^2=" + s2 + "$.", "$P(|X-" + m + "|\\ge" + d + ")\\le\\dfrac{" + s2 + "}{" + d * d + "}=" + nf(s2 / (d * d), 4) + "$."] }; }
      const k = pk(r, [1.5, 2, 2.5, 3, 4]);
      return { w: 3, q: "For any random variable with mean $\\mu$ and standard deviation $\\sigma$, Chebyshev gives a lower bound on $P(\\mu-" + k + "\\sigma\\lt X\\lt\\mu+" + k + "\\sigma)$. Find it. " + dpText(2), v: 1 - 1 / (k * k), dp: 2, steps: ["$P(|X-\\mu|\\lt k\\sigma)\\ge1-1/k^2=1-1/" + nf(k * k, 2) + "=" + nf(1 - 1 / (k * k), 4) + "$."] };
    } },

  { id: "covalg", w: 3, name: "Covariance algebra", desc: "Cov and Var of linear combinations",
    gen(r) {
      const vx = ri(r, 1, 6), vy = ri(r, 1, 6), cxy = ri(r, -2, 3), cxz = ri(r, -2, 3), cyz = ri(r, -2, 3);
      const a = pk(r, [1, 2, 3, -1, -2]), b = pk(r, [1, 2, 3, -1, -2]), c = ri(r, -4, 6);
      const type = ri(r, 0, 2), sg = (x) => (x < 0 ? "-" : "+") + (Math.abs(x) === 1 ? "" : Math.abs(x));
      if (type === 0) { const v = a * a * vx + b * b * vy + 2 * a * b * cxy;
        return { w: 3, q: "$\\mathrm{Var}(X)=" + vx + "$, $\\mathrm{Var}(Y)=" + vy + "$, $\\mathrm{Cov}(X,Y)=" + cxy + "$. Find $\\mathrm{Var}(" + (a === 1 ? "" : a === -1 ? "-" : a) + "X" + sg(b) + "Y" + (c ? (c < 0 ? c : "+" + c) : "") + ")$.", v, dp: 0, steps: ["$\\mathrm{Var}(aX+bY+c)=a^2\\mathrm{Var}X+b^2\\mathrm{Var}Y+2ab\\,\\mathrm{Cov}(X,Y)$.", "$=" + a * a + "(" + vx + ")+" + b * b + "(" + vy + ")+2(" + a + ")(" + b + ")(" + cxy + ")=" + v + "$."] }; }
      if (type === 1) { const vv = a * cxy - a * cxz + b * vy - b * cyz;
        return { w: 3, q: "$\\mathrm{Cov}(X,Y)=" + cxy + "$, $\\mathrm{Cov}(X,Z)=" + cxz + "$, $\\mathrm{Cov}(Y,Z)=" + cyz + "$, $\\mathrm{Var}(Y)=" + vy + "$. Let $U=" + (a === 1 ? "" : a === -1 ? "-" : a) + "X" + sg(b) + "Y$ and $V=Y-Z$. Find $\\mathrm{Cov}(U,V)$.", v: vv, dp: 0, steps: ["Expand: $\\mathrm{Cov}(aX+bY,\\,Y-Z)=a\\mathrm{Cov}(X,Y)-a\\mathrm{Cov}(X,Z)+b\\mathrm{Var}(Y)-b\\mathrm{Cov}(Y,Z)$.", "$=(" + a + ")(" + cxy + ")-(" + a + ")(" + cxz + ")+(" + b + ")(" + vy + ")-(" + b + ")(" + cyz + ")=" + vv + "$."] }; }
      const d = pk(r, [1, -1, 2]), v = a * vx + (a * d + b) * cxy + b * d * vy;
      return { w: 3, q: "$\\mathrm{Var}(X)=" + vx + "$, $\\mathrm{Var}(Y)=" + vy + "$, $\\mathrm{Cov}(X,Y)=" + cxy + "$. Find $\\mathrm{Cov}(" + (a === 1 ? "" : a === -1 ? "-" : a) + "X" + sg(b) + "Y,\\ X" + sg(d) + "Y)$.", v, dp: 0, steps: ["$\\mathrm{Cov}(aX+bY,X+dY)=a\\mathrm{Var}X+(ad+b)\\mathrm{Cov}(X,Y)+bd\\,\\mathrm{Var}Y$.", "$=(" + a + ")(" + vx + ")+(" + (a * d + b) + ")(" + cxy + ")+(" + b * d + ")(" + vy + ")=" + v + "$."] };
    } },

  { id: "jointcov", w: 3, name: "Cov and ρ from a table", desc: "E[XY], covariance and correlation from a joint PMF",
    gen(r) {
      const xs = pk(r, [[0, 1], [1, 2]]), ys = pk(r, [[0, 1, 2], [1, 2, 3], [-1, 0, 1]]);
      const u = parts(r, 6, 20, 1, 7), P = (i, j) => u[i * 3 + j] / 20;
      const tbl = jtable(xs, ys, (i, j) => nf(P(i, j), 2));
      const fx = xs.map((_, i) => P(i, 0) + P(i, 1) + P(i, 2)), fy = ys.map((_, j) => P(0, j) + P(1, j));
      const EX = xs.reduce((a, x, i) => a + x * fx[i], 0), EY = ys.reduce((a, y, j) => a + y * fy[j], 0);
      let EXY = 0; xs.forEach((x, i) => ys.forEach((y, j) => { EXY += x * y * P(i, j); }));
      const cov = EXY - EX * EY;
      const VX = xs.reduce((a, x, i) => a + x * x * fx[i], 0) - EX * EX, VY = ys.reduce((a, y, j) => a + y * y * fy[j], 0) - EY * EY;
      const base = ["$f_X=(" + fx.map(x => nf(x, 2)).join(",") + ")$, $f_Y=(" + fy.map(x => nf(x, 2)).join(",") + ")$; $E[X]=" + nf(EX, 3) + "$, $E[Y]=" + nf(EY, 3) + "$.", "$E[XY]=\\sum xy\\,f_{XY}(x,y)=" + nf(EXY, 4) + "$.", "$\\mathrm{Cov}=E[XY]-E[X]E[Y]=" + nf(EXY, 4) + "-" + nf(EX * EY, 4) + "=" + nf(cov, 4) + "$."];
      if (r() < 0.6) return { w: 3, q: "The joint PMF of $X$ and $Y$ is" + tbl + "Find $\\mathrm{Cov}(X,Y)$. " + dpText(3), v: cov, dp: 3, steps: base };
      const rho = cov / Math.sqrt(VX * VY);
      return { w: 3, q: "The joint PMF of $X$ and $Y$ is" + tbl + "Find $\\rho(X,Y)$. " + dpText(2), v: rho, dp: 2, steps: base.concat(["$\\mathrm{Var}(X)=" + nf(VX, 4) + "$, $\\mathrm{Var}(Y)=" + nf(VY, 4) + "$.", "$\\rho=\\dfrac{" + nf(cov, 4) + "}{\\sqrt{" + nf(VX, 4) + "\\times" + nf(VY, 4) + "}}=" + nf(rho, 4) + "$."]) };
    } },

  /* ---------- Week 4 ---------- */
  { id: "pdfk", w: 4, name: "Normalising constants", desc: "Find k (or an end point) so a PDF integrates to 1",
    gen(r) {
      const type = ri(r, 0, 3);
      if (type === 0) { const n = ri(r, 1, 3), b = ri(r, 1, 3), k = (n + 1) / Math.pow(b, n + 1);
        if (r() < 0.5) return { w: 4, q: "$f_X(x)=kx^{" + n + "}$ for $0\\le x\\le" + b + "$ and 0 otherwise. Find $k$. " + dpText(4), v: k, dp: 4, steps: ["$\\int_0^{" + b + "}kx^{" + n + "}dx=k\\dfrac{" + b + "^{" + (n + 1) + "}}{" + (n + 1) + "}=1$.", "$k=\\dfrac{" + (n + 1) + "}{" + Math.pow(b, n + 1) + "}=" + nf(k, 5) + "$."] };
        const t = +(b * pk(r, [0.25, 0.5, 0.75])).toFixed(2), v = Math.pow(t / b, n + 1);
        return { w: 4, q: "$f_X(x)=kx^{" + n + "}$ for $0\\le x\\le" + b + "$ and 0 otherwise. Find $P(X\\le" + t + ")$. " + dpText(3), v, dp: 3, steps: ["$k=" + fr(n + 1, Math.pow(b, n + 1)) + "$ from the total area.", "$P(X\\le t)=\\int_0^t kx^{" + n + "}dx=(t/" + b + ")^{" + (n + 1) + "}=(" + nf(t / b, 3) + ")^{" + (n + 1) + "}=" + nf(v, 4) + "$."] }; }
      if (type === 1) { const b = ri(r, 2, 12), k = 2 / (b * b);
        return { w: 4, q: "A waiting time $X$ (minutes) has PDF $f_X(x)=k(" + b + "-x)$ for $0\\lt x\\lt" + b + "$, 0 otherwise. Find $k$. " + dpText(4), v: k, dp: 4, steps: ["The graph is a triangle with base $" + b + "$ and height $" + b + "k$.", "Area $=\\tfrac12\\cdot" + b + "\\cdot" + b + "k=1\\Rightarrow k=\\dfrac{2}{" + b * b + "}=" + nf(k, 5) + "$."] }; }
      if (type === 2) { const a = ri(r, 1, 3), b = a + ri(r, 1, 3), k = 1 / (a * a / 2 + a * (b - a));
        return { w: 4, q: "$f_X(x)=kx$ for $0\\le x\\lt" + a + "$, $f_X(x)=" + a + "k$ for $" + a + "\\le x\\lt" + b + "$, and 0 otherwise. Find $k$. " + dpText(4), v: k, dp: 4, steps: ["Triangle: $\\int_0^{" + a + "}kx\\,dx=" + nf(a * a / 2, 2) + "k$.", "Rectangle: $" + a + "k\\times" + (b - a) + "=" + a * (b - a) + "k$.", "$" + nf(a * a / 2 + a * (b - a), 2) + "k=1\\Rightarrow k=" + nf(k, 5) + "$."] }; }
      const c = pk(r, [2, 8, 18, 32, 50]), a = Math.sqrt(2 * c);
      return { w: 4, q: "$f_X(x)=\\dfrac{x}{" + c + "}$ for $0\\lt x\\lt a$ and 0 otherwise is a valid PDF. Find $a$.", v: a, dp: 0, steps: ["$\\int_0^a \\frac{x}{" + c + "}dx=\\dfrac{a^2}{" + 2 * c + "}=1$.", "$a=\\sqrt{" + 2 * c + "}=" + a + "$."] };
    } },

  { id: "cdfcond", w: 4, name: "CDF and conditional", desc: "From a CDF like x²/b²: conditional probabilities, median, PDF values",
    gen(r) {
      const n = pk(r, [2, 3]), b = ri(r, 2, 6), B = Math.pow(b, n), F = x => Math.pow(x, n) / B;
      const cdf = "F_X(x)=\\begin{cases}0,&x\\lt0\\\\ \\dfrac{x^{" + n + "}}{" + B + "},&0\\le x\\le" + b + "\\\\ 1,&x\\gt" + b + "\\end{cases}";
      const intro = "A random variable $X$ has CDF $" + cdf + "$ ";
      const type = ri(r, 0, 3);
      if (type === 0) { let s = ri(r, 1, b - 1), t = ri(r, s + 1, b); if (t === s) t = b;
        const v = (F(t) - F(s)) / F(t);
        return { w: 4, q: intro + "Find $P(X\\gt" + s + "\\mid X\\lt" + t + ")$. " + dpText(3), v, dp: 3, steps: ["$P(" + s + "\\lt X\\lt" + t + ")=F(" + t + ")-F(" + s + ")=\\dfrac{" + Math.pow(t, n) + "-" + Math.pow(s, n) + "}{" + B + "}$.", "$P(X\\lt" + t + ")=\\dfrac{" + Math.pow(t, n) + "}{" + B + "}$.", "Ratio: $\\dfrac{" + (Math.pow(t, n) - Math.pow(s, n)) + "}{" + Math.pow(t, n) + "}=" + nf(v, 4) + "$."] }; }
      if (type === 1) { if (b < 3) return this.gen(r);
        const s = ri(r, 1, b - 2), t2 = s + 1, v = (1 - F(t2)) / (1 - F(s));
        return { w: 4, q: intro + "Find $P(X\\gt" + t2 + "\\mid X\\gt" + s + ")$. " + dpText(3), v, dp: 3, steps: ["$\\{X\\gt" + t2 + "\\}\\subset\\{X\\gt" + s + "\\}$.", "$\\dfrac{1-F(" + t2 + ")}{1-F(" + s + ")}=\\dfrac{" + (B - Math.pow(t2, n)) + "}{" + (B - Math.pow(s, n)) + "}=" + nf(v, 4) + "$."] }; }
      if (type === 2) { const m = b * Math.pow(0.5, 1 / n);
        return { w: 4, q: intro + "Find the median of $X$. " + dpText(3), v: m, dp: 3, steps: ["Solve $F(m)=0.5$: $m^{" + n + "}=" + B / 2 + "$.", "$m=" + b + "\\cdot0.5^{1/" + n + "}=" + nf(m, 4) + "$."] }; }
      const x0 = +(b * pk(r, [0.25, 0.5, 0.75])).toFixed(2), v = n * Math.pow(x0, n - 1) / B;
      return { w: 4, q: intro + "Find the value of the PDF at $x=" + x0 + "$. " + dpText(3), v, dp: 3, steps: ["$f_X(x)=F_X'(x)=\\dfrac{" + n + "x^{" + (n - 1) + "}}{" + B + "}$ on $[0," + b + "]$.", "$f_X(" + x0 + ")=" + nf(v, 4) + "$."] };
    } },

  { id: "named", w: 4, name: "Uniform, exponential, normal", desc: "Interval and conditional probabilities for named distributions",
    gen(r) {
      const type = ri(r, 0, 4);
      if (type === 0) { const a = pk(r, [0, 0, 5, 10, -10]), L = pk(r, [10, 20, 40, 50]), b = a + L, s = a + L * pk(r, [0.25, 0.5]), t = a + L * pk(r, [0.6, 0.75]);
        return { w: 4, q: "$X\\sim\\text{Uniform}[" + a + "," + b + "]$. Find $P(X\\gt" + t + "\\mid X\\gt" + s + ")$. " + dpText(2), v: (b - t) / (b - s), dp: 2, steps: ["Given $X\\gt" + s + "$, $X$ is uniform on $[" + s + "," + b + "]$.", "$P=\\dfrac{" + b + "-" + t + "}{" + b + "-" + s + "}=" + nf((b - t) / (b - s), 4) + "$."] }; }
      if (type === 1) { const a = pk(r, [-10, -6, -4, 0]), b = pk(r, [6, 10, 14, 20]), c = ri(r, 1, Math.min(-a, b) || 3), L = b - a;
        const lo = Math.max(a, -c), hi = Math.min(b, c);
        return { w: 4, q: "$X\\sim\\text{Uniform}[" + a + "," + b + "]$. Find $P(|X|\\lt" + c + ")$. " + dpText(2), v: (hi - lo) / L, dp: 2, steps: ["$|X|\\lt" + c + "$ is $" + (-c) + "\\lt X\\lt" + c + "$; overlap with $[" + a + "," + b + "]$ is $(" + lo + "," + hi + ")$.", "$P=\\dfrac{" + (hi - lo) + "}{" + L + "}=" + nf((hi - lo) / L, 4) + "$."] }; }
      if (type === 2) { const m = pk(r, [2, 4, 5, 8, 10, 20]), s = m * pk(r, [0.5, 1]), t = s + m * pk(r, [0.5, 1, 2]), v = Math.exp(-s / m) - Math.exp(-t / m);
        return { w: 4, q: "A component's lifetime $X$ (years) is exponential with mean $" + m + "$. Find $P(" + s + "\\lt X\\lt" + t + ")$. " + dpText(3), v, dp: 3, steps: ["Mean $" + m + "$ ⇒ $\\lambda=1/" + m + "$.", "$P=e^{-" + s + "/" + m + "}-e^{-" + t + "/" + m + "}=" + nf(Math.exp(-s / m), 4) + "-" + nf(Math.exp(-t / m), 4) + "=" + nf(v, 4) + "$."] }; }
      if (type === 3) { const l = pk(r, [0.1, 0.2, 0.25, 0.5, 2]), s = pk(r, [1, 2, 3, 4]), t = pk(r, [1, 2, 3, 5]), v = Math.exp(-l * t);
        return { w: 4, q: "$X\\sim\\text{Exp}(" + l + ")$. Find $P(X\\gt" + (s + t) + "\\mid X\\gt" + s + ")$. " + dpText(3), v, dp: 3, steps: ["Memoryless: $P(X\\gt" + (s + t) + "\\mid X\\gt" + s + ")=P(X\\gt" + t + ")$.", "$=e^{-" + l + "\\times" + t + "}=" + nf(v, 4) + "$."] }; }
      const Z = { "-2": 0.02275, "-1.5": 0.06681, "-1": 0.15866, "-0.5": 0.30854, "0": 0.5, "0.5": 0.69146, "1": 0.84134, "1.5": 0.93319, "2": 0.97725 };
      const mu = pk(r, [10, 20, 30, 50, 60, 100]), sg = pk(r, [2, 3, 4, 5, 10]);
      const zs = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
      let za = pk(r, zs), zb = pk(r, zs); if (za === zb) zb = za < 1 ? za + 1 : za - 1; if (za > zb) [za, zb] = [zb, za];
      const xa = mu + za * sg, xb = mu + zb * sg, sub = ri(r, 0, 1);
      const given = "Use $F_Z(" + za + ")=" + Z[String(za)] + "$ and $F_Z(" + zb + ")=" + Z[String(zb)] + "$, where $F_Z$ is the standard normal CDF.";
      if (sub === 0) { const v = Z[String(zb)] - Z[String(za)];
        return { w: 4, q: "$X\\sim\\text{Normal}(" + mu + "," + sg * sg + ")$. Find $P(" + xa + "\\lt X\\lt" + xb + ")$. " + given + " " + dpText(4), v, dp: 4, steps: ["$\\sigma=\\sqrt{" + sg * sg + "}=" + sg + "$.", "$z=\\frac{" + xa + "-" + mu + "}{" + sg + "}=" + za + "$ and $\\frac{" + xb + "-" + mu + "}{" + sg + "}=" + zb + "$.", "$P=F_Z(" + zb + ")-F_Z(" + za + ")=" + nf(v, 5) + "$."] }; }
      const v = (Z[String(zb)] - Z[String(za)]) / Z[String(zb)];
      return { w: 4, q: "$X\\sim\\text{Normal}(" + mu + "," + sg * sg + ")$. Find $P(X\\gt" + xa + "\\mid X\\lt" + xb + ")$. " + given + " " + dpText(3), v, dp: 3, steps: ["$\\sigma=" + sg + "$; standardise: $" + xa + "\\to" + za + "$, $" + xb + "\\to" + zb + "$.", "$\\dfrac{F_Z(" + zb + ")-F_Z(" + za + ")}{F_Z(" + zb + ")}=\\dfrac{" + nf(Z[String(zb)] - Z[String(za)], 5) + "}{" + Z[String(zb)] + "}=" + nf(v, 4) + "$."] };
    } }
];
