# CampusOS AI — API Documentation

## Base URL

```
http://localhost:4000/api
```

## Authentication

All protected endpoints require a JWT Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Health Check

```
GET /api/health
```

Response: `200 OK`
```json
{
  "success": true,
  "message": "CampusOS AI API is running",
  "data": {
    "version": "1.0.0",
    "environment": "development",
    "timestamp": "2026-05-25T10:00:00.000Z"
  }
}
```

---

### Auth

#### Login

```
POST /api/auth/login
```

Body:
```json
{
  "email": "super@campusos.ai",
  "password": "campusos123"
}
```

Response: `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "name": "Dr. Vikram Sarabhai",
      "email": "super@campusos.ai",
      "role": "SUPER_ADMIN",
      "campusId": null,
      "branchId": null,
      "campusName": null,
      "branchName": null,
      "isActive": true
    }
  }
}
```

#### Get Current User

```
GET /api/auth/me
Authorization: Bearer <token>
```

Response: `200 OK` — Returns full user profile with campus, branch, student/faculty details.

---

### Admin Dashboard

```
GET /api/admin/dashboard
Authorization: Bearer <token>
Roles: SUPER_ADMIN, CAMPUS_ADMIN, HOD
```

Response includes: totalStudents, totalFaculty, averageAttendance, highRiskStudents, placementReady, hostelOccupancy, activeTransportRoutes, activeEvents, branchWiseAttendance, recentAlerts.

---

### Students

```
GET /api/students
Authorization: Bearer <token>
Roles: SUPER_ADMIN, CAMPUS_ADMIN, HOD, FACULTY
```

Query Parameters:
- `branchId` — Filter by branch
- `semester` — Filter by semester (1-8)
- `section` — Filter by section (A, B, C)
- `search` — Search by name, email, or roll number
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 20, max: 100)

---

### Faculty Classes

```
GET /api/faculty/classes
Authorization: Bearer <token>
Roles: FACULTY, HOD
```

Returns subjects assigned to the logged-in faculty with student counts and attendance stats.

---

### Attendance Summary

```
GET /api/attendance/summary
Authorization: Bearer <token>
Roles: All authenticated users
```

Response varies by role:
- **Student**: Personal subject-wise attendance with percentages
- **Faculty**: Class-wise attendance overview with low-attendance counts
- **Admin**: Branch-level attendance summary
