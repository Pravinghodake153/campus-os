// ============================================================
// CampusOS AI — Events Service
// ============================================================

import { prisma } from '../../config/prisma.js';

interface AccessFilter {
  campusId?: string;
}

export async function getEvents(filter: AccessFilter) {
  const where: Record<string, unknown> = { isActive: true };
  if (filter.campusId) where.campusId = filter.campusId;

  const events = await prisma.event.findMany({
    where,
    orderBy: { date: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      clubName: true,
      date: true,
      venue: true,
      maxParticipants: true,
      isActive: true,
      _count: { select: { registrations: true } },
    },
  });

  return events.map((e) => ({
    ...e,
    registeredCount: e._count.registrations,
    _count: undefined,
  }));
}

export async function registerForEvent(eventId: string, studentId: string) {
  // Check if already registered
  const existing = await prisma.eventRegistration.findFirst({
    where: { eventId, studentId },
  });

  if (existing) {
    return { alreadyRegistered: true };
  }

  // Check if event is full
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { registrations: true } } },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
    throw new Error('Event is full');
  }

  await prisma.eventRegistration.create({
    data: { eventId, studentId },
  });

  return { alreadyRegistered: false };
}

export async function getStudentIdFromUserId(userId: string): Promise<string | null> {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true },
  });
  return student?.id || null;
}

export async function createEvent(data: any) {
  const { title, description, clubName, date, venue, maxParticipants, campusId } = data;
  return await prisma.event.create({
    data: {
      title,
      description,
      clubName,
      date: new Date(date),
      venue,
      maxParticipants,
      campusId,
    },
  });
}

export async function deleteEvent(id: string) {
  // Delete registrations first
  await prisma.eventRegistration.deleteMany({
    where: { eventId: id },
  });
  
  return await prisma.event.delete({
    where: { id },
  });
}
