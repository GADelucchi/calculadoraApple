// Imports
const { Router } = require('express')
const StaticRouter = require('./static.router')
const DollarRouter = require('./dollar.router')

// Declaration
const router = Router()
const staticRouter = new StaticRouter()
const dollarRouter = new DollarRouter()

// Code
router.use('/', staticRouter.getRouter())
router.use('/api/dollar', dollarRouter.getRouter())

// Export
module.exports = router