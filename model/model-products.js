const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
      type: String,
      required: true  
    },
    price:{
        type: Number
    },
    code:{
        type: Number,
        required: true  
    }
})


module.exports = mongoose.model('Product', productSchema) 
// 1st Name of the collection, 2nd Mongoose schema
//Mongoose automatically changes this to the plural form, transforms it to lowercase, and uses that for the database collection name.