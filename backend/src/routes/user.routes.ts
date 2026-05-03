import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getProfile } from '../controllers/user.controllers';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/profile', authenticate, getProfile);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


export default router;