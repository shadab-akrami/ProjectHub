import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Developer'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/', newUser);
      setNewUser({ name: '', email: '', password: '', role: 'Developer' });
      setShowUserForm(false);
      fetchUsers();
      alert('User created successfully!');
    } catch (error) {
      alert('Error creating user: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
      alert('User deleted successfully!');
    } catch (error) {
      alert('Error deleting user: ' + (error.response?.data?.detail || error.message));
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'Admin': return 'badge-admin';
      case 'Manager': return 'badge-manager';
      case 'Developer': return 'badge-developer';
      default: return '';
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

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
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{stats.overdue_tasks}</h3>
            <p>Overdue Tasks</p>
          </div>
        </div>
      )}

      <div className="admin-section">
        <div className="section-header">
          <h3>User Management</h3>
          <button className="btn-primary" onClick={() => setShowUserForm(!showUserForm)}>
            {showUserForm ? 'Cancel' : '+ Create User'}
          </button>
        </div>

        {showUserForm && (
          <form className="user-form" onSubmit={handleCreateUser}>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="Developer">Developer</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit" className="btn-primary">Create User</button>
          </form>
        )}

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-danger btn-sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
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
          Manage Tasks
        </button>
        <button className="action-btn" onClick={() => navigate('/users')}>
          View All Users
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
