import { Router } from 'express';
import { createAgency, getAgencies, updateAgency, deleteAgency } from '../controllers/agency.controllers';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint publik atau yg bisa diakses user biasa
router.get('/', getAgencies);

// Endpoint yg butuh autentikasi
router.use(authenticate);

router.post('/', authorizeRoles('SUPERADMIN', 'ADMIN'), createAgency);
router.put('/:id', authorizeRoles('SUPERADMIN'), updateAgency);
router.delete('/:id', authorizeRoles('SUPERADMIN'), deleteAgency);

export default router;
