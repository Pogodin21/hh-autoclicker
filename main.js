const { PAGE_TIMEOUT_MS, SEARCH_URL } = require("./modules/config/config");
const { launchBrowser } = require("./modules/browser/launchBrowser");
const { getVisibleVacancies } = require("./modules/vacancies/getVisibleVacancies");
const { processVacancies } = require("./modules/vacancies/processVacancies");
const { loadForms, saveForms } = require("./modules/forms/formsStore");
const { loadResponded, saveResponded } = require("./modules/forms/respondedStore");
const { generateHtmlReport } = require("./modules/report/generateHtmlReport");

const readline = require("readline");

(async () => {
  const browser = await launchBrowser(); //Запускаем браузер
  const page = await browser.newPage(); //Открываем новую страницу

  //Переходим на новой странице по установленной ссылке (поиск на hh.ru с предустановленными параметрами поиска)
  await page.goto(SEARCH_URL, {
    waitUntil: "domcontentloaded",
    timeout: PAGE_TIMEOUT_MS,
  });

  // await waitForUserToStart(); // Ждём команду от пользователя
  console.log("🔍 Настрой поиск в браузере.");
  console.log("▶ Нажми Enter — чтобы начать отклики на текущей странице.");
  console.log("❌ Введи `exit` — чтобы завершить работу и получить отчёт.\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let isRunning = false;
  let processing = false;
  let stopRequested = { value: false };

  const savedForms = loadForms();
  const responded = loadResponded();

  rl.on("line", async (input) => {
    const trimmed = input.trim().toLowerCase();

    if (trimmed === "exit") {
      console.log("📦 Завершаю. Генерирую отчёт...");
      saveForms(savedForms);
      await generateHtmlReport(savedForms);
      rl.close();
      await browser.close();
      process.exit(0);
    }

    if (processing) {
      console.log("⏳ Идёт парсинг. Жду завершения текущего процесса...");
      stopRequested.value = true;
      return;
    }

    console.log("▶ Запускаю обработку текущей страницы...");
    isRunning = true;
    stopRequested.value = false;
    processing = true;

    try {
      const visibleVacancies = await getVisibleVacancies(page);
      console.log(`✅ Найдено ${visibleVacancies.length} видимых вакансий.`);

      await processVacancies(
        browser,
        visibleVacancies,
        savedForms,
        stopRequested,
        responded,
        saveResponded
      );
    } catch (error) {
      console.error("❌ Ошибка во время обработки:", error);
    }

    isRunning = false;
    processing = false;
    console.log(
      "✅ Готов к новой команде. Нажми Enter для следующего запуска."
    );
  });
})();
