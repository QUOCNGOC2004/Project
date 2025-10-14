import { Request } from 'express';
import { AppDataSource } from '../config/database';

interface LogDetails {
    [key: string]: any;
}

export const logActivity = async (
    req: Request,
    userId: number | null,
    actionType: string,
    details: LogDetails = {}
) => {
    try {
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        await AppDataSource.query(
            `INSERT INTO audit_logs (user_id, action_type, ip_address, user_agent, details)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, actionType, ipAddress, userAgent, details]
        );
    } catch (error) {
        console.error('Failed to write to audit log:', error);
        
    }
};