const PizzaUser = require('../models/Pizzauser')
const jwt = require('jsonwebtoken')
const maximumLife = 2 * 24 * 60 * 60
const createToken = function (id) {
    return jwt.sign({ id }, 'secret key', {
        expiresIn: maximumLife
    })
}
const handleErrors = function (err) {
    console.log(err.message, err.code)
    let errors = { email: '', password: '' }
    if (err.code === 11000) {
        errors.email = 'That email has been already registred,try new one'
        return errors
    }
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered,please signup first'
    }
    if (err.message === 'incorrect password') {
        errors.password = 'Incorrect password'
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(error => {
            errors[error.properties.path] = error.properties.message
        })
    }
    return errors
}
const getSignUp = function (req, res) {
    res.render('signup')
}
const postSignUp = async function (req, res) {
    const { email, password } = req.body
    try {
        const user = await PizzaUser.create({ email, password })
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maximumLife * 1000 })
        res.status(201).json({ user: user._id })
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}
const getLogIn = function (req, res) {
    res.render('login')
}
const postLogIn = async function (req, res) {
    const { email, password } = req.body
    try {
        const user = await PizzaUser.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maximumLife: maximumLife * 1000 })
        res.status(200).json({ user: user._id })
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }


}
const logOut = function (req, res) {
    res.cookie('jwt', '', { maximumLife: 1 })
    res.redirect('/')

}

module.exports = {
    getSignUp,
    postSignUp,
    getLogIn,
    postLogIn,
    logOut
}
