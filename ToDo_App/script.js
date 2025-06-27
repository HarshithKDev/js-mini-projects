document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("todo-input");
  const button = document.getElementById("add-btn");
  const list = document.getElementById("todo-list");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Load saved todos when page loads
  todos.forEach(todo => {
    createTodoElement(todo.text, todo.completed);
  });

  // Add task when button clicked
  button.addEventListener("click", () => {
    const task = input.value.trim();
    if (task !== "") {
      createTodoElement(task, false);
      todos.push({ text: task, completed: false });
      saveTodos();
      input.value = "";
    }
  });

  // Add task with Enter key
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      button.click();
    }
  });

  // Reusable function to save to localStorage
  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  // Reusable function to create a todo item
  function createTodoElement(text, completed) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;
    span.classList.add("task-text");
    if (completed) span.classList.add("completed");

    // Toggle line-through on click
    span.addEventListener("click", () => {
      span.classList.toggle("completed");

      // Update completed status in todos[]
      const index = Array.from(list.children).indexOf(li);
      todos[index].completed = span.classList.contains("completed");
      saveTodos();
    });

    //Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("delete-btn");
    delBtn.addEventListener("click", () => {
      li.remove();

      // Remove from todos[]
      const index = Array.from(list.children).indexOf(li);
      todos.splice(index, 1);
      saveTodos();
    });

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  }
});