const fs = require('fs')
const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: "C:/Users/Roopesh/Desktop/Book1.xlsx" // fs.readFileSync return a Buffer
});
//First sheet should be named "Book1"

var jsonData = JSON.stringify(result)

fs.writeFile("../public/data.json", jsonData, function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
    console.log("JSON file has been saved.");
})

//first run code above with below code commented and then run the code below


const json = require('../public/data.json')
let final_data = []
for (let i = 1; i < json.Book1.length; i++) {

    final_data.push({ "word": json.Book1[i].A, "weight": json.Book1[i].B, "click": [{ 'label': 'business', 'link': 'https://www.google.com' }, { 'label': "finance", 'link': 'https://www.yahoo.com' }, { 'label': 'account', 'link': 'https://www.duckduckgo.com' },] })
}
fs.writeFile("../public/data.json", JSON.stringify(final_data), function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
    console.log("JSON file has been saved.");
});