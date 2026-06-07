import { api } from "./client";
import type { Notification, ApiResponse } from "../types";

export async function getNotifications() {
  const { data } = await api.get<ApiResponse<Notification[]>>(
    "/notifications"
  );
  return data;
}

export async function readNotification(id: string) {
  await api.patch(`/notifications/${id}/read`);
}

export async function readAllNotifications() {
  await api.patch("/notifications/read-all");
}
