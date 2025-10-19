from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import users, projects, tasks, dashboard, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Project Management Tool",
    description="A simple project management tool for managing projects, tasks, and teams",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Project Management Tool API",
        "docs": "/docs",
        "redoc": "/redoc"
    }
