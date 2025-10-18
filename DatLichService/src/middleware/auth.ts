import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface JwtPayload {
    id: number;
    role: 'user' | 'admin';
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: 'user' | 'admin';
            };
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
            
            // Nếu có yêu cầu về vai trò và vai trò trong token không khớp -> từ chối
            if (roles.length > 0 && !roles.includes(decoded.role)) {
                throw new Error("Lỗi xác thực: Không đủ quyền truy cập");
            }

            // Gắn thông tin user (id và role) và token vào request để sử dụng ở các bước sau
            req.user = { id: decoded.id, role: decoded.role };
            req.token = token;
            next();
        } catch (error: any) {
            res.status(401).json({ error: error.message || "Vui lòng đăng nhập" });
        }
    };
};