const express = require('express')
const app = express()
const routes = require('./routes/route')
const cookierParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const mongoose = require('mongoose')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(cookierParser())
mongoose.connect('mongodb://localhost/userdb', { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.Promise = global.Promise
app.get('*', checkUser)
app.get('/', function (req, res) {
    res.render('home')
})
app.get('/pizzas', requireAuth, function (req, res) {
    res.render('pizzas')
})
app.listen(3000, function () {
    console.log('The server has started at port number 3000')
})
app.use(routes)