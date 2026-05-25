// ============================================================
// CampusOS AI — Students Service
// ============================================================

import { prisma } from '../../config/prisma.js';
import { Prisma } from '@prisma/client';
import { PAGINATION } from '@campusos/constants';

interface AccessFilter {
  campusId?: string;
  branchId?: string;
}

interface StudentQuery {
  branchId?: string;
  semester?: number;
  section?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getStudents(filter: AccessFilter, query: StudentQuery) {
  const page = query.page || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
  const skip = (page - 1) * limit;

  const where: Prisma.StudentWhereInput = {};

  // Apply access filter (campus/branch scope)
  if (filter.campusId) where.campusId = filter.campusId;
  if (filter.branchId) where.branchId = filter.branchId;

  // Apply query filters (override branch only if access allows)
  if (query.branchId && !filter.branchId) where.branchId = query.branchId;
  if (query.semester) where.semester = query.semester;
  if (query.section) where.section = query.section;

  // Search by name, email, or roll number
  if (query.search) {
    where.OR = [
      { user: { name: { contains: query.search, mode: 'insensitive' } } },
      { user: { email: { contains: query.search, mode: 'insensitive' } } },
      { rollNumber: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip,
      take: limit,
      orderBy: { rollNumber: 'asc' },
      include: {
        user: { select: { id: true, name: true, email: true, isActive: true } },
        branch: { select: { id: true, name: true, code: true } },
        campus: { select: { id: true, name: true, code: true } },
        riskPredictions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { riskScore: true, riskLevel: true },
        },
      },
    }),
    prisma.student.count({ where }),
  ]);

  // Flatten latest risk prediction
  const data = students.map((s) => ({
    id: s.id,
    userId: s.userId,
    rollNumber: s.rollNumber,
    name: s.user.name,
    email: s.user.email,
    isActive: s.user.isActive,
    campusId: s.campusId,
    campusName: s.campus.name,
    branchId: s.branchId,
    branchName: s.branch.name,
    branchCode: s.branch.code,
    semester: s.semester,
    section: s.section,
    cgpa: s.cgpa,
    backlogs: s.backlogs,
    placementStatus: s.placementStatus,
    latestRisk: s.riskPredictions[0] || null,
  }));

  return { data, total, page, limit };
}

/**
 * Get marks and risk prediction for the logged-in student
 */
export async function getStudentMarks(userId: string) {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true, branchId: true, semester: true, cgpa: true, backlogs: true },
  });

  if (!student) return null;

  const marks = await prisma.mark.findMany({
    where: { studentId: student.id },
    include: {
      subject: {
        select: { id: true, name: true, code: true, isLab: true },
      },
    },
    orderBy: { subject: { code: 'asc' } },
  });

  const riskPrediction = await prisma.riskPrediction.findFirst({
    where: { studentId: student.id },
    orderBy: { createdAt: 'desc' },
    select: {
      riskScore: true,
      riskLevel: true,
      reasons: true,
      recommendations: true,
      createdAt: true,
    },
  });

  return {
    cgpa: student.cgpa,
    backlogs: student.backlogs,
    marks: marks.map((m) => ({
      subjectId: m.subject.id,
      subjectName: m.subject.name,
      subjectCode: m.subject.code,
      isLab: m.subject.isLab,
      internalMarks: m.internalMarks,
      assignmentScore: m.assignmentScore,
      examScore: m.examScore,
      total: m.internalMarks + m.assignmentScore + m.examScore,
    })),
    riskPrediction,
  };
}

import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function createStudent(data: any) {
  const { name, email, rollNumber, branchId, campusId, semester, section } = data;
  
  const passwordHash = await bcrypt.hash('campusos123', 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: UserRole.STUDENT,
      campusId,
      branchId,
    },
  });

  const student = await prisma.student.create({
    data: {
      userId: user.id,
      rollNumber,
      campusId,
      branchId,
      semester,
      section,
    },
    include: {
      user: { select: { name: true, email: true, role: true } },
      branch: { select: { name: true, code: true } },
    }
  });

  return student;
}

