const { readFileSync } = require("fs");

class JsonParser{
    constructor(filePath){
        this.filePath =  filePath;
    }
    parse(){
        // Get content from file
        var contents = readFileSync(this.filePath);
        // Define to JSON type
        return JSON.parse(contents);
    }
}
module.exports= JsonParser;