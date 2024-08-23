
const generate_id = (data) => {
    length  = data.length
    return length + 1;
}

/*
"id":1,
"description":"do dishes",
"status":"in-progress",
"createdAt": "2024-11-13T05:30:22.000Z",
"updatedAt": "2024-11-14T03:30:22.000Z"
*/

// import the fs module
const fs = require("fs")

// reading data from json file 
const data = require('./data/tasks.json')
id = generate_id(data)
console.log("id for the next task is", id)


// create a data object 
let task = {
    "id": id,
    "description": "do homework",
    "status": "in-progress",
    "createdAt": new Date(),
    "updatedAt": ""
}


// writing data to json file 
data.push(task)

// write to file 
fs.writeFile(
    "./data/tasks.json",
    JSON.stringify(data),
    err => {
        if (err) throw err;

        console.log("data written successfully")
    }
)
