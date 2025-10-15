import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entity/User";
import { Admin } from "../entity/Admin"; 

interface JwtPayload {
    id: number;
    role: 'user' | 'admin'; 
}

// Khai báo user trong request
declare global {
    namespace Express {
        interface Request {
            user?: User | Admin;
            token?: string;
        }
    }
}

// Middleware kiểm tra token và phân quyền
export const auth = (roles: Array<'user' | 'admin'> = []) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                throw new Error("Authentication failed: No token provided");
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
            
            if (!decoded.id || !decoded.role) {
                 throw new Error("Authentication failed: Invalid token payload");
            }
            
            // Nếu có yêu cầu về role và role trong token không khớp -> từ chối
            if (roles.length > 0 && !roles.includes(decoded.role)) {
                throw new Error("Authorization failed: Insufficient permissions");
            }

            let user: User | Admin | null = null;
            if (decoded.role === 'admin') {
                const adminRepository = AppDataSource.getRepository(Admin);
                user = await adminRepository.findOneBy({ id: decoded.id });
            } else {
                const userRepository = AppDataSource.getRepository(User);
                user = await userRepository.findOneBy({ id: decoded.id });
            }

            if (!user) {
                throw new Error("Authentication failed: User not found");
            }

            req.user = user;
            req.token = token;
            next();
        } catch (error: any) {
            res.status(401).json({ error: error.message || "Please authenticate." });
        }
    };
};