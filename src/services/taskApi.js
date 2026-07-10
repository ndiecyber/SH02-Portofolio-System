import api from './api';
import * as mockDb from '../utils/mockDb';

const USE_MOCK = true;

export const getTasks = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let tasks = mockDb.dbGetTasks();

    if (params.projectId) {
      tasks = tasks.filter((t) => t.projectId === params.projectId);
    }

    if (params.assigneeId) {
      tasks = tasks.filter((t) => t.assigneeId === params.assigneeId);
    }

    if (params.status) {
      tasks = tasks.filter((t) => t.status === params.status);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      tasks = tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    return tasks;
  }

  const response = await api.get('/api/tasks', { params });
  return response.data;
};

export const createTask = async (taskData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveTask(taskData);
  }

  const response = await api.post('/api/tasks', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveTask({ ...taskData, id });
  }

  const response = await api.put(`/api/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockDb.dbDeleteTask(id);
    return { success: true };
  }

  const response = await api.delete(`/api/tasks/${id}`);
  return response.data;
};
