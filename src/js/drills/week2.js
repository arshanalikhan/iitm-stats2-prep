/* ---------- Week 2 drills: independence, functions, sums, max/min ---------- */
DRILLS.push(
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

  { id: "indep", w: 2, name: "Independence check", desc: "Fill a joint table so that X and Y are independent",
    gen(r) {
      const s = pk(r, [0.2, 0.25, 0.4, 0.5, 0.6]), qu = parts(r, 3, 10, 1, 6), q = qu.map(x => x / 10);
      const row0 = q.map(x => +(s * x).toFixed(4)), row1 = q.map(x => +((1 - s) * x).toFixed(4)), j = ri(r, 1, 2);
      const tbl = jtable([0, 1], [0, 1, 2], (i, k) => i === 0 ? nf(row0[k], 4) : k === 0 ? nf(row1[0], 4) : k === j ? "?" : "·");
      return { w: 2, q: "$X$ and $Y$ are independent. Part of their joint PMF is" + tbl + "Find the cell marked ?. " + dpText(3), v: row1[j], dp: 3,
        steps: ["Independent ⇒ every row is proportional to the column totals, so row 1 = row 0 × (" + nf(row1[0], 4) + " / " + nf(row0[0], 4) + ").", "Ratio $=" + nf(row1[0] / row0[0], 4) + "$, so the cell is $" + nf(row0[j], 4) + "\\times" + nf(row1[0] / row0[0], 4) + "=" + nf(row1[j], 4) + "$.", "Check: $f_X(0)=" + nf(s, 2) + "$ and $f_X(1)=" + nf(1 - s, 2) + "$ add to 1."] };
    } }
);
