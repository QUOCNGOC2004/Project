import { Router } from 'express';
import { getDoctors, getDoctorById, filterDoctors, searchDoctorsByName, searchDoctorsWithCoSoKham } from '../controllers/doctorController';

const router = Router();

// Đặt route cụ thể trước route có tham số
router.get('/filter', filterDoctors);
router.get('/search', searchDoctorsByName);
router.get('/search-with-co-so-kham', searchDoctorsWithCoSoKham);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

export default router; 