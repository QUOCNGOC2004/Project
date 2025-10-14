import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface JwtPayload {
    id: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: { id: number }; 
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) { throw new Error(); }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;

        // Chỉ lấy id từ token và gắn vào req.user
        req.user = { id: decoded.id };

        next();
    } catch (error) {
        res.status(401).json({ error: "Please authenticate." });
    }
};