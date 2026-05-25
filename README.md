# CampusOS AI

> **Unified National Smart Campus Operating System**

CampusOS AI is a branch-aware, role-based smart campus platform where administrators manage the institution from a web command center, while students and faculty use one Android app for daily academic, attendance, timetable, placement, and AI-powered campus services.

## Architecture

```
CampusOS AI
├── apps/
│   ├── admin-web/       → Next.js + Tailwind + ShadCN (Admin dashboard)
│   ├── mobile-app/      → React Native + Expo (Student & Faculty)
│   ├── api/             → Node.js + Express + Prisma (Central backend)
│   └── ai-service/      → Python + FastAPI + scikit-learn (AI/ML)
├── packages/
│   ├── shared-types/    → TypeScript type definitions
│   ├── constants/       → System-wide constants
│   └── validation/      → Zod validation schemas
└── docs/                → Documentation
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Admin Web | Next.js, TypeScript, Tailwind CSS, ShadCN UI, Zustand, TanStack Query, Recharts |
| Mobile App | React Native, Expo, Expo Router, NativeWind, Zustand, TanStack Query |
| Backend API | Node.js, Express, TypeScript, Prisma ORM, JWT, Socket.io, Zod |
| AI Service | Python, FastAPI, scikit-learn, pandas, numpy |
| Database | PostgreSQL 16 (Docker) |
| Monorepo | pnpm workspaces + Turborepo |

## Roles

| Role | Platform | Scope |
|------|----------|-------|
| Super Admin | Web | All campuses, all branches |
| Campus Admin | Web | One campus, all branches |
| HOD | Web | One branch/department |
| Faculty | Android | Assigned classes only |
| Student | Android | Own data only |
| Placement Officer | Web | Placement data |
| Hostel Manager | Web | Hostel management |
| Transport Manager | Web | Transport routes |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### Setup

```bash
# 1. Clone and install dependencies
pnpm install

# 2. Start PostgreSQL
pnpm docker:up

# 3. Copy environment file
cp .env.example apps/api/.env

# 4. Run database migrations
pnpm db:migrate

# 5. Seed demo data
pnpm db:seed

# 6. Start the backend API
pnpm dev:api
```

### Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| super@campusos.ai | campusos123 | Super Admin |
| admin@campusos.ai | campusos123 | Campus Admin |
| hod.cse@campusos.ai | campusos123 | HOD (CSE) |
| faculty1@campusos.ai | campusos123 | Faculty (CSE) |
| student1@campusos.ai | campusos123 | Student (CSE) |
| placement@campusos.ai | campusos123 | Placement Officer |
| hostel@campusos.ai | campusos123 | Hostel Manager |
| transport@campusos.ai | campusos123 | Transport Manager |

### API Endpoints (Phase 1)

```
POST /api/auth/login          → Login with email/password
GET  /api/auth/me             → Get current user profile
GET  /api/admin/dashboard     → Admin dashboard metrics
GET  /api/students            → List students (filtered)
GET  /api/faculty/classes     → Faculty's assigned classes
GET  /api/attendance/summary  → Attendance summary
```

## License

MIT
