import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entity/User";

// kiểm tra token
interface JwtPayload {
    id: number;
}

// khai báo user trong request
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

// middleware kiểm tra token
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
        const user = await AppDataSource.getRepository(User).findOneBy({ id: decoded.id });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Please authenticate." });
    }
}; 