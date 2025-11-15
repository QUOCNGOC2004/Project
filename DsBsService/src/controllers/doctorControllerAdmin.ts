import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Doctor } from '../entity/Doctor';
import { Not } from 'typeorm';


export const createDoctor = async (req: Request, res: Response) => {
    
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
        

        return res.status(201).json(newDoctor);
    } catch (error) {
        console.error('Lỗi tạo bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi tạo bác sĩ' });
    }
};

export const updateDoctor = async (req: Request, res: Response) => {
    
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

        
        return res.json(updated);
    } catch (error) {
        console.error('Lỗi cập nhật bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật bác sĩ' });
    }
};

export const deleteDoctor = async (req: Request, res: Response) => {
    
    const { id } = req.params;
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctor = await doctorRepository.findOne({ where: { id: parseInt(id) } });

        if (!doctor) {
            return res.status(404).json({ error: 'Không tìm thấy bác sĩ để xóa' });
        }

        await doctorRepository.remove(doctor);
       
        return res.json({ message: 'Xóa bác sĩ thành công' });
    } catch (error) {
        console.error('Lỗi xóa bác sĩ:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ khi xóa bác sĩ' });
    }
};
