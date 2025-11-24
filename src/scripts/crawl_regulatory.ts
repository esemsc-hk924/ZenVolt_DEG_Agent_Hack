/* eslint-disable no-console */
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../data/regulatory_cache.json");

type Doc = {
  source: string;
  title: string;
  fetchedAt: string;
  text: string;
};

const SOURCES = [
  // UK SECR overview (gov.uk)
  "https://www.gov.uk/guidance/streamlined-energy-and-carbon-reporting-secr",
  // UK SECR environmental reporting guidelines
  "https://www.gov.uk/government/publications/environmental-reporting-guidelines-including-mandatory-greenhouse-gas-emissions-reporting-guidance",
  // EU CSRD (EUR-Lex landing)
  "https://eur-lex.europa.eu/EN/legal-content/summary/corporate-sustainability-reporting-csrd.html",
  // EU CBAM
  "https://taxation-customs.ec.europa.eu/green-transition/carbon-border-adjustment-mechanism_en"
];

async function getPage(u: string) {
  const res = await fetch(u, {
    headers: {
      "user-agent": "ZenVoltCrawler/1.0 (+contact@zenvolt.example)"
    }
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${u}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  // Try reasonable selectors first, fallback to text()
  const title = $("h1").first().text().trim() || $("title").text().trim() || u;
  const main =
    $("main").text().trim() ||
    $(".gem-c-govspeak").text().trim() ||
    $("#main-content").text().trim() ||
    $("article").text().trim() ||
    $("body").text().trim();

  // Squeeze whitespace
  const text = main.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return { title, text };
}

async function run() {
  const out: Doc[] = [];
  for (const s of SOURCES) {
    try {
      const { title, text } = await getPage(s);
      out.push({
        source: s,
        title,
        fetchedAt: new Date().toISOString(),
        text
      });
      // polite delay
      await new Promise((r) => setTimeout(r, 500));
    } catch (e: any) {
      console.error("⚠️  Failed:", s, e?.message || e);
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`✅ Saved ${out.length} docs -> ${OUT}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
