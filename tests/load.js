// Loads the data and drill files (no DOM needed) into one shared context, in build order.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SRC = path.join(__dirname, "..", "src");
const FILES = [
  "data/questions/helpers.js", "data/questions/week0.js", "data/questions/week1.js", "data/questions/week2.js",
  "data/questions/week3.js", "data/questions/week4.js", "data/mocks.js", "data/patterns-data.js",
  "js/drills/helpers.js", "js/drills/week1.js", "js/drills/week2.js", "js/drills/week3.js", "js/drills/week4.js",
];

module.exports = function load() {
  const ctx = vm.createContext({ console });
  const code = FILES.map(f => fs.readFileSync(path.join(SRC, f), "utf8")).join("\n;\n") +
    "\n;({ QS, MOCKS, PAT, DRILLS })";
  return vm.runInContext(code, ctx, { filename: "src-bundle.js" });
};
