# Quick Start Guide

## Step-by-Step Instructions to Run the Project

### Step 1: Install Prerequisites

1. **Install Python** (3.8 or higher)
   - Download from: https://www.python.org/downloads/
   - During installation, check "Add Python to PATH"
   - Verify: `python --version`

2. **Install Node.js** (14 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

3. **Install MySQL**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Remember your root password during installation
   - Start MySQL service

### Step 2: Setup Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE project_management;
```

### Step 3: Configure Backend

1. **Create virtual environment**

   Open terminal in the `Assignment` folder:
   ```bash
   python -m venv venv
   ```

2. **Activate virtual environment**

   On Windows:
   ```bash
   venv\Scripts\activate
   ```

   You should see `(venv)` appear at the start of your command line.

3. **Create environment file**

   In the `Assignment` folder, copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

   Or create a new file named `.env` with:
   ```
   DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/project_management
   SECRET_KEY=your-secret-key-here
   ```

   Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

4. **Install Python dependencies**

   With venv activated:
   ```bash
   pip install -r requirements.txt
   ```

### Step 4: Run Backend Server

In the `Assignment` folder, with venv activated:
```bash
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Keep this terminal open!

Test it: Open browser and go to http://localhost:8000/docs

**Note**: If you close the terminal and come back later, remember to activate venv again:
```bash
venv\Scripts\activate
```

### Step 5: Setup and Run Frontend

1. **Open a NEW terminal** (keep backend running)

2. **Navigate to frontend folder**:
   ```bash
   cd frontend
   ```

3. **Install Node dependencies**:
   ```bash
   npm install
   ```

   This may take a few minutes.

4. **Start React app**:
   ```bash
   npm start
   ```

Browser should automatically open http://localhost:3000

### Step 6: Use the Application

Now you have:
- **Frontend**: http://localhost:3000 (React UI)
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger)

Start by creating users, then projects, then tasks!

---

## Common Issues and Solutions

### Issue 1: "pip is not recognized"
**Solution**: Python not in PATH. Reinstall Python and check "Add Python to PATH"

### Issue 2: "npm is not recognized"
**Solution**: Node.js not in PATH. Reinstall Node.js

### Issue 3: Database connection error
**Solution**:
- Check MySQL is running
- Verify password in `.env` file
- Ensure database `project_management` exists

### Issue 4: Port 8000 already in use
**Solution**:
```bash
uvicorn app.main:app --reload --port 8001
```
Then update `frontend/src/services/api.js` line 3 to use port 8001

### Issue 5: Port 3000 already in use
**Solution**: When prompted, press 'Y' to run on a different port

### Issue 6: CORS errors in browser
**Solution**: Ensure backend is running and CORS middleware is configured (already done)

---

## Running Tests

To run unit tests (with venv activated):
```bash
pytest tests/ -v
```

---

## Stopping the Application

1. Press `Ctrl+C` in the backend terminal
2. Type `deactivate` to exit virtual environment
3. Press `Ctrl+C` in the frontend terminal

---

## Import Postman Collection

1. Open Postman
2. Click "Import"
3. Select `postman_collection.json` from the Assignment folder
4. Start testing endpoints!
