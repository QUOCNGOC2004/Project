const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

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

module.exports = router; 