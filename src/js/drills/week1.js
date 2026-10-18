/* ---------- Week 1 drills: joint, marginal and conditional distributions ---------- */
DRILLS.push(
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

  { id: "counting", w: 1, name: "Counting experiments", desc: "Joint PMF values from digits, cards, urns and coins",
    gen(r) {
      const type = ri(r, 0, 3);
      if (type === 0) {
        const m = ri(r, 3, 9), a = ri(r, 0, 9), b = ri(r, 0, m - 1), hits = [];
        for (let n = 0; n < 100; n++) if (n % 10 === a && n % m === b) hits.push(n);
        const pad = n => (n < 10 ? "0" : "") + n;
        return { w: 1, q: "A number from 00 to 99 is chosen uniformly at random. $X$ is its units digit and $Y$ is the remainder when it is divided by $" + m + "$. Find $P(X=" + a + ",\\ Y=" + b + ")$. " + dpText(2), v: hits.length / 100, dp: 2,
          steps: ["Numbers ending in " + a + ": " + pad(a) + ", " + pad(10 + a) + ", …, " + (90 + a) + ".", "Those leaving remainder " + b + " on division by " + m + ": " + (hits.map(pad).join(", ") || "none") + ".", "$P=" + hits.length + "/100=" + nf(hits.length / 100, 2) + "$."] };
      }
      if (type === 1) {
        const n = pk(r, [3, 4]), a = ri(r, 0, 2), b = ri(r, 0, n - a > 2 ? 2 : n - a), rest = n - a - b;
        const v = C(4, a) * C(4, b) * C(44, rest) / C(52, n);
        return { w: 1, q: "$" + n + "$ cards are drawn from a well-shuffled deck of 52. $X$ = number of kings, $Y$ = number of queens. Find $f_{XY}(" + a + "," + b + ")$. " + dpText(4), v, dp: 4,
          steps: ["Choose the kings, the queens, and the other cards from the 44 that are neither.", "$\\dfrac{\\binom4{" + a + "}\\binom4{" + b + "}\\binom{44}{" + rest + "}}{\\binom{52}{" + n + "}}=\\dfrac{" + C(4, a) * C(4, b) * C(44, rest) + "}{" + C(52, n) + "}=" + nf(v, 5) + "$."] };
      }
      if (type === 2) {
        const R = ri(r, 3, 6), Wh = ri(r, 2, 5), G = ri(r, 2, 4), N = R + Wh + G, a = ri(r, 0, 2), b = ri(r, 0, 3 - a), c = 3 - a - b;
        const v = C(R, a) * C(Wh, b) * C(G, c) / C(N, 3);
        return { w: 1, q: "An urn has " + R + " red, " + Wh + " white and " + G + " green balls. Three are drawn without replacement. $X$ = red drawn, $Y$ = white drawn. Find $P(X=" + a + ",Y=" + b + ")$. " + dpText(3), v, dp: 3,
          steps: ["The remaining " + c + " ball" + (c === 1 ? " is" : "s are") + " green.", "$\\dfrac{\\binom{" + R + "}{" + a + "}\\binom{" + Wh + "}{" + b + "}\\binom{" + G + "}{" + c + "}}{\\binom{" + N + "}{3}}=\\dfrac{" + C(R, a) * C(Wh, b) * C(G, c) + "}{" + C(N, 3) + "}=" + nf(v, 4) + "$."] };
      }
      const p = pk(r, [0.5, 0.4, 0.6, 0.3]), first = r() < 0.5 ? 1 : 2, a = ri(r, 0, first), y = ri(r, a, a + (3 - first));
      const q = +(1 - p).toFixed(1), v = C(first, a) * Math.pow(p, a) * Math.pow(q, first - a) * C(3 - first, y - a) * Math.pow(p, y - a) * Math.pow(q, 3 - first - (y - a));
      return { w: 1, q: "A coin with $P(\\text{head})=" + p + "$ is tossed three times. $X$ = heads in the first " + (first === 1 ? "toss" : "two tosses") + ", $Y$ = total heads. Find $f_{XY}(" + a + "," + y + ")$. " + dpText(3), v, dp: 3,
        steps: ["$X=" + a + "$ heads in the first " + first + ", and $" + (y - a) + "$ head" + (y - a === 1 ? "" : "s") + " in the last " + (3 - first) + ".", "$\\binom{" + first + "}{" + a + "}" + p + "^{" + a + "}" + q + "^{" + (first - a) + "}\\cdot\\binom{" + (3 - first) + "}{" + (y - a) + "}" + p + "^{" + (y - a) + "}" + q + "^{" + (3 - first - y + a) + "}=" + nf(v, 4) + "$."] };
    } }
);
