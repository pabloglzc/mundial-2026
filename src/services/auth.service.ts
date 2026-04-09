'use client';

import { User } from './types';
import { generateId } from '@/lib/utils';

const USERS_KEY = 'mundial2026_users';
const CURRENT_USER_KEY = 'mundial2026_currentUser';

function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    // Seed with admin user
    const admin: User = {
      id: 'admin-1',
      email: 'admin@mundial2026.com',
      name: 'Administrador',
      password: 'admin123',
      role: 'admin',
      paymentStatus: 'verified',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
    return [admin];
  }
  return JSON.parse(data);
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      return safeUser;
    }
    return null;
  },

  async register(email: string, password: string, name: string): Promise<User | null> {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return null; // email already exists
    }
    const newUser: User = {
      id: generateId(),
      email,
      password,
      name,
      role: 'user',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(CURRENT_USER_KEY);
    if (!data) return null;
    // Re-fetch from users array to get latest paymentStatus
    const stored = JSON.parse(data) as User;
    const users = getUsers();
    const fresh = users.find(u => u.id === stored.id);
    if (fresh) {
      const { password: _, ...safeUser } = fresh;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      return safeUser;
    }
    return stored;
  },

  async updatePaymentStatus(userId: string, status: User['paymentStatus']): Promise<void> {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.paymentStatus = status;
      saveUsers(users);
      // Update current user if it's the same
      const current = localStorage.getItem(CURRENT_USER_KEY);
      if (current) {
        const parsed = JSON.parse(current);
        if (parsed.id === userId) {
          parsed.paymentStatus = status;
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(parsed));
        }
      }
    }
  },

  async getAllUsers(): Promise<User[]> {
    return getUsers().map(u => {
      const { password: _, ...safe } = u;
      return safe;
    });
  },
};
