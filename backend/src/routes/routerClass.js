const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { logger } = require('../config/logger');
const { jwtPrivateKey } = require('../../process/config');

class RouterClass {
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router
    }

    init() { }

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                params[1].status(500).send(error)
                logger.error(error)
            }
        })
    }

    get(path, ...callbacks) {
        this.router.get(path, this.applyCallbacks(callbacks))
    }

    post(path, ...callbacks) {
        this.router.post(path, this.applyCallbacks(callbacks))
    }

    put(path, ...callbacks) {
        this.router.put(path, this.applyCallbacks(callbacks))
    }

    delete(path, ...callbacks) {
        this.router.delete(path, this.applyCallbacks(callbacks))
    }
}

module.exports = { RouterClass }