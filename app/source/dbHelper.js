
const MongoClient = require('mongodb');

class MongoHelper{
    
    constructor(){
        //Initialization stuff
        this.connectionString='mongodb://localhost:27017/test';
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
    RemoveRecord(collectionName,arrayOfRecords){
        MongoClient.connect(this.connectionString, function(err, db) {
            if(!err){
                console.log("Connected successfully to server");

                // Get the documents collection
                var collection = db.collection(collectionName);

                collection.remove(arrayOfRecords, function(err, result) {
                        console.log("Records deleted from the collection.");
                });
                db.close();
            }
        });
    }
}

module.exports=MongoHelper;