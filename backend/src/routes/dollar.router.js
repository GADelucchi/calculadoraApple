// Imports
const { checkDollarValue } = require("../utils/checkDollar");
const { getDollarBlue } = require("../utils/getDollar");
const { stringToNumber } = require("../utils/stringToNumber");
const { RouterClass } = require("./routerClass");

let clients = [] //Guardar las conexiones (clientes)

// Code
class DollarRouter extends RouterClass {
  init() {
    this.get('/', async (req, res) => {
      try {
        const dollarBlueString = await getDollarBlue()
        let dollarBlueNumber = stringToNumber(dollarBlueString)

        res.status(200).send({
          success: true,
          dollarBlue: dollarBlueNumber
        })
      } catch (error) {
        res.status(501).send({
          success: false,
          message: 'Error al obtener el valor del dólar',
          error: error.message
        })
      }
    })

    this.get('/stream', (req, res) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders(); // Envía los encabezados inmediatamente

      // Agrega al cliente a la lista
      clients.push(res);

      // Remueve al cliente si cierra la conexión
      req.on('close', () => {
        clients = clients.filter(client => client !== res);
        res.end();
      });
    });
  }
}

// Exports
module.exports = DollarRouter