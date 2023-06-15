const express = require('express')   //imports express libray as the application uses it
const router = express.Router()     //imports the Router Module
const Product = require('../model/model-products')

// Default HTTP methods: (GET, POST, PATCH, DELETE)
// GET (list)
router.get('/',  async (req, res) => { 
    try {
        const list = await Product.find()   //findAll 
        res.json(list) 
    } catch (err) {
        res.status(500).json( { message: err.message })   //500 Internal Server Error (Nothing to validate, must be on server side)
    } 
})

// GET (read by ID)
router.get('/:id', findProduct, async (req, res) => {  
    console.log('<READ> id: ', req.params.id) 
    res.json(res.product)  //response from function: {}
})

//POST
router.post('/', async (req, res) => { 
    const newProduct = new Product({
        name: req.body.name, 
        code: req.body.code
    })

    if(req.body.price != null){
        newProduct.price = req.body.price
     }
    //Persist in database
    try {
        const created = await newProduct.save();  
        res.status(201).json(created)     //201 Created
    } catch (error) {
        res.status(400).json({message: error.message})     //400 Bad Request: if something is missing in the request (name or code)
    }
})

//PATCH
router.patch('/:id', findProduct, async (req, res) => {
    if(req.body.name != null){
        res.product.name = req.body.name
     }
     if(req.body.code != null){
        res.product.code = req.body.code
     }
     if(req.body.price != null){
        res.product.price = req.body.price
     }
    try {
        const updProduct = await res.product.save()
        res.json(updProduct)     //200 OK (default)
    } catch (error) {
        return res.status(400).json( {message:error.message}) 
    }
 })

//DELETE
router.delete('/:id', findProduct, async(req, res) => { 
    try {
        await res.product.deleteOne()       //remove() was deprecated 
        res.json({message:'Product deleted'})
    } catch (error) {
        return res.status(500).json( {message:error.message}) 
    } 
 })
//Function to Fetch by ID (native)
 async function findProduct(req, res, next){
    let myProduct
    try {
        myProduct = await Product.findById(req.params.id)
        if(myProduct == null){  //means not exists
            return res.status(400).json({message:'Unable to find Product'})
        }
    } catch (error) {
        return res.status(500).json( {message:error.message})
    }
    
    console.log('pricing: ', myProduct.getPricing());
    res.product = myProduct
    
    next()
}

/*  OPERATIONS BY NAME (Mongoose Basic Operations)  */
// GET (read by Name)
router.get('/byname/:name', getProductByName, async (req, res) => {  
    console.log('<get.byname> name: ', req.params.name) 
    res.json(res.list)  //response from function : []
})

//findOneAndUpdate by Name
router.patch('/byname/:name', async (req, res) => {  
    console.log('<patch.byname> name: ', req.params.name) 
    try {
        let response
        let filterQ = {name:req.params.name}
        let updQ = {}
        if(req.body.code != null){
            updQ.code = req.body.code
         }
         if(req.body.price != null){
            updQ.price = req.body.price
         }
        response = await Product.findOneAndUpdate(
            filterQ, 
            updQ,
            { new: true}) //to return updated doc (default previous doc)
        console.log(response);
        res.json(response) 
    } catch (error) {
        return res.status(500).json( {message:error.message})
    }
})
//DELETE by Name
router.delete('/byname/:name', async (req, res) => {  
    console.log('<delete.byname> name: ', req.params.name) 
    try {
        let response
        let filterQ = {name:req.params.name}
        response = await Product.findOneAndDelete(    //findOneAndRemove was deprecated
            filterQ ) //it returns deleted document
        console.log(response);
        res.json(response) 
    } catch (error) {
        return res.status(500).json( {message:error.message})
    }
 })

// Function to Fetch Record via Query from Params
async function getProductByName(req, res, next){
    let myProducts
    try {
        let pName = req.params.name;
        let query = { name: pName }
        myProducts = await Product.find(query)
        if(myProducts == null){  //means list is null
            return res.status(400).json({message:'Unable to find Products By Name'})
        }
    } catch (error) {
        return res.status(500).json( {message:error.message})
    }
    res.list = myProducts
    next()
}


//Query Building
router.get('/mysearch/:order',  async (req, res) => { 
    console.log('<mysearch>');
    let order = req.params.order
    console.log(`order: ${order}`);
    try {
        // Query
        await Product.find()               // find all documents
                   // .skip(100)                   // skip the first n items
                    .limit(10)                   // limit to 10 items
                    .sort({ price: order })      // ordening ascending/descending by price
                    .select({ name: true, price: true}) // get name and price only
                    .exec()                      // execute the query
                    .then((docs) => {
                        console.log(docs);
                        res.json(docs) 
                    })
                    .catch((err) => {
                        console.error(err);
                         res.json([]) 
                    });
    } catch (err) {
        res.status(500).json( { message: err.message })   //500 Internal Server Error (Nothing to validate, must be on server side)
    } 
})

//next() callback says to move to the next section of the parent code

module.exports = router
