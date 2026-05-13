import { Router } from 'express';
import { createOfficialNote, getOfficialNotesByReport, updateOfficialNote, deleteOfficialNote } from '../controllers/officialNote.controllers';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint untuk melihat tanggapan (bisa diakses publik/user)
router.get('/report/:reportId', getOfficialNotesByReport);

// Endpoint yg butuh autentikasi & hanya SUPERADMIN dan ADMIN
router.use(authenticate);
router.use(authorizeRoles('SUPERADMIN', 'ADMIN'));

router.post('/', createOfficialNote);
router.put('/:id', updateOfficialNote);
router.delete('/:id', deleteOfficialNote);

export default router;
