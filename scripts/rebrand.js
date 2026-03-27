const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "..", "src");

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const files = walk(srcDir);
let count = 0;

for (const file of files) {
  const content = fs.readFileSync(file, "utf-8");
  if (content.includes("AIM Technologies")) {
    const updated = content.replace(/AIM Technologies/g, "Aim Tutor");
    fs.writeFileSync(file, updated, "utf-8");
    console.log("Updated:", path.relative(srcDir, file));
    count++;
  }
}

// Also handle @aimtechhyd -> @aimtutor and aimtechnologies references
for (const file of files) {
  let content = fs.readFileSync(file, "utf-8");
  let changed = false;
  
  if (content.includes("@aimtechhyd")) {
    content = content.replace(/@aimtechhyd/g, "@aimtutor");
    changed = true;
  }
  if (content.includes("@aimtech")) {
    content = content.replace(/@aimtech([^n])/g, "@aimtutor$1");
    changed = true;
  }
  if (content.includes("aimtechnologies.co")) {
    content = content.replace(/aimtechnologies\.co/g, "aimtutor.co");
    changed = true;
  }
  if (content.includes("aimtechnologies.in")) {
    content = content.replace(/aimtechnologies\.in/g, "aimtutor.in");
    changed = true;
  }
  if (content.includes("aimtechs2@gmail.com")) {
    content = content.replace(/aimtechs2@gmail\.com/g, "aimtutor@gmail.com");
    changed = true;
  }
  if (content.includes("admin@aimtechnologies")) {
    content = content.replace(/admin@aimtechnologies\.\w+/g, "admin@aimtutor.co");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, "utf-8");
    console.log("Updated refs:", path.relative(srcDir, file));
  }
}

console.log(`\nDone. ${count} files had "AIM Technologies" replaced.`);
