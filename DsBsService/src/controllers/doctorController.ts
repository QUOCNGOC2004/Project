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
        
        // Ghi log hành động xem danh sách
        await logActivity(req, userId, 'xem danh sách Bs', { count: doctors.length });

        return res.json(doctors);
    } catch (error) {
        // Ghi log lỗi
        await logActivity(req, userId, 'lỗi xem danh sách Bs', { error: (error as Error).message });

        console.error("Lỗi lấy danh sách bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const getDoctorById = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    const { id } = req.params;
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctor = await doctorRepository.findOne({ where: { id: parseInt(id) } });
        
        if (!doctor) {
            await logActivity(req, userId, 'không tìm thấy bác sĩ theo ID', { });
            return res.status(404).json({ error: "Bác sĩ không tồn tại" });
        }

        await logActivity(req, userId, 'xem bác sĩ theo ID', { doctorId: id, doctorName: doctor.name });
        return res.json(doctor);
    } catch (error) {
        await logActivity(req, userId, 'VIEW_DOCTOR_DETAILS_FAILURE', { doctorId: id, error: (error as Error).message });
        console.error("Lỗi lấy bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const filterDoctors = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    try {
        const { specialty, position, degree, experience, facility } = req.query;
        const doctorRepository = AppDataSource.getRepository(Doctor);
        let whereClause: any = {};
        if (facility && facility !== 'Tất cả') whereClause.coSoKham = facility;
        if (specialty && specialty !== 'Tất cả') whereClause.chuyenKhoa = specialty;
        if (position && position !== 'Tất cả') whereClause.chucVu = position;
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
        await logActivity(req, userId, 'FILTER_DOCTORS_FAILURE', { filters: req.query, error: (error as Error).message });
        console.error("Lỗi lọc danh sách bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const searchDoctorsByName = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    const { name } = req.query;
    try {
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Thiếu tham số tên hoặc tham số không hợp lệ' });
        }
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctors = await doctorRepository.find({ where: { name: Like(`%${name}%`) }, order: { name: 'ASC' }});

        await logActivity(req, userId, 'tìm tên bác sĩ', { searchTerm: name, resultCount: doctors.length });
        return res.json(doctors);
    } catch (error) {
        await logActivity(req, userId, 'SEARCH_DOCTORS_FAILURE', { searchTerm: name, error: (error as Error).message });
        console.error('Lỗi khi tìm kiếm bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi tìm kiếm bác sĩ' });
    }
};

export const createDoctor = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    try {
        const { 
            name, 
            email, 
            phone, 
            coSoKham, 
            chuyenKhoa, 
            moTaChucVu, 
            chucVu, 
            hocVi, 
            kinhNghiem, 
            linkAnh 
        } = req.body;

        // --- Kiểm tra dữ liệu đầu vào ---
        if (!name || !email) {
            await logActivity(req, userId, 'lỗi khi tạo bác sĩ', { input: req.body, reason: 'Thiếu tên hoaặc email' });
            return res.status(400).json({ error: "Tên và email là bắt buộc." });
        }

        const doctorRepository = AppDataSource.getRepository(Doctor);
        const existingDoctor = await doctorRepository.findOne({ where: { email } });
        if (existingDoctor) {
            await logActivity(req, userId, 'lỗi khi tạo bác sĩ', { input: req.body, reason: 'Trùng email' });
            return res.status(409).json({ error: "Email này đã được sử dụng." });
        }
        
        // --- Tạo và lưu bác sĩ mới ---
        const newDoctor = doctorRepository.create({
            name,
            email,
            phone,
            coSoKham,
            chuyenKhoa,
            moTaChucVu,
            chucVu,
            hocVi,
            kinhNghiem,
            linkAnh
        });
        
        await doctorRepository.save(newDoctor);

        await logActivity(req, userId, 'tạo bác sĩ thành công', {});
        return res.status(201).json(newDoctor);

    } catch (error) {
        await logActivity(req, userId, 'CREATE_DOCTOR_FAILURE', { input: req.body, error: (error as Error).message });
        console.error("Lỗi khi tạo bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ khi tạo bác sĩ." });
    }
};

export const updateDoctor = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    const { id } = req.params;
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctorToUpdate = await doctorRepository.findOne({ where: { id: parseInt(id) } });

        if (!doctorToUpdate) {
            await logActivity(req, userId, 'lỗi khi cập nhật bác sĩ', { doctorId: id, reason: 'Not Found' });
            return res.status(404).json({ error: "Không tìm thấy bác sĩ." });
        }
        
        // Lưu lại trạng thái cũ để so sánh
        const originalDoctor = { ...doctorToUpdate };

        const { email } = req.body;
        if (email) {
            const existingDoctor = await doctorRepository.findOne({ where: { email, id: Not(parseInt(id)) } });
            if (existingDoctor) {
                await logActivity(req, userId, 'lỗi khi cập nhật bác sĩ', { doctorId: id, input: req.body, reason: 'Email đã được sử dụng' });
                return res.status(409).json({ error: "Email này đã được sử dụng bởi một bác sĩ khác." });
            }
        }
        
        doctorRepository.merge(doctorToUpdate, req.body);
        const updatedDoctor = await doctorRepository.save(doctorToUpdate);

        await logActivity(req, userId, 'cập nhật bác sĩ thành công', { 
            doctorId: id, 
            before: originalDoctor, 
            after: updatedDoctor 
        });
        
        return res.json(updatedDoctor);

    } catch (error) {
        await logActivity(req, userId, 'UPDATE_DOCTOR_FAILURE', { doctorId: id, input: req.body, error: (error as Error).message });
        console.error("Lỗi khi cập nhật bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật bác sĩ." });
    }
};

export const deleteDoctor = async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);
    const { id } = req.params;
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctorToDelete = await doctorRepository.findOne({ where: { id: parseInt(id) } });

        if (!doctorToDelete) {
            await logActivity(req, userId, 'lỗi khi xóa bác sĩ', { doctorId: id, reason: 'Not Found' });
            return res.status(404).json({ error: "Không tìm thấy bác sĩ để xóa." });
        }
        
        await doctorRepository.remove(doctorToDelete);

        await logActivity(req, userId, 'xóa bác sĩ thành công', { doctorId: id, deletedDoctor: doctorToDelete });
        return res.status(200).json({ message: "Xóa bác sĩ thành công." });

    } catch (error) {
        await logActivity(req, userId, 'DELETE_DOCTOR_FAILURE', { doctorId: id, error: (error as Error).message });
        console.error("Lỗi khi xóa bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ khi xóa bác sĩ." });
    }
};

