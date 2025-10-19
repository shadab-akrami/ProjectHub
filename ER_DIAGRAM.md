# Entity Relationship Diagram

## Database Schema

```
┌─────────────────────────┐
│        USERS            │
├─────────────────────────┤
│ id (PK)                 │
│ name                    │
│ email (UNIQUE)          │
│ role (ENUM)             │
│ created_at              │
└─────────────────────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────────────┐
│        TASKS            │
├─────────────────────────┤
│ id (PK)                 │
│ title                   │
│ description             │
│ status (ENUM)           │
│ deadline                │
│ project_id (FK)         │
│ assigned_to (FK)        │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
         ▲
         │
         │ N:1
         │
┌─────────────────────────┐
│       PROJECTS          │
├─────────────────────────┤
│ id (PK)                 │
│ name                    │
│ description             │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
         │
         │ M:N
         │
         ▼
┌─────────────────────────┐
│   PROJECT_MEMBERS       │
│   (Join Table)          │
├─────────────────────────┤
│ project_id (FK)         │
│ user_id (FK)            │
└─────────────────────────┘
         │
         │
         ▼
┌─────────────────────────┐
│        USERS            │
└─────────────────────────┘
```

## Relationships

### 1. Users ↔ Projects (Many-to-Many)
- A user can be assigned to multiple projects
- A project can have multiple team members
- Implemented via `project_members` join table

### 2. Projects ↔ Tasks (One-to-Many)
- A project can have multiple tasks
- Each task belongs to one project
- Foreign key: `tasks.project_id` → `projects.id`
- Cascade delete: When a project is deleted, all its tasks are deleted

### 3. Users ↔ Tasks (One-to-Many)
- A user can be assigned multiple tasks
- Each task can be assigned to one user (or none)
- Foreign key: `tasks.assigned_to` → `users.id`
- Optional relationship (tasks can be unassigned)

## Enums

### UserRole
- Admin
- Manager
- Developer

### TaskStatus
- To Do
- In Progress
- Done

## Indexes

- `users.email` - Unique index for fast lookup and uniqueness constraint
- `users.id` - Primary key index
- `projects.id` - Primary key index
- `tasks.id` - Primary key index
- `tasks.project_id` - Foreign key index for faster joins
- `tasks.assigned_to` - Foreign key index for faster joins
