// ============================================================
// CampusOS AI — Roles & Permissions
// ============================================================

/** All user roles in the system */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CAMPUS_ADMIN = 'CAMPUS_ADMIN',
  HOD = 'HOD',
  FACULTY = 'FACULTY',
  STUDENT = 'STUDENT',
  PLACEMENT_OFFICER = 'PLACEMENT_OFFICER',
  HOSTEL_MANAGER = 'HOSTEL_MANAGER',
  TRANSPORT_MANAGER = 'TRANSPORT_MANAGER',
}

/** Platform each role belongs to */
export const ROLE_PLATFORM: Record<UserRole, 'web' | 'mobile' | 'both'> = {
  [UserRole.SUPER_ADMIN]: 'web',
  [UserRole.CAMPUS_ADMIN]: 'web',
  [UserRole.HOD]: 'web',
  [UserRole.FACULTY]: 'mobile',
  [UserRole.STUDENT]: 'mobile',
  [UserRole.PLACEMENT_OFFICER]: 'web',
  [UserRole.HOSTEL_MANAGER]: 'web',
  [UserRole.TRANSPORT_MANAGER]: 'web',
};

/** Admin/management roles that access the web dashboard */
export const WEB_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.CAMPUS_ADMIN,
  UserRole.HOD,
  UserRole.PLACEMENT_OFFICER,
  UserRole.HOSTEL_MANAGER,
  UserRole.TRANSPORT_MANAGER,
];

/** Roles that access the mobile app */
export const MOBILE_ROLES: UserRole[] = [
  UserRole.FACULTY,
  UserRole.STUDENT,
];

/** Roles allowed to view all campuses (national scope) */
export const NATIONAL_SCOPE_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
];

/** Roles scoped to a single campus */
export const CAMPUS_SCOPE_ROLES: UserRole[] = [
  UserRole.CAMPUS_ADMIN,
  UserRole.PLACEMENT_OFFICER,
  UserRole.HOSTEL_MANAGER,
  UserRole.TRANSPORT_MANAGER,
];

/** Roles scoped to a single branch within a campus */
export const BRANCH_SCOPE_ROLES: UserRole[] = [
  UserRole.HOD,
  UserRole.FACULTY,
  UserRole.STUDENT,
];

/** Module-level permission map */
export const MODULE_PERMISSIONS: Record<string, UserRole[]> = {
  dashboard: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.HOD],
  campuses: [UserRole.SUPER_ADMIN],
  branches: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN],
  students: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.HOD, UserRole.FACULTY],
  faculty: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.HOD],
  academics: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.HOD, UserRole.FACULTY],
  attendance: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.HOD, UserRole.FACULTY, UserRole.STUDENT],
  timetable: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.HOD, UserRole.FACULTY, UserRole.STUDENT],
  'ai-risk': [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.HOD, UserRole.FACULTY],
  placements: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.PLACEMENT_OFFICER, UserRole.STUDENT],
  events: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.HOD, UserRole.STUDENT],
  hostel: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.HOSTEL_MANAGER, UserRole.STUDENT],
  transport: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.TRANSPORT_MANAGER, UserRole.STUDENT],
  notifications: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.HOD, UserRole.FACULTY, UserRole.STUDENT],
  assistant: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN, UserRole.HOD, UserRole.FACULTY, UserRole.STUDENT],
  settings: [UserRole.SUPER_ADMIN, UserRole.CAMPUS_ADMIN],
};
