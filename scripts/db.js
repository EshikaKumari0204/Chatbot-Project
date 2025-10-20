import { DataAPIClient } from "@datastax/astra-db-ts"
import puppeteer from "puppeteer";
import { getembedding } from "../lib/apicall.js";

const dbClient = new DataAPIClient(process.env.ASTRA_DB_API_APPLICATION_TOKEN);
export const db = dbClient.db(process.env.ASTRA_DB_API_END_POINT);
export const collection = db.collection("rag_docs");
export const userscollection=db.collection("users");
const urls = [
  
  //  "https://en.wikipedia.org/wiki/Cricket",
  // "https://en.wikipedia.org/wiki/Indian_Premier_League",
  // "https://en.wikipedia.org/wiki/Virat_Kohli",
  // "https://en.wikipedia.org/wiki/MS_Dhoni",
  // "https://en.wikipedia.org/wiki/Cricket_statistics",
  //  "https://en.wikipedia.org/wiki/Glossary_of_cricket_terms",
  // "https://en.wikipedia.org/wiki/Formats_of_cricket",
  // "https://en.wikipedia.org/wiki/Laws_of_Cricket",
  // "https://en.wikipedia.org/wiki/Cricket"
];
async function scrapePage(url) {
  console.log(` Scraping for ${url}`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    const text = await page.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      return main.innerText.replace(/\s+/g, ' ').trim();
    });

    await browser.close();
    console.log(` Scraped ${text.length} characters from ${url}`);
    return text;

  } catch (err) {
    await browser.close();
    console.error(` Scrapping failed ${url}:`, err);
    return "";
  }
}
function chunkText(text, chunkSize) {
  if (!text || text.length === 0) {
    console.log("no text to create chunk");
    return [];
  }
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
  chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
}
async function ingest() {
  for (const url of urls) {
    try {
      const text = await scrapePage(url);
      if (!text) {
        console.log(` ${url} no text after scrapping`);
        continue;
      }
      const chunks = chunkText(text, 300);
      for (const chunk of chunks) {
        const embedding = await getembedding(chunk);
        await collection.insertOne({
          url,
          chunk,
          embedding
        }); }  } catch (err) {
      console.error(`error while ingestion ${url}:`, err);}}}
ingest();
//run node -rdotenv/config scripts/db.js to run the script file (for getting the embeddings)
//WORK FLOW
//scrapped the webpages ,generated chunks out of its content and then created embedding of these chunks and stored in DB