from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Task, Project, User, UserRole
from app.schemas import TaskCreate, TaskResponse, TaskUpdate
from app.auth import require_manager_or_admin, get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_admin)
):
    """Only Managers and Admins can create tasks"""
    project = db.query(Project).filter(Project.id == task.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if task.assigned_to:
        user = db.query(User).filter(User.id == task.assigned_to).first()
        if not user:
            raise HTTPException(status_code=404, detail="Assigned user not found")

    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[TaskResponse])
def list_tasks(
    project_id: int = None,
    assigned_to: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    All authenticated users can view tasks.
    Developers see only their assigned tasks unless filtering by project_id.
    Managers and Admins see all tasks.
    """
    query = db.query(Task)

    # Developers can only see tasks assigned to them (unless project_id is specified)
    if current_user.role == UserRole.DEVELOPER and not project_id:
        query = query.filter(Task.assigned_to == current_user.id)
    elif project_id:
        query = query.filter(Task.project_id == project_id)
    elif assigned_to:
        query = query.filter(Task.assigned_to == assigned_to)

    tasks = query.all()
    return tasks

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    All authenticated users can view task details.
    Developers can only view tasks assigned to them.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Developers can only view their own tasks
    if current_user.role == UserRole.DEVELOPER and task.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied. You can only view tasks assigned to you.")

    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Managers and Admins can update any task.
    Developers can only update status and add comments for their assigned tasks.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_update.model_dump(exclude_unset=True)

    # Developers can only update their own tasks and only status field
    if current_user.role == UserRole.DEVELOPER:
        if task.assigned_to != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied. You can only update tasks assigned to you.")

        # Developers can only update status
        allowed_fields = {"status"}
        if not set(update_data.keys()).issubset(allowed_fields):
            raise HTTPException(status_code=403, detail="Developers can only update task status.")

    if "assigned_to" in update_data and update_data["assigned_to"]:
        user = db.query(User).filter(User.id == update_data["assigned_to"]).first()
        if not user:
            raise HTTPException(status_code=404, detail="Assigned user not found")

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_admin)
):
    """Only Managers and Admins can delete tasks"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return None
