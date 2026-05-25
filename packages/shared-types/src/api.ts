// ============================================================
// CampusOS AI — API Types
// Request/Response types for API communication
// ============================================================

import { UserRole } from './roles.js';

// ---- API Response Envelope ----

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

// ---- Auth Types ----

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  campusId: string | null;
  branchId: string | null;
  campusName?: string;
  branchName?: string;
  isActive: boolean;
}

// ---- JWT Payload ----

export interface JwtPayload {
  id: string;
  role: UserRole;
  campusId: string | null;
  branchId: string | null;
  iat?: number;
  exp?: number;
}

// ---- Access Filter (set by branch middleware) ----

export interface AccessFilter {
  campusId?: string;
  branchId?: string;
}

// ---- Dashboard Types ----

export interface DashboardMetrics {
  totalStudents: number;
  totalFaculty: number;
  averageAttendance: number;
  highRiskStudents: number;
  placementReady: number;
  hostelOccupancy: number;
  activeTransportRoutes: number;
  activeEvents: number;
  branchWiseAttendance: BranchAttendance[];
  recentAlerts: DashboardAlert[];
}

export interface BranchAttendance {
  branchId: string;
  branchName: string;
  branchCode: string;
  averageAttendance: number;
  totalStudents: number;
}

export interface DashboardAlert {
  id: string;
  type: 'risk' | 'attendance' | 'placement' | 'hostel' | 'timetable';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: string;
}

// ---- Query Params ----

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface StudentQueryParams extends PaginationParams {
  branchId?: string;
  semester?: number;
  section?: string;
  search?: string;
}
