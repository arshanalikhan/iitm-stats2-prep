/* ---------- Week 4 drills: CDF, PDF and named continuous distributions ---------- */
DRILLS.push(
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
    } },

  { id: "discretecdf", w: 4, name: "Discrete CDF", desc: "Read PMF values and probabilities off a staircase CDF",
    gen(r) {
      const vals = [ri(r, -2, 0)]; while (vals.length < 4) vals.push(vals[vals.length - 1] + ri(r, 1, 3));
      const u = parts(r, 4, 20, 1, 9), pr = u.map(x => x / 20), cum = []; pr.reduce((a, x, i) => (cum[i] = +(a + x).toFixed(2)), 0);
      let cdf = "F(x)=\\begin{cases}0,&x\\lt" + vals[0];
      for (let i = 0; i < 4; i++) cdf += "\\\\ " + nf(cum[i], 2) + ",&" + (i < 3 ? vals[i] + "\\le x\\lt" + vals[i + 1] : "x\\ge" + vals[i]);
      cdf += "\\end{cases}";
      const type = ri(r, 0, 2), i = ri(r, 1, 3);
      if (type === 0) return { w: 4, q: "A discrete random variable has CDF $" + cdf + "$. Find $P(X=" + vals[i] + ")$. " + dpText(2), v: pr[i], dp: 2, steps: ["$P(X=" + vals[i] + ")$ is the jump at " + vals[i] + ": $" + nf(cum[i], 2) + "-" + nf(cum[i - 1], 2) + "=" + nf(pr[i], 2) + "$."] };
      if (type === 1) { const j = ri(r, 0, i - 1), v = (1 - (i ? cum[i - 1] : 0)) / (1 - (j ? cum[j - 1] : 0));
        return { w: 4, q: "A discrete random variable has CDF $" + cdf + "$. Find $P(X\\ge" + vals[i] + "\\mid X\\ge" + vals[j] + ")$. " + dpText(2), v, dp: 2, steps: ["$P(X\\ge" + vals[i] + ")=1-F(\\text{just below }" + vals[i] + ")=1-" + nf(cum[i - 1], 2) + "$.", "$P(X\\ge" + vals[j] + ")=1-" + nf(j ? cum[j - 1] : 0, 2) + "$.", "Ratio $=" + nf(v, 4) + "$."] }; }
      const t = vals[i] + 0.5, s = vals[0] - 0.5 + ri(r, 0, 1), F = x => { let c = 0; vals.forEach((vv, k) => { if (x >= vv) c = cum[k]; }); return c; }, v = F(t) - F(s);
      return { w: 4, q: "A discrete random variable has CDF $" + cdf + "$. Find $P(" + s + "\\lt X\\le" + t + ")$. " + dpText(2), v, dp: 2, steps: ["$P(a\\lt X\\le b)=F(b)-F(a)$.", "$F(" + t + ")-F(" + s + ")=" + nf(F(t), 2) + "-" + nf(F(s), 2) + "=" + nf(v, 2) + "$."] };
    } },

  { id: "pdfprob", w: 4, name: "Probability from a PDF", desc: "Interval and conditional probabilities from piecewise and polynomial PDFs",
    gen(r) {
      const type = ri(r, 0, 2);
      if (type === 0) {
        // f = c on [0,1), 2c on [1,3), 3c on [3,4] with c = 1/8
        const t = pk(r, [0.5, 1.5, 2.5, 3.5]);
        const cc = 1 / 8, F = x => x <= 1 ? cc * x : x <= 3 ? cc + 2 * cc * (x - 1) : 5 * cc + 3 * cc * (x - 3), sub = r() < 0.5;
        if (sub) return { w: 4, q: "$f(x)=c$ on $[0,1)$, $2c$ on $[1,3)$, $3c$ on $[3,4]$, 0 otherwise. Find $P(X\\lt" + t + ")$. " + dpText(3), v: F(t), dp: 3, steps: ["Area: $c+4c+3c=8c=1$, so $c=\\tfrac18$.", "$P(X\\lt" + t + ")$ = area to the left of " + t + " $=" + nf(F(t), 4) + "$."] };
        const s = pk(r, [0.5, 1]), u = pk(r, [2, 3.5]), v = (F(u) - F(s)) / (1 - F(s));
        return { w: 4, q: "$f(x)=c$ on $[0,1)$, $2c$ on $[1,3)$, $3c$ on $[3,4]$, 0 otherwise. Find $P(X\\lt" + u + "\\mid X\\gt" + s + ")$. " + dpText(3), v, dp: 3, steps: ["$c=\\tfrac18$ from the total area.", "$P(" + s + "\\lt X\\lt" + u + ")=" + nf(F(u) - F(s), 4) + "$ and $P(X\\gt" + s + ")=" + nf(1 - F(s), 4) + "$.", "Ratio $=" + nf(v, 4) + "$."] };
      }
      if (type === 1) {
        const s = pk(r, [0.25, 0.5, 0.75]), t = pk(r, [1.25, 1.5, 1.75]), F = x => x <= 1 ? x * x / 2 : 1 - (2 - x) * (2 - x) / 2, v = F(t) - F(s);
        return { w: 4, q: "$X$ has the triangular PDF $f(x)=x$ on $[0,1]$, $2-x$ on $[1,2]$, 0 otherwise. Find $P(" + s + "\\lt X\\lt" + t + ")$. " + dpText(3), v, dp: 3, steps: ["Left of " + s + ": a triangle of area $\\tfrac12(" + s + ")^2=" + nf(F(s), 4) + "$.", "Right of " + t + ": a triangle of area $\\tfrac12(2-" + t + ")^2=" + nf(1 - F(t), 4) + "$.", "$P=1-" + nf(F(s), 4) + "-" + nf(1 - F(t), 4) + "=" + nf(v, 4) + "$."] };
      }
      const b = ri(r, 3, 8), s = ri(r, 1, b - 2), t = ri(r, s + 1, b - 1), F = x => 1 - (b - x) * (b - x) / (b * b), v = (F(t) - F(s)) / (1 - F(s));
      return { w: 4, q: "$f(x)=\\dfrac{2(" + b + "-x)}{" + b * b + "}$ for $0\\lt x\\lt" + b + "$. Find $P(X\\lt" + t + "\\mid X\\gt" + s + ")$. " + dpText(3), v, dp: 3, steps: ["$P(X\\gt x)=\\left(\\frac{" + b + "-x}{" + b + "}\\right)^2$ (a smaller similar triangle).", "$P(" + s + "\\lt X\\lt" + t + ")=\\frac{" + ((b - s) * (b - s) - (b - t) * (b - t)) + "}{" + b * b + "}$, $P(X\\gt" + s + ")=\\frac{" + (b - s) * (b - s) + "}{" + b * b + "}$.", "Ratio $=\\frac{" + ((b - s) * (b - s) - (b - t) * (b - t)) + "}{" + (b - s) * (b - s) + "}=" + nf(v, 4) + "$."] };
    } }
);
