import api from './api';
import { ROLES, MAGANG_TIERS } from '../config/constants';
import { initMockDb } from '../utils/mockDb';

// Initialize mock DB on load
initMockDb();

const USE_MOCK_AUTH = true;

const MOCK_CREDENTIALS = [
  {
    email: 'admin@lexa.com',
    password: 'admin123',
    user: {
      id: 'user-ceo',
      name: 'Yogi Nugraha (CEO)',
      email: 'admin@lexa.com',
      role: ROLES.CEO,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      assignedProjects: [],
      team_id: null
    }
  },
  {
    email: 'pm@lexa.com',
    password: 'pm1234',
    user: {
      id: 'mem-1', // maps to Sarah Chen PM
      name: 'Alex Johnson (PM)',
      email: 'pm@lexa.com',
      role: ROLES.PROJECT_MANAGER,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      assignedProjects: ['proj-1', 'proj-2', 'proj-5'],
      team_id: 'team-a'
    }
  },
  {
    email: 'dev@lexa.com',
    password: 'dev1234',
    user: {
      id: 'mem-2',
      name: 'Sarah Chen (Dev)',
      email: 'dev@lexa.com',
      role: ROLES.DEVELOPER,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      assignedProjects: ['proj-1', 'proj-5'],
      team_id: 'team-a'
    }
  },
  {
    email: 'designer@lexa.com',
    password: 'design123',
    user: {
      id: 'mem-4',
      name: 'Elena Rostova (UI/UX)',
      email: 'designer@lexa.com',
      role: ROLES.UIUX_DESIGNER,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      assignedProjects: ['proj-1', 'proj-4'],
      team_id: 'team-a'
    }
  },
  {
    email: 'qa@lexa.com',
    password: 'qa1234',
    user: {
      id: 'mem-5',
      name: 'Budi Santoso (QA)',
      email: 'qa@lexa.com',
      role: ROLES.QA_TESTER,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      assignedProjects: ['proj-1', 'proj-2'],
      team_id: 'team-b'
    }
  },
  {
    email: 'client@lexa.com',
    password: 'client123',
    user: {
      id: 'user-client',
      name: 'Urban Space (Client)',
      email: 'client@lexa.com',
      role: ROLES.CLIENT,
      clientName: 'Urban Space Properties',
      avatar: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      assignedProjects: ['proj-4'],
      team_id: null
    }
  },
  {
    email: 'learning.intern@lexa.com',
    password: 'intern123',
    user: {
      id: 'mem-6',
      name: 'Dewi Lestari (Intern T1)',
      email: 'learning.intern@lexa.com',
      role: ROLES.INTERN,
      magang_tier: MAGANG_TIERS.LEARNING,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      assignedProjects: ['proj-3'], // Team Gamma project
      team_id: 'team-c'
    }
  },
  {
    email: 'apprentice.intern@lexa.com',
    password: 'intern123',
    user: {
      id: 'mem-7',
      name: 'Dewi Lestari (Intern T2)',
      email: 'apprentice.intern@lexa.com',
      role: ROLES.INTERN,
      magang_tier: MAGANG_TIERS.APPRENTICE,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      assignedProjects: ['proj-3'],
      team_id: 'team-c'
    }
  },
  {
    email: 'junior.intern@lexa.com',
    password: 'intern123',
    user: {
      id: 'mem-8',
      name: 'Dewi Lestari (Intern T3)',
      email: 'junior.intern@lexa.com',
      role: ROLES.INTERN,
      magang_tier: MAGANG_TIERS.JUNIOR,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      assignedProjects: ['proj-3'],
      team_id: 'team-c'
    }
  }
];

export const login = async (email, password) => {
  if (USE_MOCK_AUTH) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const match = MOCK_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );

    if (match) {
      const mockToken = `mock_jwt_token_sh02_${match.user.role}_${match.user.id}`;
      return { user: match.user, token: mockToken };
    } else {
      throw new Error('Email atau password salah.');
    }
  }

  // Real REST API integration
  const response = await api.post('/auth/sign-in', { email, password });
  return response.data;
};

export const logout = async () => {
  if (USE_MOCK_AUTH) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const response = await api.post('/auth/sign-out');
  return response.data;
};

export const getProfile = async () => {
  if (USE_MOCK_AUTH) {
    const userJson = localStorage.getItem('sh02_auth_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  const response = await api.get('/auth/session');
  return response.data;
};
