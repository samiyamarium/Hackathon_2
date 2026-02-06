
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

import models
from db import get_session
from jwt_utils import get_current_user

router = APIRouter(
    prefix="/api",
    tags=["tasks"],
)

@router.get("/tasks", response_model=List[models.TaskRead])
def list_tasks(
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user),
    status: Optional[str] = None, # Add status filter
    sort: Optional[str] = None # Add sort parameter
):
    query = select(models.Task).where(models.Task.user_id == current_user)
    
    if status == "pending":
        query = query.where(models.Task.completed == False)
    elif status == "completed":
        query = query.where(models.Task.completed == True)

    if sort == "created":
        query = query.order_by(models.Task.created_at)
    elif sort == "title":
        query = query.order_by(models.Task.title)
    # No due_date in model yet, so ignoring 'due_date' sort for now

    tasks = session.exec(query).all()
    return tasks

@router.post("/tasks", response_model=models.TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task: models.TaskCreate,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    db_task = models.Task.model_validate(task, update={"user_id": current_user})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.get("/tasks/{task_id}", response_model=models.TaskRead)
def get_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    task = session.exec(
        select(models.Task).where(models.Task.id == task_id, models.Task.user_id == current_user)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/tasks/{task_id}", response_model=models.TaskRead)
def update_task(
    task_id: int,
    task: models.TaskUpdate,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    db_task = session.exec(
        select(models.Task).where(models.Task.id == task_id, models.Task.user_id == current_user)
    ).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_data = task.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    task = session.exec(
        select(models.Task).where(models.Task.id == task_id, models.Task.user_id == current_user)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    session.delete(task)
    session.commit()
    return

@router.patch("/tasks/{task_id}/complete", response_model=models.TaskRead)
def toggle_complete_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    db_task = session.exec(
        select(models.Task).where(models.Task.id == task_id, models.Task.user_id == current_user)
    ).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.completed = not db_task.completed
    db_task.updated_at = datetime.utcnow() # Update timestamp

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task
