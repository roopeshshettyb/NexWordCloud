const fs = require('fs')
const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: "C:/Users/Roopesh/Desktop/Book1.xlsx" // fs.readFileSync return a Buffer
});

var jsonData = JSON.stringify(result)

fs.writeFile("../public/data.json", jsonData, function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
    const json = require('../public/data.json')
    let final_data = []
    var sheet_Name
    for (let key in json) {
        sheet_Name = key
        break
    }
    for (let i = 1; i < json[sheet_Name].length; i++) {

        final_data.push({ "word": json[sheet_Name][i].A, "weight": json[sheet_Name][i].B, "click": [{ 'label': 'business', 'link': 'https://www.google.com' }, { 'label': "finance", 'link': 'https://www.yahoo.com' }, { 'label': 'account', 'link': 'https://www.duckduckgo.com' },] })
    }
    fs.writeFile("../public/data.json", JSON.stringify(final_data), function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
})

