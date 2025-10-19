# Project Management Tool

A full-stack Project Management Tool built with FastAPI backend, React frontend, and MySQL database.

## Features

- User Management (Admin, Manager, Developer roles)
- Project Management with team assignment
- Task Management with status tracking (To Do, In Progress, Done)
- Dashboard with project metrics and overdue task tracking
- RESTful API design
- Interactive React-based UI

## Tech Stack

- **Backend**: Python (FastAPI)
- **Frontend**: React.js
- **Database**: MySQL
- **ORM**: SQLAlchemy
- **API Documentation**: Swagger UI (auto-generated)

## Project Structure

```
Assignment/
├── app/                          # Backend
│   ├── __init__.py
│   ├── main.py                   # FastAPI application
│   ├── config.py                 # Configuration
│   ├── database.py               # Database connection
│   ├── models.py                 # SQLAlchemy models
│   ├── schemas.py                # Pydantic schemas
│   └── routers/
│       ├── __init__.py
│       ├── users.py              # User endpoints
│       ├── projects.py           # Project endpoints
│       ├── tasks.py              # Task endpoints
│       └── dashboard.py          # Dashboard endpoints
├── frontend/                     # Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── Users.js
│   │   │   ├── Projects.js
│   │   │   └── Tasks.js
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── requirements.txt              # Python dependencies
├── .env.example
├── ER_DIAGRAM.md
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- MySQL Server installed and running
- pip (Python package manager)
- npm (Node package manager)

### Backend Setup

1. **Clone or download the repository**

2. **Create MySQL database**

```sql
CREATE DATABASE project_management;
```

3. **Create and activate virtual environment**

```bash
python -m venv venv
```

Activate it (Windows):
```bash
venv\Scripts\activate
```

Activate it (Mac/Linux):
```bash
source venv/bin/activate
```

4. **Configure environment variables**

Copy `.env.example` to `.env` and update the database credentials:

```bash
copy .env.example .env
```

Edit `.env`:
```
DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/project_management
SECRET_KEY=your-secret-key-here
```

5. **Install Python dependencies**

With virtual environment activated:
```bash
pip install -r requirements.txt
```

6. **Run the backend server**

```bash
uvicorn app.main:app --reload
```

The API will be available at: `http://localhost:8000`

API Documentation (Swagger): `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install Node dependencies**

```bash
npm install
```

3. **Run the React development server**

```bash
npm start
```

The frontend will be available at: `http://localhost:3000`

### Running the Complete Application

1. Start the backend server (Terminal 1):
```bash
venv\Scripts\activate
uvicorn app.main:app --reload
```

2. Start the frontend server (Terminal 2):
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints Summary

### Users
- `POST /users/` - Create a new user
- `GET /users/` - Get all users
- `GET /users/{user_id}` - Get user by ID
- `DELETE /users/{user_id}` - Delete user

### Projects
- `POST /projects/` - Create a new project
- `GET /projects/` - Get all projects
- `GET /projects/{project_id}` - Get project by ID
- `PUT /projects/{project_id}` - Update project
- `DELETE /projects/{project_id}` - Delete project

### Tasks
- `POST /tasks/` - Create a new task
- `GET /tasks/` - Get all tasks (supports query params: project_id, assigned_to)
- `GET /tasks/{task_id}` - Get task by ID
- `PUT /tasks/{task_id}` - Update task (including status change)
- `DELETE /tasks/{task_id}` - Delete task

### Dashboard
- `GET /dashboard/` - Get dashboard metrics (total projects, tasks by status, overdue tasks)

## Example Usage

### 1. Create a User

```bash
curl -X POST "http://localhost:8000/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Developer"
  }'
```

### 2. Create a Project

```bash
curl -X POST "http://localhost:8000/projects/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-commerce Website",
    "description": "Build an online store",
    "team_member_ids": [1]
  }'
```

### 3. Create a Task

```bash
curl -X POST "http://localhost:8000/tasks/" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design homepage",
    "description": "Create wireframes and mockups",
    "project_id": 1,
    "assigned_to": 1,
    "status": "To Do",
    "deadline": "2024-12-31T23:59:59"
  }'
```

### 4. Update Task Status

```bash
curl -X PUT "http://localhost:8000/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress"
  }'
```

### 5. Get Dashboard

```bash
curl -X GET "http://localhost:8000/dashboard/"
```

## Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- role (Admin, Manager, Developer)
- created_at

### Projects Table
- id (Primary Key)
- name
- description
- created_at
- updated_at

### Tasks Table
- id (Primary Key)
- title
- description
- status (To Do, In Progress, Done)
- deadline
- project_id (Foreign Key)
- assigned_to (Foreign Key)
- created_at
- updated_at

### Project_Members Table (Join Table)
- project_id (Foreign Key)
- user_id (Foreign Key)

## Assumptions

1. No authentication/authorization implemented (can be added with JWT)
2. Passwords not required for MVP
3. Simple role-based system without enforcement
4. All timestamps in UTC
5. Tasks can be unassigned (assigned_to is optional)
6. Deadline is optional for tasks

## Possible Improvements

1. Add JWT-based authentication and authorization
2. Implement role-based access control (RBAC)
3. Add pagination for list endpoints
4. Add search and filtering capabilities
5. Implement task comments functionality
6. Add file attachments for tasks
7. Email notifications for deadlines
8. Activity logs and audit trails
9. Task priority levels
10. Bulk operations support
11. Advanced reporting and analytics
12. Task dependencies and subtasks

## Testing

### Swagger UI (Interactive Documentation)
Access the interactive API documentation at `http://localhost:8000/docs` to test all endpoints using Swagger UI.

### Postman Collection
Import the `postman_collection.json` file into Postman to test all API endpoints.

### Unit Tests
Run the test suite using pytest:

```bash
pytest tests/ -v
```

Test coverage includes:
- User CRUD operations
- Project CRUD operations
- Task CRUD operations
- Validation and error handling

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Postman Collection**: `postman_collection.json` (included in repository)

## Contact

**Name**: Abdul Khadir Shehadab
**Email**: shadabakrami@gmail.com
**Phone**: +91 7975040823
