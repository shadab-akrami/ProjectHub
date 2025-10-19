import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function DeveloperDashboard() {
  const [myTasks, setMyTasks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData) {
      fetchMyTasks(userData.id);
    }
  }, []);

  const fetchMyTasks = async (userId) => {
    try {
      // Developers can only see their own tasks
      const response = await api.get(`/tasks?assigned_to=${userId}`);
      setMyTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchMyTasks(user.id);
      alert('Task status updated successfully!');
    } catch (error) {
      alert('Error updating task: ' + (error.response?.data?.detail || error.message));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'To Do': return 'badge-todo';
      case 'In Progress': return 'badge-in-progress';
      case 'Done': return 'badge-done';
      default: return '';
    }
  };

  const todoTasks = myTasks.filter(t => t.status === 'To Do');
  const inProgressTasks = myTasks.filter(t => t.status === 'In Progress');
  const doneTasks = myTasks.filter(t => t.status === 'Done');

  return (
    <div className="developer-dashboard">
      <h2>My Tasks</h2>
      <p className="welcome-text">Welcome back, {user?.name}! Here are your assigned tasks.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{myTasks.length}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card stat-todo">
          <h3>{todoTasks.length}</h3>
          <p>To Do</p>
        </div>
        <div className="stat-card stat-progress">
          <h3>{inProgressTasks.length}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card stat-done">
          <h3>{doneTasks.length}</h3>
          <p>Completed</p>
        </div>
      </div>

      <div className="tasks-board">
        <div className="task-column">
          <h3 className="column-header todo-header">To Do</h3>
          {todoTasks.map(task => (
            <div key={task.id} className="task-card">
              <h4>{task.title}</h4>
              <p>{task.description || 'No description'}</p>
              {task.deadline && (
                <div className="task-deadline">
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </div>
              )}
              <select
                className="status-select"
                value={task.status}
                onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          ))}
          {todoTasks.length === 0 && (
            <div className="empty-state">No tasks to do</div>
          )}
        </div>

        <div className="task-column">
          <h3 className="column-header progress-header">In Progress</h3>
          {inProgressTasks.map(task => (
            <div key={task.id} className="task-card">
              <h4>{task.title}</h4>
              <p>{task.description || 'No description'}</p>
              {task.deadline && (
                <div className="task-deadline">
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </div>
              )}
              <select
                className="status-select"
                value={task.status}
                onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          ))}
          {inProgressTasks.length === 0 && (
            <div className="empty-state">No tasks in progress</div>
          )}
        </div>

        <div className="task-column">
          <h3 className="column-header done-header">Done</h3>
          {doneTasks.map(task => (
            <div key={task.id} className="task-card task-completed">
              <h4>{task.title}</h4>
              <p>{task.description || 'No description'}</p>
              {task.deadline && (
                <div className="task-deadline">
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </div>
              )}
              <select
                className="status-select"
                value={task.status}
                onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          ))}
          {doneTasks.length === 0 && (
            <div className="empty-state">No completed tasks</div>
          )}
        </div>
      </div>

      {myTasks.length === 0 && (
        <div className="no-tasks-message">
          <h3>No tasks assigned yet</h3>
          <p>Your manager will assign tasks to you soon.</p>
        </div>
      )}
    </div>
  );
}

export default DeveloperDashboard;
