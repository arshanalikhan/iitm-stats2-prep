"""Turn the hand tags of past Quiz 1 questions into src/data/patterns-data.js.
Usage: python tools/analysis/qp_stats.py
Inputs: raw/qp/items.json (from qp_sheets.py) and raw/qp/tags.tsv (k <TAB> code <TAB> note, one line per distinct question).
Output: PAT = { sittings, papers, distinct, patterns: [{c, w, name, desc, trap, drill, m: {date: marks}, n}] , weeks: {date: {week: marks}} }
Only counts and my own pattern descriptions are published; no question text."""
import collections, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
QP = os.path.join(ROOT, "raw", "qp")
items = json.load(open(os.path.join(QP, "items.json"), encoding="utf-8"))
tags = {}
for line in open(os.path.join(QP, "tags.tsv"), encoding="utf-8"):
    k, c, note = line.rstrip("\n").split("\t")
    tags[int(k)] = c
# fill-in-the-blank sets: count them under the topic they test
FB_TOPIC = {572: "J1", 681: "M1", 710: "P2"}

CAT = {
    "J1": (1, "Probability from a joint table", "Read event, marginal or conditional probabilities off a joint PMF table; often fill missing cells from given marginals first.", "Divide by the probability of the condition, not of the event.", "jointcond"),
    "J2": (1, "Joint PMF given by a formula", "f(x,y) = (ax + by)/k on a small grid: find k, pick the matching table, then a marginal or conditional.", "Build the full table before answering; k cancels in conditionals.", "formulak"),
    "J3": (1, "Joint PMF of a counting experiment", "Coins, dice, cards, balls, two-digit numbers or a two-stage choice: write down the joint PMF or one value of it.", "Count the 'everything else' items; without replacement means hypergeometric.", "counting"),
    "J4": (1, "Conditional distribution", "Conditional PMF or probability given X = x or given an event, from a table or a formula.", "The conditional range can be smaller than the full range.", "jointcond"),
    "J5": (1, "Chain rule with three variables", "Given a joint value, a marginal and a conditional, find the missing conditional.", "Only split f_YZ into f_Y f_Z if Y and Z are independent.", "chain"),
    "J6": (1, "Random number of trials (two-stage)", "A Poisson or random count N, then binomial successes: conditional binomial, Poisson splitting, P(X = Y).", "The split count is Poisson(λp); f_NX(n, k) = 0 when k > n.", "poisson"),
    "I1": (2, "Independence check", "Decide independence from a table, or find the unknown that makes X and Y independent.", "One failing cell proves dependence; one matching cell proves nothing.", "indep"),
    "F1": (2, "Function of one variable", "Range and PMF of g(X).", "Add the probabilities of every x that maps to the same value.", "funcsum"),
    "F2": (2, "Function of two variables", "PMF or range of X + Y, X − Y, |X − Y|, XY, X²Y and similar, from a table or independent PMFs.", "List every pair; check the PMF adds to 1.", "funcsum"),
    "F3": (2, "Sum of independent named variables", "Poisson + Poisson, binomial + binomial, geometric + geometric.", "Geometric + geometric is not geometric: P(S = n) = (n − 1)p²(1 − p)^(n−2).", "funcsum"),
    "F4": (2, "Conditioning on a sum", "X given X + Y = n for independent Poissons (binomial) or Bernoullis.", "Use λ₁/(λ₁ + λ₂) for the share of X, not of Y.", "bernsum"),
    "M1": (2, "Max, min and i.i.d. samples", "CDF/PMF of the max or min of dice, uniforms, binomials or geometrics; 'exactly one sample equals…'.", "P(max = k) = F(k)ⁿ − F(k − 1)ⁿ; min uses tails.", "maxmin"),
    "E1": (3, "Expectation from a PMF", "E[X], E[g(X)], E[XY] from a PMF, table, bar chart or a game; unknown probability from a given mean.", "E[g(X)] = Σ g(x)p(x); do not plug E[X] into g.", "expvar"),
    "E2": (3, "Linearity and indicators", "Expected prize from coupons, expected count of girls/ones/matches, E[aX + bY].", "Linearity works with dependence and without replacement.", "linearity"),
    "V1": (3, "Variance", "Var of binomial/uniform/die, Var(aX + b), Var(XY) for independent variables, E[(X + Y)²], n and p from mean and variance.", "Var(aX + b) = a²Var(X); for independent X, Y, Var(XY) = E[X²]E[Y²] − (E[X]E[Y])².", "varcomb"),
    "C1": (3, "Covariance or correlation from a table", "Cov(X, Y) or ρ from a joint table, or the unknown cell that makes Cov = 0.", "Cov = 0 does not mean independent.", "jointcov"),
    "C2": (3, "Covariance algebra and properties", "Cov(aX + bY, cY + dZ) from given covariances; true/false property statements.", "Expand term by term; watch the signs.", "covalg"),
    "B1": (3, "Markov's inequality", "Upper bound P(X ≥ c) ≤ μ/c; sometimes the reverse (find μ from the bound).", "For integer X, P(X > 74) = P(X ≥ 75).", "bounds"),
    "B2": (3, "Chebyshev's inequality", "Lower bound on P(a < X < b) symmetric about μ, the 2σ rule, or the n needed for a sample proportion.", "Use σ² / c² with c the distance from the mean.", "bounds"),
    "D1": (4, "Discrete CDF", "Read PMF values from a CDF, or fill unknowns in a PMF/CDF pair.", "P(X = a) is the jump of F at a.", "discretecdf"),
    "P1": (4, "Normalising a PDF", "Find k, c or an end point a so that a PDF integrates to 1 (polynomial, piecewise, exponential, triangle from a graph).", "Set the area to 1, not the height.", "pdfk"),
    "P2": (4, "Probability from a PDF or CDF", "Interval or conditional probability from a PDF/CDF; pick the PDF that matches a CDF.", "P(A | B) with A inside B is P(A)/P(B).", "pdfprob"),
    "P3": (4, "Uniform, exponential, normal", "Exponential tails, memorylessness and percentiles; uniform conditionals.", "Mean 50 means λ = 1/50.", "named"),
    "P5": (4, "Mean or variance of a continuous variable", "E[X] or Var(X) by integrating x f(x) (rare in Quiz 1).", "Var = E[X²] − (E[X])².", "pdfk"),
    "W0": (0, "Week 0 distributions", "Geometric range, PMF or tail.", "Geometric starts at 1: P(X > k) = (1 − p)^k.", "maxmin"),
}

