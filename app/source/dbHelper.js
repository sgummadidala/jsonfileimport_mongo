
const MongoClient = require('mongodb');

var Connect = ()=>{
        return MongoClient.connect('mongodb://localhost:27017/test');
    };

var SaveRecord= (collectionName,arrayOfRecords)=>{
        this.Connect().then(function(db) {
            if(!db){
                console.log("Connected successfully to server");

                // Get the documents collection
                var collection = db.collection(collectionName);

                collection.insertMany(arrayOfRecords, function(err, result) {
                        console.log("Inserted into the collection");
                });
                db.close();
            }
        });
    };
var RemoveRecord = (collectionName,arrayOfRecords)=>{
        this.Connect().then(function(err, db) {
            if(!err){
                console.log("Connected successfully to server");

                // Get the documents collection
                var collection = db.collection(collectionName);

                // collection.remove(arrayOfRecords, function(err, result) {
                //         console.log("Records deleted from the collection.");
                // });
                collection.remove(arrayOfRecords, function(err, result) {
                    console.log("Records deleted from the collection.");
                });
                db.close();
            }
        });
    };
    var findRecord=(collectionName,record,dbo)=>{
        return new Promise(function(resolve,reject){
            // Get the documents collection
            var collection = dbo.collection(collectionName);
            console.log("find");
            resolve(collection.find(record["Find"]));
        });
    }
    var deleteRecord=(collectionName,record,dbo)=>{
        return new Promise(function(resolve,reject){
            // Get the documents collection
            console.log("delete");
            resolve(dbo.collection(collectionName).remove(record));
        });
    }
    var insertRecord=(collectionName,record,dbo)=>{
        return new Promise(function(resolve,reject){
            // Get the documents collection
            var collection = dbo.collection(collectionName);
            console.log("insert");
            resolve(dbo.collection(collectionName).insert(record));
        });
    }
    
    var performTransaction = (collectionName,record,dbo) => {
        console.log("====Starting a transaction=====");
        return findRecord(collectionName,record,dbo)
                .then(deleteRecord(collectionName,record,dbo))
                .then(insertRecord(collectionName,record,dbo))
    };
    var processCollection = (collectionName,arrayOfRecords) => {
        Connect().then(
          (db) => {
              var array = [];
              const dbo = db.db("test");
                Promise.all(
                    arrayOfRecords.map(element => performTransaction(collectionName,element,dbo))
                    //For each record perform a delete followed by insert.
                )
                .then(function() {
                    db.close();
                    console.log("done");
                })
                .catch(function(err) {
                    console.error("err", err);
                });
            }

        );
    };
    var processRecords=(dictionaryOfRecords)=>
    {
        Object.keys(dictionaryOfRecords).forEach((key,index)=>{
            var arrayOfObjectsToBeProcessed = dictionaryOfRecords[key]; 
            var collectionName = key;

            //process one collection at a time.
            processCollection(collectionName,arrayOfObjectsToBeProcessed); 
        });
    };

module.exports=processRecords;