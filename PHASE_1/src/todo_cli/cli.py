#import click
#from src.todo_cli.service import TodoService
# src/todo_cli/cli.py
import click
from todo_cli.service import TodoService  # remove "src."
from todo_cli.models import Todo

# Initialize the service (in-memory for now)
service = TodoService()

@click.command()
@click.argument('description')
def add(description: str):
    """Adds a new todo item."""
    try:
        todo_item = service.add_todo(description)
        click.echo(f"Todo added: \"{todo_item.description}\" (ID: {todo_item.id})")
    except ValueError as e:
        click.echo(f"Error: {e}", err=True)
        exit(2) # Invalid argument

@click.command(name='list')
def list_todos_cmd():
    """Lists all todo items."""
    todos = service.list_todos()
    if not todos:
        click.echo("No todo items found.")
        return

    click.echo("ID    Description           Status")
    click.echo("---   --------------------  --------")
    for todo_item in todos:
        status = "[x]" if todo_item.completed else "[ ]"
        click.echo(f"{todo_item.id:<5} {todo_item.description:<20}  {status}")

@click.command()
@click.argument('id', type=int)
def complete(id: int):
    """Marks a todo item as complete."""
    try:
        service.complete_todo(id)
        click.echo(f"Todo {id} marked as complete.")
    except ValueError as e:
        click.echo(f"Error: {e}", err=True)
        if "not found" in str(e):
            exit(3) # Todo item not found
        elif "already complete" in str(e):
            exit(4) # Todo item already complete
        else:
            exit(1) # General error

@click.command()
@click.argument('id', type=int)
def remove(id: int):
    """Removes a todo item."""
    try:
        service.remove_todo(id)
        click.echo(f"Todo {id} removed.")
    except ValueError as e:
        click.echo(f"Error: {e}", err=True)
        exit(3) # Todo item not found

@click.command()
def clear():
    """Removes all todo items."""
    try:
        service.clear_todos()
        click.echo("All todo items cleared.")
    except ValueError as e:
        click.echo(f"Error: {e}", err=True)
        exit(5) # No todo items to clear
