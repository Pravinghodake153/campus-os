// ============================================================
// CampusOS AI — Express Server Entry Point
// Central Backend API for the unified campus platform
// ============================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { config } from './config/index.js';
import { initializeSocket } from './sockets/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import studentsRoutes from './modules/students/students.routes.js';
import facultyRoutes from './modules/faculty/faculty.routes.js';
import attendanceRoutes from './modules/attendance/attendance.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import eventsRoutes from './modules/events/events.routes.js';
import hostelRoutes from './modules/hostel/hostel.routes.js';
import transportRoutes from './modules/transport/transport.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';

// Initialize Express
const app = express();
const httpServer = createServer(app);

// ============================================================
// Global Middleware
// ============================================================

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: config.cors.origins as unknown as string[],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging
if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Response compression
app.use(compression());

// ============================================================
// Health Check
// ============================================================

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'CampusOS AI API is running',
    data: {
      version: '1.0.0',
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
    },
  });
});

// ============================================================
// API Routes
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/ai', aiRoutes);

// ============================================================
// 404 Handler
// ============================================================

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// Global Error Handler
// ============================================================

app.use(errorMiddleware);

// ============================================================
// Initialize Socket.io & Start Server
// ============================================================

initializeSocket(httpServer);

httpServer.listen(config.port, () => {
  console.log('\n' + '═'.repeat(50));
  console.log('  🏫 CampusOS AI — Central Backend API');
  console.log('═'.repeat(50));
  console.log(`  🚀 Server:      http://localhost:${config.port}`);
  console.log(`  📡 API Base:    http://localhost:${config.port}/api`);
  console.log(`  🔌 WebSocket:   ws://localhost:${config.port}`);
  console.log(`  🌍 Environment: ${config.nodeEnv}`);
  console.log('═'.repeat(50) + '\n');
});

export default app;
