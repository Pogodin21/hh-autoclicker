const fs = require("fs");
const { saveForms } = require("./formsManager");
const { WAIT_ON_FORM_MS, PAGE_TIMEOUT_MS, RESPONSE_FORM_SELECTOR } = require("../config/config");
const { loadResponded, saveResponded } = require("./respondedManager");

async function processVacancies(browser, vacancies, savedForms, stopRequestedRef) {
   const responded = loadResponded();
  
  for (let i = 0; i < vacancies.length; i++) {
    if (stopRequestedRef.value) break;

    const vacancy = vacancies[i];

    // if (responded.has(vacancy.vacancyId)) {
    //   console.log(`⏭ Пропускаю ${vacancy.vacancyId}, уже был отклик.`);
    //   continue;
    // }

    console.log(`👉 Открываю ${i + 1}/${vacancies.length}: ${vacancy.href}`);

    try {
      const newPage = await browser.newPage();
      await newPage.goto(vacancy.href, {
        waitUntil: "domcontentloaded",
        timeout: PAGE_TIMEOUT_MS,
      });

      const hasForm = await newPage.$(RESPONSE_FORM_SELECTOR);
      if (hasForm) {
        console.log(`📝 Найдена анкета на странице ${vacancy.vacancyId}`);

        if (!savedForms.some((f) => f.vacancyId === vacancy.vacancyId)) {
          savedForms.push({
            vacancyId: vacancy.vacancyId,
            href: vacancy.href,
            timestamp: new Date().toISOString(),
          });
          saveForms(savedForms);
          console.log(`✅ Ссылка сохранена в forms.json`);
        } else {
          console.log(`⚠️ Эта анкета уже сохранена ранее.`);
        }


        responded.add(vacancy.vacancyId);
        saveResponded(responded);
        console.log(`📌 ID ${vacancy.vacancyId} добавлен в responded.json`);
      } else {
        console.log(`✅ На странице ${vacancy.vacancyId} анкета не найдена.`);
      }

      console.log(`⏳ Жду ${WAIT_ON_FORM_MS / 1000} секунд...`);
      await new Promise((resolve) => setTimeout(resolve, WAIT_ON_FORM_MS));

      await newPage.close();
    } catch (err) {
      console.error(`❌ Ошибка с вакансией ${vacancy.vacancyId}:`, err);
    }
  }
}

module.exports = { processVacancies };
