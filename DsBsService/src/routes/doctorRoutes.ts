import { Router } from 'express';
import {
    getDoctors, getDoctorById, filterDoctors, searchDoctorsByName, createDoctor,
    updateDoctor, deleteDoctor
} from '../controllers/doctorController';
import { auth } from '../middleware/auth';

const router = Router();

// router công khai
router.get('/filter', filterDoctors);
router.get('/search', searchDoctorsByName);
router.get('/', getDoctors);
// router được bảo vệ
router.post('/', auth(['admin']), createDoctor);
router.put('/:id',auth(['admin']) ,updateDoctor);
router.delete('/:id', auth(['admin']), deleteDoctor);
//router có tham số để cuối cùng
router.get('/:id', getDoctorById);

export default router; 