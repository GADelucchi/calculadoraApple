// Imports
const { logger } = require("../config/logger");
const { getDollarBlue } = require("../utils/getDollar");
const { RouterClass } = require("./routerClass");


// Code
class DollarRouter extends RouterClass {
  init() {
    this.get('/', async (req, res) => {
      try {
        getDollarBlue()
        // logger.info('Dolar Blue en router: ', dollarBlue)
      } catch {

      }
    })
  }
}

// Exports
module.exports = DollarRouter