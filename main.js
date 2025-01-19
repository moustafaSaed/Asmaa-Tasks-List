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




// a function for : - create task elements - add classes to elements - add elements to the page
var createTaskTemplate = function (content, completed) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    if (completed) {
        taskItem.classList.add("completed");
    } else {
        taskItem.classList.remove("completed");
    }
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
    doneBtn.innerHTML = completed ? "&cross;": "&check;";

    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("btn", "delete");
    deleteBtn.textContent = "حذف";

    actionsBox.appendChild(doneBtn);
    actionsBox.appendChild(deleteBtn);
}



// a function for making a message as alert at || Succes - Failed - Info
var alertMess = function (txt, type) {
    if (type == "success") {
        message.classList.add("success");
    } else if (type == "info") {
        message.classList.add("info");
    } else if (type == "failed") {
        message.classList.add("failed");
    } else {
        message.style.display = "none";
    }

    messageTxt.textContent = txt;
    message.style.scale = "1";

    const intervalId = setInterval(() => {
        // Code to be executed once
        message.style.scale = "0";
        // Clear the interval immediately after execution
        clearInterval(intervalId);
    }, 1700);

    message.addEventListener("mouseover", function () {
        clearInterval(intervalId);
    })
    message.addEventListener("mouseout", function () {
        const intervalId = setInterval(() => {
            // Code to be executed once
            message.style.scale = "0";
            // Clear the interval immediately after execution
            clearInterval(intervalId);
        }, 1700);
    })

}


var tasks = [];  // to be stored in local and get from local - the main array
var currentTasks = []; // to be as a new value after filtering the main array
var completedTasks = [];  // to be as a new value after filtering the main array





// Handeling Local Storage   ---
//  > check if there is a tasks in the browser local storage
var storedTasks = window.localStorage.getItem("tasks");

if (storedTasks) { // if you found a tasks in local storage

    tasks = JSON.parse(storedTasks); // remove string from it 
    if (tasks.length > 0) { // if there is a tasks in the defined var in local storage 
        empty.textContent = ""; // delete the content of the empty message element
        empty.classList.remove("more"); // by removing this class > we hide the empty element
        taskQuantity.textContent = ` ${tasks.length} مُهمَّة`; // dynamic div giv the total tasks numbers
    } else {
        taskQuantity.textContent = `فِي انتظَار المَهَام ..`;
        empty.textContent = "لا يُوجَد عِبَادات أو مُهمَّات بَعد ..";
        empty.classList.add("more");
    }

} else { // if there is no tasks in local storage
    taskQuantity.textContent = `فِي انتظَار المَهَام ..`;
    empty.textContent = "لا يُوجَد عِبَادات أو مُهمَّات بَعد ..";
    empty.classList.add("more");
}


// put an active class on the filtering box
var activeFilter = window.localStorage.getItem("activeEl");
if (activeFilter) {
    var activeValue = JSON.parse(activeFilter);
    filters.forEach(one => {
        one.classList.remove("active");
        if (one.textContent === activeValue) {
            one.classList.add("active");
        }
    })
}


// showing the tasks if exist
if (document.querySelector('.nav .all').classList.contains("active")) {
    tasks.forEach(task => {
        createTaskTemplate(task.taskValue, task.isCompleted); // predefined function - (the content of task, if true > put completed class)
    });
    taskQuantity.textContent = ` ${tasks.length} مُهمَّة`;

} else if (document.querySelector('.nav .current').classList.contains("active")) {
    currentTasks = tasks.filter(a => a.isCompleted === false);
    currentTasks.forEach(task => {
        createTaskTemplate(task.taskValue);
    });
    taskQuantity.textContent = `الحَاليَة  : ${currentTasks.length} مُهمَّة`;

} else if (document.querySelector('.nav .comp').classList.contains("active")) {
    completedTasks = tasks.filter(a => a.isCompleted === true);
    completedTasks.forEach(task => {
        createTaskTemplate(task.taskValue, task.isCompleted);
    });
    taskQuantity.textContent = `المُكتَمِلَة : ${completedTasks.length} مُهمَّة`;
}




