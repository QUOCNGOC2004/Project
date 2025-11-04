import { Router } from 'express';
import {
  getAllLichHen,
  getLichHenById,
  createLichHen,
  updateLichHen,
  deleteLichHen,
  getLichHenByUserId,
  updateAppointmentStatusByAdmin
} from '../controllers/LichHenController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/',auth(['admin']) ,getAllLichHen);

router.post('/', auth(['user']), createLichHen); 
router.put('/:id', auth(['user']), updateLichHen); 
router.delete('/:id', auth(['user', 'admin']), deleteLichHen);

router.get('/:id',auth(['admin']), getLichHenById);
router.patch('/:id/status', auth(['admin']), updateAppointmentStatusByAdmin); 

router.get('/user/:userId', auth(['user', 'admin']), getLichHenByUserId);



export default router;