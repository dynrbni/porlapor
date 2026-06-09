export type Gender = "LAKI_LAKI" | "PEREMPUAN";
export type Role = "USER" | "AGENCY" | "ADMIN" | "SUPERADMIN";
export type ReportStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  nik?: string;
  address?: string;
  gender?: Gender;
  photoUrl?: string;
  agencyId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Agency {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  photoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  agencyId?: string;
}

export interface Author {
  id: string;
  name: string;
  role?: string;
  photoUrl?: string;
}

export interface Comment {
  id: string;
  reportId: string;
  content: string;
  createdAt: string;
  author: Author;
}

export interface OfficialNote {
  id: string;
  reportId: string;
  content: string;
  createdAt: string;
  author: Author;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  latitude: number;
  longitude: number;
  address?: string;
  imageUrl?: string;
  user?: Author;
  category?: Category;
  agency?: Agency;
  comments?: Comment[];
  officialNotes?: OfficialNote[];
  likes?: { userId: string }[];
  _count?: { likes: number; comments: number };
  createdAt: string;
  updatedAt: string;
}

export interface ReportStats {
  totalReports: number;
  totalAgencies: number;
  totalUsers: number;
  reportsByStatus: { status: string; count: number }[];
  reportsByAgency: { agencyName: string; count: number }[];
  recentReports: Report[];
  dailyReports: { date: string; count: number }[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  nik: string;
  address: string;
  birthDate: string;
  gender: Gender;
}
