import api from './api';
import * as mockDb from '../utils/mockDb';

const USE_MOCK = true;

export const getProjects = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let projects = mockDb.dbGetProjects();

    // Get logged-in user to filter data
    const userJson = localStorage.getItem('sh02_auth_user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (user) {
      const role = user.role;
      const isAdmin = role === 'ADMIN' || role === 'CEO';
      const isIntern = role === 'INTERN';
      const isClient = role === 'CLIENT';

      if (!isAdmin) {
        if (isIntern) {
          // Intern: filter by team isolation
          projects = projects.filter((p) => p.teamId === user.team_id);
        } else if (isClient) {
          // Client: filter by client name match
          projects = projects.filter((p) => p.client === user.clientName);
        } else {
          // PM, Dev, Designer, QA: filter by assigned project ids or teamMembers
          const assignedIds = user.assignedProjects || [];
          projects = projects.filter(
            (p) => assignedIds.includes(p.id) || p.teamMembers?.includes(user.id)
          );
        }
      }
    }

    // Filter by search query (name or client)
    if (params.search) {
      const q = params.search.toLowerCase();
      projects = projects.filter(
        (p) => p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)
      );
    }

    // Filter by project category
    if (params.category) {
      projects = projects.filter((p) => p.category === params.category);
    }

    // Filter by project status
    if (params.status) {
      projects = projects.filter((p) => p.status === params.status);
    }

    return {
      projects,
      total: projects.length,
    };
  }

  const response = await api.get('/api/projects', { params });
  return response.data;
};

export const getProject = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const project = mockDb.dbGetProject(id);
    if (!project) throw new Error('Proyek tidak ditemukan.');
    return project;
  }

  const response = await api.get(`/api/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveProject(projectData);
  }

  const response = await api.post('/api/projects', projectData);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveProject({ ...projectData, id });
  }

  const response = await api.put(`/api/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockDb.dbDeleteProject(id);
    return { success: true };
  }

  const response = await api.delete(`/api/projects/${id}`);
  return response.data;
};

export const updateProjectProgress = async (id, progressData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const project = mockDb.dbGetProject(id);
    if (!project) throw new Error('Proyek tidak ditemukan.');
    
    const updated = {
      ...project,
      progress: parseInt(progressData.progress, 10),
      progressNotes: progressData.progressNotes || '',
      status: progressData.status || project.status
    };
    return mockDb.dbSaveProject(updated);
  }

  const response = await api.put(`/api/projects/${id}/progress`, progressData);
  return response.data;
};
