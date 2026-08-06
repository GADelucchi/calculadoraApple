// Imports
const { Router } = require('express')
const DollarRouter = require('./dollar.router')
const PingRouter = require('./ping.router')

// Declaration
const router = Router()
const dollarRouter = new DollarRouter()
const pingRouter = new PingRouter()

// Code
router.use('/api/dollar', dollarRouter.getRouter())
router.use('/api/ping', pingRouter.getRouter())

// Export
module.exports = router