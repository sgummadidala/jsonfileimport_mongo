
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
    SaveRecord(record){
        MongoClient.connect(this.connectionString, function(err, db) {
            if(!err){
                console.log("Connected successfully to server");

                // Get the documents collection
                var collection = db.collection(record["$type"]);
                delete record["$type"]; //delete this before inserting into db

                collection.insert(record, function(err, result) {
                        console.log("Inserted into the collection");
                        //callback(result);
                });
                //insertDocuments(db, record,function() {
                    db.close();
               // });
            }
        });
    }
}

module.exports=MongoHelper;