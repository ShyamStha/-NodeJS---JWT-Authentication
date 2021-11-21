const jwt = require('jsonwebtoken')
const PizzaUser = require('../models/Pizzauser')
const requireAuth = function (req, res, next) {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, 'secret key', function (err, decodedToken) {
            if (err) {
                console.log(err.message)
                res.redirect('/login')
            }
            else {
                console.log(decodedToken)
                next()
            }
        })
    }
    else {
        res.redirect('/login')
    }
}
//current user check
const checkUser = function (req, res, next) {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, 'secret key', async function (err, decodedToken) {
            if (err) {
                console.log(err.message)
                res.locals.user = null
                next()
            }
            else {
                console.log(decodedToken)
                let user = await PizzaUser.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })

    }
    else {
        res.locals.user = null
        next()

    }

}
module.exports = { requireAuth, checkUser }