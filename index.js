const express = require('express')
var cors = require('cors')
const app = express()
var mongoose = require('mongoose')
const url = 'mongodb+srv://terrance:Inntechweb2020@cluster0.jlhpy.mongodb.net/finix'
var path = require('path')
const User = require('./controller/user')
const Movie = require('./controller/movie')
const Order = require('./controller/order')
const Contact = require('./controller/contact')
const Career = require('./controller/career')
const Subscribe = require('./controller/subscribe')
var bodyParser = require('body-parser')
var router =  express.Router();

app.use(cors())
const port = 3000

mongoose.connect(url, {useNewUrlParser:true})
const conn = mongoose.connection

conn.on('open',()=>{
    console.log("Connected to mongodb.....")
})

app.use(express.static(path.join(__dirname,'lib'))); 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json


app.use('/user',  User )
app.use('/movie', Movie)
app.use('/order', Order)
app.use('/contact', Contact)
app.use('/career', Career)
app.use('/subscribe', Subscribe)

app.listen(port, () =>{
    console.log(`Connected to ${port}`)
})