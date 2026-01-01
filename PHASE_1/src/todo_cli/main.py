# src/todo_cli/main.py

import click
from todo_cli.cli import add, list_todos_cmd, complete, remove, clear
from todo_cli.service import TodoService

# Instantiate the service once
service = TodoService()

# Define the main CLI group
@click.group()
def main():
    """A simple CLI todo application."""
    pass

# Add commands to the main group
main.add_command(add)
main.add_command(list_todos_cmd, name='list')
main.add_command(complete)
main.add_command(remove)
main.add_command(clear)

if __name__ == '__main__':
    main()
