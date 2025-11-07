import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { DoctorSchedule } from '../entity/DoctorSchedule';
import { TimeSlot } from '../entity/TimeSlot';
import { Doctor } from '../entity/Doctor';
import {In } from 'typeorm';


// Hàm trợ giúp tạo Time Slots
const generateTimeSlots = (start: string, end: string): string[] => {
    const slots: string[] = [];
    let currentTime = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);

    while (currentTime < endTime) {
        const hours = currentTime.getUTCHours().toString().padStart(2, '0');
        const minutes = currentTime.getUTCMinutes().toString().padStart(2, '0');
        const seconds = currentTime.getUTCSeconds().toString().padStart(2, '0');
        slots.push(`${hours}:${minutes}:${seconds}`);

        // Tăng thời gian lên 1 giờ cho lần lặp tiếp theo
        currentTime.setUTCHours(currentTime.getUTCHours() + 1);
    }

    return slots;
};



export const createSchedule = async (req: Request, res: Response) => {
    
    const { doctorId, workDate, startTime, endTime } = req.body;

    if (!doctorId || !workDate || !startTime || !endTime) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc: doctorId, workDate, startTime, endTime' });
    }

    try {
        const doctorRepo = AppDataSource.getRepository(Doctor);
        const doctor = await doctorRepo.findOne({ where: { id: doctorId } });
        if (!doctor) {
            return res.status(404).json({ error: 'Không tìm thấy bác sĩ' });
        }

        const scheduleRepo = AppDataSource.getRepository(DoctorSchedule);
        const timeSlotRepo = AppDataSource.getRepository(TimeSlot);

        
        const slotTimes = generateTimeSlots(startTime, endTime);
        if (slotTimes.length === 0) {
            return res.status(400).json({ error: 'Giờ kết thúc phải lớn hơn giờ bắt đầu' });
        }

        let newSchedule: DoctorSchedule;

        
        await AppDataSource.transaction(async transactionalEntityManager => {
            
            newSchedule = scheduleRepo.create({
                doctorId,
                workDate,
                startTime,
                endTime
            });
            await transactionalEntityManager.save(newSchedule);

            // 2. Tạo các TimeSlots dựa trên ca làm việc
            const newTimeSlots = slotTimes.map(slot => {
                return timeSlotRepo.create({
                    scheduleId: newSchedule.id,
                    slotTime: slot,
                    isAvailable: true
                });
            });

            // 3. Lưu các TimeSlots
            await transactionalEntityManager.save(newTimeSlots);

        
            newSchedule.timeSlots = newTimeSlots;
        });

        
        return res.status(201).json(newSchedule!);

    } catch (error) {
        console.error('Lỗi tạo lịch làm việc:', error);
        
        return res.status(500).json({ error: 'Lỗi máy chủ khi tạo lịch làm việc' });
    }
};


