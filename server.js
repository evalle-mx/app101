const express = require('express')
const mongoose = require ('mongoose')
require('dotenv').config()

const productRouter = require('./route/router-products')

const app = express()

// mongoose.connect( 'mongodb+srv://<user>:<pass>@<cluster>>.mongodb.net/?retryWrites=true&w=majority' )
mongoose.connect( process.env.ATLAS_URL )
const db = mongoose.connection
//console.log( process.env.ATLAS_URL);


db.on('error', (e) => {
    console.log( e );
})
db.once('open', () => {
    console.log('Successfully connected to Mongo')
})

app.use( express.json() )
app.use('/products', productRouter)


app.listen( 3000, () => {
    console.log('Server started')

})

// http://localhost:3000/products