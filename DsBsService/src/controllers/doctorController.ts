import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Doctor } from '../entity/Doctor';
import { Between, Like } from 'typeorm';
import { 
  cacheDoctors, 
  cacheDoctor, 
  cacheDoctorSpecialty} from '../services/CacheService';

export const getDoctors = async (_req: Request, res: Response) => {
    try {
        // Kiểm tra cache
        const cachedData = await cacheDoctors.getAll();
        if (cachedData) {
            return res.json(cachedData);
        }

        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctors = await doctorRepository.find();
        
        // Lưu vào cache
        await cacheDoctors.setAll(doctors);
        
        return res.json(doctors);
    } catch (error) {
        console.error("Lỗi lấy danh sách bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const getDoctorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra cache
        const cachedData = await cacheDoctor.get(id);
        if (cachedData) {
            return res.json(cachedData);
        }

        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctor = await doctorRepository.findOne({ where: { id: parseInt(id) } });
        
        if (!doctor) {
            return res.status(404).json({ error: "Bác sĩ không tồn tại" });
        }
        
        // Lưu vào cache
        await cacheDoctor.set(id, doctor);
        
        return res.json(doctor);
    } catch (error) {
        console.error("Lỗi lấy bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const filterDoctors = async (req: Request, res: Response) => {
    try {
        const { specialty, position, degree, experience, facility } = req.query;
        
        // Nếu chỉ lọc theo chuyên khoa, kiểm tra cache
        if (specialty && specialty !== 'Tất cả' && !position && !degree && !experience && !facility) {
            const cachedData = await cacheDoctorSpecialty.get(specialty as string);
            if (cachedData) {
                return res.json(cachedData);
            }
        }

        const doctorRepository = AppDataSource.getRepository(Doctor);
        
        let whereClause: any = {};

        if (facility && facility !== 'Tất cả') {
            whereClause.coSoKham = facility;
        }

        if (specialty && specialty !== 'Tất cả') {
            whereClause.chuyenKhoa = specialty;
        }

        if (position && position !== 'Tất cả') {
            whereClause.chucVu = position;
        }

        if (degree && degree !== 'Tất cả') {
            whereClause.hocVi = degree;
        }

        if (experience && experience !== 'Tất cả') {
            switch (experience) {
                case 'dưới 5 năm':
                    whereClause.kinhNghiem = Between(0, 4);
                    break;
                case '5-10 năm':
                    whereClause.kinhNghiem = Between(5, 10);
                    break;
                case '10-15 năm':
                    whereClause.kinhNghiem = Between(11, 15);
                    break;
                case '15-20 năm':
                    whereClause.kinhNghiem = Between(16, 20);
                    break;
                case 'trên 20 năm':
                    whereClause.kinhNghiem = Between(21, 100);
                    break;
            }
        }

        const doctors = await doctorRepository.find({ where: whereClause });

        // Nếu chỉ lọc theo chuyên khoa, lưu vào cache
        if (specialty && specialty !== 'Tất cả' && !position && !degree && !experience && !facility) {
            await cacheDoctorSpecialty.set(specialty as string, doctors);
        }

        return res.json(doctors);
    } catch (error) {
        console.error("Lỗi lọc danh sách bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const searchDoctorsByName = async (req: Request, res: Response) => {
    try {
        const { name } = req.query;
        
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Thiếu tham số tên hoặc tham số không hợp lệ' });
        }

        const doctorRepository = AppDataSource.getRepository(Doctor);
        
        const doctors = await doctorRepository.find({
            where: {
                name: Like(`%${name}%`)
            },
            order: {
                name: 'ASC'
            }
        });

        return res.json(doctors);
        
    } catch (error) {
        console.error('Lỗi khi tìm kiếm bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi tìm kiếm bác sĩ' });
    }
};