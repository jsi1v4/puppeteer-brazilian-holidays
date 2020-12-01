const puppeteer = require('puppeteer');

function getDataFromTable() {
  const element = document.querySelector('table[class*="interna"]');
  const body = element.querySelector('tbody');
  const [header, ...rows] = body.innerText.split(/[\r\n]+/gi).map(t => t.split(/[\t]+/gi));
  const data = rows.map(a => header.reduce((acc, n, i) => { acc[n] = a[i]; return acc; }, {}));
  return data;
}

function getYearArg() {
  const [arg, argv] = process.argv.slice(2);
  return arg.includes('y') ? argv : new Date().getFullYear();
}

async function main() {
  const year = getYearArg();
  console.log(`\nstarting... get year: ${year}...`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.anbima.com.br/feriados/fer_nacionais/${year}.asp`);
  try {
    const data = await page.evaluate(getDataFromTable);
    console.table(data);
    console.log(`success...\n`);
  } catch (e) {
    console.error('error... try again, maybe another year!\n');
  }
  await browser.close();
}

main();
