import { Router } from 'express';
import {
  getAllLichHen,
  getLichHenById,
  createLichHen,
  updateLichHen,
  deleteLichHen,
  getLichHenByUserId
} from '../controllers/LichHenController';
import { auth } from '../middleware/auth';

const router = Router();


router.get('/', getAllLichHen);

// Các route cần xác thực người dùng
router.post('/', auth, createLichHen); 
router.put('/:id', auth, updateLichHen); 
router.delete('/:id', auth, deleteLichHen); 
router.get('/user/:userId', auth, getLichHenByUserId);


router.get('/:id', getLichHenById);

export default router;