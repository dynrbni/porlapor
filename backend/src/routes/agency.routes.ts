import { Router } from 'express';
import { createAgency, getAgencies, updateAgency, deleteAgency } from '../controllers/agency.controllers';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint publik atau yg bisa diakses user biasa
router.get('/', getAgencies);

// Endpoint yg butuh autentikasi & hanya SUPERADMIN dan ADMIN
router.use(authenticate);
router.use(authorizeRoles('SUPERADMIN', 'ADMIN', 'AGENCY'));

router.post('/', createAgency);
router.put('/:id', updateAgency);
router.delete('/:id', deleteAgency);

export default router;
