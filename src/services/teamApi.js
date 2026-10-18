import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';

export const getTeams = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockDb.dbGetTeams();
  }

  const response = await api.get('/api/teams');
  return response.data?.data ?? response.data;
};

export const createTeam = async (teamData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveTeam(teamData);
  }

  const response = await api.post('/api/teams', teamData);
  return response.data?.data ?? response.data;
};

export const updateTeam = async (id, teamData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.dbSaveTeam({ ...teamData, id });
  }

  const response = await api.put(`/api/teams/${id}`, teamData);
  return response.data?.data ?? response.data;
};

export const deleteTeam = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockDb.dbDeleteTeam(id);
    return { success: true };
  }

  const response = await api.delete(`/api/teams/${id}`);
  return response.data?.data ?? response.data;
};
