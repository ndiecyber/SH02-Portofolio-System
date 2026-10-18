import api from './api';

export const getTeams = async () => {
  const response = await api.get('/api/teams');
  return response.data?.data ?? response.data;
};
