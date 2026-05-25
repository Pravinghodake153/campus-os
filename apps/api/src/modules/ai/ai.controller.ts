import { Request, Response } from 'express';
import axios from 'axios';
import { z } from 'zod';
import * as aiService from './ai.service.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Axios instance for Python service with short timeout for graceful fallback
const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 5000,
});

export async function predictRiskBatch(req: Request, res: Response) {
  try {
    const { branchId } = req.body;
    if (!branchId) {
      return res.status(400).json({ success: false, message: 'branchId is required' });
    }

    const campusId = req.accessFilter?.campusId || null;
    
    // 1. Build features from DB
    const studentsFeatures = await aiService.buildBatchFeatures(branchId, campusId);
    
    if (studentsFeatures.length === 0) {
      return res.status(404).json({ success: false, message: 'No students found in this branch' });
    }

    // 2. Call Python AI Service
    try {
      const response = await aiClient.post('/predict/risk/batch', {
        students: studentsFeatures
      });
      
      const results = response.data.results;
      
      // 3. Persist to DB
      await aiService.saveRiskPredictions(results, branchId);
      
      res.json({
        success: true,
        data: results,
        message: 'Risk predictions generated and saved successfully.',
        fallback: false
      });
      
    } catch (aiError) {
      console.error('AI Service Error:', aiError.message);
      
      // Graceful fallback to cached DB results
      const cachedResults = await aiService.getLastSavedRiskPredictions(branchId, campusId);
      
      res.status(503).json({
        success: true,
        data: cachedResults,
        message: 'AI service is currently unavailable. Showing last computed results.',
        fallback: true
      });
    }

  } catch (error) {
    console.error('predictRiskBatch error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function retrainModel(req: Request, res: Response) {
  try {
    const response = await aiClient.post('/predict/risk/train');
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(503).json({ success: false, message: 'AI service is unavailable to retrain.' });
  }
}

export async function getModelInfo(req: Request, res: Response) {
  try {
    const response = await aiClient.get('/predict/risk/model-info');
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(503).json({ success: false, message: 'AI service is unavailable.' });
  }
}

export async function generateTimetable(req: Request, res: Response) {
  try {
    const schema = z.object({
      campusId: z.string().uuid(),
      branchId: z.string().uuid(),
      semester: z.number().int().min(1).max(8),
      section: z.string()
    });
    
    const data = schema.parse(req.body);
    
    // Fetch dependencies
    const { subjects, rooms } = await aiService.fetchTimetableDependencies(data.campusId, data.branchId, data.semester);
    
    if (subjects.length === 0 || rooms.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing subjects or rooms for this branch/campus.' });
    }

    const payload = {
      ...data,
      subjects: subjects.map(s => ({
        code: s.code,
        name: s.name,
        faculty: 'Faculty ' + s.facultyId, // simplified
        weeklyHours: s.weeklyHours,
        isLab: s.isLab
      })),
      rooms: rooms.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        capacity: r.capacity
      }))
    };
    
    try {
      const response = await aiClient.post('/optimize/timetable', payload);
      res.json({ success: true, data: response.data });
    } catch (aiError) {
      res.status(503).json({ success: false, message: 'AI Timetable Optimizer is currently unavailable.' });
    }

  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Invalid request' });
  }
}

export async function saveTimetable(req: Request, res: Response) {
  try {
    const { timetable, campusId, branchId, semester, section } = req.body;
    
    await aiService.saveTimetableToDb(timetable, campusId, branchId, semester, section);
    
    res.json({ success: true, message: 'Timetable saved successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save timetable.' });
  }
}

export async function assistantQuery(req: Request, res: Response) {
  try {
    const { query } = req.body;
    const user = req.user;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'query is required' });
    }
    
    const context = await aiService.buildAssistantContext(user!.id, user!.role, user!.campusId, user!.branchId);
    
    try {
      const response = await aiClient.post('/assistant/query', {
        query,
        context
      });
      
      res.json({ success: true, data: response.data });
    } catch (aiError) {
      res.status(503).json({ 
        success: false, 
        message: 'AI Assistant is currently offline.',
        data: { intent: 'UNKNOWN', message: 'Sorry, I am currently offline.', data: null }
      });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
