const fs = require("fs");
const open = require("open").default;
const { HTML_REPORT_FILE } = require("../config/config");

async function generateHtmlReport(forms) {
  if (!forms.length) {
    console.log("ℹ️ Нет сохранённых анкет для отчёта.");
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Список анкет с hh.ru</title>
</head>
<body>
  <h1>Список анкет</h1>
  <ul>
    ${forms
      .map(
        (item) =>
          `<li><a href="${item.href}" target="_blank">vacancyId=${item.vacancyId}</a> (сохранено: ${item.timestamp})</li>`
      )
      .join("\n")}
  </ul>
</body>
</html>
  `;

  fs.writeFileSync(HTML_REPORT_FILE, htmlContent, "utf-8");
  
  await open(HTML_REPORT_FILE);
  
}

module.exports = { generateHtmlReport };
