/* ---------- Practice bank ---------- */
// Original questions in the style of the course's assignments and Quiz 1 papers (new numbers and settings).
// Fields: w = week, t = "mcq" | "msq" | "num", c = shared setup (optional), q = question,
// o = options, a = correct option indexes (mcq/msq), n = [answer, tolerance] (num), e = explanation.
const R = String.raw;
// T("X\\Y|0|1", "0|0.1|0.2", ...) builds a small table; the first cell of each row is a header.
function T(...rows) {
  return '<div class="ptwrap"><table class="pt">' + rows.map((r, i) => "<tr>" + r.split("|").map((c, j) => (i === 0 || j === 0) ? "<th>" + c + "</th>" : "<td>" + c + "</td>").join("") + "</tr>").join("") + "</table></div>";
}
// Row-list table for three or more variables: header then rows.
function L(head, ...rows) {
  return '<div class="ptwrap"><table class="pt"><tr>' + head.split("|").map(h => "<th>" + h + "</th>").join("") + "</tr>" + rows.map(r => "<tr>" + r.split("|").map(c => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</table></div>";
}

// Every week file appends its questions here.
const QS = [];
