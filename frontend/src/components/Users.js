import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer',
    password: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the admin endpoint for creating users with proper role
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      await axios.post(`${API_URL}/users/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setShowModal(false);
      setFormData({ name: '', email: '', role: 'Developer', password: '' });
      fetchUsers();
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
        console.error(err);
      }
    }
  };

  const getRoleBadgeClass = (role) => {
    const roleMap = {
      'Admin': 'badge-admin',
      'Manager': 'badge-manager',
      'Developer': 'badge-developer',
    };
    return roleMap[role] || 'badge-developer';
  };

  if (loading) return <div className="loading">Loading...</div>;

  const isAdmin = currentUser?.role === 'Admin';

  return (
    <div>
      <div className="page-header">
        <h2>{isAdmin ? 'User Management' : 'Team Members'}</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add User
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {!isAdmin && (
        <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>
          View all team members. Only Admins can create or delete users.
        </p>
      )}

      <div className="grid">
        {users.map((user) => (
          <div key={user.id} className="list-item">
            <div className="list-item-content">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                {user.role}
              </span>
            </div>
            {isAdmin && (
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New User</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Create User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
