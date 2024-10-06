// Imports
const { getDollarBlue } = require("../utils/getDollar");
const { RouterClass } = require("./routerClass");


// Code
class DollarRouter extends RouterClass {
  init() {
    this.get('/', async (req, res) => {
      try {
        const dollarBlueString = await getDollarBlue()

        const dollarBlueNumber = Number(dollarBlueString.replace(',', '.'))
        console.log(typeof(dollarBlueNumber), dollarBlueNumber);

        res.status(200).json({
          success: true,
          dollarBlue: dollarBlueNumber
        })
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error al obtener el valor del dólar',
          error: error.message
        })
        throw new Error(error)
      }
    })
  }
}

// Exports
module.exports = DollarRouter