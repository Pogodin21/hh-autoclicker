const fs = require("fs");
const { FORMS_FILE } = require("../config/config");

function loadForms() {
  if (fs.existsSync(FORMS_FILE)) {
    return JSON.parse(fs.readFileSync(FORMS_FILE, "utf-8"));
  }
  return [];
}

function saveForms(forms) {
  fs.writeFileSync(FORMS_FILE, JSON.stringify(forms, null, 2), "utf-8");
}

module.exports = { loadForms, saveForms };