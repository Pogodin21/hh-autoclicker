const puppeteer = require("puppeteer");
const { PROFILE_DIR } = require("../config/config");

async function launchBrowser() {
  return puppeteer.launch({
    headless: false,
    userDataDir: PROFILE_DIR,
    args: ["--start-maximized"],
    defaultViewport: null,
  });
}

module.exports = { launchBrowser };