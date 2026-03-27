const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "..", "src");

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) results.push(full);
  }
  return results;
}

const replacements = [
  [/aimtechnologies\.co/g, "aimtutor.co"],
  [/aimtechnologies\.in/g, "aimtutor.in"],
  [/aimtechs2@gmail\.com/g, "aimtutor@gmail.com"],
  [/admin@aimtechnologies\.\w+/g, "admin@aimtutor.co"],
  [/@aimtechhyd/g, "@aimtutor"],
  [/@aimtech([^n])/g, "@aimtutor$1"],
  [/aimtechnologies/gi, "aimtutor"],
];

const files = walk(srcDir);
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf-8");
  let changed = false;

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      changed = true;
    }
    // Reset regex lastIndex for global regexes
    pattern.lastIndex = 0;
  }

  if (changed) {
    fs.writeFileSync(file, content, "utf-8");
    console.log("Fixed:", path.relative(srcDir, file));
    count++;
  }
}

console.log(`Done. ${count} files updated in second pass.`);
