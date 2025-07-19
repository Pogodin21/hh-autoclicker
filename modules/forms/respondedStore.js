const fs = require("fs");
const path = require("path");

const RESPONDED_FILE = path.join(__dirname, "../data/responded.json");

function loadResponded() {
  try {
    if (fs.existsSync(RESPONDED_FILE)) {
      const content = fs.readFileSync(RESPONDED_FILE, "utf-8").trim();
      if (content) {
        return new Set(JSON.parse(content));
      }
    }
  } catch (err) {
    console.warn("⚠️ Не удалось прочитать responded.json. Создаю новый.");
  }
  return new Set();
}

function saveResponded(respondedSet) {
  fs.writeFileSync(RESPONDED_FILE, JSON.stringify([...respondedSet], null, 2), "utf-8");
}

module.exports = { loadResponded, saveResponded };
