// Imports
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const routerServer = require('./src/routes/index.router.js')
const { logger } = require('./src/config/logger')
const { port } = require('./process/config')

// Instancia
const app = express()

// Config
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(cors({
    origin: '*',
    methods: 'POST',
    allowedHeaders: 'content-type',
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
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