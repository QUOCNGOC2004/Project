import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Doctor } from '../entity/Doctor';
import { Between, Like,Not } from 'typeorm';
import { logActivity } from '../utils/logger';

export const getDoctors = async (_req: Request, res: Response) => {
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctors = await doctorRepository.find();
        return res.json(doctors);
    } catch (error) {
        console.error("Lỗi lấy danh sách bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ" });
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
        const { specialty, position, degree, experience, facility } = req.query;
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


/**
 * @description Tạo một bác sĩ mới
 * @route POST /api/doctors
 */
export const createDoctor = async (req: Request, res: Response) => {
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
            return res.status(400).json({ error: "Tên và email là bắt buộc." });
        }

        const doctorRepository = AppDataSource.getRepository(Doctor);

        // --- Kiểm tra email đã tồn tại chưa ---
        const existingDoctor = await doctorRepository.findOne({ where: { email } });
        if (existingDoctor) {
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
        
        return res.status(201).json(newDoctor);

    } catch (error) {
        console.error("Lỗi khi tạo bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ khi tạo bác sĩ." });
    }
};

/**
 * @description Cập nhật thông tin bác sĩ theo ID
 * @route PUT /api/doctors/:id
 */
export const updateDoctor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const doctorRepository = AppDataSource.getRepository(Doctor);

        // --- Tìm bác sĩ cần cập nhật ---
        const doctorToUpdate = await doctorRepository.findOne({ where: { id: parseInt(id) } });
        if (!doctorToUpdate) {
            return res.status(404).json({ error: "Không tìm thấy bác sĩ." });
        }

        const { email } = req.body;

        // --- Nếu email được cập nhật, kiểm tra xem nó có bị trùng với người khác không ---
        if (email) {
            const existingDoctor = await doctorRepository.findOne({ 
                where: { 
                    email,
                    id: Not(parseInt(id)) // Tìm email trùng nhưng không phải của chính bác sĩ này
                } 
            });
            if (existingDoctor) {
                return res.status(409).json({ error: "Email này đã được sử dụng bởi một bác sĩ khác." });
            }
        }

        // --- Gộp thông tin cũ và mới, sau đó lưu lại ---
        // doctorRepository.merge(entityToUpdate, newPartialData)
        doctorRepository.merge(doctorToUpdate, req.body);
        const updatedDoctor = await doctorRepository.save(doctorToUpdate);
        
        return res.json(updatedDoctor);

    } catch (error) {
        console.error("Lỗi khi cập nhật bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật bác sĩ." });
    }
};

/**
 * @description Xóa một bác sĩ theo ID
 * @route DELETE /api/doctors/:id
 */
export const deleteDoctor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const doctorRepository = AppDataSource.getRepository(Doctor);

        // --- Kiểm tra xem bác sĩ có tồn tại không trước khi xóa ---
        const doctorToDelete = await doctorRepository.findOne({ where: { id: parseInt(id) } });
        if (!doctorToDelete) {
            return res.status(404).json({ error: "Không tìm thấy bác sĩ để xóa." });
        }

        // --- Thực hiện xóa ---
        await doctorRepository.remove(doctorToDelete);

        return res.status(200).json({ message: "Xóa bác sĩ thành công." });

    } catch (error) {
        console.error("Lỗi khi xóa bác sĩ:", error);
        return res.status(500).json({ error: "Lỗi máy chủ khi xóa bác sĩ." });
    }
};