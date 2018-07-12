const jsonParser=require('./app/source/util/parser');
const dbHelper = require('./app/source/dbHelper');

//Step 1: Read json data from text file
var parser = new jsonParser('./app/data/masterdata.json');
var recordsToBeSaved = parser.parse(); //Returns Array

//Step 2: Save each record in the array
var mongoDBHelper = new dbHelper();
recordsToBeSaved.forEach(element => {
	mongoDBHelper.SaveRecord(element);
});




 
  
