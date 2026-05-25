// ============================================================
// CampusOS AI — Role-Based Routing
// Maps user roles to their default landing page
// ============================================================

// Role constants inlined to avoid cross-package import issues with Turbopack
// These mirror the UserRole enum from @campusos/shared-types
const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  CAMPUS_ADMIN: "CAMPUS_ADMIN",
  HOD: "HOD",
  FACULTY: "FACULTY",
  STUDENT: "STUDENT",
  PLACEMENT_OFFICER: "PLACEMENT_OFFICER",
  HOSTEL_MANAGER: "HOSTEL_MANAGER",
  TRANSPORT_MANAGER: "TRANSPORT_MANAGER",
} as const;

/** Get the default route for a given role after login */
export function getDefaultRoute(role: string): string {
  switch (role) {
    case ROLES.SUPER_ADMIN:
    case ROLES.CAMPUS_ADMIN:
    case ROLES.HOD:
      return "/dashboard";
    case ROLES.PLACEMENT_OFFICER:
      return "/placements";
    case ROLES.HOSTEL_MANAGER:
      return "/hostel";
    case ROLES.TRANSPORT_MANAGER:
      return "/transport";
    default:
      return "/dashboard";
  }
}

/** Check if a role is allowed on the web platform */
export function isWebRole(role: string): boolean {
  const webRoles: string[] = [
    ROLES.SUPER_ADMIN,
    ROLES.CAMPUS_ADMIN,
    ROLES.HOD,
    ROLES.PLACEMENT_OFFICER,
    ROLES.HOSTEL_MANAGER,
    ROLES.TRANSPORT_MANAGER,
  ];
  return webRoles.includes(role);
}
