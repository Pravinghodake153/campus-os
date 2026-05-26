// ============================================================
// CampusOS AI — App Configuration
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',

  database: {
    url: process.env.NODE_ENV === 'production'
      ? 'postgresql://campusos:campusos123@localhost:5432/campusos_dev?schema=public'
      : (process.env.DATABASE_URL || 'postgresql://campusos:campusos123@localhost:5432/campusos_dev'),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'campusos-jwt-secret-change-in-prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  ai: {
    serviceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  },

  cors: {
    origins: true, // Allow all origins for MVP
  },
} as const;
