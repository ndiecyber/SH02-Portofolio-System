import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';

export const getClients = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let clients = mockDb.dbGetClients();

    if (params.search) {
      const q = params.search.toLowerCase();
      clients = clients.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.company_name && c.company_name.toLowerCase().includes(q)) ||
          (c.industry && c.industry.toLowerCase().includes(q)) ||
          (c.contact_name && c.contact_name.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }

    if (params.active !== undefined && params.active !== '') {
      const isActiveBool = params.active === true || params.active === 'true';
      clients = clients.filter((c) => c.active === isActiveBool);
    }

    return {
      clients,
      total: clients.length,
    };
  }

  try {
    const response = await api.get('/api/clients', { params });
    const raw = response.data;
    let clientList = [];
    let totalCount = 0;

    if (Array.isArray(raw)) {
      clientList = raw;
      totalCount = raw.length;
    } else if (Array.isArray(raw?.data)) {
      clientList = raw.data;
      totalCount = raw.meta?.total ?? raw.total ?? raw.data.length;
    } else if (raw?.clients) {
      clientList = raw.clients;
      totalCount = raw.total ?? clientList.length;
    }

    // Normalize company_name and name aliases
    const normalized = clientList.map((c) => ({
      ...c,
      name: c.name || c.company_name || 'Client',
      company_name: c.company_name || c.name || 'Client',
      contact_name: c.contact_name || c.contactPerson || '',
    }));

    return {
      clients: normalized,
      total: totalCount,
    };
  } catch (err) {
    if (err.response?.status === 403) {
      console.warn('GET /api/clients returned 403 Forbidden (developer role), falling back to mock clients');
      const mockList = mockDb.dbGetClients();
      return { clients: mockList, total: mockList.length };
    }
    throw err;
  }
};

export const getClient = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const client = mockDb.dbGetClient(id);
    if (!client) throw new Error('Klien tidak ditemukan.');
    return client;
  }

  const response = await api.get(`/api/clients/${id}`);
  const data = response.data?.data ?? response.data;
  return {
    ...data,
    name: data.name || data.company_name || 'Client',
    company_name: data.company_name || data.name || 'Client',
    contact_name: data.contact_name || data.contactPerson || '',
  };
};

export const createClient = async (clientData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveClient(clientData);
  }

  const payload = {
    ...clientData,
    company_name: clientData.company_name || clientData.name,
    name: clientData.name || clientData.company_name,
  };

  const response = await api.post('/api/clients', payload);
  return response.data?.data ?? response.data;
};

export const updateClient = async (id, clientData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveClient({ ...clientData, id });
  }

  const payload = {
    ...clientData,
    company_name: clientData.company_name || clientData.name,
    name: clientData.name || clientData.company_name,
  };

  const response = await api.put(`/api/clients/${id}`, payload);
  return response.data?.data ?? response.data;
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
