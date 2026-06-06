import express from 'express';
import {
  createReport,
  getAllReports,
  getReportById,
  getReportStats,
  updateReport,
  deleteReport,
  addComment,
  toggleLike
} from '../controllers/report.controllers';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.get('/reports/stats', getReportStats);
router.get('/reports', getAllReports);
router.get('/reports/:id', getReportById);

// Protected routes
router.use('/reports', authenticate);

router.post('/reports', createReport);
router.put('/reports/:id', updateReport);
router.post('/reports/:id/comments', addComment);
router.post('/reports/:id/like', toggleLike);
router.delete('/reports/:id', deleteReport);

export default router;
