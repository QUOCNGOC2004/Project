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
                throw new Error("Lỗi xác thực: Thiếu token");
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
            
            if (!decoded.id || !decoded.role) {
                 throw new Error("Lỗi xác thực: Token không hợp lệ");
            }
            
            // Nếu có yêu cầu về role và role trong token không khớp -> từ chối
            if (roles.length > 0 && !roles.includes(decoded.role)) {
                throw new Error("Lỗi xác thực: Không đủ quyền truy cập");
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
                throw new Error("Lỗi xác thực: Người dùng không tồn tại");
            }

            req.user = user;
            req.token = token;
            next();
        } catch (error: any) {
            res.status(401).json({ error: error.message || "Vui lòng đăng nhập" });
        }
    };
};