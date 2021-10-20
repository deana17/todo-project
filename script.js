//today's date
const date = document.getElementById("date");
var options = { weekday: "long", month: "short", day: "numeric" };
const today = new Date();
date.innerHTML = today.toLocaleDateString("en", options);

//vars
let id = 0;
const list = document.querySelector("#list");
const deleteAllBtn = document.querySelector(".button");

//UI //add new task
class UI {
  //display todos
  static displayToDo() {
    const todos = Store.getToDos();
    todos.forEach((todo) => UI.addToDoList(todo.text, todo.id, todo.completed));
  }
  //add ToDo to list
  static addToDoList(toDo, id, ifChecked) {
    const completed = ifChecked ? "checkedLine" : "";
    const statusIcon = ifChecked ? "fa-check-circle" : "fa-circle";

    const listItem = `<li>
    <i class="far ${statusIcon} co" action="complete" id="${id}"></i>
      <p class="text ${completed}">${toDo} </p> <input class="textInput" type="text" value="${toDo}" style="display:none"/>
      <i class="far fa-edit" action="edit" id="${id}"></i>
      <i class="far fa-trash-alt" action="delete" id="${id}"></i>
      </li>
      `;
    const position = "beforeend";
    list.insertAdjacentHTML(position, listItem);
  }

  //remove element
  static removeToDo(element) {
    //remove item from UI
    element.parentNode.parentNode.removeChild(element.parentNode);

    //remove todo from the storage
    // get value of the current id and remove it from storage
    const curId = element.attributes.id.value;
    const todos = Store.getToDos();

    todos.forEach((todo, index) => {
      if (+todo.id === +curId) {
        todos.splice(index, 1);
      }
    });
    localStorage.setItem("toDo", JSON.stringify(todos));
  }
  static editToDo(element) {
    var text = element.parentNode.childNodes[3];
    var input = element.parentNode.childNodes[5];
    console.log(element.parentNode.childNodes);
    text.style.display = "none";
    input.style.display = "flex";
    input.addEventListener("keyup", function (event) {
      if (event.key == "Enter") {
        text.style.display = "flex";
        input.style.display = "none";
        text.textContent = input.value;

        const curId = element.attributes.id.value;
        const todos = Store.getToDos();
        todos.forEach((todo, index) => {
          if (+todo.id === +curId) {
            todos[index].text = input.value;
          }
        });
        localStorage.setItem("toDo", JSON.stringify(todos));
      }
    });
  }

  //complete element
  static completeToDo(element) {
    const CHECK = "fa-check-circle";
    const UNCHECK = "fa-circle";
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle("checkedLine");

    //update the storage
    const curId = element.attributes.id.value;
    const todos = Store.getToDos();
    todos.forEach((todo, index) => {
      if (+todo.id === +curId) {
        todos[index].completed = todos[index].completed ? false : true;
      }
    });
    localStorage.setItem("toDo", JSON.stringify(todos));
  }
}
//   //clear all todo

//   static clearToDo() {
//     list.innetHTML = "";
//     localStorage.clear();
//   }

//add to local storage
class Store {
  static getToDos() {
    let todos;
    if (localStorage.getItem("toDo") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("toDo"));
    }
    return todos;
  }

  static addToDoList(toDo, id) {
    const todos = Store.getToDos();

    todos.push({ text: toDo, id: id, completed: false });

    localStorage.setItem("toDo", JSON.stringify(todos));
  }
}

//event to display todos
document.addEventListener("DOMContentLoaded", UI.displayToDo);

//if press enter then call addNewToDo()
document.addEventListener("keyup", function () {
  if (event.keyCode == 13) {
    const toDoItem = input.value;
    //a little validation
    if (toDoItem) {
      //add item to UI
      UI.addToDoList(toDoItem, Date.now());

      //add item to local storage
      Store.addToDoList(toDoItem, Date.now());
      // increment id
      id++;
    }
    input.value = "";
  }
});

// this method is for checking and removing items
list.addEventListener("click", (event) => {
  const element = event.target;
  if (element.attributes.action) {
    const elementAction = element.attributes.action.value;
    if (elementAction == "complete") {
      UI.completeToDo(element);
    } else if (elementAction == "delete") {
      UI.removeToDo(element);
    } else if (elementAction == "edit") {
      UI.editToDo(element);
    }
  }
});

deleteAllBtn.onclick = () => {
  const lis = document.querySelectorAll("li");

  for (let index = 0; index < lis.length; index++) {
    const element = lis[index];
    element.remove();
  }

  localStorage.setItem("toDo", JSON.stringify([]));
};
