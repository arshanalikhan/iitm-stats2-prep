/* ---------- Graded assignments: answers and method notes, added only after each deadline ---------- */
// Question text is not reproduced: students open the paper on Seek and follow along by question number.
// A week's items are added to this file only after its deadline (tests/check_data.js fails otherwise).
// Week: w, title, due (ISO, IST), tentative (date not yet on Seek), topics, items.
// Item: q = question number(s), mk = marks, p = past-quiz pattern code (optional), topic, idea, work, ans,
//       twin = an original practice question in the practice-bank format (new numbers and settings).
const GA = [
  {
    w: 1, title: "Graded Assignment 1", due: "2026-10-11T23:59:00+05:30",
    topics: "Joint, marginal and conditional PMFs; more than two random variables",
    items: [
      {
        q: "1", mk: 1, p: "J2", topic: "Conditional probability from a formula PMF",
        idea: R`The condition $Y\gt1$ is just $Y=2$ here. Divide the joint probability by the probability of the condition.`,
        work: R`$f_{XY}(1,2)=\tfrac{5}{36}$ and $P(Y=2)=\tfrac{2+5+8}{36}=\tfrac{15}{36}$, so $P(0\lt X\lt2\mid Y\gt1)=\tfrac{5}{15}$.`,
        ans: R`$\tfrac13\approx0.33$ (Seek accepts 0.30 to 0.36)`,
        twin: { w: 1, t: "num", q: R`$f_{XY}(x,y)=\dfrac{2x+y}{27}$ for $x,y\in\{0,1,2\}$. Find $P(X=2\mid Y\ge1)$. Enter the answer correct to two decimal places.`, n: [0.5238, 0.006], e: R`$P(X=2,Y\ge1)=\tfrac{5+6}{27}$ and $P(Y\ge1)=\tfrac{9+12}{27}$. The ratio is $\tfrac{11}{21}=0.52$.` }
      },
      {
        q: "2", mk: 1, p: "J3", topic: "Joint PMF of heads and the first-head toss",
        idea: R`List the 8 outcomes and record (number of heads, toss of the first head) for each.`,
        work: R`TTT gives $(0,0)$. First head on toss 1 leaves two free tosses: $f(1,1)=\tfrac18$, $f(2,1)=\tfrac28$, $f(3,1)=\tfrac18$. First head on toss 2 (TH then one free toss): $f(1,2)=f(2,2)=\tfrac18$. TTH: $f(1,3)=\tfrac18$.`,
        ans: R`Option (b): its $Y=1$ row reads $\tfrac18,\tfrac14,\tfrac18$ for $X=1,2,3$.`,
        twin: { w: 1, t: "num", q: R`Four fair coins are tossed. $X$ is the number of heads and $Y$ is the toss on which the first head appears ($Y=0$ if there is none). Find $f_{XY}(2,2)$. Enter the answer correct to three decimal places.`, n: [0.125, 0.0006], e: R`First head on toss 2 means T then H. Exactly one more head among tosses 3 and 4: 2 ways. $\tfrac{2}{16}=0.125$.` }
      },
      {
        q: "3", mk: 1, p: "J3", topic: "Event probability in a coin-scoring game",
        idea: R`Enumerate the 8 outcomes. "Fewer than three heads" removes HHH; "score 1 or less" keeps a first head on toss 1, or no head at all.`,
        work: R`HHT, HTH and HTT score 1, and TTT scores $-1$: 4 of the 8 outcomes.`,
        ans: R`$0.5$`,
        twin: { w: 1, t: "num", q: R`Three fair coins are tossed. You score 3, 2 or 1 point if the first head is on toss 1, 2 or 3, and $-2$ if no head appears. $X$ is the number of heads and $Y$ the score. Find $P(X\le1,\,Y\ge1)$. Enter the answer correct to three decimal places.`, n: [0.375, 0.0006], e: R`$X\le1$: HTT ($Y=3$), THT ($2$), TTH ($1$), TTT ($-2$). Three of them score at least 1: $\tfrac38=0.375$.` }
      },
      {
        q: "4", mk: 0, p: "J4", topic: "Conditional PMF: jobs assigned to firms",
        idea: R`Each job goes to A, B or C with probability $\tfrac13$, independently. Condition on B getting no job.`,
        work: R`$P(Y=0)=\left(\tfrac23\right)^2=\tfrac49$ and $P(X=2,Y=0)=\left(\tfrac13\right)^2=\tfrac19$, so $f_{X|Y=0}(2)=\tfrac{1/9}{4/9}$.`,
        ans: R`$0.25$ (Seek accepts 0.23 to 0.27; this question carries 0 marks on Seek)`,
        twin: { w: 1, t: "num", q: R`Two jobs are each given to one of four firms A, B, C, D, uniformly at random and independently. $X$ is the number of jobs for A and $Y$ the number for B. Find $f_{X|Y=0}(1)$. Enter the answer correct to three decimal places.`, n: [0.4444, 0.0006], e: R`$P(Y=0)=\left(\tfrac34\right)^2=\tfrac{9}{16}$ and $P(X=1,Y=0)=2\cdot\tfrac14\cdot\tfrac24=\tfrac{4}{16}$. The ratio is $\tfrac49=0.444$.` }
      },
      {
        q: "5", mk: 1, p: "J1", topic: "Missing cell, then a conditional",
        idea: R`Find $k$ from the total, then condition on the $X=1$ column.`,
        work: R`$k=1-\left(\tfrac14+\tfrac18+\tfrac14+0+\tfrac18\right)=\tfrac14$. $f_X(1)=\tfrac18+\tfrac14+\tfrac18=\tfrac12$, so $f_{Y|X=1}(2)=\tfrac{1/4}{1/2}$.`,
        ans: R`$0.5$`,
        twin: { w: 1, t: "num", q: R`The joint PMF of $X$ and $Y$ is` + T(R`Y \ X|0|1`, R`1|$\tfrac16$|$\tfrac1{12}$`, R`2|$\tfrac16$|$k$`, R`3|$\tfrac1{12}$|$\tfrac14$`) + R`Find $f_{Y|X=1}(2)$. Enter the answer correct to three decimal places.`, n: [0.4286, 0.0006], e: R`$k=1-\tfrac{2+2+1+1+3}{12}=\tfrac14$. $f_X(1)=\tfrac1{12}+\tfrac14+\tfrac14=\tfrac7{12}$, so $\tfrac{3/12}{7/12}=\tfrac37=0.429$.` }
      },
      {
        q: "6", mk: 1, p: "J4", topic: "Conditional from a table with a zero cell",
        idea: R`Given three drinks, only one sandwich count has positive probability.`,
        work: R`$f_{X|Y=3}(2)=\dfrac{0.05}{0+0.05}$.`,
        ans: R`$1$`,
        twin: { w: 1, t: "num", q: R`The joint PMF of the numbers of sandwiches $X$ and drinks $Y$ bought by a customer is` + T(R`Y \ X|1|2|3`, "1|0.30|0.15|0.05", "2|0.10|0.25|0.15") + R`Find $P(X=3\mid Y=2)$. Enter the answer correct to two decimal places.`, n: [0.3, 0.006], e: R`$P(Y=2)=0.10+0.25+0.15=0.5$, so $\tfrac{0.15}{0.5}=0.3$.` }
      },
      {
        q: "7", mk: 1, p: "J3", topic: "Two-stage experiment: a card, then balls",
        idea: R`Total probability over the first stage: face card ($\tfrac{12}{52}$) or not ($\tfrac{40}{52}$).`,
        work: R`Bag A, two balls: $P(\text{1 red})=\dfrac{6\cdot9}{\binom{15}{2}}=\dfrac{54}{105}$. Bag B, three balls: $\dfrac{8\binom{12}{2}}{\binom{20}{3}}=\dfrac{528}{1140}$. So $f_Y(1)=\tfrac{12}{52}\cdot\tfrac{54}{105}+\tfrac{40}{52}\cdot\tfrac{528}{1140}=0.1187+0.3563$.`,
        ans: R`$0.475$, entered as 0.47 or 0.48 (Seek accepts 0.45 to 0.49)`,
        twin: { w: 1, t: "num", q: R`A fair die is rolled. On a 1 or 2, two balls are drawn without replacement from a bag with 5 red and 5 black balls; otherwise two balls are drawn from a bag with 3 red and 7 black balls. $Y$ is the number of red balls drawn. Find $f_Y(1)$. Enter the answer correct to two decimal places.`, n: [0.4963, 0.006], e: R`$\tfrac13\cdot\tfrac{5\cdot5}{45}+\tfrac23\cdot\tfrac{3\cdot7}{45}=\tfrac{25+42}{135}=0.496$.` }
      },
      {
        q: "8", mk: 1, p: "J5", topic: "Chain rule with three variables",
        idea: R`A conditional on $(Y,Z)$ must be multiplied by the joint PMF of $(Y,Z)$.`,
        work: R`$f_{X|(Y=y,Z=z)}(x)=\dfrac{f_{XYZ}(x,y,z)}{f_{YZ}(y,z)}$, so $f_{XYZ}=f_{X|(Y,Z)}\,f_{YZ}$ always holds. Replacing $f_{YZ}$ by $f_Yf_Z$ needs $Y,Z$ independent, and the other two options multiply by the wrong factors.`,
        ans: R`Option (b) only`,
        twin: { w: 1, t: "msq", q: R`Which of these hold for all discrete $X$, $Y$, $Z$ (wherever the conditionals are defined)?`, o: [R`$f_{XYZ}(x,y,z)=f_{Z|(X=x,Y=y)}(z)\,f_{XY}(x,y)$`, R`$f_{XYZ}(x,y,z)=f_{X|Y=y}(x)\,f_{Y|Z=z}(y)\,f_Z(z)$`, R`$f_{XYZ}(x,y,z)=f_{X|(Y=y,Z=z)}(x)\,f_{Y|Z=z}(y)\,f_Z(z)$`, R`$f_{XY}(x,y)=f_{X|Y=y}(x)\,f_X(x)$`], a: [0, 2], e: R`Chain rule: condition each variable on all the ones already placed. (b) drops $Z$ from the condition on $X$; (d) should multiply by $f_Y(y)$.` }
      },
      {
        q: "9", mk: 1, p: "J2", topic: "Formula PMF with two unknowns",
        idea: R`Two equations: the total is 1, and the given event has probability $\tfrac47$.`,
        work: R`Over $0\le x\le2$, $0\le y\le3$: $\sum(bx+y)=12b+18$, so $a(12b+18)=1$. The event $X\ge1,\,Y\le2$ gives $a(9b+6)=\tfrac47$. Solving: $b=2$ and $a=\tfrac1{42}$, so $f_{XY}(x,y)=\tfrac{2x+y}{42}$ and $f_{XY}(0,2)=\tfrac{2}{42}$.`,
        ans: R`$\tfrac1{21}\approx0.05$ (Seek accepts 0.03 to 0.07)`,
        twin: { w: 1, t: "num", q: R`$f_{XY}(x,y)=a(x+by)$ for integers $0\le x\le2$ and $0\le y\le2$, and $P(Y=0)=\tfrac19$. Find $f_{XY}(2,1)$. Enter the answer correct to two decimal places.`, n: [0.1481, 0.006], e: R`$P(Y=0)=a(0+1+2)=3a=\tfrac19$, so $a=\tfrac1{27}$. The total is $a(9+9b)=1$, so $b=2$. Then $f_{XY}(2,1)=\tfrac{2+2}{27}=0.15$.` }
      },
      {
        q: "10", mk: 1, p: "J4", topic: "Heads before the first tail, given the total",
        idea: R`$Y=0$ means the first toss is a tail. Given $X=2$, every placement of the two heads is equally likely.`,
        work: R`Both heads must land in tosses 2 to 8: $\binom72=21$ of $\binom82=28$ placements. (For $n$ tosses the answer is $\tfrac{n-2}{n}$.)`,
        ans: R`$0.75$ (Seek accepts 0.73 to 0.77)`,
        twin: { w: 1, t: "num", q: R`A fair coin is tossed 6 times. $X$ is the number of heads and $Y$ the number of heads before the first tail. Find $f_{Y|X=3}(1)$. Enter the answer correct to two decimal places.`, n: [0.3, 0.006], e: R`$Y=1$ means H then T. The other 2 heads go in tosses 3 to 6: $\binom42=6$ of $\binom63=20$ placements, so $0.3$.` }
      },
      {
        q: "11", mk: 1, p: "J3", topic: "Committee: joint count of two groups",
        idea: R`All $\binom{18}{2}$ committees are equally likely; count those with one A and one B member.`,
        work: R`$\dfrac{7\cdot6}{\binom{18}{2}}=\dfrac{42}{153}$.`,
        ans: R`$0.2745$, entered as 0.27 (Seek accepts 0.25 to 0.29)`,
        twin: { w: 1, t: "num", q: R`A committee of 3 is chosen at random from 5 members of party A, 4 of party B and 3 of party C. $X$ is the number of A members and $Y$ the number of B members. Find $f_{XY}(2,1)$. Enter the answer correct to two decimal places.`, n: [0.1818, 0.006], e: R`$\dfrac{\binom52\binom41}{\binom{12}3}=\dfrac{40}{220}=0.18$.` }
      },
      {
        q: "12", mk: 1, p: "J3", topic: "Counts of two faces: multinomial",
        idea: R`Each roll is a "1", a "6" or something else ($\tfrac46$): a multinomial count.`,
        work: R`$\dfrac{5!}{1!\,1!\,3!}\left(\tfrac16\right)\left(\tfrac16\right)\left(\tfrac46\right)^3=20\cdot\dfrac{64}{7776}$.`,
        ans: R`$0.1646$, entered as 0.165 (Seek accepts 0.162 to 0.166)`,
        twin: { w: 1, t: "num", q: R`A fair die is rolled 6 times. $X$ is the number of 1s and $Y$ the number of 6s. Find $P(X=2,\,Y=1)$. Enter the answer correct to three decimal places.`, n: [0.0823, 0.0006], e: R`$\dfrac{6!}{2!\,1!\,3!}\left(\tfrac16\right)^2\left(\tfrac16\right)\left(\tfrac46\right)^3=60\cdot\dfrac{64}{46656}=0.082$.` }
      },
      {
        q: "13", mk: 1, p: "J1", topic: "Marginal of X for a uniform set of points",
        idea: R`Count the integer points: for each $y\in\{-1,0,1\}$, $x+y$ takes 5 values, so there are 15 equally likely points.`,
        work: R`$x=\pm3$ has 1 point, $x=\pm2$ has 2, and $x\in\{-1,0,1\}$ has 3.`,
        ans: R`Option (b): $\tfrac1{15},\tfrac2{15},\tfrac3{15}$ rising to the middle`,
        twin: { w: 1, t: "num", q: R`$(X,Y)$ is uniform over the integer points with $0\le y\le2$ and $-1\le x-y\le1$. Find $f_X(2)$. Enter the answer correct to three decimal places.`, n: [0.2222, 0.0006], e: R`There are 9 points (3 for each $y$). $x=2$ occurs for $y=1$ and $y=2$: $\tfrac29=0.222$.` }
      },
      {
        q: "14", mk: 1, p: "J1", topic: "Marginal of Y for the same points",
        idea: R`Each $y$ has the same number of points.`,
        work: R`5 points for each of $y=-1,0,1$: $\tfrac5{15}$ each.`,
        ans: R`Option (b): uniform, $\tfrac13$ on $\{-1,0,1\}$`
      },
      {
        q: "15–18", mk: 4, p: "J2", topic: "Fill-in set I: normalising a formula PMF",
        idea: R`The blanks rebuild the sum of the PMF over its four points.`,
        work: R`A is the summand $f_{X,Y}(x,y)$ (option 4). B is the missing term $f_{X,Y}(0,2)$ (option 1). C is $f_{X,Y}(1,1)=\tfrac4k$ (option 9). D: $\tfrac{1+2+4+5}{k}=1$ gives $k=12$ (option 8).`,
        ans: R`A 4, B 1, C 9, D 8`,
        twin: { w: 1, t: "num", q: R`$f_{XY}(x,y)=\dfrac{x+2y}{k}$ for $x\in\{0,1\}$ and $y\in\{1,2\}$. Find $k$.`, n: [14, 0.01], e: R`$\tfrac{2+4+3+5}{k}=1$, so $k=14$.` }
      },
      {
        q: "19–22", mk: 4, p: "J4", topic: "Fill-in set II: a conditional PMF",
        idea: R`$f_{X|Y=y}(x)$ is the joint PMF divided by the marginal of $Y$.`,
        work: R`A is $f_{X,Y}(x,y)$ (option 3) and B is $f_Y(y)$ (option 2). C: $f_Y(2)=\tfrac{2+5}{12}=\tfrac7{12}$ (option 5). D: $\tfrac{5/12}{7/12}=\tfrac57$ (option 6).`,
        ans: R`A 3, B 2, C 5, D 6`,
        twin: { w: 1, t: "num", q: R`$f_{XY}(x,y)=\dfrac{x+2y}{14}$ for $x\in\{0,1\}$ and $y\in\{1,2\}$. Find $f_{X|Y=2}(1)$. Enter the answer correct to two decimal places.`, n: [0.5556, 0.006], e: R`$f_Y(2)=\tfrac{4+5}{14}$, so $f_{X|Y=2}(1)=\tfrac{5/14}{9/14}=\tfrac59=0.56$.` }
      }
    ]
  },
  {
    w: 2, title: "Graded Assignment 2", due: "2026-10-18T23:59:00+05:30",
    topics: "Independence, functions of random variables, sums, maximum and minimum",
    items: [
      {
        q: "1", mk: 1, p: "W0", topic: "Memoryless geometric",
        idea: R`After 3 failed runs the remaining wait is a fresh geometric: $P(X\gt5\mid X\gt3)=P(X\gt2)$.`,
        work: R`$(1-0.15)^2=0.85^2=0.7225$.`,
        ans: R`$0.72$ (Seek accepts 0.69 to 0.75)`,
        twin: { w: 2, t: "num", q: R`Each trial succeeds with probability 0.2, independently. There has been no success in the first 2 trials. Find the probability that the first success comes after trial 6. Enter the answer correct to two decimal places.`, n: [0.4096, 0.006], e: R`Memoryless: $P(X\gt6\mid X\gt2)=P(X\gt4)=0.8^4=0.41$.` }
      },
      {
        q: "2", mk: 1, p: "I1", topic: "Fill a table, then test independence",
        idea: R`The row total gives $a$, the given relation gives $b$, and the grand total gives $k$.`,
        work: R`$a=\tfrac38-\tfrac18=\tfrac14$, $b=2a=\tfrac12$, $k=1-\tfrac38-\tfrac12=\tfrac18$. Both variables then have marginal $\left(\tfrac38,\tfrac58\right)$, so $f_X(2)=f_Y(2)$ and $f_X(1)=f_Y(1)$. But $f_{XY}(1,1)=\tfrac14\ne\tfrac38\cdot\tfrac38$, so they are not independent.`,
        ans: R`Options (a) and (d)`,
        twin: { w: 2, t: "msq", q: R`The joint PMF of $X$ and $Y$ is` + T(R`Y \ X|1|2`, R`1|$a$|$\tfrac16$`, R`2|$k$|$b$`) + R`with $P(Y=1)=\tfrac12$ and $b=\tfrac a2$. Which are true?`, o: [R`$f_X(1)=f_Y(1)$`, R`$k=\tfrac13$`, R`$X$ and $Y$ are independent`, R`$f_{X|Y=2}(2)=\tfrac12$`], a: [1, 2], e: R`$a=\tfrac12-\tfrac16=\tfrac13$, $b=\tfrac16$, $k=1-\tfrac12-\tfrac16=\tfrac13$. $f_X=\left(\tfrac23,\tfrac13\right)$ and $f_Y=\left(\tfrac12,\tfrac12\right)$, and every cell is the product, so they are independent. $f_{X|Y=2}(2)=\tfrac{1/6}{1/2}=\tfrac13$.` }
      },
      {
        q: "3", mk: 1, p: "M1", topic: "CDF of the minimum",
        idea: R`Work with tails: the minimum exceeds $t$ only if both variables do.`,
        work: R`$1-F_Z=(1-F_X)(1-F_Y)$, so $F_Z=F_X+F_Y-F_XF_Y$.`,
        ans: R`Option (d)`,
        twin: { w: 2, t: "mcq", q: R`$X$ and $Y$ are independent with CDFs $F_X$ and $F_Y$. The CDF of $\max(X,Y)$ is`, o: [R`$\max(F_X,F_Y)$`, R`$F_XF_Y$`, R`$F_X+F_Y-F_XF_Y$`, R`$1-F_XF_Y$`], a: [1], e: R`$\max(X,Y)\le t$ needs both to be at most $t$: $F_X(t)F_Y(t)$. For the minimum you use tails instead.` }
      },
      {
        q: "4", mk: 1, p: "I1", topic: "Which joint table is independent?",
        idea: R`Find both marginals and test every cell. One failing cell (often a zero with non-zero margins) rules a table out.`,
        work: R`Only the $3\times2$ table works: $f_X=(0.25,0.5,0.25)$, $f_Y=(0.4,0.6)$, and every cell is the product, e.g. $0.5\times0.6=0.30$. Each other table has a cell that fails.`,
        ans: R`Option (e)`,
        twin: { w: 2, t: "num", q: R`$X$ and $Y$ are independent, and part of their joint PMF is` + T(R`X \ Y|0|1|2`, "0|0.06|0.12|?", "1|0.14|?|?") + R`Find $f_{XY}(1,2)$. Enter the answer correct to two decimal places.`, n: [0.28, 0.006], e: R`Column $Y=0$ gives $f_X(0):f_X(1)=0.06:0.14$, so $f_X=(0.3,0.7)$. Then $f_Y(0)=\tfrac{0.06}{0.3}=0.2$, $f_Y(1)=\tfrac{0.12}{0.3}=0.4$, $f_Y(2)=0.4$. So $f_{XY}(1,2)=0.7\times0.4=0.28$.` }
      },
      {
        q: "5", mk: 1, p: "F4", topic: "Conditioning on a Bernoulli sum",
        idea: R`$Z=1$ happens as $(X,Y)=(1,0)$ or $(0,1)$.`,
        work: R`$f_{X|Z=1}(1)=\dfrac{0.2\times0.6}{0.2\times0.6+0.8\times0.4}=\dfrac{0.12}{0.44}$.`,
        ans: R`$\tfrac3{11}\approx0.27$ (Seek accepts 0.25 to 0.29)`,
        twin: { w: 2, t: "num", q: R`$X\sim$ Bernoulli($0.3$) and $Y\sim$ Bernoulli($0.6$) are independent, and $Z=X+Y$. Find $f_{X|Z=1}(1)$. Enter the answer correct to two decimal places.`, n: [0.2222, 0.006], e: R`$\dfrac{0.3\times0.4}{0.3\times0.4+0.7\times0.6}=\dfrac{0.12}{0.54}=0.22$.` }
      },
      {
        q: "6", mk: 1, p: "F3", topic: "PMF of X + Y",
        idea: R`The joint PMF factorises: $f_{XY}=\tfrac34\left(\tfrac14\right)^x\cdot\tfrac34\left(\tfrac14\right)^y$, and every pair with $x+y=k$ has the same probability.`,
        work: R`There are $k+1$ such pairs, each with probability $\tfrac{9}{16\cdot4^k}$.`,
        ans: R`Option (b): $(k+1)\dfrac{9}{16\cdot4^k}$`,
        twin: { w: 2, t: "num", q: R`$f_{XY}(x,y)=\dfrac{4}{9\cdot3^{x+y}}$ for $x,y\in\{0,1,2,\dots\}$. Find $P(X+Y=2)$. Enter the answer correct to two decimal places.`, n: [0.1481, 0.006], e: R`Three pairs $(0,2),(1,1),(2,0)$, each $\tfrac{4}{81}$: $\tfrac{12}{81}=0.15$.` }
      },
      {
        q: "7", mk: 1, p: "M1", topic: "PMF of the maximum",
        idea: R`Either both equal $k$, or one equals $k$ and the other is smaller. (Equivalently $F(k)^2-F(k-1)^2$ with $F(k)=1-4^{-(k+1)}$.)`,
        work: R`$P(X=Y=k)=\tfrac{9}{16\cdot4^{2k}}$ and $2P(X=k)P(Y\lt k)=2\cdot\tfrac{3}{4^{k+1}}\left(1-4^{-k}\right)=\tfrac{3(4^k-1)}{2\cdot4^{2k}}$. The range starts at $k=0$, where the answer is $\tfrac9{16}$.`,
        ans: R`Option (c), for $k=0,1,2,\dots$`,
        twin: { w: 2, t: "num", q: R`$f_{XY}(x,y)=\dfrac{4}{9\cdot3^{x+y}}$ for $x,y\in\{0,1,2,\dots\}$. Find $P(\max(X,Y)=1)$. Enter the answer correct to two decimal places.`, n: [0.3457, 0.006], e: R`$X$ and $Y$ are i.i.d. with $F(k)=1-3^{-(k+1)}$. $F(1)^2-F(0)^2=\tfrac{64}{81}-\tfrac{36}{81}=\tfrac{28}{81}=0.35$.` }
      },
      {
        q: "8", mk: 1, p: "F2", topic: "Difference of two dice",
        idea: R`Count ordered pairs with $x-y=3$.`,
        work: R`$(4,1),(5,2),(6,3)$: $\tfrac3{36}$.`,
        ans: R`$\tfrac1{12}\approx0.08$ (Seek accepts 0.07 to 0.09)`,
        twin: { w: 2, t: "num", q: R`Two fair four-sided dice (faces 1 to 4) are rolled, and $Z=X-Y$. Find $f_Z(1)$. Enter the answer correct to three decimal places.`, n: [0.1875, 0.0006], e: R`$(2,1),(3,2),(4,3)$: $\tfrac3{16}=0.1875$.` }
      },
      {
        q: "9", mk: 1, p: "F3", topic: "Sum of two geometrics",
        idea: R`$P(Z=n)=(n-1)p^2(1-p)^{n-2}$ for $n\ge2$. Compare consecutive values.`,
        work: R`$P(Z=17)\lt P(Z=18)\iff16\lt17(1-p)\iff p\lt\tfrac1{17}=0.0588$.`,
        ans: R`Option (d): $p\lt0.059$`,
        twin: { w: 2, t: "num", q: R`$X$ and $Y$ are i.i.d. Geometric($p$) and $Z=X+Y$. For which $p$ is $P(Z=10)=P(Z=11)$? Enter the answer correct to two decimal places.`, n: [0.1, 0.006], e: R`$9p^2(1-p)^8=10p^2(1-p)^9$ gives $1-p=0.9$, so $p=0.1$. For smaller $p$, $P(Z=10)\lt P(Z=11)$.` }
      },
      {
        q: "10", mk: 1, p: "M1", topic: "Exactly one equals 2 and exactly one equals 4",
        idea: R`Choose which variable is 2 and which is 4 ($3\times2=6$ ways); the third must be neither.`,
        work: R`$p_2=2e^{-2}=0.2707$ and $p_4=\tfrac23e^{-2}=0.0902$, so $6\,p_2\,p_4\,(1-p_2-p_4)=0.0936$.`,
        ans: R`$0.094$ (Seek accepts 0.091 to 0.095)`,
        twin: { w: 2, t: "num", q: R`$X_1,X_2,X_3$ are i.i.d. Poisson($1$). Find the probability that exactly one of them equals 0 and exactly one equals 1. Enter the answer correct to three decimal places.`, n: [0.2146, 0.0006], e: R`$p_0=p_1=e^{-1}=0.3679$. $6\,p_0\,p_1\,(1-p_0-p_1)=6(0.1353)(0.2642)=0.215$.` }
      },
      {
        q: "11", mk: 1, p: "F2", topic: "$X+Y-XY$ is \"X or Y\"",
        idea: R`$Z=0$ only when both are 0.`,
        work: R`$P(Z=0)=0.2\times0.8=0.16$, so $P(Z=1)=0.84$.`,
        ans: R`Option (b): Bernoulli($0.84$)`,
        twin: { w: 2, t: "num", q: R`$X\sim$ Bernoulli($0.7$) and $Y\sim$ Bernoulli($0.4$) are independent, and $Z=X+Y-2XY$. Find $P(Z=1)$. Enter the answer correct to two decimal places.`, n: [0.54, 0.006], e: R`$Z=1$ when exactly one of them is 1: $0.7\times0.6+0.3\times0.4=0.54$.` }
      },
      {
        q: "12", mk: 1, p: "F4", topic: "Geometric given the sum",
        idea: R`For i.i.d. geometrics, $P(X=k\mid X+Y=n)$ is the same for every $k=1,\dots,n-1$.`,
        work: R`$\dfrac{p(1-p)^3\cdot p(1-p)^3}{7p^2(1-p)^6}=\dfrac17$.`,
        ans: R`$\tfrac17\approx0.14$ (Seek accepts 0.13 to 0.15)`,
        twin: { w: 2, t: "num", q: R`$X$ and $Y$ are i.i.d. Geometric($0.3$). Find $P(X=2\mid X+Y=6)$. Enter the answer correct to two decimal places.`, n: [0.2, 0.006], e: R`Given a sum of 6, $X$ is uniform on $\{1,\dots,5\}$: $\tfrac15=0.2$.` }
      },
      {
        q: "13", mk: 1, p: "F4", topic: "Poisson split given the total",
        idea: R`$(Y\mid Z=n)\sim$ Binomial$\left(n,\tfrac{\lambda_Y}{\lambda_X+\lambda_Y}\right)$.`,
        work: R`Binomial($5,\tfrac49$): $\binom54\left(\tfrac49\right)^4\left(\tfrac59\right)=\dfrac{6400}{59049}$.`,
        ans: R`$0.108$ (Seek accepts 0.106 to 0.110)`,
        twin: { w: 2, t: "num", q: R`$X\sim$ Poisson($3$) and $Y\sim$ Poisson($6$) are independent, and $Z=X+Y$. Find $f_{Y|Z=4}(3)$. Enter the answer correct to three decimal places.`, n: [0.3951, 0.0006], e: R`Binomial($4,\tfrac69$): $4\left(\tfrac23\right)^3\left(\tfrac13\right)=\tfrac{32}{81}=0.395$.` }
      },
      {
        q: "14", mk: 1, p: "M1", topic: "Minimum of two dice",
        idea: R`$P(\min=k)=P(\min\ge k)-P(\min\ge k+1)$.`,
        work: R`$\tfrac{25}{36}-\tfrac{16}{36}=\tfrac9{36}$.`,
        ans: R`$0.25$`,
        twin: { w: 2, t: "num", q: R`Two fair dice are rolled. Find the probability that the smaller number is 3. Enter the answer correct to two decimal places.`, n: [0.1944, 0.006], e: R`$\tfrac{16}{36}-\tfrac{9}{36}=\tfrac7{36}=0.19$.` }
      },
      {
        q: "15", mk: 1, p: "I1", topic: "Are U and V independent?",
        idea: R`Look for a pair of values that cannot happen together.`,
        work: R`$U=1$ exactly when $V=1$. So $P(U=1,V=0)=0$, while $P(U=1)P(V=0)=\tfrac49\cdot\tfrac49\ne0$.`,
        ans: R`No (option b)`,
        twin: { w: 2, t: "mcq", q: R`$X$ and $Y$ are i.i.d. Bernoulli($\tfrac12$). $U=1$ if exactly one of them is 1 (otherwise $U=0$), and $V=X$. Are $U$ and $V$ independent?`, o: ["Yes", "No"], a: [0], e: R`All four $(U,V)$ pairs have probability $\tfrac14=\tfrac12\cdot\tfrac12$. With Bernoulli($\tfrac13$) instead it breaks: $P(U=1,V=1)=\tfrac29$ but $P(U=1)P(V=1)=\tfrac4{27}$.` }
      },
      {
        q: "16", mk: 1, topic: "Count of one survey answer",
        idea: R`Each employee picks "Not Applicable" with probability $\tfrac1{16}$, independently: Binomial($n,\tfrac1{16}$).`,
        work: R`$P(\text{exactly }2)=\binom n2\left(\tfrac1{16}\right)^2\left(\tfrac{15}{16}\right)^{n-2}$.`,
        ans: R`Option (c)`,
        twin: { w: 2, t: "num", q: R`Ten people independently choose one of four answers with probabilities $\tfrac12,\tfrac14,\tfrac18,\tfrac18$. Find the probability that exactly 3 choose the last answer. Enter the answer correct to three decimal places.`, n: [0.092, 0.0006], e: R`Binomial($10,\tfrac18$): $\binom{10}3\left(\tfrac18\right)^3\left(\tfrac78\right)^7=0.092$.` }
      },
      {
        q: "17", mk: 1, topic: "Both answers appear: inclusion–exclusion",
        idea: R`Find the chance that at least one of the two answers is missing, then subtract from 1.`,
        work: R`$P(\text{no Flexible})=P(\text{no N/A})=\left(\tfrac{15}{16}\right)^n$ and $P(\text{neither})=\left(\tfrac{14}{16}\right)^n$, so $P(\text{one missing})=2\left(\tfrac{15}{16}\right)^n-\left(\tfrac{14}{16}\right)^n$.`,
        ans: R`Option (c)`,
        twin: { w: 2, t: "num", q: R`Ten people independently choose one of four answers with probabilities $\tfrac12,\tfrac14,\tfrac18,\tfrac18$. Find the probability that the third and the fourth answers each appear at least once. Enter the answer correct to three decimal places.`, n: [0.5302, 0.0006], e: R`$1-\left\{2\left(\tfrac78\right)^{10}-\left(\tfrac68\right)^{10}\right\}=1-(0.5262-0.0563)=0.530$.` }
      },
      {
        q: "18", mk: 1, p: "W0", topic: "Statements about a geometric wait",
        idea: R`Memorylessness: $P(X=n+k\mid X\gt k)=P(X=n)$. The key reads option (a) this way.`,
        work: R`(a) is memorylessness, (b) holds because trials are independent, and (d) holds because the next trial still fails with probability 0.2. (c) is wrong: $P(X=3)=0.8^2\times0.2=0.128$.`,
        ans: R`Options (a), (b) and (d)`,
        twin: { w: 2, t: "msq", q: R`A machine fails on each trial with probability $0.25$, independently, and $X$ is the trial of the first failure. Which are true?`, o: [R`$P(X=2)=0.1875$`, R`$P(X\gt3)\approx0.42$`, R`$P(X=5\mid X\gt2)=P(X=3)$`, R`$P(X=4\mid X\gt2)=0.25$`], a: [0, 1, 2], e: R`$P(X=2)=0.75\times0.25$ and $P(X\gt3)=0.75^3=0.422$. Memorylessness shifts by 2, so $P(X=5\mid X\gt2)=P(X=3)$ and $P(X=4\mid X\gt2)=P(X=2)=0.1875$, not 0.25.` }
      },
      {
        q: "19–24", mk: 6, p: "F2", topic: "Fill-in set: who gets a head first",
        idea: R`Condition on the toss where Aman gets his first head; Deepak must still be waiting.`,
        work: R`A: independent (2). B: Geometric (3). Aman wins outright when $X_1\lt X_2$ (7). Given $X_1=k$ we need $X_2\gt k$ (9), and $P(X_2\gt k)=\left(\tfrac12\right)^k$ (11). Then $\sum_k\left(\tfrac14\right)^k=\tfrac13$ (13).`,
        ans: R`A 2, B 3, C 7, D 9, E 11, F 13`,
        twin: { w: 2, t: "num", q: R`Aman tosses a fair coin until he gets a head; Deepak rolls a fair die until he gets a six. They go at the same time, one attempt each per round. Find the probability that Aman finishes strictly first. Enter the answer correct to two decimal places.`, n: [0.7143, 0.006], e: R`$\sum_k P(X_1=k)P(X_2\gt k)=\sum_k\tfrac12\left(\tfrac12\right)^{k-1}\left(\tfrac56\right)^k=\dfrac{\tfrac12\cdot\tfrac56}{1-\tfrac12\cdot\tfrac56}=\tfrac57=0.71$.` }
      }
    ]
  },
  {
    w: 3, title: "Graded Assignment 3", due: "2026-10-25T23:59:00+05:30",
    topics: "Expectation, variance, covariance and correlation; Markov and Chebyshev bounds",
    items: []
  },
  {
    w: 4, title: "Graded Assignment 4", due: "2026-11-01T23:59:00+05:30", tentative: true,
    topics: "Continuous random variables: CDF, PDF, uniform, exponential and normal",
    items: []
  }
];
