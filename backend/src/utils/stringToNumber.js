// Code
const stringToNumber = (string) => {
  // console.log('String en stringToNumber: ', string);
  
  const number = Number(string.replace(',', '.')); // Convierte a número

  // console.log('Number en stringToNumber: ', number);

  return number
}

// Exports
module.exports = {
  stringToNumber
}