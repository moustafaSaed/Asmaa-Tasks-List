// Elements

const form = document.querySelector(".form");
const input = document.querySelector(".input");
const addBtn = document.querySelector(".add");


var tasks = [];  // 1

var storedTasks = window.localStorage.getItem("tasks");
if(storedTasks){
    tasks = JSON.parse(storedTasks);
}



addBtn.addEventListener("click", function(){
    if(input.value == "") {
        document.querySelector(".error").textContent = "Please write a specific task .. !";
    } else {
        document.querySelector(".error").textContent = "";
        tasks.push(input.value);
        input.value = "";
        stringTasks = JSON.stringify(tasks);
        window.localStorage.setItem("tasks", stringTasks); 
    }
    var getTasks = window.localStorage.getItem("tasks");
    var updatedTasks = JSON.parse(getTasks);

    updatedTasks.forEach(task => {
        console.log(`task  : ${task}`);
    });
})



// window.localStorage.removeItem("tasks");