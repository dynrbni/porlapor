import express from 'express';
import {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
} from '../controllers/report.controllers';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.use('/reports', authenticate);

router.post('/reports', createReport);
router.get('/reports', getAllReports);
router.get('/reports/:id', getReportById);
router.put('/reports/:id', updateReport);
router.delete('/reports/:id', deleteReport);

export default router;
