import { api, publicApi } from "./client";
import type { Report } from "../types";

export async function getReports(params?: Record<string, any>) {
  const { data } = await publicApi.get("/reports", { params });
  return data as { message: string; data: Report[] };
}

export async function getReportById(id: string) {
  const { data } = await publicApi.get(`/reports/${id}`);
  return data as { message: string; data: Report };
}

export async function getMyReports(userId: string, params?: Record<string, any>) {
  const { data } = await api.get("/reports", { params: { ...params, userId } });
  return data as { message: string; data: Report[] };
}

export async function createReport(formData: FormData) {
  const { data } = await api.post("/reports", formData);
  return data;
}

export async function addComment(reportId: string, content: string) {
  const { data } = await api.post(`/reports/${reportId}/comments`, {
    content,
  });
  return data as { message: string; data: Comment };
}

export async function toggleLike(reportId: string) {
  const { data } = await api.post(`/reports/${reportId}/like`);
  return data as { message: string; liked: boolean };
}

export async function getStats() {
  const { data } = await publicApi.get("/reports/stats");
  return data as { message: string; data: import("../types").ReportStats };
}
