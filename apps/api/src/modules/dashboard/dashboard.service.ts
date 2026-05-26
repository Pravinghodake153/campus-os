// ============================================================
// CampusOS AI — Dashboard Service
// Aggregates real data for admin dashboard metrics
// ============================================================

import { prisma } from '../../config/prisma.js';
interface AccessFilter {
  campusId?: string;
  branchId?: string;
}

export async function getDashboardMetrics(filter: AccessFilter) {
  const where: { campusId?: string; branchId?: string } = {};
  if (filter.campusId) where.campusId = filter.campusId;
  if (filter.branchId) where.branchId = filter.branchId;

  const facultyWhere: { campusId?: string; branchId?: string } = {};
  if (filter.campusId) facultyWhere.campusId = filter.campusId;
  if (filter.branchId) facultyWhere.branchId = filter.branchId;

  // Run all queries in parallel for performance
  const [
    totalStudents,
    totalFaculty,
    attendanceRecords,
    highRiskStudents,
    placementReadyStudents,
    hostels,
    activeTransportRoutes,
    activeEvents,
    branches,
    recentRiskPredictions,
  ] = await Promise.all([
    // Total students
    prisma.student.count({ where }),

    // Total faculty
    prisma.faculty.count({ where: facultyWhere }),

    // Attendance records for average calculation
    prisma.attendanceRecord.findMany({
      where: {
        session: {
          ...(filter.campusId && { campusId: filter.campusId }),
          ...(filter.branchId && { branchId: filter.branchId }),
        },
      },
      select: { status: true },
    }),

    // High-risk students
    prisma.riskPrediction.count({
      where: {
        riskLevel: 'HIGH',
        ...(filter.campusId && { campusId: filter.campusId }),
        ...(filter.branchId && { branchId: filter.branchId }),
      },
    }),

    // Placement-ready students (CGPA >= 6.0, no backlogs)
    prisma.student.count({
      where: {
        ...where,
        cgpa: { gte: 6.0 },
        backlogs: 0,
      },
    }),

    // Hostel data
    prisma.hostel.findMany({
      where: filter.campusId ? { campusId: filter.campusId } : {},
      select: { totalRooms: true, occupiedRooms: true },
    }),

    // Active transport routes
    prisma.transportRoute.count({
      where: filter.campusId ? { campusId: filter.campusId } : {},
    }),

    // Active events
    prisma.event.count({
      where: {
        isActive: true,
        ...(filter.campusId && { campusId: filter.campusId }),
      },
    }),

    // Branches with attendance data
    prisma.branch.findMany({
      where: filter.campusId ? { campusId: filter.campusId } : {},
      ...(filter.branchId && { where: { id: filter.branchId } }),
      select: {
        id: true,
        name: true,
        code: true,
        _count: { select: { students: true } },
      },
    }),

    // Recent risk predictions for alerts
    prisma.riskPrediction.findMany({
      where: {
        riskLevel: { in: ['HIGH', 'MEDIUM'] },
        ...(filter.campusId && { campusId: filter.campusId }),
        ...(filter.branchId && { branchId: filter.branchId }),
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        student: {
          include: {
            user: { select: { name: true } },
            branch: { select: { code: true } },
          },
        },
      },
    }),
  ]);

  // Calculate average attendance
  const totalRecords = attendanceRecords.length;
  const presentRecords = attendanceRecords.filter((r: { status: string }) => r.status === 'PRESENT').length;
  const averageAttendance = totalRecords > 0
    ? Math.round((presentRecords / totalRecords) * 100)
    : 0;

  // Calculate hostel occupancy
  const totalHostelRooms = hostels.reduce((sum: number, h: { totalRooms: number; occupiedRooms: number }) => sum + h.totalRooms, 0);
  const totalOccupied = hostels.reduce((sum: number, h: { totalRooms: number; occupiedRooms: number }) => sum + h.occupiedRooms, 0);
  const hostelOccupancy = totalHostelRooms > 0
    ? Math.round((totalOccupied / totalHostelRooms) * 100)
    : 0;

  // Branch-wise attendance breakdown
  const branchWiseAttendance = await Promise.all(
    branches.map(async (branch: { id: string; name: string; code: string; _count: { students: number } }) => {
      const branchRecords = await prisma.attendanceRecord.findMany({
        where: {
          session: {
            branchId: branch.id,
            ...(filter.campusId && { campusId: filter.campusId }),
          },
        },
        select: { status: true },
      });

      const branchTotal = branchRecords.length;
      const branchPresent = branchRecords.filter((r: { status: string }) => r.status === 'PRESENT').length;

      return {
        branchId: branch.id,
        branchName: branch.name,
        branchCode: branch.code,
        averageAttendance: branchTotal > 0
          ? Math.round((branchPresent / branchTotal) * 100)
          : 0,
        totalStudents: branch._count.students,
      };
    })
  );

  // Generate dashboard alerts
  const alerts = [];

  // Branch risk alerts
  for (const branch of branchWiseAttendance) {
    const branchHighRisk = await prisma.riskPrediction.count({
      where: {
        riskLevel: 'HIGH',
        student: { branchId: branch.branchId },
      },
    });

    if (branchHighRisk > 0) {
      alerts.push({
        id: `risk-${branch.branchId}`,
        type: 'risk' as const,
        severity: branchHighRisk > 10 ? 'critical' as const : 'warning' as const,
        message: `${branch.branchCode} branch has ${branchHighRisk} high-risk student(s) this week.`,
        createdAt: new Date().toISOString(),
      });
    }

    if (branch.averageAttendance < 75 && branch.averageAttendance > 0) {
      alerts.push({
        id: `attendance-${branch.branchId}`,
        type: 'attendance' as const,
        severity: 'warning' as const,
        message: `${branch.branchCode} attendance is at ${branch.averageAttendance}%, below 75% threshold.`,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Hostel alert
  if (hostelOccupancy > 90) {
    alerts.push({
      id: 'hostel-occupancy',
      type: 'hostel' as const,
      severity: 'info' as const,
      message: `Hostel occupancy is at ${hostelOccupancy}%.`,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    totalStudents,
    totalFaculty,
    averageAttendance,
    highRiskStudents,
    placementReady: placementReadyStudents,
    hostelOccupancy,
    activeTransportRoutes,
    activeEvents,
    branchWiseAttendance,
    recentAlerts: alerts.slice(0, 10),
  };
}
