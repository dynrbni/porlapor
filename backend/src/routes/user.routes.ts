import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getProfile, updateProfile } from '../controllers/user.controllers';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadProfilePhoto } from '../middlewares/upload.middleware';

const router = express.Router();

router.use('/users', authenticate);

router.get('/users', authorizeRoles('ADMIN', 'SUPERADMIN', 'AGENCY'), getAllUsers);
router.get('/users/me', getProfile);
router.put('/users/me', uploadProfilePhoto.single('photo'), updateProfile);
router.get('/users/:id', authorizeRoles('ADMIN', 'SUPERADMIN', 'AGENCY'), getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


export default router;