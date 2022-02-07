// This file scrapes the JumboCash portal for how many meal swipes I’ve used.
const JUMBOCASH_PASSWORD = process.env.JUMBOCASH_PASSWORD;
const GITHUB_GIST_TOKEN = process.env.GIST_TOKEN;

const GIST_ID = "f87b1fb5b39209697c156bded77fe23d";

const puppeteer = require("puppeteer");
const { Octokit } = require("octokit");
const octokit = new Octokit({ auth: GITHUB_GIST_TOKEN });

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto("https://www.jumbocash.net/login.php");
  await page.waitForSelector("#loginphrase");
  await page.type("#loginphrase", "1370784");
  await page.type("#password", JUMBOCASH_PASSWORD);
  await page.click('input[type="submit"]');
  await page.waitForSelector(".jsa_transactions"); // Wait for account page to load.

  const rawSwipes = await page.evaluate(
    () => document.querySelector("table:last-of-type tbody .sr-only").innerText
  );
  const swipes = parseInt(rawSwipes.replace("Current Balance", "").trim());

  await octokit.rest.gists.update({
    gist_id: GIST_ID,
    files: {
      "swipes.txt": {
        content: JSON.stringify({
          swipesLeft: swipes,
          timestamp: new Date().getTime(),
        }),
      },
    },
  });

  console.log(`Gist updated to ${swipes} swipes left.`);

  await page.close();
  await browser.close();
})();
