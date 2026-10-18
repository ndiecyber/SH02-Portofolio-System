import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';
import {
  normalizeProject,
  normalizeProjectList,
  projectStatusToApi,
} from '../utils/contractMap';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('sh02_auth_user') || 'null');
  } catch {
    return null;
  }
};

// UI form -> backend payload (backend uses lowercase enum + uuid relations).
export const serializeProjectPayload = (data = {}) => {
  const payload = {
    serviceId: data.serviceId,
    createdBy: data.createdBy || getStoredUser()?.id,
    name: data.name,
    clientId: data.clientId,
    description: data.description || undefined,
    repositoryUrl: data.repositoryUrl || undefined,
    demoUrl: data.demoUrl || undefined,
    thumbnail: data.thumbnail || undefined,
    status: projectStatusToApi(data.status),
    budget: data.budget !== undefined && data.budget !== '' ? String(data.budget) : undefined,
    startDate: data.startDate || undefined,
    endDate: data.endDate || undefined,
  };

  // Only send relation arrays when provided so editing doesn't wipe them.
  if (Array.isArray(data.technologyIds) && data.technologyIds.length > 0) {
    payload.technologyIds = data.technologyIds;
  }
  if (Array.isArray(data.memberIds) && data.memberIds.length > 0) {
    payload.memberIds = data.memberIds;
  }
  if (Array.isArray(data.teamIds) && data.teamIds.length > 0) {
    payload.teamIds = data.teamIds;
  }

  return payload;
};

export const getProjects = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const projects = mockDb.dbGetProjects();
    return { projects, total: projects.length };
  }

  const response = await api.get('/api/projects', { params });
  const raw = response.data;
  const list = raw?.data ?? raw?.projects ?? (Array.isArray(raw) ? raw : []);
  return {
    projects: normalizeProjectList(list),
    total: raw?.meta?.total ?? raw?.total ?? list.length,
  };
};

export const getProject = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const project = mockDb.dbGetProject(id);
    if (!project) throw new Error('Proyek tidak ditemukan.');
    return project;
  }

  const response = await api.get(`/api/projects/${id}`);
  return normalizeProject(response.data?.data ?? response.data);
};

export const createProject = async (projectData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveProject(projectData);
  }

  const response = await api.post('/api/projects', serializeProjectPayload(projectData));
  return normalizeProject(response.data?.data ?? response.data);
};

export const updateProject = async (id, projectData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveProject({ ...projectData, id });
  }

  const response = await api.put(`/api/projects/${id}`, serializeProjectPayload(projectData));
  return normalizeProject(response.data?.data ?? response.data);
};

export const deleteProject = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockDb.dbDeleteProject(id);
    return { success: true };
  }

  const response = await api.delete(`/api/projects/${id}`);
  return response.data?.data ?? response.data;
};

export const updateProjectProgress = async (id, progressData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const project = mockDb.dbGetProject(id);
    if (!project) throw new Error('Proyek tidak ditemukan.');
    return mockDb.dbSaveProject({
      ...project,
      progress: parseInt(progressData.progressPercentage ?? progressData.progress, 10),
      progressNotes: progressData.message || progressData.progressNotes || '',
    });
  }

  const payload = {
    progressPercentage: Number(progressData.progressPercentage ?? progressData.progress) || 0,
    message: progressData.message ?? progressData.progressNotes ?? '',
  };
  const response = await api.put(`/api/projects/${id}/progress`, payload);
  return normalizeProject(response.data?.data ?? response.data);
};

export const getProjectLogs = async (id) => {
  if (USE_MOCK) {
    return [];
  }
  const response = await api.get(`/api/projects/${id}/logs`);
  return response.data?.data ?? response.data ?? [];
};

export const trackProject = async (code) => {
  const response = await api.get(`/api/projects/track/${code}`);
  return response.data?.data ?? response.data;
};
