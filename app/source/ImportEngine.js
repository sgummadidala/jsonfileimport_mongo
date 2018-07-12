const jsonParser=require('./util/parser');
const dbHelper = require('./dbHelper');

class ImportEngine {

    ParseFileContent(){
        var parser = new jsonParser('./app/data/masterdata.json');
        var recordsToBeSaved = parser.parse(); //Returns Array
        return recordsToBeSaved;
    }
    GroupRecordByCollectionName(recordsToBeSaved){
        //Avoiding saving records one by one, instead group records based on the type property in each record.
        //Once grouped, trigger one bluk insertion statement to mangodb
        //Sample Objects:
        // {
        // 	"$type":"Company", => Collection Name
        // 	"code":"ManuLife",
        // 	"Address":"Toronto"
        // }
        // {
        // 	"$type":"Company",
        // 	"code":"TRIBALSCALE",
        // 	"Address":"Toronoto"
        // },

        var dictionaryRecords ={}; //Simulating a dictionary => Equivalent to C# Dictionary<string,List<Object>>

        recordsToBeSaved.forEach(e=>{
            var collectionName = e["$type"];
            delete e["$type"]; //Remove type before saving to database.
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

            //There must be only one call to database for each batch insertion.
            mongoDBHelper.SaveRecord(collectionName,arrayOfObjectsToBeSaved); 
        });
    }

    import(){
        //Step-1 => Read json data from text file
        var recordsToBeSaved = this.ParseFileContent();
        
        //Step-2: Groud Records for batch insertion
        var groupedRecordsByCollectionName = this.GroupRecordByCollectionName(recordsToBeSaved);

        //Step-3: Trigger batch insertion command
        this.saveRecords(groupedRecordsByCollectionName);
    }
}

module.exports = ImportEngine;

