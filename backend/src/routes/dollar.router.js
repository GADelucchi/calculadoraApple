// Imports
const { checkDollarValue } = require("../utils/checkDollar");
const { getDollarBlue } = require("../utils/getDollar");
const { stringToNumber } = require("../utils/stringToNumber");
const { RouterClass } = require("./routerClass");

let clients = [] //Guardar las conexiones (clientes)

// Code
class DollarRouter extends RouterClass {
  init() {
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

    this.get('/', async (req, res) => {
      try {
        const dollarBlueString = await getDollarBlue()
        let dollarBlueNumber = stringToNumber(dollarBlueString)
        console.log(typeof (dollarBlueNumber), dollarBlueNumber); // Ver tipo de dato y valor de dólar

        setInterval(async () => {
          // console.log('DolarBlueNumber en dollar.router.js: ', dollarBlueNumber); // 1
          const newDollarBlue = await checkDollarValue(dollarBlueNumber)

          if (newDollarBlue !== dollarBlueNumber) {
            dollarBlueNumber = newDollarBlue
            clients.forEach(client => {
              client.write(`data: ${dollarBlueNumber}\n\n`); // Envía el nuevo valor a los clientes
            });
          }

          console.log('Dolar post checkDollarValue en dollar.router.js: ', newDollarBlue); // 3
        }, 20000);

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