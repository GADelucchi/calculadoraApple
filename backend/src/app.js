// Imports
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const routerServer = require('./routes/index.router.js')
const { logger } = require('./config/logger.js')
const { port } = require('../process/config.js')

// Instancia
const app = express()

// Config
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Middleware de terceros
app.use(cookieParser('P@l@braS3cre3t0'))

// Puerto
const httpServer = app.listen(port, (error) => {
    if (error) logger.error('Error en el servidor', error)
    logger.info(`Escuchando en el puerto: ${port}`);
})

// Rutas
app.use(routerServer)
app.use(`/static`, express.static(__dirname + `/public`))