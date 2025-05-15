import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Doctor } from '../entity/Doctor';

export const getDoctors = async (_req: Request, res: Response) => {
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctors = await doctorRepository.find();
        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getDoctorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctor = await doctorRepository.findOne({ where: { id: parseInt(id) } });
        
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        
        return res.json(doctor);
    } catch (error) {
        console.error("Error fetching doctor:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}; 