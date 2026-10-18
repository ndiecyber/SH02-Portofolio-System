import api from './api';

export const getTeams = async () => {
  const response = await api.get('/api/teams');
  return response.data?.data ?? response.data;
};

export const createTeam = async (teamData) => {
  const response = await api.post('/api/teams', teamData);
  return response.data?.data ?? response.data;
};

export const updateTeam = async (id, teamData) => {
  const response = await api.put(`/api/teams/${id}`, teamData);
  return response.data?.data ?? response.data;
};

export const deleteTeam = async (id) => {
  const response = await api.delete(`/api/teams/${id}`);
  return response.data?.data ?? response.data;
};
