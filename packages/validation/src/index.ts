// ============================================================
// CampusOS AI — Shared Validation Schemas (Zod)
// Used by backend for request validation and frontend for form validation
// ============================================================

import { z } from 'zod';

// ---- Auth Schemas ----

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerDeviceSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  deviceName: z.string().optional(),
  platform: z.enum(['android', 'ios']),
});

// ---- Student Schemas ----

export const createStudentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  campusId: z.string().uuid('Invalid campus ID'),
  branchId: z.string().uuid('Invalid branch ID'),
  semester: z.number().int().min(1).max(8),
  section: z.string().min(1).max(1),
});

// ---- Attendance Schemas ----

export const startAttendanceSessionSchema = z.object({
  subjectId: z.string().uuid('Invalid subject ID'),
  durationMinutes: z.number().int().min(1).max(30).default(5),
});

export const markAttendanceSchema = z.object({
  sessionToken: z.string().min(1, 'Session token is required'),
  bleDetected: z.boolean(),
  bleSignalStrength: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  deviceId: z.string().optional(),
  biometricVerified: z.boolean().default(false),
});

export const manualMarkSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  studentId: z.string().uuid('Invalid student ID'),
  status: z.enum(['PRESENT', 'ABSENT']),
  reason: z.string().optional(),
});

// ---- Marks Schemas ----

export const addMarksSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  subjectId: z.string().uuid('Invalid subject ID'),
  internalMarks: z.number().min(0).max(100),
  assignmentScore: z.number().min(0).max(100),
  examScore: z.number().min(0).max(100).optional(),
  semester: z.number().int().min(1).max(8),
});

// ---- Event Schemas ----

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  clubName: z.string().optional(),
  date: z.string().datetime(),
  venue: z.string().min(1, 'Venue is required'),
  maxParticipants: z.number().int().positive().optional(),
  branchId: z.string().uuid().optional(),
});

// ---- Placement Schemas ----

export const createPlacementSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  role: z.string().min(2, 'Role is required'),
  packageLpa: z.number().positive('Package must be positive'),
  minCgpa: z.number().min(0).max(10),
  requiredSkills: z.array(z.string()).min(1, 'At least one skill required'),
  driveDate: z.string().datetime(),
});

// ---- Hostel Schemas ----

export const createHostelComplaintSchema = z.object({
  hostelId: z.string().uuid('Invalid hostel ID'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

// ---- AI Assistant Schemas ----

export const assistantQuerySchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters'),
  context: z.enum(['admin', 'faculty', 'student']).optional(),
});

// ---- Timetable Schemas ----

export const generateTimetableSchema = z.object({
  campusId: z.string().uuid(),
  branchId: z.string().uuid(),
  semester: z.number().int().min(1).max(8),
  section: z.string().min(1).max(1),
});

// ---- Export types inferred from schemas ----

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type StartAttendanceSessionInput = z.infer<typeof startAttendanceSessionSchema>;
export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
export type ManualMarkInput = z.infer<typeof manualMarkSchema>;
export type AddMarksInput = z.infer<typeof addMarksSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreatePlacementInput = z.infer<typeof createPlacementSchema>;
export type CreateHostelComplaintInput = z.infer<typeof createHostelComplaintSchema>;
export type AssistantQueryInput = z.infer<typeof assistantQuerySchema>;
export type GenerateTimetableInput = z.infer<typeof generateTimetableSchema>;
