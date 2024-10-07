// Imports
const { getDollarBlue } = require("./getDollar");
const { stringToNumber } = require("./stringToNumber");

// Code
const checkDollarValue = async (value) => {
  let currentDollarValue = value;
  console.log('Valor de entrada en checkDollar.js: ', value); // 2

  const dollarBlueString = await getDollarBlue(); // Obtén el valor del dólar
  const dollarBlueNumber = stringToNumber(dollarBlueString)

  if (currentDollarValue !== dollarBlueNumber) {
    currentDollarValue = dollarBlueNumber;

    // Aquí se notifica si cambia el valor
    console.log('El valor del dólar ha cambiado:', currentDollarValue); // 4
  }

  return currentDollarValue
};

// Exports
module.exports = {
  checkDollarValue
}