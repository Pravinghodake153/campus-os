// ============================================================
// CampusOS AI — Notifications Service
// ============================================================

import { prisma } from '../../config/prisma.js';

export async function getNotifications(userId: string, limit = 20) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      message: true,
      type: true,
      isRead: true,
      createdAt: true,
    },
  });

  const unreadCount = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  return { notifications, unreadCount };
}

export async function markAsRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
}

import { NotificationType } from '@prisma/client';

export async function createNotification(data: any) {
  const { title, message, type, branchId, semester } = data;
  
  // Find users to send to. If branchId and semester are provided, send to students in that scope.
  // Otherwise, broad broadcast. For demo, we just broadcast to all students in branch if provided.
  let whereClause: any = {};
  if (branchId) {
    whereClause = { branchId };
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    select: { id: true },
  });

  const notifications = users.map(u => ({
    userId: u.id,
    title,
    message,
    type: type as NotificationType,
  }));

  await prisma.notification.createMany({
    data: notifications,
  });

  return { count: notifications.length };
}
