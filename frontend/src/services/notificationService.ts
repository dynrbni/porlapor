import apiClient from './authService';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  reportId: string | null;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const res = await apiClient.get('/notifications');
    return res.data.data || [];
  },

  async getUnreadCount(): Promise<number> {
    const res = await apiClient.get('/notifications/unread-count');
    return res.data.data?.count || 0;
  },

  async markAsRead(id: string) {
    await apiClient.put(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    await apiClient.put('/notifications/read-all');
  },
};
