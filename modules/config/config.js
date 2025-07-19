const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

module.exports = {
  SEARCH_URL: "https://hh.ru",
  
  PROFILE_DIR: "./my-profile",
  DATA_DIR: dataDir, 

  FORMS_FILE: path.join(dataDir, "forms.json"),
  HTML_REPORT_FILE: path.join(dataDir, "forms_report.html"),

  PAGE_TIMEOUT_MS: 60000,
  WAIT_ON_FORM_MS: 2000,

  RESPONSE_FORM_SELECTOR: "#RESPONSE_MODAL_FORM_ID",
};
