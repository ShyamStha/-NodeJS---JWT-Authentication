const express = require('express')
const router = express()
const controller = require('../controller/controller')
router.get('/signup', controller.getSignUp)
router.get('/login', controller.getLogIn)
router.post('/signup', controller.postSignUp)
router.post('/login', controller.postLogIn)
router.get('/logout', controller.logOut)

module.exports = router