import { api } from "./client";
import type { Report, ApiResponse } from "../types";

export interface ReportQuery {
  page?: number;
  limit?: number;
  status?: string;
  categoryId?: string;
  agencyId?: string;
  search?: string;
}

export async function getReports(params?: ReportQuery) {
  const { data } = await api.get<ApiResponse<Report[]>>("/reports", {
    params,
  });
  return data;
}

export async function getReportById(id: string) {
  const { data } = await api.get<ApiResponse<Report>>(`/reports/${id}`);
  return data;
}

export async function createReport(formData: FormData) {
  const { data } = await api.post<{ report: Report }>("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateReport(id: string, formData: FormData) {
  const { data } = await api.put<{ report: Report }>(
    `/reports/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export async function deleteReport(id: string) {
  await api.delete(`/reports/${id}`);
}

export async function getMyReports(params?: ReportQuery) {
  const { data } = await api.get<ApiResponse<Report[]>>("/reports/me", {
    params,
  });
  return data;
}

export async function likeReport(reportId: string) {
  const { data } = await api.post(`/reports/${reportId}/like`);
  return data;
}

export async function unlikeReport(reportId: string) {
  await api.delete(`/reports/${reportId}/like`);
}

export async function addComment(reportId: string, content: string) {
  const { data } = await api.post(`/reports/${reportId}/comments`, {
    content,
  });
  return data;
}

export async function getComments(reportId: string) {
  const { data } = await api.get(`/reports/${reportId}/comments`);
  return data;
}

export async function addOfficialNote(reportId: string, content: string) {
  const { data } = await api.post(`/reports/${reportId}/official-notes`, {
    content,
  });
  return data;
}

export async function updateReportStatus(
  reportId: string,
  status: string,
  note?: string
) {
  const { data } = await api.put(`/reports/${reportId}/status`, {
    status,
    note,
  });
  return data;
}