export const updateSchedule = async (req: Request, res: Response) => {
    
    const { id } = req.params;
    const { workDate, startTime, endTime } = req.body;

    try {
        const scheduleRepo = AppDataSource.getRepository(DoctorSchedule);
        const timeSlotRepo = AppDataSource.getRepository(TimeSlot);

     
        const schedule = await scheduleRepo.findOne({
            where: { id: parseInt(id) },
            relations: ['timeSlots'] 
        });

        if (!schedule) {
            return res.status(404).json({ error: 'Không tìm thấy lịch làm việc' });
        }

       
        const hasBookedSlot = schedule.timeSlots.some(slot => slot.appointmentId !== null);
        if (hasBookedSlot) {
            return res.status(409).json({ error: 'Không thể cập nhật. Lịch làm việc này đã có lịch hẹn được đặt.' });
        }

       
        if (!workDate && !startTime && !endTime) {
            return res.status(400).json({ error: 'Không có thông tin cập nhật' });
        }

       
        const newWorkDate = workDate || schedule.workDate;
        const newStartTime = startTime || schedule.startTime;
        const newEndTime = endTime || schedule.endTime;

        
        const newSlotTimes = generateTimeSlots(newStartTime, newEndTime);
        if (newSlotTimes.length === 0) {
            return res.status(400).json({ error: 'Giờ kết thúc phải lớn hơn giờ bắt đầu' });
        }

       
        await AppDataSource.transaction(async transactionalEntityManager => {
         
            await transactionalEntityManager.remove(schedule.timeSlots);

            
            schedule.workDate = newWorkDate;
            schedule.startTime = newStartTime;
            schedule.endTime = newEndTime;
            await transactionalEntityManager.save(schedule);

           
            const newTimeSlots = newSlotTimes.map(slot => {
                return timeSlotRepo.create({
                    scheduleId: schedule.id,
                    slotTime: slot,
                    isAvailable: true
                });
            });
            await transactionalEntityManager.save(newTimeSlots);

            schedule.timeSlots = newTimeSlots;
        });


        
        return res.json(schedule);

    } catch (error) {
        console.error('Lỗi cập nhật lịch làm việc:', error);
        
        return res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật lịch làm việc' });
    }
};


export const deleteSchedule = async (req: Request, res: Response) => {
   
    const { id } = req.params;

    try {
        const scheduleRepo = AppDataSource.getRepository(DoctorSchedule);

        const schedule = await scheduleRepo.findOne({
            where: { id: parseInt(id) },
            relations: ['timeSlots']
        });

        if (!schedule) {
            return res.status(404).json({ error: 'Không tìm thấy lịch làm việc' });
        }

        
        const hasBookedSlot = schedule.timeSlots.some(slot => slot.appointmentId !== null);
        if (hasBookedSlot) {
            return res.status(409).json({ error: 'Không thể xóa. Lịch làm việc này đã có lịch hẹn được đặt.' });
        }

        
        await scheduleRepo.remove(schedule);

        
        return res.json({ message: 'Xóa lịch làm việc thành công' });

    } catch (error) {
        console.error('Lỗi xóa lịch làm việc:', error);
        
        return res.status(500).json({ error: 'Lỗi máy chủ khi xóa lịch làm việc' });
    }
};


