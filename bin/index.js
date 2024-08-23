#! /usr/bin/env node
const { Command } = require('commander');

// import the fs module to read and write to file 
const fs = require("fs")
const fp = "./data/tasks.json"

// declare the `program` variable 
const program = new Command();


// helper function 
const generate_id = (data) => {
    length = data.length
    return length + 1 
}


// enum 
const Status = {
    Todo : Symbol("todo"),
    Ip: Symbol("in-progress"),
    Done: Symbol("done")
}




program
    .name('task-cli')
    .description('CLI to allow a user to add/delete/update/read tasks and their status')
    .version('0.1.0')

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




program.parse()


