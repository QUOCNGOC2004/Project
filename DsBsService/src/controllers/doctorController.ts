import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Doctor } from '../entity/Doctor';
import { Between } from 'typeorm';

export const getDoctors = async (_req: Request, res: Response) => {
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctors = await doctorRepository.find();
        res.json(doctors);
    } catch (error) {
        console.error("Lỗi lấy danh sách bác sĩ:", error);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const getDoctorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctor = await doctorRepository.findOne({ where: { id: parseInt(id) } });
        
        if (!doctor) {
            return res.status(404).json({ error: "Bác sĩ không tồn tại" });
        }
        
        return res.json(doctor);
    } catch (error) {
        console.error("Lỗi lấy bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const filterDoctors = async (req: Request, res: Response) => {
    try {
        const { specialty, position, degree, experience } = req.query;
        const doctorRepository = AppDataSource.getRepository(Doctor);
        
        let whereClause: any = {};

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
        res.json(doctors);
    } catch (error) {
        console.error("Lỗi lọc danh sách bác sĩ:", error);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
}; 