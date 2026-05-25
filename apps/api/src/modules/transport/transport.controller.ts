import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { z } from 'zod';

export const getRoutes = async (req: Request, res: Response) => {
  try {
    const { campusId } = req.query;
    const filter = campusId ? { campusId: String(campusId) } : {};

    const routes = await prisma.transportRoute.findMany({
      where: filter,
      include: {
        campus: {
          select: { name: true, code: true }
        }
      },
      orderBy: { routeName: 'asc' },
    });

    res.json({ success: true, routes });
  } catch (error) {
    console.error('Error fetching transport routes:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const createRouteSchema = z.object({
  routeName: z.string().min(2),
  busNumber: z.string().min(2),
  driverName: z.string().min(2),
  driverPhone: z.string().min(10),
  stops: z.array(z.string()).min(1),
  campusId: z.string().uuid(),
});

export const createRoute = async (req: Request, res: Response) => {
  try {
    const data = createRouteSchema.parse(req.body);
    
    // Check if user is restricted to a campus
    if (req.user?.campusId && req.user.campusId !== data.campusId) {
      return res.status(403).json({ success: false, error: 'Cannot create transport route in another campus' });
    }

    const route = await prisma.transportRoute.create({
      data,
    });

    res.status(201).json({ success: true, route });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    console.error('Error creating transport route:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
