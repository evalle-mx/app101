const express = require('express')   //imports express libray as the application uses it
const router = express.Router()     //imports the Router Module
const Product = require('../model/model-products')

// HTTP methods: (GET, POST, PATCH, DELETE)
// GET (list)
router.get('/',  async (req, res) => { 
    try {
        const list = await Product.find()   //findAll 
        res.json(list) 
    } catch (err) {
        res.status(500).json( { message: err.message })   //500 Internal Server Error (Nothing to validate, must be on server side)
    } 
})
// GET (read)
router.get('/:id', getProduct, async (req, res) => {  
    console.log('<READ> id: ', req.params.id) 
    // res.send( {message:`Product id: ${req.params.id}`})
    res.json(res.product)
})

//POST
router.post('/', async (req, res) => { 
    const newProduct = new Product({
        name: req.body.name, 
        code: req.body.code
    })
    //Persist in database
    try {
        const created = await newProduct.save();  
        res.status(201).json(created)     //201 Created
    } catch (error) {
        res.status(400).json({message: error.message})     //400 Bad Request: if something is missing in the request (name or code)
    }
})

//PATCH
router.patch('/:id', getProduct, async (req, res) => {
    if(req.body.name != null){
        res.product.name = req.body.name
     }
     if(req.body.code != null){
        res.product.code = req.body.code
     }
    try {
        const updProduct = await res.product.save()
        res.json(updProduct)     //200 OK (default)
    } catch (error) {
        return res.status(400).json( {message:error.message}) 
    }
 })

//DELETE
router.delete('/:id', getProduct, async(req, res) => { 
    try {
        //as getOneProduct has the document, call remove from collection
        await res.product.deleteOne()       //remove() was deprecated 
        res.json({message:'Product deleted'})
    } catch (error) {
        return res.status(500).json( {message:error.message}) 
    } 
 })

 async function getProduct(req, res, next){
    let myProduct
    try {
        myProduct = await Product.findById(req.params.id)
        if(myProduct == null){  //means not exists
            return res.status(400).json({message:'Unable to find Product'})
        }
    } catch (error) {
        return res.status(500).json( {message:error.message})
    }
    res.product = myProduct
    next()
}
//next() callback says to move to the next section of the parent code

module.exports = router
