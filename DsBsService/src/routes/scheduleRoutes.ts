import { Router } from 'express';
import {
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getAllSchedules,
    getSchedulesByDoctorId,
    createBatchSchedules,
    getDoctorScheduleDetails
} from '../controllers/scheduleControllerAdmin';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/',[auth(['admin'])] ,getAllSchedules);
router.post('/', [auth(['admin'])], createSchedule);
router.post('/batch',[auth(['admin'])] ,createBatchSchedules);
// (Route này phải đặt trước route /:id)
router.get('/doctor/:doctorId',[auth(['admin'])] ,getSchedulesByDoctorId);
router.get('/:doctorId/schedule',[auth(['user'])] ,getDoctorScheduleDetails);
router.put('/:id',[auth(['admin'])] ,updateSchedule);
router.delete('/:id',[auth(['admin'])] , deleteSchedule);

export default router;