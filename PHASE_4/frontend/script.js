const API_URL = 'http://localhost:5000/todos'; // Assuming Flask backend runs on port 5000

document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();

    const todoForm = document.getElementById('todo-form');
    todoForm.addEventListener('submit', addTodo);
});

async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

function displayTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear existing list

    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.dataset.id = todo.id;
        if (todo.completed) {
            listItem.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodoCompleted(todo.id, checkbox.checked));

        const todoTitle = document.createElement('span');
        todoTitle.textContent = todo.title;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTodo(todo.id));

        listItem.appendChild(checkbox);
        listItem.appendChild(todoTitle);
        listItem.appendChild(deleteButton);
        todoList.appendChild(listItem);
    });
}

async function addTodo(event) {
    event.preventDefault();
    const todoInput = document.getElementById('todo-input');
    const title = todoInput.value.trim();

    if (title) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            });
            const newTodo = await response.json();
            todoInput.value = ''; // Clear input
            fetchTodos(); // Refresh the list
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }
}

async function toggleTodoCompleted(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });
        await response.json();
        fetchTodos(); // Refresh the list
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTodo(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        fetchTodos(); // Refresh the list
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}
