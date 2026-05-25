// ============================================================
// CampusOS AI — Audit Logger
// Records admin actions for accountability
// ============================================================

import { prisma } from '../config/prisma.js';

/**
 * Log an audit event to the database
 */
export async function logAudit(
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        metadata: metadata ? (metadata as any) : undefined,
      },
    });
  } catch (error) {
    // Audit logging should never break the main flow
    console.error('⚠️ Audit log failed:', error);
  }
}
