// ================= REGISTER =================

function register(){

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;


    if(name=="" || email=="" || password==""){

        alert("Please fill all fields");
        return;

    }


    let users = JSON.parse(localStorage.getItem("users")) || [];


    let exists = users.find(user => user.email == email);


    if(exists){

        alert("Email already registered");
        return;

    }


  let user = {

name:name,
email:email,
password:password,
role:role,
points:0,
completedTasks:0

}; 

    users.push(user);


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    alert("Registration successful");


    window.location.href="login.html";

}



// ================= LOGIN =================


function login(){

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;


    let users = JSON.parse(localStorage.getItem("users")) || [];


    let user = users.find(
        u => u.email == email && u.password == password
    );


    if(user){


        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );


        if(user.role=="reviewer"){

            window.location.href="reviewer.html";

        }
        else{

            window.location.href="dashboard.html";

        }


    }
    else{

        alert("Invalid email or password");

    }

}



// ================= DASHBOARD LOAD =================


let currentUser =
JSON.parse(localStorage.getItem("currentUser"));


if(currentUser){


    let username =
    document.getElementById("username");


    if(username){

        username.innerText=currentUser.name;

    }


    let points =
    document.getElementById("points");


    if(points){

        points.innerText=currentUser.points;

    }


}



// ================= PERSONAL TASK =================


function addTask(){


    let input =
    document.getElementById("taskInput");


    let task=input.value.trim();


    if(task==""){

        alert("Enter a task");
        return;

    }


    let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];


    tasks.push(task);


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    input.value="";


    showTasks();

}




function showTasks(){


    let list =
    document.getElementById("taskList");


    if(!list)
    return;


    list.innerHTML="";


    let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];



    tasks.forEach((task,index)=>{


        let li=document.createElement("li");


        li.innerHTML =
        task;


        let btn=document.createElement("button");


        btn.innerText="✅ Done";


        btn.onclick=function(){

            completeTask(index);

        };


        li.appendChild(btn);


        list.appendChild(li);



    });



}



function completeTask(index){


    let tasks =
    JSON.parse(localStorage.getItem("tasks"));


    tasks.splice(index,1);



    let user =
    JSON.parse(localStorage.getItem("currentUser"));



    user.points +=5;



    updateUser(user);



    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );



    location.reload();


}

addHistory({

title: taskName,

type:"Personal Task",

status:"Completed",

points:10,

date:new Date().toLocaleString()

});

// ================= UPDATE USER =================


function updateUser(user){


    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    let users =
    JSON.parse(localStorage.getItem("users")) || [];


    let index =
    users.findIndex(
        u=>u.email==user.email
    );


    if(index!=-1){

        users[index]=user;

    }


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


}




// ================= PROFESSIONAL TASK =================


function addProfessionalTask(){


    let task =
    document.getElementById("professionalInput").value;


    let file =
    document.getElementById("taskFile").files[0];



    if(task=="" || !file){

        alert("Enter task and select file");
        return;

    }



    let tasks =
    JSON.parse(
        localStorage.getItem("professionalTasks")
    ) || [];



    tasks.push({

        task:task,
        file:file.name,
        status:"Pending"

    });



    localStorage.setItem(
        "professionalTasks",
        JSON.stringify(tasks)
    );



    alert("Task submitted for review");


    showProfessionalTasks();


}




function showProfessionalTasks(){


    let list =
    document.getElementById("professionalList");


    if(!list)
    return;


    list.innerHTML="";


    let tasks =
    JSON.parse(
        localStorage.getItem("professionalTasks")
    ) || [];



    tasks.forEach(task=>{


        let li=document.createElement("li");


        li.innerHTML=

        `
        ${task.task}<br>
        📄 ${task.file}<br>
        Status: ${task.status}
        `;


        list.appendChild(li);


    });



}

addHistory({

title: submittedTaskName,

type:"Professional Task",

status:"Pending Review",

points:0,

date:new Date().toLocaleString()

});


// ================= REVIEWER =================


