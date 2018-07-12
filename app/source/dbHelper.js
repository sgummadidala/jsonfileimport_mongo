
const MongoClient = require('mongodb');

class MongoHelper{
    
    constructor(){
        //Initialization stuff
        this.connectionString='mongodb://localhost:27017/test';
    }
    insertDocuments(db,record,callback) {
        var collectionName = record["$type"];

        // Get the documents collection
        var collection = db.collection(collectionName);
        // Insert some documents
        collection.insert(record, function(err, result) {
                assert.equal(err, null);
                console.log("Inserted into the collection");
                callback(result);
        });
    }
    SaveRecord(collectionName,arrayOfRecords){
        MongoClient.connect(this.connectionString, function(err, db) {
            if(!err){
                console.log("Connected successfully to server");

                // Get the documents collection
                var collection = db.collection(collectionName);

                collection.insertMany(arrayOfRecords, function(err, result) {
                        console.log("Inserted into the collection");
                });
                db.close();
            }
        });
    }
}

module.exports=MongoHelper;