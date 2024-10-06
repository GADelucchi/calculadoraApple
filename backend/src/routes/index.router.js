// Imports
const { Router } = require('express')
const DollarRouter = require('./dollar.router')

// Declaration
const router = Router()
const dollarRouter = new DollarRouter()

// Code
router.use('/api/dollar', dollarRouter.getRouter())

// Export
module.exports = router