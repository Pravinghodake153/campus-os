import { prisma } from '../../config/prisma.js';
import { config } from '../../config/index.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export async function buildBatchFeatures(branchId: string, campusId: string | null = null) {
  // Fetch all students in the branch with their marks and attendance
  const students = await prisma.student.findMany({
    where: { branchId, ...(campusId && { campusId }) },
    include: {
      user: true,
      marks: true,
      attendance: {
        include: { session: true }
      }
    }
  });

  const features = students.map(student => {
    // Calculate attendance percentage
    const totalSessions = student.attendance.length;
    const presentSessions = student.attendance.filter(a => a.status === 'PRESENT').length;
    const attendance_pct = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 100;

    // Calculate marks averages
    const totalInternal = student.marks.reduce((acc, mark) => acc + mark.internalMarks, 0);
    const avg_internal_marks = student.marks.length > 0 ? totalInternal / student.marks.length : 100;

    const totalAssignment = student.marks.reduce((acc, mark) => acc + mark.assignmentScore, 0);
    const avg_assignment_score = student.marks.length > 0 ? totalAssignment / student.marks.length : 100;

    const totalExam = student.marks.reduce((acc, mark) => acc + (mark.examScore || 0), 0);
    const avg_exam = student.marks.length > 0 ? totalExam / student.marks.length : 100;

    const performance_drop = avg_exam - avg_internal_marks;
    const class_participation = attendance_pct / 100; // Simplified proxy

    return {
      studentId: student.id,
      attendance_pct,
      avg_internal_marks,
      avg_assignment_score,
      cgpa: student.cgpa,
      backlogs: student.backlogs,
      performance_drop,
      class_participation
    };
  });

  return features;
}

export async function saveRiskPredictions(predictions: any[], branchId: string) {
  for (const pred of predictions) {
    await prisma.riskPrediction.upsert({
      where: { studentId: pred.studentId },
      update: {
        riskScore: pred.riskScore,
        riskLevel: pred.riskLevel,
        reasons: pred.studentReasons,
        recommendations: pred.recommendations,
      },
      create: {
        studentId: pred.studentId,
        riskScore: pred.riskScore,
        riskLevel: pred.riskLevel,
        reasons: pred.studentReasons,
        recommendations: pred.recommendations,
      }
    });
  }
}

export async function getLastSavedRiskPredictions(branchId: string, campusId: string | null = null) {
  // Fetch from DB if AI is down
  const predictions = await prisma.riskPrediction.findMany({
    where: {
      student: { branchId, ...(campusId && { campusId }) }
    },
    include: {
      student: { include: { user: true } }
    }
  });
  
  return predictions.map(p => ({
    studentId: p.studentId,
    riskScore: p.riskScore,
    riskLevel: p.riskLevel,
    confidence: 0, // from DB we don't store confidence, assume 0 for fallback
    globalFeatureImportance: {},
    studentReasons: p.reasons,
    recommendations: p.recommendations,
    // Add student name for UI fallback convenience
    studentName: p.student?.user?.name || "Unknown"
  }));
}

export async function fetchTimetableDependencies(campusId: string, branchId: string, semester: int) {
  const subjects = await prisma.subject.findMany({
    where: { branchId, semester }
  });
  
  const rooms = await prisma.room.findMany({
    where: { campusId }
  });
  
  return { subjects, rooms };
}

export async function saveTimetableToDb(timetable: any[], campusId: string, branchId: string, semester: number, section: string) {
  // Clear existing
  await prisma.timetable.deleteMany({
    where: { branchId, semester, section }
  });
  
  // Flatten timetable and save
  const slotsToSave = [];
  for (const day of timetable) {
    for (const slot of day.slots) {
      // Find subject ID and room ID
      const subject = await prisma.subject.findFirst({ where: { code: slot.subjectCode, branchId } });
      const room = await prisma.room.findFirst({ where: { name: slot.room, campusId } });
      
      if (subject && room) {
        slotsToSave.push({
          day: day.day,
          startTime: new Date(`1970-01-01T${slot.time.split('-')[0]}:00Z`),
          endTime: new Date(`1970-01-01T${slot.time.split('-')[1]}:00Z`),
          branchId,
          semester,
          section,
          subjectId: subject.id,
          facultyId: subject.facultyId || '',
          roomId: room.id,
          campusId
        });
      }
    }
  }
  
  if (slotsToSave.length > 0) {
    await prisma.timetable.createMany({ data: slotsToSave });
  }
}

export async function buildAssistantContext(userId: string, role: string, campusId: string | null, branchId: string | null) {
  const context: any = { role };
  
  if (role === 'STUDENT') {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        marks: true,
        attendance: true,
        riskPredictions: true
      }
    });
    context.student = student;
  } else if (role === 'FACULTY' || role === 'HOD' || role === 'CAMPUS_ADMIN' || role === 'SUPER_ADMIN') {
    // For MVP, just return basic stats. AI Service will use DB data later.
    context.students = await prisma.student.findMany({
      where: {
        ...(branchId && { branchId }),
        ...(campusId && { campusId })
      },
      include: { riskPredictions: true, user: true }
    });
    
    // Aggregate risk
    const highRisk = context.students.filter((s: any) => s.riskPredictions?.[0]?.riskLevel === 'HIGH').length;
    const medRisk = context.students.filter((s: any) => s.riskPredictions?.[0]?.riskLevel === 'MEDIUM').length;
    context.risk_data = {
      highRiskCount: highRisk,
      mediumRiskCount: medRisk,
      totalStudents: context.students.length
    };
  }
  
  return context;
}
