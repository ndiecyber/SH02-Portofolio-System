import api from './api';
import { normalizeClient, serializeClient } from '../utils/contractMap';

export const getClients = async (params = {}) => {
  const response = await api.get('/api/clients', { params });
  const raw = response.data;
  const list = raw?.data ?? raw?.clients ?? (Array.isArray(raw) ? raw : []);
  return {
    clients: list.map(normalizeClient),
    total: raw?.meta?.total ?? raw?.total ?? list.length,
  };
};

export const createClient = async (clientData) => {
  const response = await api.post('/api/clients', serializeClient(clientData));
  return normalizeClient(response.data?.data ?? response.data);
};

export const updateClient = async (id, clientData) => {
  const response = await api.put(`/api/clients/${id}`, serializeClient(clientData));
  return normalizeClient(response.data?.data ?? response.data);
};

export const deleteClient = async (id) => {
  const response = await api.delete(`/api/clients/${id}`);
  return response.data?.data ?? response.data;
};
