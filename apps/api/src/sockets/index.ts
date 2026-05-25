// ============================================================
// CampusOS AI — Socket.io Setup
// Real-time communication for attendance and notifications
// ============================================================

import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

let io: SocketServer;

export function initializeSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: config.cors.origins as unknown as string[],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // JWT authentication middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        id: string;
        role: string;
        campusId: string | null;
        branchId: string | null;
      };
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`🔌 Socket connected: ${user.id} (${user.role})`);

    // Join role-based rooms
    socket.join(`role:${user.role}`);

    // Join campus room
    if (user.campusId) {
      socket.join(`campus:${user.campusId}`);
    }

    // Join branch room
    if (user.branchId) {
      socket.join(`branch:${user.branchId}`);
    }

    // Join personal room for notifications
    socket.join(`user:${user.id}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${user.id}`);
    });
  });

  console.log('🔌 Socket.io initialized');
  return io;
}

export function getIO(): SocketServer {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocket first.');
  }
  return io;
}

// ---- Helper functions for emitting events ----

/**
 * Emit attendance update to a specific branch room
 */
export function emitAttendanceUpdate(branchId: string, data: unknown): void {
  if (io) {
    io.to(`branch:${branchId}`).emit('attendance:update', data);
  }
}

/**
 * Emit notification to a specific user
 */
export function emitNotification(userId: string, notification: unknown): void {
  if (io) {
    io.to(`user:${userId}`).emit('notification:new', notification);
  }
}

/**
 * Emit dashboard refresh to all admin roles
 */
export function emitDashboardRefresh(campusId: string): void {
  if (io) {
    io.to(`campus:${campusId}`).emit('dashboard:refresh');
  }
}
