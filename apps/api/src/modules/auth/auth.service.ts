// ============================================================
// CampusOS AI — Auth Service
// Business logic for authentication
// ============================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';
import { config } from '../../config/index.js';

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      campus: { select: { id: true, name: true, code: true } },
      branch: { select: { id: true, name: true, code: true } },
    },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      campusId: true,
      branchId: true,
      isActive: true,
      createdAt: true,
      campus: { select: { id: true, name: true, code: true, city: true } },
      branch: { select: { id: true, name: true, code: true } },
      student: {
        select: {
          id: true,
          rollNumber: true,
          semester: true,
          section: true,
          cgpa: true,
          backlogs: true,
          placementStatus: true,
        },
      },
      faculty: {
        select: {
          id: true,
          employeeCode: true,
          designation: true,
        },
      },
    },
  });
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(user: {
  id: string;
  role: string;
  campusId: string | null;
  branchId: string | null;
}): string {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      campusId: user.campusId,
      branchId: user.branchId,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as any }
  );
}
