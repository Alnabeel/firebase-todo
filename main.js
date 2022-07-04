const task = document.querySelector("#list")
let input = document.querySelector("#input")
let addbtn = document.querySelector("#addbtn")
const completelist = document.querySelector("#completelist")

addbtn.addEventListener("click", () => {

  if (input.value == "") {
    alert("Please Enter Your Task")
  } else {
    fetch('https://newtodo-2b836-default-rtdb.firebaseio.com/user.json', {
      method: "POST",
      body: JSON.stringify({
        "name": input.value,
        "status": "uncomplete"
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then(response => response.json())
      .then(result => get())
    input.value = ""
  }
})
function get() {

  fetch("https://newtodo-2b836-default-rtdb.firebaseio.com/user.json", {
    method: 'GET'
  })
    .then(response => response.json())
    .then(result => {
      completelist.innerHTML=""
      task.innerHTML = ""
      for (const data in result) {
        if (result[data].status === 'uncomplete') {
          task.innerHTML += (`
          <h3>Task</h3>

          <li  class="list-group-item  " data-id="${data}">
            <span> ${result[data].name}</span>
            <span><button type="button" class="btn btn-primary" data-id="${data}" onclick="editlist('${data}', '${result[data].name}')">Edit</button></span>
            <span><button type="button" class="btn btn-danger" data-id="${data}" onclick="deletelist('${data}')">Delete</button></span>
            <span><button type="button" class="btn btn-success" data-id="${data}" onclick="complete('${data}')">Complete</button></span>
                  
         </li>`);
        }else if(result[data].status === 'completed'){
          completelist.innerHTML +=(`
          <h3>Completed-Task</h3>
           <li class="list-group-item" >
          <span>${result[data].name}</span>
          <span><button type="button" class="btn btn-danger" onclick="deletelist('${data}')">Delete</button></span>
      </li> `)
      
            
        }


      }
    })
    .catch(error => console.log('error', error));

}
function deletelist(id) {

  fetch(`https://newtodo-2b836-default-rtdb.firebaseio.com/user/${id}.json`, {

    method: "DELETE",
  })

    .then(response => response.json())
    .then((data) => get())
}
function editlist(id, task) {


  input.value = task
  deletelist(id)

}
function complete(id) {
  fetch(`https://newtodo-2b836-default-rtdb.firebaseio.com/user/${id}.json`, {
    method: "PATCH",
    body: JSON.stringify({

      "status": "completed"
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" }

  })
    .then(response => response.json())
    .then(result => get())
    .catch(error => console.log('error', error));
}
get()