function loadReviewerTasks(){


    let list =
    document.getElementById("reviewList");


    if(!list)
    return;



    list.innerHTML="";


    let tasks =
    JSON.parse(
        localStorage.getItem("professionalTasks")
    ) || [];



    tasks.forEach((task,index)=>{


        let li=document.createElement("li");


        li.innerHTML=

        `
        <b>${task.task}</b><br>
        File: ${task.file}<br>
        Status: ${task.status}
        `;



        if(task.status=="Pending"){


            let btn=document.createElement("button");


            btn.innerText="Approve ✅";


            btn.onclick=function(){

                approveTask(index);

            };


            li.appendChild(btn);


        }



        list.appendChild(li);



    });



}




function approveTask(index){


    let tasks =
    JSON.parse(
        localStorage.getItem("professionalTasks")
    );


    tasks[index].status="Approved";


    localStorage.setItem(
        "professionalTasks",
        JSON.stringify(tasks)
    );



    let user =
    JSON.parse(
        localStorage.getItem("currentUser")
    );



    user.points +=10;



    updateUser(user);



    alert("Task approved +10 points");


    loadReviewerTasks();


}




function openReviewer(){

    window.location.href="reviewer.html";

}



function goDashboard(){

    window.location.href="dashboard.html";

}



// ================= LEADERBOARD =================


function showLeaderboard(){


    let list =
    document.getElementById("leaderboard");


    if(!list)
    return;



    let users =
    JSON.parse(localStorage.getItem("users")) || [];



    users.sort(
        (a,b)=>b.points-a.points
    );



    list.innerHTML="";



    users.forEach((user,index)=>{


        let li=document.createElement("li");


        li.innerHTML =
        `
        ${index+1}. ${user.name}
        🏆 ${user.points} pts
        `;


        list.appendChild(li);


    });


}



// ================= LOGOUT =================


function logout(){


    localStorage.removeItem("currentUser");


    window.location.href="login.html";


}



// RUN FUNCTIONS

showTasks();

showProfessionalTasks();

loadReviewerTasks();

showLeaderboard();

function openProfile(){

    window.location.href="profile.html";

}



function loadProfile(){

    let currentUser =
    JSON.parse(localStorage.getItem("currentUser"));


    if(!currentUser){

        window.location.href="login.html";
        return;

    }


    document.getElementById("profileName").value =
    currentUser.name;


    document.getElementById("profileEmail").value =
    currentUser.email;


    document.getElementById("profileRole").value =
    currentUser.role;



    let points =
    currentUser.points || 0;


    document.getElementById("profilePoints").value =
    points;



    let completed =
    currentUser.completedTasks || 0;


    document.getElementById("profileTasks").value =
    completed;

}




function updateProfile(){

    let currentUser =
    JSON.parse(localStorage.getItem("currentUser"));


    let newName =
    document.getElementById("profileName").value;



    currentUser.name = newName;



    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );


    alert("Profile Updated Successfully 🎉");

}



function goBack(){

    window.location.href="dashboard.html";

}


function openHistory(){

    window.location.href="history.html";

}




function loadHistory(){


let currentUser =
JSON.parse(localStorage.getItem("currentUser"));



if(!currentUser){

    window.location.href="login.html";
    return;

}



let container =
document.getElementById("historyContainer");



let history =
currentUser.taskHistory || [];



if(history.length === 0){

container.innerHTML =
`
<h3>No task history available yet 🚀</h3>
`;

return;

}



history.forEach(task => {


container.innerHTML +=
`

<div class="card">

<h3>${task.title}</h3>

<p>
Type: ${task.type}
</p>


<p>
Status:
<b>${task.status}</b>
</p>


<p>
Points:
${task.points}
</p>


<p>
Date:
${task.date}
</p>


</div>

`;

});


}




function addHistory(task){


let currentUser =
JSON.parse(localStorage.getItem("currentUser"));



if(!currentUser.taskHistory){

currentUser.taskHistory=[];

}



currentUser.taskHistory.push(task);



localStorage.setItem(
"currentUser",
JSON.stringify(currentUser)
);


}