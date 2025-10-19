import React, { useState, useEffect } from 'react';
import { taskService, projectService, userService } from '../services/api';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    project_id: '',
    assigned_to: '',
    deadline: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAll();
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAll();
      setProjects(response.data);
    } catch (err) {
      console.error(err);
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
      const submitData = {
        ...formData,
        project_id: parseInt(formData.project_id),
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
        deadline: formData.deadline || null,
      };

      if (editingTask) {
        await taskService.update(editingTask.id, submitData);
      } else {
        await taskService.create(submitData);
      }
      setShowModal(false);
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'To Do',
        project_id: '',
        assigned_to: '',
        deadline: '',
      });
      fetchTasks();
    } catch (err) {
      setError('Failed to save task');
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      project_id: task.project_id,
      assigned_to: task.assigned_to || '',
      deadline: task.deadline ? task.deadline.split('.')[0] : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(id);
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'To Do': 'badge-todo',
      'In Progress': 'badge-progress',
      'Done': 'badge-done',
    };
    return statusMap[status] || 'badge-todo';
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown';
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Tasks</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Task
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="grid">
        {tasks.map((task) => (
          <div key={task.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <h3>{task.title}</h3>
              <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                {task.status}
              </span>
            </div>
            <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>{task.description}</p>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Project:</strong> {getProjectName(task.project_id)}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Assigned to:</strong> {getUserName(task.assigned_to)}
              </div>
              {task.deadline && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="action-buttons">
              <button className="btn btn-primary btn-small" onClick={() => handleEdit(task)}>
                Edit
              </button>
              <button className="btn btn-danger btn-small" onClick={() => handleDelete(task.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingTask(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
              <button className="close-btn" onClick={() => { setShowModal(false); setEditingTask(null); }}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <label>Project</label>
                <select
                  required
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Assign to</label>
                <select
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
