import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import DeveloperDashboard from './components/DeveloperDashboard';
import Users from './components/Users';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import Login from './components/Login';
import Register from './components/Register';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

function RoleBasedDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  switch(user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Manager':
      return <ManagerDashboard />;
    case 'Developer':
      return <DeveloperDashboard />;
    default:
      return <Navigate to="/login" />;
  }
}

function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>Project Hub</h1>
        <div>
          <NavLink to="/">Dashboard</NavLink>

          {/* Show Users link for Admin and Manager */}
          {(user?.role === 'Admin' || user?.role === 'Manager') && (
            <NavLink to="/users">Users</NavLink>
          )}

          {/* Show Projects and Tasks for Admin and Manager */}
          {(user?.role === 'Admin' || user?.role === 'Manager') && (
            <>
              <NavLink to="/projects">Projects</NavLink>
              <NavLink to="/tasks">Tasks</NavLink>
            </>
          )}
        </div>
      </div>
      <div className="navbar-right">
        {user && (
          <>
            <div className="user-info">
              <div className="user-avatar">{getInitials(user.name)}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{user.role}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <NavBar />
                <div className="container">
                  <Routes>
                    {/* Role-based Dashboard */}
                    <Route path="/" element={<RoleBasedDashboard />} />

                    {/* Admin and Manager can view users */}
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                          <Users />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin and Manager routes */}
                    <Route
                      path="/projects"
                      element={
                        <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                          <Projects />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/tasks"
                      element={
                        <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                          <Tasks />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
