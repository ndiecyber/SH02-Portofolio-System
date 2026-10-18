import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';
import { normalizeClient, serializeClient } from '../utils/contractMap';

export const getClients = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const clients = mockDb.dbGetClients();
    return { clients, total: clients.length };
  }

  const response = await api.get('/api/clients', { params });
  const raw = response.data;
  const list = raw?.data ?? raw?.clients ?? (Array.isArray(raw) ? raw : []);
  return {
    clients: list.map(normalizeClient),
    total: raw?.meta?.total ?? raw?.total ?? list.length,
  };
};

export const getClient = async (id) => {
  if (USE_MOCK) {
    const client = mockDb.dbGetClient(id);
    if (!client) throw new Error('Klien tidak ditemukan.');
    return client;
  }
  const response = await api.get(`/api/clients/${id}`);
  return normalizeClient(response.data?.data ?? response.data);
};

export const createClient = async (clientData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveClient(clientData);
  }
  const response = await api.post('/api/clients', serializeClient(clientData));
  return normalizeClient(response.data?.data ?? response.data);
};

export const updateClient = async (id, clientData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveClient({ ...clientData, id });
  }
  const response = await api.put(`/api/clients/${id}`, serializeClient(clientData));
  return normalizeClient(response.data?.data ?? response.data);
};

export const deleteClient = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockDb.dbDeleteClient(id);
    return { success: true };
  }
  const response = await api.delete(`/api/clients/${id}`);
  return response.data?.data ?? response.data;
};
