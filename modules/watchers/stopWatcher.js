const readline = require("readline");

function setupStopWatcher(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", () => {
    console.log("⏹ Остановка откликов по запросу пользователя.");
    callback();
    rl.close();
  });
}

module.exports = { setupStopWatcher };
