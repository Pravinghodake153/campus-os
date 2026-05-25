// ============================================================
// CampusOS AI — Model Types
// TypeScript interfaces mirroring Prisma models for frontend use
// ============================================================

// ---- Enums ----

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum PlacementDriveStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  SELECTED = 'SELECTED',
  REJECTED = 'REJECTED',
}

export enum RoomType {
  CLASSROOM = 'CLASSROOM',
  LAB = 'LAB',
  AUDITORIUM = 'AUDITORIUM',
}

export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export enum NotificationType {
  ACADEMIC = 'ACADEMIC',
  ATTENDANCE = 'ATTENDANCE',
  PLACEMENT = 'PLACEMENT',
  EVENT = 'EVENT',
  GENERAL = 'GENERAL',
}

export enum StudentPlacementStatus {
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  ELIGIBLE = 'ELIGIBLE',
  APPLIED = 'APPLIED',
  PLACED = 'PLACED',
}

// ---- Model Interfaces ----

export interface Campus {
  id: string;
  name: string;
  city: string;
  state: string;
  code: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  campusId: string;
  name: string;
  code: string;
  hodId: string | null;
  campus?: Campus;
  createdAt: string;
}

export interface Student {
  id: string;
  userId: string;
  rollNumber: string;
  campusId: string;
  branchId: string;
  semester: number;
  section: string;
  cgpa: number;
  backlogs: number;
  registeredDeviceId: string | null;
  hostelId: string | null;
  transportRouteId: string | null;
  placementStatus: StudentPlacementStatus;
  user?: { id: string; name: string; email: string };
  branch?: Branch;
  campus?: Campus;
}

export interface Faculty {
  id: string;
  userId: string;
  employeeCode: string;
  campusId: string;
  branchId: string;
  designation: string;
  user?: { id: string; name: string; email: string };
  branch?: Branch;
  campus?: Campus;
  subjects?: Subject[];
}

export interface Subject {
  id: string;
  campusId: string;
  branchId: string;
  name: string;
  code: string;
  semester: number;
  section: string;
  facultyId: string;
  weeklyHours: number;
  isLab: boolean;
  faculty?: Faculty;
  branch?: Branch;
}

export interface AttendanceSession {
  id: string;
  subjectId: string;
  facultyId: string;
  campusId: string;
  branchId: string;
  semester: number;
  section: string;
  sessionToken: string;
  bleToken: string | null;
  startedAt: string;
  expiresAt: string;
  status: SessionStatus;
  subject?: Subject;
  faculty?: Faculty;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  subjectId: string;
  status: AttendanceStatus;
  confidenceScore: number;
  verificationMethod: string;
  bleDetected: boolean;
  locationVerified: boolean;
  deviceVerified: boolean;
  markedAt: string;
  student?: Student;
  subject?: Subject;
}

export interface Mark {
  id: string;
  studentId: string;
  subjectId: string;
  internalMarks: number;
  assignmentScore: number;
  examScore: number;
  semester: number;
  campusId: string;
  branchId: string;
  student?: Student;
  subject?: Subject;
}

export interface RiskPrediction {
  id: string;
  studentId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  reasons: string[];
  recommendations: string[];
  campusId: string;
  branchId: string;
  createdAt: string;
  student?: Student;
}

export interface Timetable {
  id: string;
  campusId: string;
  branchId: string;
  semester: number;
  section: string;
  subjectId: string;
  facultyId: string;
  roomId: string;
  day: string;
  startTime: string;
  endTime: string;
  subject?: Subject;
  faculty?: Faculty;
  room?: Room;
}

export interface Room {
  id: string;
  campusId: string;
  name: string;
  type: RoomType;
  capacity: number;
}

export interface Placement {
  id: string;
  campusId: string;
  companyName: string;
  role: string;
  packageLpa: number;
  minCgpa: number;
  requiredSkills: string[];
  driveDate: string;
  status: PlacementDriveStatus;
}

export interface PlacementApplication {
  id: string;
  placementId: string;
  studentId: string;
  status: ApplicationStatus;
  appliedAt: string;
  placement?: Placement;
  student?: Student;
}

export interface Event {
  id: string;
  campusId: string;
  branchId: string | null;
  title: string;
  description: string;
  clubName: string | null;
  date: string;
  venue: string;
  maxParticipants: number | null;
  isActive: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  registeredAt: string;
}

export interface Hostel {
  id: string;
  campusId: string;
  name: string;
  totalRooms: number;
  occupiedRooms: number;
  wardenName: string | null;
}

export interface HostelComplaint {
  id: string;
  studentId: string;
  hostelId: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
}

export interface TransportRoute {
  id: string;
  campusId: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverPhone: string | null;
  stops: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}
