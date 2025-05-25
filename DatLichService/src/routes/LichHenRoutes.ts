import { Router } from 'express';
import {
  getAllLichHen,
  getLichHenById,
  createLichHen,
  updateLichHen,
  deleteLichHen,
  getLichHenByUserId
} from '../controllers/LichHenController';

const router = Router();

// Lấy danh sách lịch hẹn
router.get('/', getAllLichHen);

// Tạo lịch hẹn mới
router.post('/', createLichHen);

// Cập nhật lịch hẹn
router.put('/:id', updateLichHen);

// Xóa lịch hẹn
router.delete('/:id', deleteLichHen);

// Lấy lịch hẹn theo ID
router.get('/:id', getLichHenById);

// Lấy lịch hẹn theo user_id
router.get('/user/:userId', getLichHenByUserId);

export default router;