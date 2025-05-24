import { Router } from 'express';
import appointmentController from '../controllers/appointmentController';

const router = Router();

// Lấy danh sách lịch hẹn
router.get('/', appointmentController.getAllAppointments);

// Lấy lịch hẹn theo ID
router.get('/:id', appointmentController.getAppointmentById);

// Tạo lịch hẹn mới
router.post('/', appointmentController.createAppointment);

// Cập nhật lịch hẹn
router.put('/:id', appointmentController.updateAppointment);

// Xóa lịch hẹn
router.delete('/:id', appointmentController.deleteAppointment);

export default router; 