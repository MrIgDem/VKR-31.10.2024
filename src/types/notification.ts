export type NotificationType = 
  | 'info' 
  | 'warning' 
  | 'error' 
  | 'success';

export type NotificationCategory =
  | 'project'
  | 'task'
  | 'risk'
  | 'document'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  categories: {
    [key in NotificationCategory]: {
      enabled: boolean;
      email: boolean;
      push: boolean;
      minPriority: NotificationPriority;
    };
  };
}

export interface NotificationStore {
  notifications: Notification[];
  preferences: NotificationPreferences;
  isLoading: boolean;
  error: string | null;

  // Методы для уведомлений
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;

  // Методы для настроек уведомлений
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  
  // Push-уведомления
  requestPushPermission: () => Promise<boolean>;
  subscribeToPush: () => Promise<void>;
  unsubscribeFromPush: () => Promise<void>;

  // Email-уведомления
  updateEmailPreferences: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;

  // Получение уведомлений
  getUnreadCount: () => number;
  getNotificationsByCategory: (category: NotificationCategory) => Notification[];
  getRecentNotifications: (limit?: number) => Notification[];
}