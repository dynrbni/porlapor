import { api } from "./client";

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  message: string;
  reportId: string | null;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await api.get("/notifications/unread-count");
  return res.data;
};

export const markAsRead = async (id: string) => {
  return api.put(`/notifications/${id}/read`);
};

export const markAllAsRead = async () => {
  return api.put("/notifications/read-all");
};
