# CampusOS AI — Architecture

## System Architecture

```
                    ┌────────────────────────────┐
                    │      Admin Web App          │
                    │ Next.js + Tailwind + ShadCN │
                    │ Admin / HOD / Placement     │
                    └─────────────┬──────────────┘
                                  │
                                  │ REST API + WebSocket
                                  │
┌────────────────────────────┐    │     ┌────────────────────────────┐
│      Android App            │────┼────▶│     Central Backend API     │
│ React Native / Expo         │          │ Node.js + Express           │
│ Student + Faculty           │◀───┼─────│ Auth + RBAC + Logic         │
└────────────────────────────┘    │     └─────────────┬──────────────┘
                                  │                   │
                                  │     ┌─────────────▼──────────────┐
                                  │     │        AI Service           │
                                  │     │ FastAPI + scikit-learn      │
                                  │     └─────────────┬──────────────┘
                                  │                   │
                                  │     ┌─────────────▼──────────────┐
                                  └────▶│      PostgreSQL Database    │
                                        └────────────────────────────┘
```

## Role-Based Access Matrix

| Role | Platform | Campus Scope | Branch Scope |
|------|----------|-------------|--------------|
| SUPER_ADMIN | Web | All | All |
| CAMPUS_ADMIN | Web | Own Campus | All in campus |
| HOD | Web | Own Campus | Own Branch |
| FACULTY | Mobile | Own Campus | Own Branch |
| STUDENT | Mobile | Own Campus | Own Branch |
| PLACEMENT_OFFICER | Web | Own Campus | All in campus |
| HOSTEL_MANAGER | Web | Own Campus | All in campus |
| TRANSPORT_MANAGER | Web | Own Campus | All in campus |

## Data Flow

### API Request Flow
```
Client → Express Router → Auth Middleware → Role Middleware → Branch Middleware → Controller → Service → Prisma → PostgreSQL
```

### Real-Time Flow
```
Event → Socket.io Server → Room Broadcast (campus/branch/user) → Connected Clients
```

### AI Integration Flow
```
Node.js Backend → HTTP Request → Python FastAPI → ML Model → Response → Backend → Client
```
