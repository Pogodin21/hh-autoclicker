module.exports = async (page, url) => {
  console.log("▶ Переходим на hh.ru...");
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 600000,
  });

  console.log("✅ Страница загружена.");
  console.log("🔑 Теперь авторизуйся вручную (с логином, паролем, 2FA).");
  console.log("ℹ️ Когда закончишь, просто закрой скрипт вручную (Ctrl + C в терминале).");
};
