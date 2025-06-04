const { launchBrowser } = require("./browser");
const { PAGE_TIMEOUT_MS, SEARCH_URL } = require("../config/config");
const { setupStopWatcher } = require("./stopWatcher");
const { loadForms } = require("./formsManager");
const { getVisibleVacancies } = require("./vacancies");
const { processVacancies } = require("./responder");
const { generateHtmlReport } = require("./htmlReport");

(async () => {
  const browser = await launchBrowser(); //Запускаем браузер
  const page = await browser.newPage(); //Открываем новую страницу

  //Переходим на новой странице по установленной ссылке (поиск на hh.ru с предустановленными параметрами поиска)
  await page.goto(SEARCH_URL, {
    waitUntil: "domcontentloaded",
    timeout: PAGE_TIMEOUT_MS,
  });

  const savedForms = loadForms();
  const visibleVacancies = await getVisibleVacancies(page);
  console.log(`✅ Найдено ${visibleVacancies.length} видимых вакансий.`);

  const stopRequested = { value: false };
  setupStopWatcher(() => {stopRequested.value = true;});

  await processVacancies(browser, visibleVacancies, savedForms, stopRequested)
  await generateHtmlReport(savedForms);

})();