export const getAllSchedules = async (_req: Request, res: Response) => {
    
    try {
        const scheduleRepo = AppDataSource.getRepository(DoctorSchedule);
      
        const schedules = await scheduleRepo.find({
            relations: ['doctor', 'timeSlots'],
            order: {
                workDate: 'ASC',
                startTime: 'ASC'
            }
        });

        
        return res.json(schedules);

    } catch (error) {
        console.error('Lỗi lấy danh sách lịch làm việc:', error);
        
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

export const getSchedulesByDoctorId = async (req: Request, res: Response) => {
    
    const { doctorId } = req.params;

    try {
    
        const doctorRepo = AppDataSource.getRepository(Doctor);
        const doctor = await doctorRepo.findOne({ where: { id: parseInt(doctorId) } });
        
        if (!doctor) {
            return res.status(404).json({ error: 'Không tìm thấy bác sĩ' });
        }

        const scheduleRepo = AppDataSource.getRepository(DoctorSchedule);
        const schedules = await scheduleRepo.find({
            where: { doctorId: parseInt(doctorId) },
            relations: ['timeSlots'], 
            order: {
                workDate: 'ASC',
                startTime: 'ASC'
            }
        });

        if (!schedules || schedules.length === 0) {
           
     
            return res.json([]); 
        }
        
        
        return res.json(schedules);

    } catch (error) {
        console.error('Lỗi lấy lịch làm việc theo bác sĩ:', error);
        
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};


// --- HÀM HELPER TÍNH TOÁN NGÀY ---
const getDatesForWeek = (anchorDateStr: string, selectedDays: number[]): string[] => {
    const anchorDate = new Date(anchorDateStr + 'T00:00:00Z');
    const dayOfWeek = anchorDate.getUTCDay(); // 0 = CN, 1 = T2, ...
    const startOfWeek = new Date(anchorDate);
   
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - (dayOfWeek || 7) + 1);

    const datesToCreate: string[] = [];

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setUTCDate(currentDate.getUTCDate() + i);

        const currentDayKey = currentDate.getUTCDay(); // 0=CN, 1=T2...

        if (selectedDays.includes(currentDayKey)) {
            datesToCreate.push(currentDate.toISOString().split('T')[0]);
        }
    }
    return datesToCreate;
};

export const createBatchSchedules = async (req: Request, res: Response) => {
    const { doctorId, startTime, endTime, anchorDate, selectedDays } = req.body;

    if (!doctorId || !startTime || !endTime || !anchorDate || !selectedDays) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc: doctorId, startTime, endTime, anchorDate, selectedDays' });
    }
    if (!Array.isArray(selectedDays) || selectedDays.length === 0) {
        return res.status(400).json({ error: 'selectedDays phải là một mảng và không được rỗng' });
    }

    try {
        const doctorRepo = AppDataSource.getRepository(Doctor);
        const scheduleRepo = AppDataSource.getRepository(DoctorSchedule);
        const timeSlotRepo = AppDataSource.getRepository(TimeSlot);

        const doctor = await doctorRepo.findOne({ where: { id: doctorId } });
        if (!doctor) {
            return res.status(404).json({ error: 'Không tìm thấy bác sĩ' });
        }

        // Tạo các slot time
        const slotTimes = generateTimeSlots(startTime, endTime);
        if (slotTimes.length === 0) {
            return res.status(400).json({ error: 'Giờ kết thúc phải lớn hơn giờ bắt đầu' });
        }

        // Tính toán các ngày làm việc cần tạo
        const workDates = getDatesForWeek(anchorDate, selectedDays);
        if (workDates.length === 0) {
            return res.status(400).json({ error: 'Không có ngày nào được chọn để tạo lịch' });
        }

        const existingSchedules = await scheduleRepo.find({
            where: {
                doctorId: doctorId,
                workDate: In(workDates), 
                startTime: startTime    
            }
        });

        if (existingSchedules.length > 0) {
            const conflictingDates = existingSchedules.map(s => s.workDate);
            return res.status(409).json({ 
                error: `Không thể tạo lịch. Đã tồn tại lịch làm việc vào các ngày: ${conflictingDates.join(', ')}` 
            });
        }

        const createdSchedules: DoctorSchedule[] = [];

        await AppDataSource.transaction(async transactionalEntityManager => {
            for (const date of workDates) {
                // a. Tạo DoctorSchedule
                const newSchedule = scheduleRepo.create({
                    doctorId,
                    workDate: date,
                    startTime,
                    endTime
                });
                await transactionalEntityManager.save(newSchedule);

                // b. Tạo các TimeSlots cho schedule
                const newTimeSlots = slotTimes.map(slot => {
                    return timeSlotRepo.create({
                        scheduleId: newSchedule.id,
                        slotTime: slot,
                        isAvailable: true
                    });
                });
                await transactionalEntityManager.save(newTimeSlots);

                // c. Gắn timeslots vào schedule để trả về
                newSchedule.timeSlots = newTimeSlots;
                createdSchedules.push(newSchedule);
            }
        });

        // Trả về kết quả (mảng các lịch đã tạo)
        return res.status(201).json(createdSchedules);

    } catch (error) {
        console.error('Lỗi tạo lịch hàng loạt:', error);
        if ((error as any).code === '23505') { // 23505 là mã lỗi unique_violation của Postgres
             return res.status(409).json({ error: 'Xung đột lịch làm việc. Vui lòng kiểm tra lại.' });
        }
        return res.status(500).json({ error: 'Lỗi máy chủ khi tạo lịch làm việc' });
    }
};