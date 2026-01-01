from typing import List, Dict
from todo_cli.models import Todo

class TodoService:
    def __init__(self):
        self._todos: Dict[int, Todo] = {}
        self._next_id = 1

    def add_todo(self, description: str) -> Todo:
        todo = Todo(id=self._next_id, description=description)
        self._todos[self._next_id] = todo
        self._next_id += 1
        return todo

    def list_todos(self) -> List[Todo]:
        return list(self._todos.values())

    def complete_todo(self, todo_id: int) -> Todo:
        todo = self._todos.get(todo_id)
        if not todo:
            raise ValueError(f"Todo with ID {todo_id} not found.")
        if todo.completed:
            raise ValueError(f"Todo {todo_id} is already complete.")
        todo.completed = True
        return todo

    def remove_todo(self, todo_id: int):
        if todo_id not in self._todos:
            raise ValueError(f"Todo with ID {todo_id} not found.")
        del self._todos[todo_id]

    def clear_todos(self):
        if not self._todos:
            raise ValueError("No todo items to clear.")
        self._todos.clear()
        self._next_id = 1
