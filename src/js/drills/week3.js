/* ---------- Week 3 drills: expectation, variance, covariance, bounds ---------- */
DRILLS.push(
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

  { id: "linearity", w: 3, name: "Linearity and indicators", desc: "Expected prizes, counts and sums without listing outcomes",
    gen(r) {
      const type = ri(r, 0, 3);
      if (type === 0) {
        const N = pk(r, [200, 250, 300, 400, 500]), pr = [pk(r, [1000, 1500, 2000]), pk(r, [500, 600, 1000])], k = ri(r, 2, 4), tot = pr[0] + pr[1];
        return { w: 3, q: "A raffle has " + N + " tickets: one wins ₹" + pr[0] + ", one wins ₹" + pr[1] + ", the rest win nothing. You get " + k + " tickets at random. Find your expected winnings in ₹. " + dpText(2), v: k * tot / N, dp: 2,
          steps: ["Each ticket you hold has mean prize $\\frac{" + tot + "}{" + N + "}=" + nf(tot / N, 4) + "$.", "Linearity (works without replacement): $" + k + "\\times" + nf(tot / N, 4) + "=" + nf(k * tot / N, 4) + "$."] };
      }
      if (type === 1) {
        const m = pk(r, [4, 6, 8]), n = ri(r, 2, 4), v = m * (1 - Math.pow((m - 1) / m, n));
        return { w: 3, q: "A fair " + m + "-sided die is rolled " + n + " times. Find the expected number of different faces that appear. " + dpText(2), v, dp: 2,
          steps: ["Indicator for each face: it appears with probability $1-\\left(\\frac{" + (m - 1) + "}{" + m + "}\\right)^{" + n + "}$.", "Add over the " + m + " faces: $" + m + "\\left(1-\\left(\\frac{" + (m - 1) + "}{" + m + "}\\right)^{" + n + "}\\right)=" + nf(v, 4) + "$."] };
      }
      if (type === 2) {
        const N = pk(r, [10, 12, 20, 30]), k = ri(r, 3, 6), v = k * (N + 1) / 2;
        return { w: 3, q: "Balls numbered 1 to " + N + " are in a bag; " + k + " are drawn without replacement. Find the expected sum of the numbers drawn. " + dpText(1), v, dp: 1,
          steps: ["Each drawn ball has mean $\\frac{" + N + "+1}{2}=" + nf((N + 1) / 2, 2) + "$.", "$" + k + "\\times" + nf((N + 1) / 2, 2) + "=" + nf(v, 2) + "$."] };
      }
      const l = pk(r, [20, 30, 40, 60]), prices = [pk(r, [20, 30]), pk(r, [40, 50]), pk(r, [80, 100])], u = parts(r, 3, 10, 1, 6), pr = u.map(x => x / 10);
      const m = prices.reduce((a, x, i) => a + x * pr[i], 0);
      return { w: 3, q: "Customers per day at a stall are Poisson($" + l + "$). Each spends ₹" + prices.join(", ₹") + " with probabilities " + pr.map(x => nf(x, 1)).join(", ") + ". Find the expected daily takings in ₹. " + dpText(1), v: l * m, dp: 1,
        steps: ["Mean spend per customer: $" + prices.map((x, i) => x + "(" + nf(pr[i], 1) + ")").join("+") + "=" + nf(m, 2) + "$.", "Expected takings $=\\lambda\\times" + nf(m, 2) + "=" + nf(l * m, 2) + "$."] };
    } },

  { id: "varcomb", w: 3, name: "Variance combinations", desc: "Var(aX + bY), Var(XY), E[(X + Y)²], binomial from mean and variance",
    gen(r) {
      const type = ri(r, 0, 3), ex = ri(r, 1, 6), vx = ri(r, 1, 5), ey = ri(r, 1, 6), vy = ri(r, 1, 5);
      const intro = "$X$ and $Y$ are independent with $E[X]=" + ex + "$, $\\mathrm{Var}(X)=" + vx + "$, $E[Y]=" + ey + "$, $\\mathrm{Var}(Y)=" + vy + "$. ";
      if (type === 0) { const v = (vx + ex * ex) * (vy + ey * ey) - ex * ex * ey * ey;
        return { w: 3, q: intro + "Find $\\mathrm{Var}(XY)$.", v, dp: 0, steps: ["$E[X^2]=" + vx + "+" + ex * ex + "=" + (vx + ex * ex) + "$, $E[Y^2]=" + (vy + ey * ey) + "$.", "$\\mathrm{Var}(XY)=E[X^2]E[Y^2]-(E[X]E[Y])^2=" + (vx + ex * ex) * (vy + ey * ey) + "-" + ex * ex * ey * ey + "=" + v + "$."] }; }
      if (type === 1) { const v = vx + vy + (ex + ey) * (ex + ey);
        return { w: 3, q: intro + "Find $E[(X+Y)^2]$.", v, dp: 0, steps: ["$E[(X+Y)^2]=\\mathrm{Var}(X+Y)+(E[X+Y])^2$.", "$=(" + vx + "+" + vy + ")+(" + ex + "+" + ey + ")^2=" + v + "$."] }; }
      if (type === 2) { const a = pk(r, [2, 3, 4, -2]), b = pk(r, [2, 3, -1, -3]), c = ri(r, 1, 9), v = a * a * vx + b * b * vy;
        return { w: 3, q: intro + "Find $\\mathrm{Var}(" + a + "X" + (b < 0 ? "" : "+") + b + "Y+" + c + ")$.", v, dp: 0, steps: ["Independent: $\\mathrm{Var}(aX+bY+c)=a^2\\mathrm{Var}X+b^2\\mathrm{Var}Y$.", "$" + a * a + "(" + vx + ")+" + b * b + "(" + vy + ")=" + v + "$."] }; }
      const n = pk(r, [8, 10, 12, 16, 20]), p = pk(r, [0.25, 0.5, 0.75]), mu = n * p, s2 = n * p * (1 - p);
      return { w: 3, q: "$X\\sim\\text{Binomial}(n,p)$ with $E[X]=" + nf(mu, 2) + "$ and $\\mathrm{Var}(X)=" + nf(s2, 3) + "$. Find $n$.", v: n, dp: 0, steps: ["$\\frac{\\mathrm{Var}}{E}=1-p=" + nf(s2 / mu, 3) + "$, so $p=" + nf(p, 2) + "$.", "$n=E[X]/p=" + nf(mu, 2) + "/" + nf(p, 2) + "=" + n + "$."] };
    } }
);
