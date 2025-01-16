// Elements

const form = document.querySelector(".form");
const input = document.querySelector(".input");
const addBtn = document.querySelector(".add");
const tasksBox = document.querySelector(".tasks");
const empty = document.querySelector(".no-tasks"); // appear when there is no tasks
const taskQuantity = document.querySelector(".quantity");
const message = document.querySelector(".message");
const messageTxt = document.querySelector(".message .txt");
const undoBtn = document.querySelector(".undo");
const filters = document.querySelectorAll(".filter-nav li"); // 3 filters li



/* a function for :
    - create task elements
    - add classes to elements
    - add elements to the page
*/
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

/* a function for making a message as alert at 
    -- success
    -- failed
    -- info 
*/
var alertMess = function(txt,type){
    if(type == "success"){
        message.classList.add("success");
    } else if(type == "info") {
        message.classList.add("info");
    } else if(type == "failed") {
        message.classList.add("failed");
    } else {
        message.style.display = "none";
    }

    messageTxt.textContent = txt;
    message.style.right = "30px";

    setTimeout(() => {
        message.style.right = "-30vw";
    }, 3300);
}


var tasks = [];  // 1
var currentTasks = []; 
var completedTasks = [];  


//                 ---          Handeling Local Storage         ---

// check if there is a tasks in the browser local storage
var storedTasks = window.localStorage.getItem("tasks");

if(storedTasks){ 
        tasks = JSON.parse(storedTasks);
        if(tasks.length > 0) {
            empty.textContent = "";
            empty.classList.remove("more");
            taskQuantity.textContent =`عدد المهام : ${tasks.length} مهمة`;
        } else {
            taskQuantity.textContent =`في انتظار المهام ..`;
            empty.textContent = "لا يوجد عبادات أو مهمات بعد ..";
            empty.classList.add("more");
        }
        
    } else {
    taskQuantity.textContent =`في انتظار المهام ..`;
    empty.textContent = "لا يوجد عبادات أو مهمات بعد ..";
    empty.classList.add("more");
}

var storedCompleteTasks = window.localStorage.getItem("completed-tasks");
if(storedCompleteTasks) {
    completedTasks = JSON.parse(storedCompleteTasks);
}

var storedCurrentTasks = window.localStorage.getItem("current-tasks");
if(storedCurrentTasks) {
    currentTasks = JSON.parse(storedCurrentTasks);
}

// put an active class on the filtering box
var activeFilter = window.localStorage.getItem("activeEl");
if(activeFilter){
    var activeValue = JSON.parse(activeFilter);
    filters.forEach(one=>{
        one.classList.remove("active");
        if(one.textContent === activeValue) {
            one.classList.add("active");
        }
    })
}


// showing the tasks if exist
if(document.querySelector('.nav .all').classList.contains("active")) {
    tasks.forEach(task => {
        createTaskTemplate(task.taskValue);
        taskQuantity.textContent =`عدد المهام : ${tasks.length} مهمة`;
    });
} else if(document.querySelector('.nav .current').classList.contains("active")) {
    currentTasks.forEach(task => {
        createTaskTemplate(task.taskValue);
        taskQuantity.textContent =`عدد المهام الحالية  : ${currentTasks.length} مهمة`;
    });
} else if(document.querySelector('.nav .comp').classList.contains("active")) {
    completedTasks.forEach(task => {
        createTaskTemplate(task.taskValue);
        taskQuantity.textContent =`عدد المهام المكتملة : ${completedTasks.length} مهمة`;
    });
}

// filteration 

