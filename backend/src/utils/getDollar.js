// Imports
const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer');
const { logger } = require('../config/logger');

// Code
// const getDollarBlue = async () => {
//   try {
//     const { data } = await axios.get('https://www.ambito.com'); // O cualquier otra fuente
//     const $ = cheerio.load(data);
//     // console.log($.html());

//     // // Selector específico del valor del dólar blue en dolarhoy.com
//     const dollarValue = $('.main-container').text(); // Cambiar con el selector correcto
//     console.log(dollarValue);

//     // console.log(`El valor del dólar blue es: ${dollarValue}`);
//     // return dollarValue;
//   } catch (error) {
//     console.error('Error al obtener el valor del dólar:', error);
//   }
// };

const getDollarBlue = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://www.ambito.com/');

  // await page.waitForSelector('.data-venta');

  // Selecciona el elemento que contiene el valor del dólar
  const elements = await page.$$('.economic-indicators__buy-value', el => el.innerText);

  // Muestra el contenido de cada elemento
  // for (let i = 0; i < elements.length; i++) {
  //   const value = await page.evaluate(el => el.innerText, elements[i]);
  //   console.log(`Elemento ${i}:`, value);
// }

  const secondElement = elements[1]
  // logger.info(secondElement)
  const value = await page.evaluate(el => el.innerText, secondElement);

  console.log('El valor del dólar es:', value);

  await browser.close();

  // return value
}

// Exports
module.exports = {
  getDollarBlue
}