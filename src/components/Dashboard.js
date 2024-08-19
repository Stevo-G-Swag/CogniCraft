import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useAuth();

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get('/api/projects', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProjects(response.data);
      console.log('Projects fetched successfully');
    } catch (error) {
      console.error('Error fetching projects:', error.message, error.stack);
    }
  }, [user.token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', newProject, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNewProject({ name: '', description: '' });
      fetchProjects();
      console.log('Project created successfully');
    } catch (error) {
      console.error('Error creating project:', error.message, error.stack);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <form onSubmit={handleCreateProject}>
        <input
          type="text"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          placeholder="Project Name"
          required
        />
        <input
          type="text"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          placeholder="Project Description"
        />
        <button type="submit">Create Project</button>
      </form>
      <h2>Your Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;