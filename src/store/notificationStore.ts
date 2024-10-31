import { create } from 'zustand';
import { NotificationStore, Notification, NotificationPreferences } from '../types/notification';

const defaultPreferences: NotificationPreferences = {
  email: true,
  push: true,
  categories: {
    project: {
      enabled: true,
      email: true,
      push: true,
      minPriority: 'medium',
    },
    task: {
      enabled: true,
      email: true,
      push: true,
      minPriority: 'medium',
    },
    risk: {
      enabled: true,
      email: true,
      push: true,
      minPriority: 'low',
    },
    document: {
      enabled: true,
      email: true,
      push: true,
      minPriority: 'medium',
    },
    system: {
      enabled: true,
      email: true,
      push: true,
      minPriority: 'high',
    },
  },
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  preferences: defaultPreferences,
  isLoading: false,
  error: null,

  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      read: false,
    };

    set(state => ({
      notifications: [notification, ...state.notifications],
    }));

    // Отправка Push-уведомления
    if (get().preferences.push && 
        get().preferences.categories[notification.category].push &&
        Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon.png',
      });
    }

    // Отправка Email-уведомления
    if (get().preferences.email && 
        get().preferences.categories[notification.category].email) {
      // Здесь должна быть логика отправки email
    }
  },

  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    }));
  },

  deleteNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  updatePreferences: (preferences) => {
    set(state => ({
      preferences: {
        ...state.preferences,
        ...preferences,
      },
    }));
  },

  requestPushPermission: async () => {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request push permission:', error);
      return false;
    }
  },

  subscribeToPush: async () => {
    try {
      const permission = await get().requestPushPermission();
      if (permission) {
        // Здесь должна быть логика подписки на push-уведомления
        set(state => ({
          preferences: {
            ...state.preferences,
            push: true,
          },
        }));
      }
    } catch (error) {
      set({ error: 'Failed to subscribe to push notifications' });
    }
  },

  unsubscribeFromPush: async () => {
    try {
      // Здесь должна быть логика отписки от push-уведомлений
      set(state => ({
        preferences: {
          ...state.preferences,
          push: false,
        },
      }));
    } catch (error) {
      set({ error: 'Failed to unsubscribe from push notifications' });
    }
  },

  updateEmailPreferences: async (email: string) => {
    try {
      // Здесь должна быть логика обновления email-предпочтений
      set(state => ({
        preferences: {
          ...state.preferences,
          email: true,
        },
      }));
    } catch (error) {
      set({ error: 'Failed to update email preferences' });
    }
  },

  verifyEmail: async (token: string) => {
    try {
      // Здесь должна быть логика верификации email
      return true;
    } catch (error) {
      set({ error: 'Failed to verify email' });
      return false;
    }
  },

  getUnreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  },

  getNotificationsByCategory: (category) => {
    return get().notifications.filter(n => n.category === category);
  },

  getRecentNotifications: (limit = 10) => {
    return get().notifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
}));