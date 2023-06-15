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
    },
    createdAt: Date,
    updatedAt: Date
})

//Instance Methods
productSchema.methods.getPricing = function () {
    let labelCurrency = ' CAD'
    if(this.price){
        return '$ ' + this.price + labelCurrency
    }
    else {
        return `Product ` + this.name + ' has no price '
    }
}


// Middleware functions
productSchema.pre('save', function (next) {
    let now = Date.now();
  
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
      this.createdAt = now;
    }
    // Call the next function in the pre-save chain
    next();
  });


module.exports = mongoose.model('Product', productSchema) 
// 1st Name of the collection, 2nd Mongoose schema
//Mongoose automatically changes this to the plural form, transforms it to lowercase, and uses that for the database collection name.