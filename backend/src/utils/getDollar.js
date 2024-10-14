// Imports
const puppeteer = require('puppeteer');

// Code
const getDollarBlue = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://www.ambito.com/');

  // Selecciona el elemento que contiene el valor del dólar
  const elements = await page.$$('.economic-indicators__buy-value', el => el.innerText);

  const secondElement = elements[1]

  const value = await page.evaluate(el => el.innerText, secondElement);

  // console.log('Dolar en getDollar.js: ', value);

  await browser.close();

  return value
}

// Exports
module.exports = {
  getDollarBlue
}