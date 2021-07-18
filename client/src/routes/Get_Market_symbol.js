// Requiring users file
var fs = require("fs")

let user = {
    "EQLIST":[],
    "FOLIST":[],
    "COMLIST":[],
}
let data = {}
data = {...data,...user}
fs.writeFile("symbols_data.json", JSON.stringify(data), err => {
    if (err) throw err; 
    console.log("Done writing"); // Success
});