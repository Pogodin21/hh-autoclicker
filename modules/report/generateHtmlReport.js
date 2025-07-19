const fs = require("fs");
const path = require("path");
const open = require("open").default;
const { HTML_REPORT_FILE } = require("../config/config");

const TEMPLATE_PATH = path.join(__dirname, "template.html");
const STYLE_SRC = path.join(__dirname, "style.css");
const STYLE_DEST = path.join(path.dirname(HTML_REPORT_FILE), "style.css");

function formatDate(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("ru-RU").format(date);
}

async function generateHtmlReport(forms) {
  if (!forms.length) {
    console.log("ℹ️ Нет сохранённых анкет для отчёта.");
    return;
  }

  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

  const rows = forms.map(f => {
    const date = formatDate(f.timestamp);
    return `<tr>
      <td><a href="${f.href}" target="_blank">${f.text || f.vacancyId}</a></td>
      <td class="date">${date}</td>
    </tr>`;
  }).join("\n");

  const html = template.replace("{{rows}}", rows);
  fs.writeFileSync(HTML_REPORT_FILE, html, "utf-8");

  // Копируем CSS рядом с HTML
  fs.copyFileSync(STYLE_SRC, STYLE_DEST);

  await open(HTML_REPORT_FILE);
}

module.exports = { generateHtmlReport };
