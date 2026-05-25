// ============================================================
// CampusOS AI — Attendance Service
// ============================================================

import { prisma } from '../../config/prisma.js';

interface AccessFilter {
  campusId?: string;
  branchId?: string;
}

/**
 * Get attendance summary based on user role:
 * - Admin roles: branch-wise attendance overview
 * - Faculty: subject-wise for their classes
 * - Student: personal subject-wise breakdown
 */
export async function getAttendanceSummary(
  filter: AccessFilter,
  userRole: string,
  userId: string
) {
  // For STUDENT role — personal attendance
  if (userRole === 'STUDENT') {
    return getStudentAttendance(userId);
  }

  // For FACULTY role — their subjects
  if (userRole === 'FACULTY') {
    return getFacultyAttendanceSummary(userId);
  }

  // For admin roles — branch overview
  return getAdminAttendanceSummary(filter);
}

async function getStudentAttendance(userId: string) {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true, branchId: true, semester: true, section: true },
  });

  if (!student) return null;

  // Get all subjects for this student's branch/semester/section
  const subjects = await prisma.subject.findMany({
    where: {
      branchId: student.branchId,
      semester: student.semester,
      section: student.section,
    },
    select: { id: true, name: true, code: true, isLab: true },
  });

  // For each subject, calculate attendance
  const subjectWise = await Promise.all(
    subjects.map(async (subject) => {
      const records = await prisma.attendanceRecord.findMany({
        where: {
          studentId: student.id,
          subjectId: subject.id,
        },
        select: { status: true },
      });

      const total = records.length;
      const present = records.filter(r => r.status === 'PRESENT').length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectCode: subject.code,
        isLab: subject.isLab,
        totalClasses: total,
        attended: present,
        percentage,
        status: percentage >= 75 ? 'SAFE' : percentage >= 65 ? 'WARNING' : 'CRITICAL',
      };
    })
  );

  // Overall attendance
  const totalAll = subjectWise.reduce((sum, s) => sum + s.totalClasses, 0);
  const attendedAll = subjectWise.reduce((sum, s) => sum + s.attended, 0);
  const overallPercentage = totalAll > 0 ? Math.round((attendedAll / totalAll) * 100) : 0;

  return {
    type: 'student',
    overall: {
      totalClasses: totalAll,
      attended: attendedAll,
      percentage: overallPercentage,
      status: overallPercentage >= 75 ? 'SAFE' : overallPercentage >= 65 ? 'WARNING' : 'CRITICAL',
    },
    subjects: subjectWise,
  };
}

async function getFacultyAttendanceSummary(userId: string) {
  const faculty = await prisma.faculty.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!faculty) return null;

  const subjects = await prisma.subject.findMany({
    where: { facultyId: faculty.id },
    include: {
      branch: { select: { code: true } },
    },
  });

  const subjectSummaries = await Promise.all(
    subjects.map(async (subject) => {
      const sessions = await prisma.attendanceSession.count({
        where: { subjectId: subject.id },
      });

      const records = await prisma.attendanceRecord.findMany({
        where: { subjectId: subject.id },
        select: { status: true },
      });

      const total = records.length;
      const present = records.filter(r => r.status === 'PRESENT').length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      // Count students below 75%
      const studentRecords = await prisma.attendanceRecord.groupBy({
        by: ['studentId'],
        where: { subjectId: subject.id },
        _count: { status: true },
      });

      let lowAttendanceCount = 0;
      for (const sr of studentRecords) {
        const studentPresent = await prisma.attendanceRecord.count({
          where: { studentId: sr.studentId, subjectId: subject.id, status: 'PRESENT' },
        });
        const studentPercentage = sr._count.status > 0
          ? (studentPresent / sr._count.status) * 100
          : 0;
        if (studentPercentage < 75) lowAttendanceCount++;
      }

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectCode: subject.code,
        branchCode: subject.branch.code,
        semester: subject.semester,
        section: subject.section,
        isLab: subject.isLab,
        totalSessions: sessions,
        averageAttendance: percentage,
        lowAttendanceStudents: lowAttendanceCount,
      };
    })
  );

  return {
    type: 'faculty',
    subjects: subjectSummaries,
  };
}

async function getAdminAttendanceSummary(filter: AccessFilter) {
  const branchWhere = filter.campusId ? { campusId: filter.campusId } : {};
  if (filter.branchId) Object.assign(branchWhere, { id: filter.branchId });

  const branches = await prisma.branch.findMany({
    where: branchWhere,
    select: { id: true, name: true, code: true },
  });

  const branchSummaries = await Promise.all(
    branches.map(async (branch) => {
      const records = await prisma.attendanceRecord.findMany({
        where: {
          session: { branchId: branch.id },
        },
        select: { status: true },
      });

      const total = records.length;
      const present = records.filter(r => r.status === 'PRESENT').length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      const totalStudents = await prisma.student.count({
        where: { branchId: branch.id },
      });

      const sessions = await prisma.attendanceSession.count({
        where: { branchId: branch.id },
      });

      return {
        branchId: branch.id,
        branchName: branch.name,
        branchCode: branch.code,
        totalStudents,
        totalSessions: sessions,
        averageAttendance: percentage,
        status: percentage >= 75 ? 'GOOD' : percentage >= 60 ? 'MODERATE' : 'CRITICAL',
      };
    })
  );

  // Overall
  const totalRecords = branchSummaries.reduce((sum, b) => sum + b.totalSessions, 0);
  const avgAll = branchSummaries.length > 0
    ? Math.round(branchSummaries.reduce((sum, b) => sum + b.averageAttendance, 0) / branchSummaries.length)
    : 0;

  return {
    type: 'admin',
    overall: {
      totalBranches: branchSummaries.length,
      totalSessions: totalRecords,
      averageAttendance: avgAll,
    },
    branches: branchSummaries,
  };
}

