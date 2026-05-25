# CampusOS AI — Database Documentation

## Overview

PostgreSQL database with 18+ tables supporting multi-campus, multi-branch operations.

## Entity Relationship Summary

```
Campus (1) ──── (N) Branch
Campus (1) ──── (N) User
Branch (1) ──── (N) Student
Branch (1) ──── (N) Faculty
Branch (1) ──── (N) Subject
Faculty (1) ──── (N) Subject
Subject (1) ──── (N) AttendanceSession
AttendanceSession (1) ──── (N) AttendanceRecord
Student (1) ──── (N) AttendanceRecord
Student (1) ──── (N) Mark
Student (1) ──── (N) RiskPrediction
Student (1) ──── (N) PlacementApplication
Placement (1) ──── (N) PlacementApplication
Student (1) ──── (N) EventRegistration
Event (1) ──── (N) EventRegistration
Hostel (1) ──── (N) Student
Hostel (1) ──── (N) HostelComplaint
TransportRoute (1) ──── (N) Student
User (1) ──── (N) Notification
User (1) ──── (N) AuditLog
```

## Key Design Decisions

1. **UUID Primary Keys**: All tables use UUIDs for globally unique IDs.
2. **Campus/Branch Scoping**: Most tables include `campusId` and `branchId` for access control filtering.
3. **Attendance Confidence Score**: AttendanceRecord stores individual verification signals (BLE, location, device) and a composite confidence score.
4. **Risk as JSON**: RiskPrediction stores `reasons` and `recommendations` as JSON arrays for flexibility.
5. **Audit Trail**: All significant actions are logged in `audit_logs` for compliance.

## Seed Data

Run `pnpm db:seed` to populate:
- 1 campus (NIT Pune)
- 4 branches (CSE, ECE, ME, CIVIL)
- 40 students (10 per branch)
- 8 faculty (2 per branch, including HODs)
- 16 subjects (4 per branch)
- Attendance sessions, records, marks, risk predictions
- Placement drives, events, hostel, transport, notifications