// filteration 
filters.forEach(filter => {
    filter.addEventListener("click", () => {

        // Handeling Local Storage 
        filters.forEach(el => el.classList.remove("active")); // remove all active classes
        filter.classList.add("active"); // put an active class on the target one
        activeValue = JSON.stringify(filter.textContent); // string the value to be storable in local storage
        window.localStorage.setItem("activeEl", activeValue); // set the value in the local storage


        window.location.reload();
    })
});




// when click on addTask button 
addBtn.addEventListener("click", function () {
    var alreadyExist = false;
    if (input.value == "") {

        document.querySelector(".error").textContent = "برجَاء كِتَابة عِبَادةٌ ما أو مُهمَّةٌ ما ..";
        document.querySelector(".error").style.backgroundColor = "#fff";
        document.querySelector(".error").style.display = "block";

    } else {
        tasks.forEach(task => {
            if (task.taskValue == input.value) {
                alreadyExist = true;
            };
        })

        if (alreadyExist) {
            document.querySelector(".error").textContent = "هذهِ المُهمّة موجودة بالفِعل .. أدخِل مُهمَّة أخرى";
            document.querySelector(".error").style.backgroundColor = "#fff";
            document.querySelector(".error").style.display = "block";
        } else {
            document.querySelector(".error").textContent = "";
            document.querySelector(".error").style.backgroundColor = "unset";
            document.querySelector(".error").style.display = "none";
            tasks.push({
                id: Date.now(),
                taskValue: input.value,
                isCompleted: false
            });
            var inputValue = input.value;
            input.value = "";
            stringTasks = JSON.stringify(tasks);
            window.localStorage.setItem("tasks", stringTasks);
            var getTasks = window.localStorage.getItem("tasks");
            tasks = JSON.parse(getTasks);
            alertMess(`تمَّت إضَافة المُهمَّة : " ${inputValue} " بنجـَـاح`, "success");
            const intervalId = setInterval(() => {
                // Code to be executed once
                window.location.reload();
                // Clear the interval immediately after execution
                clearInterval(intervalId);
            }, 1700);

            message.addEventListener("mouseover", function () {
                clearInterval(intervalId);
            })
            message.addEventListener("mouseout", function () {
                const intervalId = setInterval(() => {
                    // Code to be executed once
                    window.location.reload();
                    // Clear the interval immediately after execution
                    clearInterval(intervalId);
                }, 1700);
            })
        }
    }
})


// complete task button
const doneBtns = document.querySelectorAll(".done")
doneBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {

        var targetValue = btn.parentElement.parentElement.querySelector(".txt").innerHTML;
        var targetIndex = tasks.findIndex(item => item.taskValue === targetValue);



        if (btn.parentElement.parentElement.classList.contains("completed")) {
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
        window.location.reload();
    });
});



// delete task button
const deleteBtn = document.querySelectorAll(".delete");

deleteBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        var targetValue = btn.parentElement.parentElement.querySelector(".txt").innerHTML;
        var targetIndex = tasks.findIndex(item => item.taskValue === targetValue);
        var deletedId = tasks[targetIndex].id;
        var deletedValue = tasks[targetIndex].taskValue;
        var deletedIsCompleted = tasks[targetIndex].isCompleted;
        tasks.splice(targetIndex, 1);

        stringTasks = JSON.stringify(tasks);
        window.localStorage.setItem("tasks", stringTasks);

        alertMess(`تَم حَذف المُهمَّة : " ${targetValue} " بِنَجَاح`, "failed");

        undoBtn.addEventListener("click", () => {
            tasks.push({
                id: deletedId,
                taskValue: deletedValue,
                isCompleted: deletedIsCompleted
            });
            stringTasks = JSON.stringify(tasks);
            window.localStorage.setItem("tasks", stringTasks);
        })
        const intervalId = setInterval(() => {
            // Code to be executed once
            window.location.reload();
            // Clear the interval immediately after execution
            clearInterval(intervalId);
        }, 1700);

        message.addEventListener("mouseover", function () {
            clearInterval(intervalId);
        })
        message.addEventListener("mouseout", function () {
            const intervalId = setInterval(() => {
                // Code to be executed once
                window.location.reload();
                // Clear the interval immediately after execution
                clearInterval(intervalId);
            }, 1700);
        })
    })
});


const deleteAllBtn = document.querySelector(".delete-all");
console.log(deleteAllBtn);
deleteAllBtn.addEventListener("click", () => {
    window.localStorage.removeItem("tasks");
    window.location.reload();
})

