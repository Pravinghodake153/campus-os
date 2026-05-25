// ============================================================
// CampusOS AI — Faculty Service
// ============================================================

import { prisma } from '../../config/prisma.js';

/**
 * Get classes (subjects) assigned to a specific faculty member
 */
export async function getFacultyClasses(userId: string) {
  // First find the faculty record for this user
  const faculty = await prisma.faculty.findUnique({
    where: { userId },
    select: { id: true, branchId: true, campusId: true },
  });

  if (!faculty) {
    return null;
  }

  // Get all subjects assigned to this faculty
  const subjects = await prisma.subject.findMany({
    where: { facultyId: faculty.id },
    include: {
      branch: { select: { id: true, name: true, code: true } },
      _count: {
        select: {
          attendanceSessions: true,
          marks: true,
        },
      },
    },
    orderBy: [{ semester: 'asc' }, { section: 'asc' }, { name: 'asc' }],
  });

  // For each subject, count students and get attendance stats
  const classesWithStats = await Promise.all(
    subjects.map(async (subject) => {
      const studentCount = await prisma.student.count({
        where: {
          branchId: subject.branchId,
          semester: subject.semester,
          section: subject.section,
        },
      });

      // Get attendance stats for this subject
      const attendanceRecords = await prisma.attendanceRecord.findMany({
        where: { subjectId: subject.id },
        select: { status: true },
      });

      const totalRecords = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
      const averageAttendance = totalRecords > 0
        ? Math.round((presentCount / totalRecords) * 100)
        : 0;

      return {
        id: subject.id,
        name: subject.name,
        code: subject.code,
        semester: subject.semester,
        section: subject.section,
        weeklyHours: subject.weeklyHours,
        isLab: subject.isLab,
        branchName: subject.branch.name,
        branchCode: subject.branch.code,
        studentCount,
        totalSessions: subject._count.attendanceSessions,
        averageAttendance,
      };
    })
  );

  return classesWithStats;
}

export async function getAllFaculty(filter: any) {
  return await prisma.faculty.findMany({
    where: filter,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
      branch: {
        select: {
          name: true,
          code: true,
        },
      },
      campus: {
        select: {
          name: true,
          code: true,
        },
      },
    },
    orderBy: {
      user: {
        name: 'asc',
      },
    },
  });
}

import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function createFaculty(data: any) {
  const { name, email, designation, employeeCode, branchId, campusId, isHOD } = data;
  
  const passwordHash = await bcrypt.hash('campusos123', 10);
  const role = isHOD ? UserRole.HOD : UserRole.FACULTY;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      campusId,
      branchId,
    },
  });

  const faculty = await prisma.faculty.create({
    data: {
      userId: user.id,
      designation,
      employeeCode,
      campusId,
      branchId,
    },
    include: {
      user: { select: { name: true, email: true, role: true } },
      branch: { select: { name: true, code: true } },
    }
  });

  if (isHOD) {
    await prisma.branch.update({
      where: { id: branchId },
      data: { hodId: user.id },
    });
  }

  return faculty;
}
