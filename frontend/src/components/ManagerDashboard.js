import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function ManagerDashboard() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
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

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="manager-dashboard">
      <h2>Manager Dashboard</h2>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.total_projects}</h3>
            <p>Total Projects</p>
          </div>
          <div className="stat-card">
            <h3>{stats.total_tasks}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-card">
            <h3>{stats.tasks_by_status?.['In Progress'] || 0}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3>{stats.overdue_tasks}</h3>
            <p>Overdue Tasks</p>
          </div>
        </div>
      )}

      <div className="manager-section">
        <div className="section-header">
          <h3>Projects Overview</h3>
          <button className="btn-primary" onClick={() => navigate('/projects')}>
            + Create Project
          </button>
        </div>

        <div className="projects-grid">
          {projects.slice(0, 4).map(project => (
            <div key={project.id} className="project-card" onClick={() => navigate('/projects')}>
              <h4>{project.name}</h4>
              <p>{project.description || 'No description'}</p>
              <div className="project-meta">
                <span>Team: {project.team_members?.length || 0} members</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="manager-section">
        <div className="section-header">
          <h3>Recent Tasks</h3>
          <button className="btn-primary" onClick={() => navigate('/tasks')}>
            + Create Task
          </button>
        </div>

        <table className="tasks-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {recentTasks.map(task => (
              <tr key={task.id} onClick={() => navigate('/tasks')} style={{cursor: 'pointer'}}>
                <td>{task.title}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td>{task.assigned_to ? `User #${task.assigned_to}` : 'Unassigned'}</td>
                <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="quick-actions">
        <button className="action-btn" onClick={() => navigate('/projects')}>
          Manage Projects
        </button>
        <button className="action-btn" onClick={() => navigate('/tasks')}>
          Manage All Tasks
        </button>
        <button className="action-btn" onClick={() => navigate('/users')}>
          View Team Members
        </button>
      </div>
    </div>
  );
}

export default ManagerDashboard;
