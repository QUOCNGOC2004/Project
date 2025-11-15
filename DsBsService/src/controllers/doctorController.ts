import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Doctor } from '../entity/Doctor';
import { Brackets } from 'typeorm';


export const getDoctors = async (_req: Request, res: Response) => {
    
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctors = await doctorRepository.find();

       
        return res.json(doctors);
    } catch (error) {
        console.error('Lỗi lấy danh sách bác sĩ:', error);
        
        return res.status(500).json({ error: 'Lỗi máy chủ khi lấy danh sách bác sĩ' });
    }
};

export const getDoctorById = async (req: Request, res: Response) => {
    
    const { id } = req.params;
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctor = await doctorRepository.findOne({ where: { id: parseInt(id) } });

        if (!doctor) {
            return res.status(404).json({ error: 'Không tìm thấy bác sĩ' });
        }

       
        return res.json(doctor);
    } catch (error) {
        console.error('Lỗi lấy bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi lấy bác sĩ' });
    }
};

export const filterDoctors = async (req: Request, res: Response) => {
    try {
        const {
            name,
            gender,
            degree,
            experience,
        
            workDate, 
            shifts, 
            filterAvailable 
        } = req.query;
        
        const doctorRepository = AppDataSource.getRepository(Doctor);
        
        
        const qb = doctorRepository.createQueryBuilder("doctor");

        
        if (name && typeof name === 'string' && name.trim() !== '') {
            qb.andWhere("doctor.name LIKE :doctorName", { doctorName: `%${name}%` });
        }
        if (gender && gender !== 'Tất cả') {
            qb.andWhere("doctor.gioiTinh = :gender", { gender });
        }
        if (degree && degree !== 'Tất cả') {
            qb.andWhere("doctor.hocVi = :degree", { degree });
        }
        if (experience && experience !== 'Tất cả') {
            switch (experience) {
                case 'dưới 5 năm': qb.andWhere("doctor.kinhNghiem BETWEEN 0 AND 4"); break;
                case '5-10 năm': qb.andWhere("doctor.kinhNghiem BETWEEN 5 AND 10"); break;
                case '10-15 năm': qb.andWhere("doctor.kinhNghiem BETWEEN 11 AND 15"); break;
                case '15-20 năm': qb.andWhere("doctor.kinhNghiem BETWEEN 16 AND 20"); break;
                case 'trên 20 năm': qb.andWhere("doctor.kinhNghiem BETWEEN 21 AND 100"); break;
            }
        }
        if (workDate && typeof workDate === 'string') {
            qb.innerJoin(
                "DoctorSchedule", 
                "schedule",      
                "schedule.doctor_id = doctor.id AND schedule.work_date = :workDate", 
                { workDate }    
            );
            qb.innerJoin("schedule.timeSlots", "slot");
     
            if (filterAvailable && filterAvailable === 'true') {
              
                qb.andWhere("slot.isAvailable = :isAvailable", { isAvailable: true });
            }

           
            const selectedShifts = Array.isArray(shifts) ? shifts : (shifts ? [shifts] : []);
            
            if (selectedShifts.length > 0) {
                
                const shiftConditions = new Brackets(sqb => {
                    if (selectedShifts.includes('sang')) {
                        
                        sqb.orWhere("slot.slotTime BETWEEN '00:00:00' AND '12:59:59'");
                    }
                    if (selectedShifts.includes('chieu')) {
                        
                        sqb.orWhere("slot.slotTime BETWEEN '13:00:00' AND '17:59:59'");
                    }
                    if (selectedShifts.includes('toi')) {
                        
                        sqb.orWhere("slot.slotTime BETWEEN '18:00:00' AND '23:59:59'");
                    }
                });
                qb.andWhere(shiftConditions);
            }
        }
        qb.groupBy("doctor.id"); 
        
        const doctors = await qb.getMany();
        
        return res.json(doctors);

    } catch (error) {
        console.error('Lỗi lọc bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi lọc bác sĩ' });
    }
};
