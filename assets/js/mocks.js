// Generated from src/ by tools/build_site.py. Edit the source, not this file.
/* ---------- Mock quizzes: 40 marks each, the shape of the real Quiz 1 ---------- */
// Items use the same fields as the practice bank plus m = marks. Items sharing c form a comprehension set.
const MA1 = R`$X$ has PMF` + T("x|0|1|3", "P(X = x)|0.25|0.25|0.5");
const MA2 = R`$X$ and $Y$ are i.i.d. Uniform$\{1,2,3,4,5\}$.`;
const MA3 = R`$X_1,X_2,X_3$ take values in $\{0,1\}$ with joint PMF $f(x_1,x_2,x_3)=k(2+x_1+x_2+x_3)$.`;
const MA4 = R`$X_1,\dots,X_5$ are i.i.d. samples of $X$ with PMF` + T("x|0|1|2|3", "P(X = x)|0.5|0.2|0.2|0.1");
const MA5 = R`A delivery takes $X$ hours, with PDF $f(x)=\dfrac{x}{18}$ for $0\le x\le6$ and 0 otherwise. Let $U$ be the event that it takes more than 4 hours and $V$ the event that it takes more than 2 hours. Find $P(U\mid V)$.<br><b>Solution.</b> $P(U\cap V)=\boxed{\text{A}}=\boxed{\text{B}}\,\dfrac{x}{18}\,dx=\boxed{\text{C}}$, and $P(V)=\int_2^6\frac{x}{18}dx=\boxed{\text{D}}$, so $P(U\mid V)=\boxed{\text{E}}$.<br>Options: (1) $P(X\gt2)$ (2) $P(X\gt4)$ (3) $\int_2^6$ (4) $\int_4^6$ (5) $\int_0^4$ (6) $\tfrac59$ (7) $\tfrac89$ (8) $\tfrac49$ (9) $\tfrac19$ (10) $P(X\lt4)$<br>Enter only the option number for blanks A–D.`;
const MB1 = R`Vehicles passing a toll in an hour: $X\sim$ Poisson($25$). Each is speeding with probability $0.2$, independently. $Y$ = number of speeding vehicles.`;
const MB2 = R`The number of tickets $X$ a help desk closes in an hour has PMF` + T("x|0|1|2|3|4", "P(X = x)|0.15|β|0.30|0.20|0.10") + R`Let $Y=1$ if $X\ge3$ and $Y=0$ otherwise.`;
const MB3 = R`A coin with $P(\text{head})=0.6$ is tossed twice. $X$ = heads on the first toss, $Y$ = total heads.`;
const MB4 = R`$P(X=i,Y=j)=\dfrac{i+j}{k}$ for $i\in\{1,2,3\}$, $j\in\{1,2\}$.`;
const MB5 = R`The joint PMF of $X$ and $Y$ is` + T(R`X \ Y|0|1|2`, "0|0.10|0.10|0.05", "1|0.05|0.20|0.15", "2|0.10|0.05|0.20") + R`Find the probability that $\max(X,Y)=Y$.<br><b>Solution.</b> $\max(X,Y)=Y$ exactly when $\boxed{\text{A}}$. So the probability is $\sum_{k=0}^{2}\boxed{\text{B}}$. The $k=0$ term is $0.10$, the $k=1$ term is $\boxed{\text{C}}$ and the $k=2$ term is $\boxed{\text{D}}$, giving $\boxed{\text{E}}$.<br>Options: (1) $X\le Y$ (2) $X\ge Y$ (3) $X=Y$ (4) $P(X\le k,Y=k)$ (5) $P(X=k,Y\le k)$ (6) $0.30$ (7) $0.25$ (8) $0.40$ (9) $0.20$ (10) $0.35$<br>Enter only the option number for blanks A–D.`;
const MC1 = R`Rainfall $X$ (cm) on a rainy day has CDF $F(x)=\dfrac{x^2}{49}$ for $0\le x\le7$ (0 before, 1 after).`;
const MC2 = R`A box has 5 milk and 3 dark chocolates. Two are taken at random without replacement. $X$ = number of milk chocolates taken.`;
const MC3 = R`A six-sided die shows 1 on two faces, 2 on one face and 3 on three faces. It is thrown twice; $Z$ is the sum of the two results.`;
const MC4 = R`Two fair dice are thrown. $Z$ = the larger of the two numbers.`;
const MC5 = R`The joint PMF of $X$ and $Y$ is` + T(R`X \ Y|0|1|2`, "0|0.2|0.1|0.1", "1|0.1|0.2|0.3");

