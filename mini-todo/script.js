window.onload = function () {
  const taskInput = document.getElementById("taskInput");
  const addButton = document.getElementById("addButton");
  const taskList = document.getElementById("taskList");
  const taskCounter = document.getElementById("taskCounter");
  const emptyState = document.getElementById("emptyState");

  function updateCounter() {
    const tasks = taskList.querySelectorAll(".task-item");
    const completedTasks = taskList.querySelectorAll(".task-item.completed");

    taskCounter.textContent = tasks.length + " total • " + completedTasks.length + " completed";
  }

  function updateEmptyState() {
    if (taskList.children.length === 0) {
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
    }
  }

  function createTask(taskText) {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    const taskSpan = document.createElement("span");
    taskSpan.className = "task-text";
    taskSpan.textContent = taskText;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const doneButton = document.createElement("button");
    doneButton.type = "button";
    doneButton.className = "done-btn";
    doneButton.textContent = "Done";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    doneButton.onclick = function () {
      taskItem.classList.toggle("completed");

      if (taskItem.classList.contains("completed")) {
        doneButton.textContent = "Undo";
      } else {
        doneButton.textContent = "Done";
      }

      updateCounter();
    };

    deleteButton.onclick = function () {
      taskItem.remove();
      updateCounter();
      updateEmptyState();
    };

    actions.appendChild(doneButton);
    actions.appendChild(deleteButton);

    taskItem.appendChild(taskSpan);
    taskItem.appendChild(actions);

    taskList.appendChild(taskItem);
    updateCounter();
    updateEmptyState();
  }

  function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
      alert("Type a task first.");
      return;
    }

    createTask(taskText);
    taskInput.value = "";
    taskInput.focus();
  }

  addButton.onclick = addTask;

  taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  updateCounter();
  updateEmptyState();
};
