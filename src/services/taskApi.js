import api from './api';
import { normalizeTask, serializeTask } from '../utils/contractMap';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('sh02_auth_user') || 'null');
  } catch {
    return null;
  }
};

export const getTasks = async (params = {}) => {
  const response = await api.get('/api/tasks', { params });
  const raw = response.data;
  const list = raw?.data ?? (Array.isArray(raw) ? raw : []);
  return list.map(normalizeTask);
};

export const createTask = async (taskData) => {
  const payload = {
    ...serializeTask(taskData),
    createdBy: taskData.createdBy || getStoredUser()?.id,
  };
  const response = await api.post('/api/tasks', payload);
  return normalizeTask(response.data?.data ?? response.data);
};

export const updateTask = async (id, taskData) => {
  const payload = serializeTask(taskData);
  delete payload.projectId;
  delete payload.assigneeId;
  delete payload.createdBy;
  const response = await api.put(`/api/tasks/${id}`, payload);
  return normalizeTask(response.data?.data ?? response.data);
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data?.data ?? response.data;
};
