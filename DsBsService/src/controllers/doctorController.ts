import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Doctor } from '../entity/Doctor';
import { Between, Like, Not } from 'typeorm';
import { logActivity } from '../utils/logger';


const getUserIdFromRequest = (req: Request): number | null => {
    return req.user?.id || null;
};


export const getDoctors = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctors = await doctorRepository.find();

        await logActivity(req, userId, 'xem danh sách bác sĩ', { count: doctors.length });
        return res.json(doctors);
    } catch (error) {
        console.error('Lỗi lấy danh sách bác sĩ:', error);
        await logActivity(req, userId, 'GET_DOCTORS_FAILURE', { error: (error as Error).message });
        return res.status(500).json({ error: 'Lỗi máy chủ khi lấy danh sách bác sĩ' });
    }
};

export const getDoctorById = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    const { id } = req.params;
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctor = await doctorRepository.findOne({ where: { id: parseInt(id) } });

        if (!doctor) {
            return res.status(404).json({ error: 'Không tìm thấy bác sĩ' });
        }

        await logActivity(req, userId, 'xem bác sĩ theo ID', { doctorId: id });
        return res.json(doctor);
    } catch (error) {
        console.error('Lỗi lấy bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi lấy bác sĩ' });
    }
};

export const filterDoctors = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    try {
        const { gender, degree, experience } = req.query;
        const doctorRepository = AppDataSource.getRepository(Doctor);

        let whereClause: any = {};

        if (gender && gender !== 'Tất cả') whereClause.gioiTinh = gender;
        if (degree && degree !== 'Tất cả') whereClause.hocVi = degree;
        if (experience && experience !== 'Tất cả') {
            switch (experience) {
                case 'dưới 5 năm': whereClause.kinhNghiem = Between(0, 4); break;
                case '5-10 năm': whereClause.kinhNghiem = Between(5, 10); break;
                case '10-15 năm': whereClause.kinhNghiem = Between(11, 15); break;
                case '15-20 năm': whereClause.kinhNghiem = Between(16, 20); break;
                case 'trên 20 năm': whereClause.kinhNghiem = Between(21, 100); break;
            }
        }

        const doctors = await doctorRepository.find({ where: whereClause });
        await logActivity(req, userId, 'lọc bác sĩ', { filters: req.query, resultCount: doctors.length });

        return res.json(doctors);
    } catch (error) {
        console.error('Lỗi lọc bác sĩ:', error);
        await logActivity(req, userId, 'FILTER_DOCTORS_FAILURE', { filters: req.query, error: (error as Error).message });
        return res.status(500).json({ error: 'Lỗi máy chủ khi lọc bác sĩ' });
    }
};

export const searchDoctorsByName = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    const { name } = req.query;

    try {
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Thiếu tham số name hoặc không hợp lệ' });
        }

        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctors = await doctorRepository.find({
            where: { name: Like(`%${name}%`) },
            order: { name: 'ASC' },
        });

        await logActivity(req, userId, 'tìm bác sĩ theo tên', { searchTerm: name, resultCount: doctors.length });
        return res.json(doctors);
    } catch (error) {
        console.error('Lỗi tìm bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi tìm kiếm bác sĩ' });
    }
};

export const createDoctor = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    try {
        const { name, email, phone, gioiTinh, moTaBacSi, hocVi, kinhNghiem, linkAnh } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Tên và email là bắt buộc' });
        }

        const doctorRepository = AppDataSource.getRepository(Doctor);
        const existingDoctor = await doctorRepository.findOne({ where: { email } });
        if (existingDoctor) {
            return res.status(409).json({ error: 'Email đã tồn tại' });
        }

        const newDoctor = doctorRepository.create({
            name,
            email,
            phone,
            gioiTinh,
            moTaBacSi,
            hocVi,
            kinhNghiem,
            linkAnh,
        });

        await doctorRepository.save(newDoctor);
        await logActivity(req, userId, 'tạo bác sĩ', { doctorId: newDoctor.id });

        return res.status(201).json(newDoctor);
    } catch (error) {
        console.error('Lỗi tạo bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi tạo bác sĩ' });
    }
};

export const updateDoctor = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    const { id } = req.params;
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctor = await doctorRepository.findOne({ where: { id: parseInt(id) } });

        if (!doctor) {
            return res.status(404).json({ error: 'Không tìm thấy bác sĩ' });
        }

        const { email } = req.body;
        if (email) {
            const existing = await doctorRepository.findOne({ where: { email, id: Not(parseInt(id)) } });
            if (existing) {
                return res.status(409).json({ error: 'Email đã được sử dụng' });
            }
        }

        doctorRepository.merge(doctor, req.body);
        const updated = await doctorRepository.save(doctor);

        await logActivity(req, userId, 'cập nhật bác sĩ', { doctorId: id });
        return res.json(updated);
    } catch (error) {
        console.error('Lỗi cập nhật bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật bác sĩ' });
    }
};

export const deleteDoctor = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    const { id } = req.params;
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctor = await doctorRepository.findOne({ where: { id: parseInt(id) } });

        if (!doctor) {
            return res.status(404).json({ error: 'Không tìm thấy bác sĩ để xóa' });
        }

        await doctorRepository.remove(doctor);
        await logActivity(req, userId, 'xóa bác sĩ', { doctorId: id });
        return res.json({ message: 'Xóa bác sĩ thành công' });
    } catch (error) {
        console.error('Lỗi xóa bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi xóa bác sĩ' });
    }
};
