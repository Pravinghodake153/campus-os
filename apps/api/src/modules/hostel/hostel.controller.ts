import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { z } from 'zod';

export const getHostels = async (req: Request, res: Response) => {
  try {
    const { campusId } = req.query;
    const filter = campusId ? { campusId: String(campusId) } : {};

    const hostels = await prisma.hostel.findMany({
      where: filter,
      include: {
        campus: {
          select: { name: true, code: true }
        }
      },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, hostels });
  } catch (error) {
    console.error('Error fetching hostels:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const createHostelSchema = z.object({
  name: z.string().min(2),
  totalRooms: z.number().min(1),
  occupiedRooms: z.number().default(0),
  wardenName: z.string().min(2),
  campusId: z.string().uuid(),
});

export const createHostel = async (req: Request, res: Response) => {
  try {
    const data = createHostelSchema.parse(req.body);
    
    // Check if user is restricted to a campus
    if (req.user?.campusId && req.user.campusId !== data.campusId) {
      return res.status(403).json({ success: false, error: 'Cannot create hostel in another campus' });
    }

    const hostel = await prisma.hostel.create({
      data,
    });

    res.status(201).json({ success: true, hostel });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    console.error('Error creating hostel:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const getComplaints = async (req: Request, res: Response) => {
  try {
    const { hostelId, status } = req.query;
    const filter: any = {};
    if (hostelId) filter.hostelId = String(hostelId);
    if (status) filter.status = String(status);

    const complaints = await prisma.hostelComplaint.findMany({
      where: filter,
      include: {
        student: {
          select: {
            user: { select: { name: true, email: true } },
            rollNumber: true
          }
        },
        hostel: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const createComplaintSchema = z.object({
  hostelId: z.string().uuid(),
  title: z.string().min(5),
  description: z.string().min(10),
});

export const createComplaint = async (req: Request, res: Response) => {
  try {
    const data = createComplaintSchema.parse(req.body);
    
    // For MVP, assuming req.user has a student profile if they are a student
    // We'll just look it up.
    const student = await prisma.student.findUnique({
      where: { userId: req.user!.id }
    });
    
    if (!student) {
      return res.status(403).json({ success: false, error: 'Only students can create complaints' });
    }

    const complaint = await prisma.hostelComplaint.create({
      data: {
        ...data,
        studentId: student.id,
      },
    });

    res.status(201).json({ success: true, complaint });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
