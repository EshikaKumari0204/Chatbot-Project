import { DataAPIClient } from "@datastax/astra-db-ts"
import puppeteer from "puppeteer";
import { getembedding } from "../lib/apicall.js";
const dbClient = new DataAPIClient(process.env.ASTRA_DB_API_APPLICATION_TOKEN);
export const db = dbClient.db(process.env.ASTRA_DB_API_END_POINT);
export const collection = db.collection("rag_docs");
export const userscollection=db.collection("users");
   const urls = [
    // "https://en.wikipedia.org/wiki/Invention",
    // "https://en.wikipedia.org/wiki/Timeline_of_scientific_discoveries",
    // "https://en.wikipedia.org/wiki/Timeline_of_historic_inventions",
    // "https://en.wikipedia.org/wiki/List_of_inventors",
    // "https://en.wikipedia.org/wiki/List_of_inventions_and_discoveries_by_women",
    // "https://en.wikipedia.org/wiki/List_of_English_inventions_and_discoveries",
    // "https://en.wikipedia.org/wiki/List_of_Indian_inventions_and_discoveries",
    // "https://en.wikipedia.org/wiki/List_of_American_inventions_and_discoveries",
    // "https://en.wikipedia.org/wiki/List_of_French_inventions_and_discoveries",
    // "https://en.wikipedia.org/wiki/List_of_German_inventions_and_discoveries",
    // "https://en.wikipedia.org/wiki/List_of_Russian_inventions_and_discoveries",
    // "https://en.wikipedia.org/wiki/List_of_inventions_named_after_people",
    // "https://en.wikipedia.org/wiki/History_of_science",
    // "https://en.wikipedia.org/wiki/History_of_technology",
    // "https://en.wikipedia.org/wiki/Scientific_method",
    // "https://en.wikipedia.org/wiki/Innovation",
    // "https://en.wikipedia.org/wiki/Discovery_(observation)",
    // "https://en.wikipedia.org/wiki/History_of_invention",
    // "https://en.wikipedia.org/wiki/Engineering",
    // "https://en.wikipedia.org/wiki/Scientific_revolution"
]
async function scrapePage(url) {
  console.log(` scraping for ${url}`);
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
    console.log(` scraped ${text.length} letters from ${url}`);
    return text;
 } catch (err) {
    await browser.close();
    console.error(`error while scrapping  ${url}:`, err);
    return "";
  }}
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
  return chunks;}
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
//run node -r dotenv/config scripts/db.js to run the script file (for getting the embeddings)
//WORK FLOW
//scrapped the webpages ,generated chunks out of its content and then created embedding of these chunks and stored in DB