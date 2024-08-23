#! /usr/bin/env node
const { Command } = require('commander');

// import the fs module to read and write to file 
const fs = require("fs")
const path = require('path')
const fp = path.join(__dirname,"/data/tasks.json")


// declare the `program` variable 
const program = new Command();


// helper function 
const generate_id = (data) => {
    length = data.length
    return length + 1 
}


// status enum 
const Status = {
    Todo : Symbol("todo"),
    Ip: Symbol("in-progress"),
    Done: Symbol("done")
}


program
    .name('task-cli')
    .description('CLI to allow a user to add/delete/update/read tasks and their status')
    .version('0.1.0')


// command to add a task 
program
    .command('add')
    .description(' add a task to the task list ')
    .argument('<task>',"a task todo")
    .action(
        (task) => {
            // step 1: check if data file exists
                // if it does not exist, create a file with an empty list 
                // if it exists, read the length of the data 
            const exists = fs.existsSync(fp)
            if (!exists){
                fs.writeFileSync(fp,"[]")
            }
            let data = require(fp)
            let id = generate_id(data)
            let task_obj = {
                "id":id,
                "description": task,
                "status": Status.Todo, // the default status
                "createdAt": new Date(),
                "updatedAt": ""
            }

            data.push(task_obj)

            // overwrite existing file
            fs.writeFile(
                fp,
                JSON.stringify(data),
                (err) => {
                    if (err) throw err
                    console.log("Task Added Successfully (ID: )", task_obj.id)
                }
            )
            }
       
    )


// command to update a task by their id 
// user input :
// 1) id of the task to update (rmbr to check if such task exists. how to handle a task that doesn't exist )
// 2) a string which is the updated description of the task 

program
    .command("update")
    .description("updating a task and their description ")
    .argument("<task_id>","the id indicating the task to be updated")
    .argument("<description>","the updated version of the description")
    .action(
        (task_id, description)=> {

            let exist = false  // a boolean variable which indicates if the task exists in the array 
            
            // check if id exists by looping through the array 
            // if it exists, update the data object. 
            let data = require(fp)
            for ( let i = 0; i < data.length; i++){
                if (data[i].id == parseInt(task_id)){
                    // work on this 
                    exist = true 
                    data[i].description = description;
                    data[i].updatedAt = new Date()                   

                    fs.writeFile(
                        fp,
                        JSON.stringify(data),
                        (err) => {
                            if (err) throw err
                            console.log("Task Updated Successfully (ID: )", data[i].id)
                        }
                    )
                }
            }
  

            // if it does not exist, print a message to user telling them it does not exist 
            if (exist == false){
                console.log("task does not exist bro.")
            }
          
    })



program.parse()


