import { Router } from 'express';
import {
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getAllSchedules,
    getSchedulesByDoctorId,
    createBatchSchedules
} from '../controllers/scheduleController';
import { auth } from '../middleware/auth';

const router = Router();
router.use(auth(['admin']));

router.get('/', getAllSchedules);
router.post('/', createSchedule);
router.post('/batch', createBatchSchedules);
// (Route này phải đặt trước route /:id)
router.get('/doctor/:doctorId', getSchedulesByDoctorId);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;