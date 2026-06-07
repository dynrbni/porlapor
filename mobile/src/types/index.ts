export type Role = 'USER' | 'AGENCY' | 'ADMIN' | 'SUPERADMIN';
export type ReportStatus = 'PENDING' | 'IN_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type Gender = 'LAKI_LAKI' | 'PEREMPUAN';
export type PhotoSource = 'LOCAL' | 'URL';
export type NotificationType = 'new_report' | 'comment' | 'like' | 'official_note' | 'status_change';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  nik: string;
  birthDate: string | null;
  address: string;
  gender: Gender;
  photoUrl: string | null;
  photoSource: PhotoSource | null;
  role: Role;
  agencyId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Agency {
  id: string;
  name: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  photoUrl: string | null;
  photoSource: PhotoSource | null;
  categories?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  agencyId: string | null;
  agency?: Agency;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string | null;
  imageUrl: string | null;
  status: ReportStatus;
  userId: string;
  user?: User;
  categoryId: string;
  category?: Category;
  agencyId: string | null;
  agency?: Agency;
  comments?: Comment[];
  likes?: ReportLike[];
  officialNotes?: OfficialNote[];
  _count?: { comments: number; likes: number };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  reportId: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ReportLike {
  id: string;
  userId: string;
  reportId: string;
  createdAt: string;
}

export interface OfficialNote {
  id: string;
  content: string;
  reportId: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  reportId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface StatsResponse {
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

export interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
}
