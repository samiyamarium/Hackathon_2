from typing import List, Optional
from datetime import datetime

from sqlmodel import Session, select
from pydantic import BaseModel, Field
from fastapi import Depends

from models import Task, Conversation, Message
from database import engine # Assuming engine is used to get session

# --- Input/Output Models for MCP Tools ---

# add_task
class AddTaskInput(BaseModel):
    user_id: str
    title: str
    description: Optional[str] = None

class AddTaskOutput(BaseModel):
    task_id: int
    status: str = "created"
    title: str

# list_tasks
class ListTasksInput(BaseModel):
    user_id: str
    status: Optional[str] = "all" # "all", "pending", "completed"

class TaskOutput(BaseModel): # Reusable for list_tasks output
    id: int
    title: str
    completed: bool

class ListTasksOutput(BaseModel):
    tasks: List[TaskOutput]

# complete_task
class CompleteTaskInput(BaseModel):
    user_id: str
    task_id: int

class CompleteTaskOutput(BaseModel):
    task_id: int
    status: str = "completed"
    title: str

# delete_task
class DeleteTaskInput(BaseModel):
    user_id: str
    task_id: int

class DeleteTaskOutput(BaseModel):
    task_id: int
    status: str = "deleted"
    title: str

# update_task
class UpdateTaskInput(BaseModel):
    user_id: str
    task_id: int
    title: Optional[str] = None
    description: Optional[str] = None

class UpdateTaskOutput(BaseModel):
    task_id: int
    status: str = "updated"
    title: str


# --- MCP Tool Functions ---

def get_session():
    with Session(engine) as session:
        yield session

def add_task(input: AddTaskInput, session: Session = Depends(get_session)) -> AddTaskOutput:
    task = Task(user_id=input.user_id, title=input.title, description=input.description)
    session.add(task)
    session.commit()
    session.refresh(task)
    return AddTaskOutput(task_id=task.id, title=task.title)

def list_tasks(input: ListTasksInput, session: Session = Depends(get_session)) -> ListTasksOutput:
    statement = select(Task).where(Task.user_id == input.user_id)
    if input.status == "pending":
        statement = statement.where(Task.completed == False)
    elif input.status == "completed":
        statement = statement.where(Task.completed == True)

    tasks = session.exec(statement).all()
    return ListTasksOutput(tasks=[TaskOutput(id=t.id, title=t.title, completed=t.completed) for t in tasks])

def complete_task(input: CompleteTaskInput, session: Session = Depends(get_session)) -> CompleteTaskOutput:
    task = session.get(Task, input.task_id)
    if not task or task.user_id != input.user_id:
        # TODO: Handle task not found or unauthorized access more gracefully
        raise ValueError("Task not found or unauthorized.")
    task.completed = True
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return CompleteTaskOutput(task_id=task.id, title=task.title)

def delete_task(input: DeleteTaskInput, session: Session = Depends(get_session)) -> DeleteTaskOutput:
    task = session.get(Task, input.task_id)
    if not task or task.user_id != input.user_id:
        raise ValueError("Task not found or unauthorized.")
    session.delete(task)
    session.commit()
    return DeleteTaskOutput(task_id=task.id, title=task.title)

def update_task(input: UpdateTaskInput, session: Session = Depends(get_session)) -> UpdateTaskOutput:
    task = session.get(Task, input.task_id)
    if not task or task.user_id != input.user_id:
        raise ValueError("Task not found or unauthorized.")
    if input.title is not None:
        task.title = input.title
    if input.description is not None:
        task.description = input.description
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return UpdateTaskOutput(task_id=task.id, title=task.title)