// ============================================================
// Smart Attendance — Session Management
// ============================================================

import crypto from 'crypto';

/**
 * Faculty creates a new attendance session
 */
export async function createSession(
  userId: string,
  subjectId: string
) {
  const faculty = await prisma.faculty.findUnique({
    where: { userId },
    select: { id: true, campusId: true, branchId: true },
  });

  if (!faculty) return null;

  // Verify the subject belongs to this faculty
  const subject = await prisma.subject.findFirst({
    where: { id: subjectId, facultyId: faculty.id },
    select: { id: true, semester: true, section: true, branchId: true },
  });

  if (!subject) return null;

  // Check for active sessions for this subject
  const activeSession = await prisma.attendanceSession.findFirst({
    where: { subjectId, status: 'ACTIVE' },
  });

  if (activeSession) {
    return { session: activeSession, alreadyActive: true };
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

  const session = await prisma.attendanceSession.create({
    data: {
      subjectId,
      facultyId: faculty.id,
      campusId: faculty.campusId,
      branchId: subject.branchId,
      semester: subject.semester,
      section: subject.section,
      sessionToken: crypto.randomUUID(),
      bleToken: crypto.randomUUID().substring(0, 8),
      startedAt: now,
      expiresAt,
      status: 'ACTIVE',
    },
  });

  return { session, alreadyActive: false };
}

/**
 * Student marks attendance for a session
 */
export async function markAttendance(
  userId: string,
  sessionId: string
) {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true, branchId: true, registeredDeviceId: true },
  });

  if (!student) return { error: 'Student profile not found', code: 404 };

  const session = await prisma.attendanceSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      subjectId: true,
      branchId: true,
      status: true,
      expiresAt: true,
    },
  });

  if (!session) return { error: 'Session not found', code: 404 };
  if (session.status !== 'ACTIVE') return { error: 'Session is no longer active', code: 400 };
  if (new Date() > session.expiresAt) return { error: 'Session has expired', code: 400 };

  // Check if already marked
  const existing = await prisma.attendanceRecord.findFirst({
    where: { sessionId, studentId: student.id },
  });

  if (existing) return { error: 'Attendance already marked', code: 409, record: existing };

  // Calculate confidence score
  let confidenceScore = 0;
  const bleDetected = true; // MVP: assume BLE detected
  const locationVerified = true; // MVP: assume location verified
  const deviceVerified = !!student.registeredDeviceId;
  const correctClass = student.branchId === session.branchId;
  const inTimeWindow = new Date() <= session.expiresAt;

  if (bleDetected) confidenceScore += 40;
  if (locationVerified) confidenceScore += 25;
  if (deviceVerified) confidenceScore += 20;
  if (correctClass) confidenceScore += 10;
  if (inTimeWindow) confidenceScore += 5;

  const status = confidenceScore >= 75 ? 'PRESENT'
    : confidenceScore >= 50 ? 'PENDING'
    : 'ABSENT';

  const record = await prisma.attendanceRecord.create({
    data: {
      sessionId,
      studentId: student.id,
      subjectId: session.subjectId,
      status: status as any,
      confidenceScore,
      verificationMethod: 'SMART',
      bleDetected,
      locationVerified,
      deviceVerified,
      markedAt: new Date(),
    },
  });

  return { record, confidenceScore, status };
}

/**
 * Get live session data — students who have marked attendance
 */
export async function getSessionRecords(sessionId: string) {
  const records = await prisma.attendanceRecord.findMany({
    where: { sessionId },
    include: {
      student: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
    orderBy: { markedAt: 'asc' },
  });

  return records.map((r) => ({
    studentId: r.studentId,
    studentName: r.student.user.name,
    rollNumber: r.student.rollNumber,
    status: r.status,
    confidenceScore: r.confidenceScore,
    markedAt: r.markedAt,
  }));
}

/**
 * End (close) an attendance session
 */
export async function endSession(userId: string, sessionId: string) {
  const faculty = await prisma.faculty.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!faculty) return null;

  const session = await prisma.attendanceSession.findFirst({
    where: { id: sessionId, facultyId: faculty.id },
  });

  if (!session) return null;

  return prisma.attendanceSession.update({
    where: { id: sessionId },
    data: { status: 'CLOSED' },
  });
}

