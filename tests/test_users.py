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

def test_create_user():
    response = client.post(
        "/users/",
        json={"name": "Test User", "email": "test@example.com", "role": "Developer"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"
    assert data["role"] == "Developer"
    assert "id" in data

def test_get_users():
    response = client.get("/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_user_by_id():
    create_response = client.post(
        "/users/",
        json={"name": "Jane Doe", "email": "jane@example.com", "role": "Manager"}
    )
    user_id = create_response.json()["id"]

    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Jane Doe"

def test_delete_user():
    create_response = client.post(
        "/users/",
        json={"name": "To Delete", "email": "delete@example.com", "role": "Admin"}
    )
    user_id = create_response.json()["id"]

    delete_response = client.delete(f"/users/{user_id}")
    assert delete_response.status_code == 204

    get_response = client.get(f"/users/{user_id}")
    assert get_response.status_code == 404

def test_create_duplicate_email():
    client.post(
        "/users/",
        json={"name": "User 1", "email": "duplicate@example.com", "role": "Developer"}
    )
    response = client.post(
        "/users/",
        json={"name": "User 2", "email": "duplicate@example.com", "role": "Developer"}
    )
    assert response.status_code == 400
