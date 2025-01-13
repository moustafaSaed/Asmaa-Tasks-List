// Elements

const form = document.querySelector(".form");
const input = document.querySelector(".input");
const addBtn = document.querySelector(".add");
const tasksBox = document.querySelector(".tasks");
const empty = document.querySelector(".no-tasks");


var createTaskTemplate = function(content) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    tasksBox.appendChild(taskItem);

    const taskTxt = document.createElement("div");
    taskTxt.classList.add("txt");
    taskTxt.textContent = content;
    taskItem.appendChild(taskTxt);

    const actionsBox = document.createElement("div");
    actionsBox.classList.add("actions");
    taskItem.appendChild(actionsBox);


    const doneBtn = document.createElement("div");
    doneBtn.classList.add("btn", "done");
    doneBtn.textContent = "تم";

    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("btn", "delete");
    deleteBtn.textContent = "مسح";

    actionsBox.appendChild(doneBtn);
    actionsBox.appendChild(deleteBtn);
}

var tasks = [];  // 1

var storedTasks = window.localStorage.getItem("tasks");
if(storedTasks){
        tasks = JSON.parse(storedTasks);
        if(tasks.length > 0) {
            empty.textContent = "";
        } else {
            empty.textContent = "there is no tasks yet";
        }
    
} else {
    empty.textContent = "there is no tasks yet";
}

tasks.forEach(task => {
    createTaskTemplate(task.taskValue);
});


addBtn.addEventListener("click", function(){
    if(input.value == "") {
        document.querySelector(".error").textContent = "Please write a specific task .. !";
    } else {
        document.querySelector(".error").textContent = "";
        tasks.push({
            id: Date.now(),
            taskValue: input.value,
            isCompleted : false
        });
        input.value = "";
        stringTasks = JSON.stringify(tasks);
        window.localStorage.setItem("tasks", stringTasks); 
        var getTasks = window.localStorage.getItem("tasks");
        tasks = JSON.parse(getTasks);
        window.location.reload();
    }
})


const doneBtns = document.querySelectorAll(".done")
doneBtns.forEach(btn => {
    btn.addEventListener("click", ()=>{
        console.log(btn.parentElement.parentElement.querySelector(".txt").innerHTML);
        btn.parentElement.parentElement.classList.toggle("completed");
    })
});


const deleteBtn = document.querySelectorAll(".delete");
deleteBtn.forEach(btn => {
    btn.addEventListener("click", ()=>{
        // const index = tasks.indexOf()
        var targetValue = btn.parentElement.parentElement.querySelector(".txt").innerHTML;
        var targetIndex = tasks.findIndex(item => item.taskValue === targetValue);
        tasks.splice(targetIndex, 1);
        console.log(tasks);
        // btn.parentElement.parentElement.remove();
        stringTasks = JSON.stringify(tasks);
        window.localStorage.setItem("tasks", stringTasks);
        window.location.reload();
    })
});


const deleteAllBtn = document.querySelector(".delete-all");
console.log(deleteAllBtn);
deleteAllBtn.addEventListener("click", ()=>{
    window.localStorage.removeItem("tasks");
    window.location.reload();
})