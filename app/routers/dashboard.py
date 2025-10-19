from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from app.database import get_db
from app.models import Project, Task, TaskStatus
from app.schemas import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    total_projects = db.query(Project).count()
    total_tasks = db.query(Task).count()

    tasks_by_status = {}
    for status in TaskStatus:
        count = db.query(Task).filter(Task.status == status).count()
        tasks_by_status[status.value] = count

    overdue_tasks = db.query(Task).filter(
        Task.deadline < datetime.utcnow(),
        Task.status != TaskStatus.DONE
    ).count()

    return {
        "total_projects": total_projects,
        "total_tasks": total_tasks,
        "tasks_by_status": tasks_by_status,
        "overdue_tasks": overdue_tasks
    }
