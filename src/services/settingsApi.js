import api, { USE_MOCK } from './api';
import * as mockDb from '../utils/mockDb';

export const getSettings = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockDb.dbGetSettings();
  }

  const response = await api.get('/api/settings');
  return response.data;
};

export const updateSettings = async (settingsData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.dbSaveSettings(settingsData);
  }

  const response = await api.put('/api/settings', settingsData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Retrieve current user
    const userJson = localStorage.getItem('sh02_auth_user');
    const user = userJson ? JSON.parse(userJson) : null;
    if (!user) throw new Error('Pengguna tidak terautentikasi.');

    const { currentPassword, newPassword } = passwordData;

    // Standard mock credentials validation
    const mockPasswords = {
      'admin@lexa.com': 'admin123',
      'pm@lexa.com': 'pm1234',
      'dev@lexa.com': 'dev1234',
      'designer@lexa.com': 'design123',
      'qa@lexa.com': 'qa1234',
      'client@lexa.com': 'client123',
      'learning.intern@lexa.com': 'intern123',
      'apprentice.intern@lexa.com': 'intern123',
      'junior.intern@lexa.com': 'intern123'
    };

    const correctPassword = mockPasswords[user.email] || 'password123';
    
    if (currentPassword !== correctPassword) {
      throw new Error('Kata sandi saat ini salah.');
    }

    if (newPassword.length < 6) {
      throw new Error('Kata sandi baru harus minimal 6 karakter.');
    }

    return { success: true, message: 'Kata sandi berhasil diperbarui.' };
  }

  const response = await api.put('/api/settings/password', passwordData);
  return response.data;
};
