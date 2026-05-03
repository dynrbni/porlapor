import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getProfile } from '../controllers/user.controllers';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/users', authorizeRoles('ADMIN', 'SUPERADMIN'), getAllUsers);
router.get('/users/me', getProfile);
router.get('/users/:id', authorizeRoles('ADMIN', 'SUPERADMIN'), getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


export default router;