const MOCKS = [
  { id: "A", name: "Mock A", note: "Balanced across Weeks 1–4, with a fill-in-the-blanks set", items: [
    { m: 3, w: 4, t: "num", q: R`$f(x)=c(3-x)$ for $0\lt x\lt3$ and 0 otherwise is a PDF. Find $c$. Enter the answer correct to two decimal places.`, n: [0.2222, 0.006], e: R`Triangle area $\tfrac12\cdot3\cdot3c=4.5c=1$, so $c=2/9=0.22$.` },
    { m: 3, w: 2, t: "num", q: R`$X\sim$ Bernoulli($0.3$) and $Y\sim$ Bernoulli($0.5$) are independent and $Z=X+Y$. Find $f_{X\mid Z=1}(1)$. Enter the answer correct to two decimal places.`, n: [0.3, 0.006], e: R`$\dfrac{0.3\cdot0.5}{0.3\cdot0.5+0.7\cdot0.5}=0.3$.` },
    { m: 3, w: 1, t: "num", q: R`A number from 00 to 99 is chosen uniformly at random. $X$ = units digit, $Y$ = remainder when the number is divided by 7. Find $P(X=5, Y=1)$. Enter the answer correct to two decimal places.`, n: [0.02, 0.0006], e: R`Units digit 5 and remainder 1 mod 7: 15 and 85. $2/100=0.02$.` },
    { m: 3, w: 3, t: "num", q: R`$X$ has mean 25 and variance 4. Use Chebyshev's inequality to find a lower bound on $P(20\lt X\lt30)$. Enter the answer correct to two decimal places.`, n: [0.84, 0.006], e: R`$1-\dfrac{4}{5^2}=0.84$.` },
    { m: 3, w: 3, t: "num", q: R`A raffle has 250 tickets; one wins ₹1000, one wins ₹500, one wins ₹250 and the rest win nothing. You hold 2 tickets. Find your expected winnings in ₹.`, n: [14, 0.01], e: R`Each ticket's mean prize is $1750/250=7$; two tickets: $14$.` },
    { m: 3, w: 3, t: "mcq", c: MA1, q: R`Find $E[(X-1)^2]$.`, o: ["1.5", "2", "2.25", "3"], a: [2], e: R`$0.25\cdot1+0.25\cdot0+0.5\cdot4=2.25$.` },
    { m: 2, w: 3, t: "num", c: MA1, q: R`Use Markov's inequality to bound $P(X\ge3)$. Enter the answer correct to two decimal places.`, n: [0.5833, 0.006], e: R`$E[X]=0.25+1.5=1.75$; $1.75/3=0.58$.` },
    { m: 2, w: 2, t: "mcq", c: MA2, q: R`Find $P(\max(X,Y)=4)$.`, o: ["4/25", "7/25", "9/25", "16/25"], a: [1], e: R`$(4/5)^2-(3/5)^2=7/25$.` },
    { m: 3, w: 2, t: "num", c: MA2, q: R`Find $P(\max(X,Y)\le3\mid\min(X,Y)\ge2)$. Enter the answer correct to two decimal places.`, n: [0.25, 0.006], e: R`Both in $\{2,3\}$: $(2/5)^2$; both $\ge2$: $(4/5)^2$. Ratio $4/16=0.25$.` },
    { m: 3, w: 1, t: "mcq", c: MA3, q: R`Find $k$.`, o: ["1/16", "1/24", "1/28", "1/32"], a: [2], e: R`Sum of $2+x_1+x_2+x_3$ over 8 points: $16+12=28$.` },
    { m: 2, w: 1, t: "num", c: MA3, q: R`Find $P(X_1=1\mid X_2=0)$. Enter the answer correct to two decimal places.`, n: [0.5833, 0.006], e: R`$X_2=0$: $f(0,0,0)+f(0,0,1)=5k$, $f(1,0,0)+f(1,0,1)=7k$. So $7/12=0.58$.` },
    { m: 3, w: 2, t: "num", c: MA4, q: R`Find the probability that the value 2 appears exactly once among the five samples. Enter the answer correct to two decimal places.`, n: [0.4096, 0.006], e: R`$5(0.2)(0.8)^4=0.41$.` },
    { m: 2, w: 2, t: "num", c: MA4, q: R`Find the probability that no sample equals 0. Enter the answer correct to three decimal places.`, n: [0.03125, 0.0006], e: R`$0.5^5=0.031$.` },
    { m: 1, w: 4, t: "num", c: MA5, q: R`Enter the correct option number for A.`, n: [2, 0.01], e: R`$U\cap V=\{X\gt4\}$ because $X\gt4$ already implies $X\gt2$: option (2).` },
    { m: 1, w: 4, t: "num", c: MA5, q: R`Enter the correct option number for B.`, n: [4, 0.01], e: R`$P(X\gt4)=\int_4^6\frac x{18}dx$: option (4).` },
    { m: 1, w: 4, t: "num", c: MA5, q: R`Enter the correct option number for C.`, n: [6, 0.01], e: R`$\dfrac{36-16}{36}=\dfrac{20}{36}=\dfrac59$: option (6).` },
    { m: 1, w: 4, t: "num", c: MA5, q: R`Enter the correct option number for D.`, n: [7, 0.01], e: R`$\dfrac{36-4}{36}=\dfrac89$: option (7).` },
    { m: 1, w: 4, t: "num", c: MA5, q: R`Calculate the value of E. Enter the answer correct to three decimal places.`, n: [0.625, 0.0006], e: R`$\dfrac{5/9}{8/9}=\dfrac58=0.625$.` }
  ] },
  { id: "B", name: "Mock B", note: "Heavier on Weeks 1 and 3, with a fill-in-the-blanks set", items: [
    { m: 3, w: 4, t: "num", q: R`$f(x)=kx(2-x)$ for $0\lt x\lt2$ and 0 otherwise is a PDF. Find $k$. Enter the answer correct to two decimal places.`, n: [0.75, 0.006], e: R`$\int_0^2(2x-x^2)dx=4-\tfrac83=\tfrac43$, so $k=0.75$.` },
    { m: 3, w: 1, t: "num", q: R`Calls to a shop in an hour are Poisson($10$); each is a complaint with probability $0.4$, independently. Find the probability of exactly 2 complaints in an hour. Enter the answer correct to three decimal places.`, n: [0.1465, 0.0006], e: R`Complaints $\sim$ Poisson(4): $e^{-4}4^2/2=0.147$.` },
    { m: 3, w: 3, t: "num", q: R`$\mathrm{Cov}(X,Y)=3$, $\mathrm{Cov}(X,Z)=-1$, $\mathrm{Cov}(Y,Z)=2$, $\mathrm{Var}(Y)=4$. Find $\mathrm{Cov}(2X-Y,\ Y+Z)$.`, n: [-2, 0.01], e: R`$2\mathrm{Cov}(X,Y)+2\mathrm{Cov}(X,Z)-\mathrm{Var}(Y)-\mathrm{Cov}(Y,Z)=6-2-4-2=-2$.` },
    { m: 3, w: 2, t: "num", q: R`Two fair dice are rolled. Find the probability that the larger number exceeds the smaller by exactly 1. Enter the answer correct to two decimal places.`, n: [0.2778, 0.006], e: R`Ordered pairs differing by 1: $5\times2=10$, so $10/36=0.28$.` },
    { m: 3, w: 1, t: "msq", q: R`A box has 2 red balls and 1 blue ball. Two balls are drawn <b>with replacement</b>. $A$ = number of red draws, $B$ = number of blue draws. Choose the correct statements.`, o: [R`The possible values of $A$ are $\{0,1,2\}$.`, R`$f_{AB}(1,1)=\tfrac49$`, R`$f_{B\mid A=0}(2)=1$`, R`$A$ and $B$ are independent.`], a: [0, 1, 2], e: R`$f_{AB}(1,1)=2\cdot\tfrac23\cdot\tfrac13=\tfrac49$. If no red is drawn both draws are blue. $B=2-A$, so they are dependent.` },
    { m: 2, w: 1, t: "msq", c: MB1, q: R`Which are true?`, o: [R`$(Y\mid X=10)\sim$ Binomial($10, 0.2$)`, R`$(Y\mid X=10)\sim$ Binomial($25, 0.2$)`, R`$Y\sim$ Poisson($5$)`, R`$\mathrm{Var}(Y)=25$`], a: [0, 2], e: R`Given 10 vehicles, each speeds with probability 0.2. Splitting gives $Y\sim$ Poisson(5), whose variance is 5.` },
    { m: 3, w: 3, t: "num", c: MB1, q: R`Find $\mathrm{Var}(3Y)-2\,\mathrm{Var}(X)+10$.`, n: [5, 0.01], e: R`$9\cdot5-2\cdot25+10=5$.` },
    { m: 2, w: 3, t: "num", c: MB2, q: R`Find $E[X]$. Enter the answer correct to two decimal places.`, n: [1.85, 0.006], e: R`$\beta=1-0.75=0.25$. $E[X]=0.25+0.6+0.6+0.4=1.85$.` },
    { m: 3, w: 1, t: "num", c: MB2, q: R`Find $P(Y=1\mid X\ge2)$. Enter the answer correct to two decimal places.`, n: [0.5, 0.006], e: R`$P(X\ge3)/P(X\ge2)=0.3/0.6=0.5$.` },
    { m: 3, w: 1, t: "num", c: MB3, q: R`Find $P(Y=1)$. Enter the answer correct to two decimal places.`, n: [0.48, 0.006], e: R`$HT$ or $TH$: $2(0.6)(0.4)=0.48$.` },
    { m: 2, w: 1, t: "num", c: MB3, q: R`Find $P(X=1\mid Y=1)$. Enter the answer correct to one decimal place.`, n: [0.5, 0.006], e: R`$P(HT)/P(Y=1)=0.24/0.48=0.5$.` },
    { m: 3, w: 1, t: "num", c: MB4, q: R`Find $k$.`, n: [21, 0.01], e: R`$(2+3)+(3+4)+(4+5)=21$.` },
    { m: 2, w: 1, t: "mcq", c: MB4, q: R`Find $P(Y=2)$.`, o: ["3/7", "4/7", "1/3", "2/3"], a: [1], e: R`$(3+4+5)/21=12/21=4/7$.` },
    { m: 1, w: 2, t: "num", c: MB5, q: R`Enter the correct option number for A.`, n: [1, 0.01], e: R`$\max(X,Y)=Y$ means $X\le Y$: option (1).` },
    { m: 1, w: 2, t: "num", c: MB5, q: R`Enter the correct option number for B.`, n: [4, 0.01], e: R`Split by the value $k$ of $Y$: $\sum_k P(X\le k,Y=k)$, option (4).` },
    { m: 1, w: 2, t: "num", c: MB5, q: R`Enter the correct option number for C.`, n: [6, 0.01], e: R`$P(X\le1,Y=1)=0.10+0.20=0.30$: option (6).` },
    { m: 1, w: 2, t: "num", c: MB5, q: R`Enter the correct option number for D.`, n: [8, 0.01], e: R`$P(X\le2,Y=2)=0.05+0.15+0.20=0.40$: option (8).` },
    { m: 1, w: 2, t: "num", c: MB5, q: R`Calculate the value of E. Enter the answer correct to one decimal place.`, n: [0.8, 0.006], e: R`$0.10+0.30+0.40=0.8$.` }
  ] },
  { id: "C", name: "Mock C", note: "More comprehension sets, no blanks", items: [
    { m: 3, w: 4, t: "num", q: R`Daily rainfall $X$ (mm) has CDF $F(x)=1-e^{-0.25x}$ for $x\ge0$. Find $P(X\gt8)$. Enter the answer correct to three decimal places.`, n: [0.1353, 0.0006], e: R`$1-F(8)=e^{-2}=0.135$.` },
    { m: 3, w: 2, t: "num", q: R`Each attempt at a task succeeds with probability $0.2$, independently. The first 4 attempts failed. Find the probability that the first success comes after attempt 7. Enter the answer correct to three decimal places.`, n: [0.512, 0.0006], e: R`Memoryless: $P(X\gt7\mid X\gt4)=0.8^3=0.512$.` },
    { m: 3, w: 3, t: "num", q: R`$X$ and $Y$ are independent with $E[X]=4$, $\mathrm{Var}(X)=3$, $E[Y]=1$, $\mathrm{Var}(Y)=2$. Find $\mathrm{Var}(XY)$.`, n: [41, 0.01], e: R`$E[X^2]=19$, $E[Y^2]=3$: $57-16=41$.` },
    { m: 3, w: 1, t: "num", q: R`$X, Y, Z$ take values in $\{0,1\}$. Given $f_{XYZ}(0,1,1)=0.15$, $f_Y(1)=0.6$ and $f_{Z\mid Y=1}(1)=0.5$, find $f_{X\mid Y=1,Z=1}(0)$. Enter the answer correct to one decimal place.`, n: [0.5, 0.006], e: R`$f_{YZ}(1,1)=0.5\times0.6=0.3$; $0.15/0.3=0.5$.` },
    { m: 3, w: 3, t: "num", q: R`A fair coin is tossed 400 times. Use Chebyshev's inequality to bound the probability that the number of heads differs from 200 by 25 or more. Enter the answer correct to two decimal places.`, n: [0.16, 0.006], e: R`$\sigma^2=100$: $100/625=0.16$.` },
    { m: 2, w: 4, t: "mcq", c: MC1, q: R`Which is the PDF of $X$ on $[0,7]$?`, o: [R`$\dfrac{x}{49}$`, R`$\dfrac{2x}{49}$`, R`$\dfrac{x^2}{49}$`, R`$\dfrac17$`], a: [1], e: R`Differentiate: $F'(x)=2x/49$.` },
    { m: 3, w: 4, t: "num", c: MC1, q: R`Find $P(X\gt3\mid X\lt5)$. Enter the answer correct to two decimal places.`, n: [0.64, 0.006], e: R`$\dfrac{F(5)-F(3)}{F(5)}=\dfrac{25-9}{25}=0.64$.` },
    { m: 2, w: 1, t: "mcq", c: MC2, q: R`What is the PMF of $X$ (values 0, 1, 2)?`, o: [R`$\tfrac3{28},\ \tfrac{15}{28},\ \tfrac{10}{28}$`, R`$\tfrac9{64},\ \tfrac{30}{64},\ \tfrac{25}{64}$`, R`$\tfrac13,\ \tfrac13,\ \tfrac13$`, R`$\tfrac6{28},\ \tfrac{12}{28},\ \tfrac{10}{28}$`], a: [0], e: R`$\binom32/\binom82=3/28$, $5\cdot3/28=15/28$, $\binom52/28=10/28$. Option 2 would be with replacement.` },
    { m: 3, w: 3, t: "num", c: MC2, q: R`Find $E[X]$. Enter the answer correct to two decimal places.`, n: [1.25, 0.006], e: R`$2\cdot\tfrac58=1.25$.` },
    { m: 2, w: 2, t: "mcq", c: MC3, q: R`What is the range of $Z$?`, o: [R`$\{1,\dots,6\}$`, R`$\{2,\dots,6\}$`, R`$\{2,3,4\}$`, R`$\{2,4,6\}$`], a: [1], e: R`Each throw is 1, 2 or 3, so the sum runs from 2 to 6.` },
    { m: 3, w: 2, t: "num", c: MC3, q: R`Find $P(Z=4)$. Enter the answer correct to two decimal places.`, n: [0.3611, 0.006], e: R`$(1,3),(3,1),(2,2)$: $2\cdot\tfrac26\cdot\tfrac36+\tfrac1{36}=\tfrac{13}{36}=0.36$.` },
    { m: 2, w: 2, t: "mcq", c: MC4, q: R`The CDF of $Z$ at $k\in\{1,\dots,6\}$ is`, o: [R`$\dfrac k6$`, R`$\left(\dfrac k6\right)^2$`, R`$1-\left(\dfrac{6-k}{6}\right)^2$`, R`$\dfrac{2k-1}{36}$`], a: [1], e: R`Both dice must be at most $k$.` },
    { m: 3, w: 2, t: "num", c: MC4, q: R`Find $P(Z=5)$. Enter the answer correct to two decimal places.`, n: [0.25, 0.006], e: R`$\dfrac{25-16}{36}=0.25$.` },
    { m: 2, w: 3, t: "num", c: MC5, q: R`Find $E[XY]$. Enter the answer correct to one decimal place.`, n: [0.8, 0.006], e: R`Only $X=1$ rows count: $1(0.2)+2(0.3)=0.8$.` },
    { m: 3, w: 3, t: "num", c: MC5, q: R`Find $\mathrm{Cov}(X,Y)$. Enter the answer correct to two decimal places.`, n: [0.14, 0.006], e: R`$E[X]=0.6$, $E[Y]=0.3+0.8=1.1$: $0.8-0.66=0.14$.` }
  ] }
];
