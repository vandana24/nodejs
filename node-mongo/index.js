const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dboper = require('./operation')
const url = 'mongodb://localhost:27017/conFusion';
 

MongoClient.connect(url).then((client) => {
    db = client.db('conFusion');
    console.log("connected correctly to server");

    dboper.insertDocument(db, { name: "vandy", description: "test" }, "dishes")
    .then((result) => {
        console.log("Insert Document:\n", result.ops);

        return dboper.findDocuments(db, "dishes");
    })
    .then((docs) => {
            console.log("Found documents:\n", docs);
            return dboper.updateDocument(db, { name: 'vandy' },
                     { description: 'Update test' }, "dishes");
        })
    .then((result) => {
            console.log("update Document:\n", result.result);

            return dboper.findDocuments(db, "dishes");
    })
    .then((docs) => {
        console.log("Found documents:\n", docs);
        return db.dropCollection("dishes");
     })
    .then((result) => {
            console.log("Dropped Collection:", result);
            return client.close();
                        
        })
        .catch((err) =>console.log(err));
        
        
            
},(err) => console.log(err))
.catch((err) =>console.log(err));
