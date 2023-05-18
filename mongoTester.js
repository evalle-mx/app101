const MongoClient = require('mongodb').MongoClient
require('dotenv').config();

const client = new MongoClient(process.env.ATLAS_URL)

const attemptToConnect = () => {
    client.connect()
    .then( cli => {
        //console.log('Connected: ', cli);
        console.log('Connected: ')
    })
    .then(_ => {
        client.close().then(_ => {
            console.log('Closed Database connection');
        })
    })
    .catch(err => {
        console.error(err);
    })
}

// attemptToConnect();

/* Read a document */
const findOne = (databaseName, collectionName, productName) => {
    client
    .connect()
    .then( cli => {
        //get Database
        const database = cli.db(databaseName);
        //get collection
        const collection = database.collection(collectionName);

        //Query predicate (search where product.name is..)
        const query = { name: productName };

        return collection.findOne(query);
    })
    .then( (document) => {
        if(document){
            console.log('SUCCESS!!! ');
            console.log(document);
        }
        else {
            console.log(`eRROR: \n ${productName} was Not found in the collection ${collectionName} `);
        }
    })
    .then(_ => {
        client.close().then(_ => {
            console.log('Closed Database connection');
        })
    })
    .catch(err => {
        console.error(err);
    })
}


/* Insert documents */
const addDocs = (databaseName, collectionName) => {
    client
    .connect()
    .then( cli => {
        const database = cli.db(databaseName);
        const collection = database.collection(collectionName);

        //Query predicate (search where product.name is..)
        const documents = [
            { name: 'T-shirt', code:101 },
            { name: 'Boots', code:125 },
            { name: 'Socks', code:808 }
        ];

        return collection.insertMany(documents);
    })
    .then( (res) => {
        if(res){
            console.log('SUCCESS!!! ');
            console.log(res);
        }
        else {
            console.log(`eRROR`);
        }
    })
    .then(_ => {
        client.close().then(_ => {
            console.log('Closed Database connection');
        })
    })
    .catch(err => {
        console.error(err);
    })
}

findOne('clevydb', 'products', 'Jacket');

//addDocs('demodb', 'products');