// Imports
const { RouterClass } = require("./routerClass")
const path = require('path')

// Code
class StaticRouter extends RouterClass {
  init() {
    this.get('/', async (req, res) => {
      try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error al ingresar a /static',
          error: error.message
        })
        console.log('Error al entrar a /static');
        throw new Error(error)
      }
    })
  }
}

// Exports
module.exports = StaticRouter