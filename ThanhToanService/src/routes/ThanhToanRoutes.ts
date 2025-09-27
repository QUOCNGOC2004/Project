import { Router } from 'express';
import {
  getAllThanhToan,
  getThanhToanById,
  createThanhToan,
  updateThanhToan,
  deleteThanhToan,
  getThanhToanByUserId
} from '../controllers/ThanhToanController';

const router = Router();

// Lấy danh sách thanh toán
router.get('/', getAllThanhToan);

// Tạo thanh toán mới
router.post('/', createThanhToan);

// Cập nhật thanh toán
router.put('/:id', updateThanhToan);

// Xóa thanh toán
router.delete('/:id', deleteThanhToan);

// Lấy thanh toán theo ID
router.get('/:id', getThanhToanById);

// Lấy thanh toán theo user_id
router.get('/user/:userId', getThanhToanByUserId);

export default router;