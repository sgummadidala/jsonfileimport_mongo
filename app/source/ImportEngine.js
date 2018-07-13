const jsonParser=require('./util/parser');
const dbHelper = require('./dbHelper');

class ImportEngine {

    ParseFileContent(){
        var parser = new jsonParser('./app/data/ratesapidata.json');
        var recordsToBeSaved = parser.parse(); //Returns Array
        return recordsToBeSaved;
    }
    VerifyAndDeleteIfRecordExists(recordsToBeSaved){
        var dictionaryRecords ={};

        recordsToBeSaved.forEach(record=>{
            var findRecordObject = record["Find"];
            var collectionName = record["$type"];

            if(!dictionaryRecords.hasOwnProperty(collectionName))
            {
                dictionaryRecords[collectionName] = new Array();
            }
            dictionaryRecords[collectionName].push(findRecordObject);
        })

        //Connect to database , issue remove command
        var mongoDBHelper = new dbHelper();
        Object.keys(dictionaryRecords).forEach((key,index)=>{
            var arrayOfObjectsToBeDeleted = dictionaryRecords[key]; 
            var collectionName = key;

            arrayOfObjectsToBeDeleted.forEach(r=>{
                mongoDBHelper.RemoveRecord(collectionName,r); 
            })
            
        });
    }
    GroupRecordByCollectionName(recordsToBeSaved){
        var dictionaryRecords ={};
        recordsToBeSaved.forEach(e=>{
            var collectionName = e["$type"];
            delete e["$type"]; //Remove type before saving to database.
            delete e["Find"];
            if(!dictionaryRecords.hasOwnProperty(collectionName))
            {
                dictionaryRecords[collectionName] = new Array();
            }
            dictionaryRecords[collectionName].push(e);
        });
        return dictionaryRecords;
    }
    saveRecords(dictionaryRecords){
        var mongoDBHelper = new dbHelper();
        Object.keys(dictionaryRecords).forEach((key,index)=>{
            var arrayOfObjectsToBeSaved = dictionaryRecords[key]; 
            var collectionName = key;

            mongoDBHelper.SaveRecord(collectionName,arrayOfObjectsToBeSaved); 
        });
    }

    import(){
        //Step-1 => Read json data from text file
        var recordsToBeSaved = this.ParseFileContent();
        
        //Step-2 => Delete if there are any existing records in db.
        this.VerifyAndDeleteIfRecordExists(recordsToBeSaved);

        //Step-3: Groud Records for batch insertion
        var groupedRecordsByCollectionName = this.GroupRecordByCollectionName(recordsToBeSaved);

        //Step-4: Trigger batch insertion command
        this.saveRecords(groupedRecordsByCollectionName);
    }
}

module.exports = ImportEngine;