dates = sorted({it["date"] for it in items})
marks = collections.defaultdict(lambda: collections.defaultdict(float))
weeks = collections.defaultdict(lambda: collections.defaultdict(float))
fb_dates = set()
cur_fb = None
for it in items:
    if it["dup_of"] is not None:
        continue
    c = tags[it["k"]]
    if c == "FB":
        fb_dates.add(it["date"])
        if it["k"] in FB_TOPIC:
            cur_fb = FB_TOPIC[it["k"]]
        c = cur_fb
    marks[c][it["date"]] += it["marks"]
    weeks[it["date"]][CAT[c][0]] += it["marks"]

pats = []
for c, (w, name, desc, trap, drill) in CAT.items():
    m = {d: marks[c][d] for d in dates if marks[c].get(d)}
    pats.append({"c": c, "w": w, "name": name, "desc": desc, "trap": trap, "drill": drill, "m": m, "n": len(m)})
pats.sort(key=lambda p: (-p["n"], -sum(p["m"].values())))
out = {"sittings": dates, "papers": len(json.load(open(os.path.join(QP, "stats2-quizpractice-q1.json"), encoding="utf-8"))["papers"]),
       "distinct": sum(1 for it in items if it["dup_of"] is None), "fb": sorted(fb_dates),
       "patterns": pats, "weeks": {d: dict(weeks[d]) for d in dates}}
js = "/* ---------- Past Quiz 1 pattern statistics ---------- */\n// Generated by tools/analysis/qp_stats.py from hand-tagged past papers (13 sittings, Jun 2022 to Jul 2026). Counts only.\nconst PAT = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
open(os.path.join(ROOT, "src", "data", "patterns-data.js"), "w", encoding="utf-8").write(js)
for p in pats:
    print(f'{p["c"]:3} {p["n"]:2}/13  {sum(p["m"].values()):5.1f}  {p["name"]}')
