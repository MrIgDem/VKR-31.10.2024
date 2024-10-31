import { describe, test, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    localStorage.clear();
    const store = useAuthStore.getState();
    store.logout();
  });

  test('should register a new user', async () => {
    const store = useAuthStore.getState();
    const userData = {
      username: 'testuser',
      name: 'Test User',
      role: 'engineer' as const,
      accessLevel: 'user' as const,
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'engineering' as const,
      position: 'Engineer',
      password: 'password123'
    };

    await store.register(userData);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe(userData.username);
  });

  test('should login user with correct credentials', async () => {
    const store = useAuthStore.getState();
    const userData = {
      username: 'testuser',
      name: 'Test User',
      role: 'engineer' as const,
      accessLevel: 'user' as const,
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'engineering' as const,
      position: 'Engineer',
      password: 'password123'
    };

    await store.register(userData);
    await store.login('testuser', 'password123');
    
    expect(store.isAuthenticated).toBe(true);
    expect(store.user?.username).toBe(userData.username);
  });

  test('should not login with incorrect password', async () => {
    const store = useAuthStore.getState();
    const userData = {
      username: 'testuser',
      name: 'Test User',
      role: 'engineer' as const,
      accessLevel: 'user' as const,
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'engineering' as const,
      position: 'Engineer',
      password: 'password123'
    };

    await store.register(userData);
    
    await expect(store.login('testuser', 'wrongpassword')).rejects.toThrow('Неверный пароль');
  });

  test('should logout user', async () => {
    const store = useAuthStore.getState();
    const userData = {
      username: 'testuser',
      name: 'Test User',
      role: 'engineer' as const,
      accessLevel: 'user' as const,
      email: 'test@example.com',
      phone: '+7 (999) 999-99-99',
      department: 'engineering' as const,
      position: 'Engineer',
      password: 'password123'
    };

    await store.register(userData);
    await store.login('testuser', 'password123');
    store.logout();
    
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
  });
});