import React, { useState, useEffect } from 'react';
import { projectService, userService } from '../services/api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team_member_ids: [],
  });

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAll();
      setProjects(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectService.update(editingProject.id, formData);
      } else {
        await projectService.create(formData);
      }
      setShowModal(false);
      setEditingProject(null);
      setFormData({ name: '', description: '', team_member_ids: [] });
      fetchProjects();
    } catch (err) {
      setError('Failed to save project');
      console.error(err);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      team_member_ids: project.team_members.map(m => m.id),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.delete(id);
        fetchProjects();
      } catch (err) {
        setError('Failed to delete project');
        console.error(err);
      }
    }
  };

  const handleTeamMemberToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      team_member_ids: prev.team_member_ids.includes(userId)
        ? prev.team_member_ids.filter(id => id !== userId)
        : [...prev.team_member_ids, userId]
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Projects</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Project
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="grid">
        {projects.map((project) => (
          <div key={project.id} className="card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div style={{ marginTop: '1rem' }}>
              <strong>Team Members:</strong>
              <div style={{ marginTop: '0.5rem' }}>
                {project.team_members.length > 0 ? (
                  project.team_members.map(member => (
                    <span key={member.id} className="badge badge-developer" style={{ marginRight: '0.5rem' }}>
                      {member.name}
                    </span>
                  ))
                ) : (
                  <span style={{ color: '#7f8c8d' }}>No team members</span>
                )}
              </div>
            </div>
            <div className="action-buttons">
              <button className="btn btn-primary btn-small" onClick={() => handleEdit(project)}>
                Edit
              </button>
              <button className="btn btn-danger btn-small" onClick={() => handleDelete(project.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingProject(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="close-btn" onClick={() => { setShowModal(false); setEditingProject(null); }}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Team Members</label>
                <div className="checkbox-group">
                  {users.map(user => (
                    <div key={user.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.team_member_ids.includes(user.id)}
                        onChange={() => handleTeamMemberToggle(user.id)}
                      />
                      <span>{user.name} ({user.role})</span>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
