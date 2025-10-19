import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getMetrics();
      setMetrics(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!metrics) return null;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{metrics.total_projects}</h3>
          <p>Total Projects</p>
        </div>
        <div className="stat-card">
          <h3>{metrics.total_tasks}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{metrics.overdue_tasks}</h3>
          <p>Overdue Tasks</p>
        </div>
      </div>

      <div className="card">
        <h3>Tasks by Status</h3>
        <div style={{ marginTop: '1rem' }}>
          {Object.entries(metrics.tasks_by_status).map(([status, count]) => (
            <div key={status} style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>{status}</span>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
