import { Router } from 'express';
import {
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getAllSchedules,
    getSchedulesByDoctorId
} from '../controllers/scheduleController';
import { auth } from '../middleware/auth';

const router = Router();


router.use(auth(['admin']));


router.get('/', getAllSchedules);


router.post('/', createSchedule);


// (Route này phải đặt trước route /:id)
router.get('/doctor/:doctorId', getSchedulesByDoctorId);


router.put('/:id', updateSchedule);

router.delete('/:id', deleteSchedule);

export default router;