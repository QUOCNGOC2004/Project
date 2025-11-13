import { Router } from 'express';
import {
  getAllLichHen,
  getLichHenById,
  createLichHen,
  updateLichHen,
  deleteLichHen,
  getLichHenByUserId,
  updateAppointmentStatusByAdmin,
  getNotificationsByUserId, 
  markNotificationsAsRead
} from '../controllers/LichHenController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/',auth(['admin']) ,getAllLichHen);

router.post('/', auth(['user']), createLichHen); 

router.get('/user/my-notifications', auth(['user']), getNotificationsByUserId);
router.patch('/user/my-notifications/mark-as-read', auth(['user']), markNotificationsAsRead);

router.put('/:id', auth(['user']), updateLichHen); 
router.delete('/:id', auth(['user', 'admin']), deleteLichHen);

router.get('/:id',auth(['admin']), getLichHenById);
router.patch('/:id/status', auth(['admin']), updateAppointmentStatusByAdmin); 

router.get('/user/:userId', auth(['user', 'admin']), getLichHenByUserId);



export default router;