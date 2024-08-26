#! /usr/bin/env node
const { Command } = require('commander');

// import the fs module to read and write to file 
const fs = require("fs")
const path = require('path')
const fp = path.join(__dirname,"/data/tasks.json")


// declare the `program` variable 
const program = new Command();


// helper function 
// this function generates a new id for the new task
const generate_id = (data) => {
    length = data.length
    return length + 1 
}

// this function writes to the json file 
const write_to_file = (task_name,data, task_id) => {
    const exists = fs.existsSync(fp)
    if (!exists){
        fs.writeFileSync(fp,"[]")
    }
    
    fs.writeFile(
        fp,
        data,
        (err) => {
            if (err) throw err
            console.log(task_name + " success! task id", task_id)
        }
    )


}




// status enum 
const Status = {
    Todo : "todo",
    Ip: "in-progress",
    Done: "done"
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

program
    .command("delete")
    .description("delete a task by their id")
    .argument("<task_id>","the id of the task that we want to delete")
    .action(
        (task_id) => {

            // get data 
            const data = require(fp)
            
            let index; // the index from which we need to start updating ids

            let isFound = false; // indicate whether or not we found a matching id to delete

            for (let i = 0; i < data.length; i++){
                if (data[i].id == parseInt(task_id)){
                    isFound = true;
                    data.splice(i, 1);
                    index = i;
                }
            }

            // if an element is found, then we delete
            if (isFound === true){
                // update the ids
                for ( let i = index; i < data.length; i++){
                    data[i].id = i + 1;
                }

                fs.writeFile(
                    fp,
                    JSON.stringify(data),
                    (err) => {
                        if (err) throw err
                        console.log("deleted! task id", task_id)
                    }
                )
            }else {
                console.log("did not find a matching task id")
            }

        }
         
    )

program 
    .command('mark-in-progress')
    .description('mark a task as in progress')
    .argument("<task-id","the id of the task to be marked as in progress")
    .action(
        (task_id) => {
            
            // get all the data 
            const data = require(fp)

            // make sure task id exists 
            if (parseInt(task_id) <= data.length) {
               let task_index = parseInt(task_id) - 1
               let task = data[task_index]
               
               task.status = Status.Ip
               task.updatedAt = new Date();

               write_to_file("Mark In Progress", JSON.stringify(data),task_id)

            }else {
                console.log("task id does not exist")
            }
        }
    )

program.parse()




