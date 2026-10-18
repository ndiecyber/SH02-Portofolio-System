import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';
import { normalizeTask, serializeTask } from '../utils/contractMap';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('sh02_auth_user') || 'null');
  } catch {
    return null;
  }
};

export const getTasks = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    let tasks = mockDb.dbGetTasks();
    if (params.projectId) tasks = tasks.filter((t) => t.projectId === params.projectId);
    if (params.assigneeId) tasks = tasks.filter((t) => t.assigneeId === params.assigneeId);
    return tasks;
  }

  const response = await api.get('/api/tasks', { params });
  const raw = response.data;
  const list = raw?.data ?? (Array.isArray(raw) ? raw : []);
  return list.map(normalizeTask);
};

export const createTask = async (taskData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return mockDb.dbSaveTask(taskData);
  }

  const payload = {
    ...serializeTask(taskData),
    createdBy: taskData.createdBy || getStoredUser()?.id,
  };
  const response = await api.post('/api/tasks', payload);
  return normalizeTask(response.data?.data ?? response.data);
};

export const updateTask = async (id, taskData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return mockDb.dbSaveTask({ ...taskData, id });
  }

  const payload = serializeTask(taskData);
  delete payload.projectId;
  delete payload.assigneeId;
  delete payload.createdBy;
  const response = await api.put(`/api/tasks/${id}`, payload);
  return normalizeTask(response.data?.data ?? response.data);
};

export const deleteTask = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockDb.dbDeleteTask(id);
    return { success: true };
  }

  const response = await api.delete(`/api/tasks/${id}`);
  return response.data?.data ?? response.data;
};