filters.forEach(filter => {
    filter.addEventListener("click",()=>{

        // Handeling Local Storage 
        filters.forEach(el=>el.classList.remove("active")); // remove all active classes
        filter.classList.add("active"); // put an active class on the target one
        activeValue = JSON.stringify(filter.textContent); // string the value to be storable in local storage
        window.localStorage.setItem("activeEl",activeValue); // set the value in the local storage
        

        var type = filter.getAttribute("data-type");
        console.log(type);
        switch (type) {
            case "comp":
                var completedTasks = tasks.filter(task => task.isCompleted === true);
                var stringTasks = JSON.stringify(completedTasks);
                window.localStorage.setItem("completed-tasks", stringTasks);
                window.location.reload();
                break;
            case "current":
                var currentTasks = tasks.filter(task => task.isCompleted === false);
                var stringTasks = JSON.stringify(currentTasks);
                window.localStorage.setItem("current-tasks", stringTasks);
                window.location.reload();
                break;
            case "all":
                var allTasks = tasks;
                var stringTasks = JSON.stringify(allTasks);
                window.localStorage.setItem("tasks", stringTasks);
                window.location.reload();
                break;
                default:
                window.location.reload();
                break;
        }
    })
});

const tasksArr = document.querySelectorAll(".tasks .task");

// check if the task is completed or not 
tasksArr.forEach((el,index) => {
    if(tasks[index].isCompleted) {
        el.classList.add("completed");
    } else {
        el.classList.remove("completed");
    }
});


// when click on addTask button 
addBtn.addEventListener("click", function(){
    if(input.value == "") {
        document.querySelector(".error").textContent = "برجَاء كِتَابة عِبَادةٌ ما أو مُهمَّةٌ ما ..";
        document.querySelector(".error").style.backgroundColor = "#fff";

    } else {
        document.querySelector(".error").textContent = "";
        tasks.push({
            id: Date.now(),
            taskValue: input.value,
            isCompleted : false
        });
        var inputValue = input.value;
        input.value = "";
        stringTasks = JSON.stringify(tasks);
        window.localStorage.setItem("tasks", stringTasks); 
        var getTasks = window.localStorage.getItem("tasks");
        tasks = JSON.parse(getTasks);
        alertMess(`تمَّت إضَافة المُهمَّة : " ${inputValue} " بنجـَـاح`,"success");
        setTimeout(() => {
            window.location.reload();
        }, 3300);
    }
})


// complete task button
const doneBtns = document.querySelectorAll(".done")
doneBtns.forEach(btn => {

    btn.addEventListener("click", ()=>{

        var targetValue = btn.parentElement.parentElement.querySelector(".txt").innerHTML;
        var targetIndex = tasks.findIndex(item => item.taskValue === targetValue);

        if(btn.parentElement.parentElement.classList.contains("completed")) {
            btn.parentElement.parentElement.classList.remove("completed");
            tasks[targetIndex].isCompleted = false;
            var stringTasks = JSON.stringify(tasks);
            window.localStorage.setItem("tasks", stringTasks);
        } else {
            btn.parentElement.parentElement.classList.add("completed");
            tasks[targetIndex].isCompleted = true;
            var stringTasks = JSON.stringify(tasks);
            window.localStorage.setItem("tasks", stringTasks);
        }
    });
});



// delete task button
const deleteBtn = document.querySelectorAll(".delete");

deleteBtn.forEach(btn => {
    btn.addEventListener("click", ()=>{
        var targetValue = btn.parentElement.parentElement.querySelector(".txt").innerHTML;
        var targetIndex = tasks.findIndex(item => item.taskValue === targetValue);
        var deletedId = tasks[targetIndex].id;
        var deletedValue = tasks[targetIndex].taskValue;
        var deletedIsCompleted = tasks[targetIndex].isCompleted;
        tasks.splice(targetIndex, 1);
        
        stringTasks = JSON.stringify(tasks);
        window.localStorage.setItem("tasks", stringTasks);

        alertMess(`تم حذف المهمة : " ${targetValue} " بنجاح`,"failed");

        undoBtn.addEventListener("click", ()=> {
            tasks.push({
                id: deletedId,
                taskValue: deletedValue,
                isCompleted : deletedIsCompleted
            });
            stringTasks = JSON.stringify(tasks);
            window.localStorage.setItem("tasks", stringTasks); 
        })

        setTimeout(() => {
            window.location.reload();
        }, 3000);
    })
});


const deleteAllBtn = document.querySelector(".delete-all");
console.log(deleteAllBtn);
deleteAllBtn.addEventListener("click", ()=>{
    window.localStorage.removeItem("tasks");
    window.location.reload();
})