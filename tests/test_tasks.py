import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_create_task():
    project_response = client.post(
        "/projects/",
        json={"name": "Task Test Project", "description": "For testing tasks", "team_member_ids": []}
    )
    project_id = project_response.json()["id"]

    response = client.post(
        "/tasks/",
        json={
            "title": "Test Task",
            "description": "A test task",
            "status": "To Do",
            "project_id": project_id
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["status"] == "To Do"
    assert "id" in data

def test_get_tasks():
    response = client.get("/tasks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_task_status():
    project_response = client.post(
        "/projects/",
        json={"name": "Update Test Project", "description": "For status update", "team_member_ids": []}
    )
    project_id = project_response.json()["id"]

    create_response = client.post(
        "/tasks/",
        json={
            "title": "Status Test Task",
            "description": "Will change status",
            "status": "To Do",
            "project_id": project_id
        }
    )
    task_id = create_response.json()["id"]

    update_response = client.put(
        f"/tasks/{task_id}",
        json={"status": "In Progress"}
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["status"] == "In Progress"

def test_delete_task():
    project_response = client.post(
        "/projects/",
        json={"name": "Delete Test Project", "description": "For task deletion", "team_member_ids": []}
    )
    project_id = project_response.json()["id"]

    create_response = client.post(
        "/tasks/",
        json={
            "title": "To Delete",
            "description": "Will be deleted",
            "status": "To Do",
            "project_id": project_id
        }
    )
    task_id = create_response.json()["id"]

    delete_response = client.delete(f"/tasks/{task_id}")
    assert delete_response.status_code == 204

    get_response = client.get(f"/tasks/{task_id}")
    assert get_response.status_code == 404
