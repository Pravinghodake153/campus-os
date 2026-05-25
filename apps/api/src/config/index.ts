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
    url: process.env.DATABASE_URL || 'postgresql://campusos:campusos123@localhost:5432/campusos_dev',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'campusos-jwt-secret-change-in-prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  ai: {
    serviceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  },

  cors: {
    origins: [
      'http://localhost:3000', // Admin Web App
      'http://localhost:8081', // Expo
      'http://localhost:19006', // Expo Web
    ],
  },
} as const;
