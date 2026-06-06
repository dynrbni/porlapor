import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controllers';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Public: anyone can read categories
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);

// Protected: only authenticated users can mutate
router.post('/categories', authenticate, createCategory);
router.put('/categories/:id', authenticate, updateCategory);
router.delete('/categories/:id', authenticate, deleteCategory);

export default router;
