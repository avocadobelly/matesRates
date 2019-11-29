const express = require('express')
const bodyParser = require('body-parser')
const Decimal = require('decimal.js')
const MongoClient = require('mongodb').MongoClient
const app = express()
const port = 4400
const url = 'mongodb://localhost:27017'
var jsonParser = bodyParser.json()

var addNewAccount = (db, accountData) => {
    var collection = db.collection('accounts')
    collection.insertOne(accountData)
}

var getAllAccountsData = (db, callback) => {
    var collection = db.collection('accounts')
    collection.find({}).toArray((err, docs) => {
        callback(docs)
    })
}

var getAccountsBelowBal = (db, upperBal, callback) => {
    var collection = db.collection('accounts')
    collection.find({balance: {$lt: upperBal}}).toArray((err, docs) => {
        results = []
        docs.forEach(doc => {
            doc.balance = doc.balance.toString()
            results.push(doc)
        })
        callback(results)
    })
}

app.post('/accounts', jsonParser, (req, res) => {
//these will be the names for the url:
    const name = req.body.name
    const balance = req.body.balance

    let accountData = {
        accountHolder: name,
        balance: balance
    }

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        console.log('Connected correctly to MongoDb')
        let db = client.db('matesRates')

        let result = addNewAccount(db, accountData)

        client.close()
    })
res.send('added new account')
})

app.get('/accounts', (req, res) => {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        console.log('Connected correctly to MongoDb')
        let db = client.db('matesRates')
        let result = getAllAccountsData(db, (allAccounts) => {
            res.json(allAccounts)
        })
        client.close()
    })
    res.send('got accounts')
});

app.get('/accounts/:balance/andBelow', (req, res) => {
    let upperBal = req.params.balance
    upperBal = parseFloat(upperBal)
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        console.log('Connected correctly to MongoDb')
        let db = client.db('matesRates')
        let result = getAccountsBelowBal(db, upperBal, (accounts) => {
            res.json(accounts)
        })
        client.close()
    })
});

app.listen(port, () => console.log(`app listening on port ${port}`))
