// Imports
const puppeteer = require('puppeteer');
const { logger } = require('../config/logger');

// Code
const getDollarBlue = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://www.ambito.com/');

  // Selecciona el elemento que contiene el valor del dólar
  const elements = await page.$$('.economic-indicators__buy-value', el => el.innerText);

  const secondElement = elements[1]

  const value = await page.evaluate(el => el.innerText, secondElement);

  await browser.close();

  return value
}

// Exports
module.exports = {
  getDollarBlue
}