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

def test_create_project():
    response = client.post(
        "/projects/",
        json={"name": "Test Project", "description": "A test project", "team_member_ids": []}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Project"
    assert data["description"] == "A test project"
    assert "id" in data

def test_get_projects():
    response = client.get("/projects/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_project():
    create_response = client.post(
        "/projects/",
        json={"name": "Original Name", "description": "Original desc", "team_member_ids": []}
    )
    project_id = create_response.json()["id"]

    update_response = client.put(
        f"/projects/{project_id}",
        json={"name": "Updated Name"}
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["name"] == "Updated Name"

def test_delete_project():
    create_response = client.post(
        "/projects/",
        json={"name": "To Delete", "description": "Will be deleted", "team_member_ids": []}
    )
    project_id = create_response.json()["id"]

    delete_response = client.delete(f"/projects/{project_id}")
    assert delete_response.status_code == 204

    get_response = client.get(f"/projects/{project_id}")
    assert get_response.status_code == 404
