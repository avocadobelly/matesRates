const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
//what does 'this'v do?
const app = express()
const port = 4400
const url = 'mongodb://localhost:27017'
var jsonParser = bodyParser.json()


var addNewAccount = (db, accountData) => {
    var collection = db.collection('accounts')
    console.log(accountData)
    collection.insertOne(accountData)
}

app.post('/accounts', jsonParser, function (req, res) {
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

var getAllAccountsData = (db, callback) => {
    var collection = db.collection('accounts')
    collection.find({}).toArray((err, docs) => {
        console.log('found the following records')
        callback(docs)
    })
}

app.get('/accounts', function(req, res) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        console.log('Connected correctly to MongoDb')
        let db = client.db('matesRates')

        let result = getAllAccountsData(db, (allAccounts) => {
            console.log(allAccounts)
            res.json(allAccounts)
        })
        //close client after you opened it:
        client.close()
    })
    res.send('got accounts')
});




app.listen(port, () => console.log(`app listening on port ${port}`))