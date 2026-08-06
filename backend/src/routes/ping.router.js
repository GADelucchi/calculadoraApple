// Imports
const { RouterClass } = require("./routerClass");

// Code
class PingRouter extends RouterClass {
  init() {
    this.get('/', (req, res) => {
      res.status(200).send('pong')
    })
  }
}

// Exports
module.exports = PingRouter
