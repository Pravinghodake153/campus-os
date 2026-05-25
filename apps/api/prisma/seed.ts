// ============================================================
// CampusOS AI — Database Seed Script
// Generates realistic synthetic data for demo and development
// ============================================================

import { PrismaClient, UserRole, AttendanceStatus, SessionStatus, RiskLevel, PlacementDriveStatus, ApplicationStatus, RoomType, ComplaintStatus, NotificationType, StudentPlacementStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

function randomFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log('🌱 Starting CampusOS AI database seed...\n');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.hostelComplaint.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.placementApplication.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.riskPrediction.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.event.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.room.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.transportRoute.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.user.deleteMany();
  await prisma.campus.deleteMany();

  const defaultPassword = await hashPassword('campusos123');

  // ============================================================
  // 1. Campus
  // ============================================================
  console.log('🏫 Creating campus...');
  const campus = await prisma.campus.create({
    data: {
      name: 'National Institute of Technology, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      code: 'NITP',
    },
  });

  // ============================================================
  // 2. Branches
  // ============================================================
  console.log('🌿 Creating branches...');
  const branchData = [
    { name: 'Computer Science & Engineering', code: 'CSE' },
    { name: 'Electronics & Communication Engineering', code: 'ECE' },
    { name: 'Mechanical Engineering', code: 'ME' },
    { name: 'Civil Engineering', code: 'CIVIL' },
  ];

  const branches: Record<string, string> = {};
  for (const bd of branchData) {
    const branch = await prisma.branch.create({
      data: { campusId: campus.id, name: bd.name, code: bd.code },
    });
    branches[bd.code] = branch.id;
  }

  // ============================================================
  // 3. Hostels & 4. Transport Routes
  // ============================================================
  console.log('🏠🚌 Creating hostels and transport routes...');
  const hostelBoys = await prisma.hostel.create({
    data: { campusId: campus.id, name: 'Aryabhatta Boys Hostel', totalRooms: 120, occupiedRooms: 108, wardenName: 'Dr. Rajesh Kumar' },
  });
  const hostelGirls = await prisma.hostel.create({
    data: { campusId: campus.id, name: 'Kalpana Chawla Girls Hostel', totalRooms: 80, occupiedRooms: 73, wardenName: 'Dr. Meena Sharma' },
  });
  
  const routes = [];
  routes.push(await prisma.transportRoute.create({
    data: { campusId: campus.id, routeName: 'Hinjewadi - Campus', busNumber: 'MH-12-AB-1234', driverName: 'Ramesh Patil', driverPhone: '+919876543210', stops: ['Hinjewadi Phase 1', 'Wakad', 'Baner', 'Aundh', 'NIT Pune Campus'] },
  }));
  routes.push(await prisma.transportRoute.create({
    data: { campusId: campus.id, routeName: 'Kothrud - Campus', busNumber: 'MH-12-CD-5678', driverName: 'Suresh Jadhav', driverPhone: '+919876543211', stops: ['Kothrud Depot', 'Karve Nagar', 'Warje', 'NIT Pune Campus'] },
  }));
  routes.push(await prisma.transportRoute.create({
    data: { campusId: campus.id, routeName: 'Hadapsar - Campus', busNumber: 'MH-12-EF-9012', driverName: 'Anil Deshmukh', driverPhone: '+919876543212', stops: ['Hadapsar', 'Magarpatta', 'Fursungi', 'NIBM', 'NIT Pune Campus'] },
  }));

  // ============================================================
  // 5. Admin Users
  // ============================================================
  console.log('👤 Creating admin users...');
  await prisma.user.create({ data: { name: 'Dr. Vikram Sarabhai', email: 'super@campusos.ai', passwordHash: defaultPassword, role: UserRole.SUPER_ADMIN, campusId: null, branchId: null } });
  await prisma.user.create({ data: { name: 'Dr. Anand Kulkarni', email: 'admin@campusos.ai', passwordHash: defaultPassword, role: UserRole.CAMPUS_ADMIN, campusId: campus.id, branchId: null } });
  await prisma.user.create({ data: { name: 'Prof. Sneha Deshpande', email: 'placement@campusos.ai', passwordHash: defaultPassword, role: UserRole.PLACEMENT_OFFICER, campusId: campus.id, branchId: null } });
  await prisma.user.create({ data: { name: 'Mr. Sunil Mahajan', email: 'hostel@campusos.ai', passwordHash: defaultPassword, role: UserRole.HOSTEL_MANAGER, campusId: campus.id, branchId: null } });
  await prisma.user.create({ data: { name: 'Mr. Pradeep Thorat', email: 'transport@campusos.ai', passwordHash: defaultPassword, role: UserRole.TRANSPORT_MANAGER, campusId: campus.id, branchId: null } });

  // ============================================================
  // 6. Faculty (4 per branch = 16 total)
  // ============================================================
  console.log('👨‍🏫 Creating faculty...');
  const facultyData: Array<{ name: string; email: string; code: string; branch: string; designation: string; isHOD: boolean }> = [];
  for (const branch of Object.keys(branches)) {
    facultyData.push({ name: `Dr. HOD ${branch}`, email: `hod.${branch.toLowerCase()}@campusos.ai`, code: `${branch}-HOD`, branch, designation: 'Professor & HOD', isHOD: true });
    facultyData.push({ name: `Prof. Senior ${branch}`, email: `senior.${branch.toLowerCase()}@campusos.ai`, code: `${branch}-F1`, branch, designation: 'Associate Professor', isHOD: false });
    facultyData.push({ name: `Prof. Mid ${branch}`, email: `mid.${branch.toLowerCase()}@campusos.ai`, code: `${branch}-F2`, branch, designation: 'Assistant Professor', isHOD: false });
    facultyData.push({ name: `Prof. Junior ${branch}`, email: `junior.${branch.toLowerCase()}@campusos.ai`, code: `${branch}-F3`, branch, designation: 'Assistant Professor', isHOD: false });
  }

  const facultyRecords: Array<{ id: string; branchCode: string; userId: string }> = [];
  for (const fd of facultyData) {
    const user = await prisma.user.create({
      data: { name: fd.name, email: fd.email, passwordHash: defaultPassword, role: fd.isHOD ? UserRole.HOD : UserRole.FACULTY, campusId: campus.id, branchId: branches[fd.branch] },
    });
    const faculty = await prisma.faculty.create({
      data: { userId: user.id, employeeCode: fd.code, campusId: campus.id, branchId: branches[fd.branch], designation: fd.designation },
    });
    facultyRecords.push({ id: faculty.id, branchCode: fd.branch, userId: user.id });
    if (fd.isHOD) {
      await prisma.branch.update({ where: { id: branches[fd.branch] }, data: { hodId: user.id } });
    }
  }

  // ============================================================
  // 7. Subjects (Semesters 1-8 for all branches)
  // ============================================================
  console.log('📚 Creating subjects...');
  const subjectRecords: Array<{ id: string; branchCode: string; semester: number }> = [];
  for (const branch of Object.keys(branches)) {
    const branchFaculty = facultyRecords.filter(f => f.branchCode === branch);
    for (let sem = 1; sem <= 8; sem++) {
      // 4 subjects per semester
      for (let sub = 1; sub <= 4; sub++) {
        const isLab = sub === 4;
        const faculty = branchFaculty[sub % branchFaculty.length];
        const subject = await prisma.subject.create({
          data: {
            campusId: campus.id,
            branchId: branches[branch],
            name: `${branch} Sem ${sem} Subject ${sub}`,
            code: `${branch}${sem}0${sub}`,
            semester: sem,
            section: 'A',
            facultyId: faculty.id,
            weeklyHours: isLab ? 3 : 4,
            isLab,
          },
        });
        subjectRecords.push({ id: subject.id, branchCode: branch, semester: sem });
      }
    }
  }

  // ============================================================
  // 8. Students (50 per branch, diverse semesters)
  // ============================================================
  console.log('🎓 Creating students...');
  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Anika', 'Sara', 'Isha', 'Myra', 'Aanya', 'Kavya', 'Riya', 'Priya'];
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Verma', 'Joshi', 'Patil', 'Deshmukh', 'Kulkarni', 'Reddy', 'Naik', 'Rao', 'Iyer', 'Menon', 'Shah', 'Mehta', 'Chopra', 'Thakur', 'Mishra'];

  const studentRecords: Array<{ id: string; branchCode: string; semester: number; userId: string }> = [];
  let studentCounter = 1;

  for (const [branchCode, branchId] of Object.entries(branches)) {
    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[(studentCounter - 1) % firstNames.length];
      const lastName = lastNames[(studentCounter - 1) % lastNames.length];
      const name = `${firstName} ${lastName} ${studentCounter}`;
      
      const email = i === 0 && branchCode === 'CSE'
        ? 'student1@campusos.ai'
        : `student.${branchCode.toLowerCase()}.${i + 1}@campusos.ai`;
        
      const rollNumber = `${campus.code}-${branchCode}-${String(studentCounter).padStart(4, '0')}`;
      
      // Distribute students across semesters (mostly 6, but some in 2, 4, 8)
      const semesterOptions = [2, 4, 6, 6, 6, 8];
      const semester = semesterOptions[i % semesterOptions.length];

      const cgpa = randomFloat(4.5, 9.8);
      const backlogs = cgpa < 6.0 ? randomInt(1, 4) : 0;
      
      let placementStatus = StudentPlacementStatus.NOT_ELIGIBLE;
      if (semester >= 6 && cgpa >= 6.0 && backlogs === 0) {
        placementStatus = Math.random() > 0.5 ? StudentPlacementStatus.ELIGIBLE : StudentPlacementStatus.APPLIED;
      }

      const user = await prisma.user.create({
        data: { name, email, passwordHash: defaultPassword, role: UserRole.STUDENT, campusId: campus.id, branchId },
      });

      const student = await prisma.student.create({
        data: {
          userId: user.id, rollNumber, campusId: campus.id, branchId, semester, section: 'A', cgpa, backlogs,
          registeredDeviceId: `device-${crypto.randomUUID().substring(0, 8)}`,
          hostelId: Math.random() > 0.6 ? (Math.random() > 0.5 ? hostelBoys.id : hostelGirls.id) : null,
          transportRouteId: Math.random() > 0.7 ? randomChoice(routes).id : null,
          placementStatus,
        },
      });

      studentRecords.push({ id: student.id, branchCode, semester, userId: user.id });
      studentCounter++;
    }
  }

  // ============================================================
  // 9. Rooms
  // ============================================================
  console.log('🏢 Creating rooms...');
  const roomRecords: Array<{ id: string; type: RoomType }> = [];
  for (let i = 1; i <= 10; i++) {
    const classroom = await prisma.room.create({
      data: { campusId: campus.id, name: `CR-${100 + i}`, type: RoomType.CLASSROOM, capacity: 60 },
    });
    roomRecords.push({ id: classroom.id, type: RoomType.CLASSROOM });
    
    if (i <= 5) {
      const lab = await prisma.room.create({
        data: { campusId: campus.id, name: `LAB-${i}`, type: RoomType.LAB, capacity: 30 },
      });
      roomRecords.push({ id: lab.id, type: RoomType.LAB });
    }
  }

  // ============================================================
  // 10. Attendance Sessions & Records
  // ============================================================
  console.log('📋 Creating attendance sessions and records...');
  // To avoid massive DB operations, we'll only create sessions for Semester 6 for demo
  for (const [branchCode, branchId] of Object.entries(branches)) {
    const sem6Subjects = subjectRecords.filter(s => s.branchCode === branchCode && s.semester === 6);
    const branchFaculty = facultyRecords.filter(f => f.branchCode === branchCode);
    const sem6Students = studentRecords.filter(s => s.branchCode === branchCode && s.semester === 6);

    for (let s = 0; s < 3; s++) {
      const subject = sem6Subjects[s % sem6Subjects.length];
      const faculty = branchFaculty[s % branchFaculty.length];
      const sessionDate = new Date();
      sessionDate.setDate(sessionDate.getDate() - s);
      sessionDate.setHours(9 + s * 2, 0, 0, 0);

      const expiresAt = new Date(sessionDate);
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      const session = await prisma.attendanceSession.create({
        data: {
          subjectId: subject.id, facultyId: faculty.id, campusId: campus.id, branchId, semester: 6, section: 'A',
          sessionToken: crypto.randomUUID(), bleToken: crypto.randomUUID().substring(0, 8),
          startedAt: sessionDate, expiresAt, status: SessionStatus.CLOSED,
        },
      });

      const attendanceData = sem6Students.map(student => {
        const isPresent = Math.random() > 0.25;
        const confidenceScore = isPresent ? randomInt(65, 100) : randomInt(0, 40);
        return {
          sessionId: session.id, studentId: student.id, subjectId: subject.id,
          status: confidenceScore >= 75 ? AttendanceStatus.PRESENT : (confidenceScore >= 50 ? AttendanceStatus.PENDING : AttendanceStatus.ABSENT),
          confidenceScore, verificationMethod: isPresent ? 'SMART' : 'MANUAL',
          bleDetected: isPresent && Math.random() > 0.1, locationVerified: isPresent && Math.random() > 0.15, deviceVerified: isPresent && Math.random() > 0.05,
          markedAt: new Date(sessionDate.getTime() + randomInt(30, 240) * 1000),
        };
      });
      
      await prisma.attendanceRecord.createMany({ data: attendanceData });
    }
  }

  // ============================================================
  // 11. Marks & 12. Risk Predictions
  // ============================================================
  console.log('📝⚠️ Creating marks and risk predictions...');
  for (const student of studentRecords) {
    const studentSubjects = subjectRecords.filter(s => s.branchCode === student.branchCode && s.semester === student.semester);
    
    // Create Marks
    const marksData = studentSubjects.map(sub => ({
      studentId: student.id, subjectId: sub.id, semester: student.semester, campusId: campus.id, branchId: branches[student.branchCode],
      internalMarks: randomFloat(20, 100, 0), assignmentScore: randomFloat(30, 100, 0), examScore: randomFloat(20, 100, 0),
    }));
    await prisma.mark.createMany({ data: marksData });

    // Create Risk Prediction
    const studentDb = await prisma.student.findUnique({ where: { id: student.id }, include: { marks: true } });
    if (!studentDb) continue;
    
    const avgMarks = studentDb.marks.length > 0 ? studentDb.marks.reduce((sum, m) => sum + m.internalMarks, 0) / studentDb.marks.length : 50;
    
    let riskScore = 0;
    const reasons: string[] = [];
    const recommendations: string[] = [];

    if (studentDb.cgpa < 6.0) { riskScore += 25; reasons.push(`Low CGPA: ${studentDb.cgpa}`); recommendations.push('Mentoring required'); }
    if (studentDb.backlogs > 0) { riskScore += 20; reasons.push(`${studentDb.backlogs} active backlog(s)`); recommendations.push('Clear backlogs'); }
    if (avgMarks < 50) { riskScore += 25; reasons.push(`Low internal marks`); recommendations.push('Attend extra classes'); }
    
    riskScore = Math.min(riskScore, 100);
    const riskLevel = riskScore >= 70 ? RiskLevel.HIGH : (riskScore >= 40 ? RiskLevel.MEDIUM : RiskLevel.LOW);
    if (reasons.length === 0) { reasons.push('Stable academic performance'); recommendations.push('Keep it up'); }

    await prisma.riskPrediction.create({
      data: { studentId: student.id, riskScore, riskLevel, reasons, recommendations, campusId: campus.id, branchId: branches[student.branchCode] },
    });
  }

  // ============================================================
  // 13. Placements, 14. Events, 15. Complaints, 16. Notifications
  // ============================================================
  console.log('💼🎉🔧🔔 Creating placements, events, complaints, and notifications...');
  // We keep this minimal for demo
  const placement = await prisma.placement.create({
    data: { campusId: campus.id, companyName: 'Google India', role: 'Software Engineer', packageLpa: 32.0, minCgpa: 8.0, requiredSkills: ['Data Structures', 'Algorithms'], driveDate: new Date('2026-06-15'), status: PlacementDriveStatus.UPCOMING },
  });
  
  const event = await prisma.event.create({
    data: { campusId: campus.id, title: 'Code-a-thon 2026', description: 'National level hackathon', date: new Date('2026-06-10'), venue: 'Main Auditorium', maxParticipants: 200 },
  });

  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const notifData = allUsers.slice(0, 50).map(u => ({
    userId: u.id, title: 'Welcome to CampusOS', message: 'Your account is ready.', type: NotificationType.GENERAL, isRead: false
  }));
  await prisma.notification.createMany({ data: notifData });

  console.log('\n✅ Seed completed successfully!\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
