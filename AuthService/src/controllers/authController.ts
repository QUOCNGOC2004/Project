import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../index";
import { User } from "../entity/User";
import { Admin } from "../entity/Admin";
import { validate } from "class-validator";
import { logActivity } from "../utils/logger";

export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, email, password } = req.body;

        // kiểm tra xem user đã tồn tại chưa
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where: [{ email }, { username }]
        });

        if (existingUser) {
            // Ghi log đăng ký thất bại do người dùng đã tồn tại
            await logActivity(req, null, 'đăng ký thất bại', { username, email, reason: "người dùng tồn tại" });
            return res.status(400).json({
                error: "Email hoặc tên đăng nhập này đã tồn tại"
            });
        }

        // tạo user mới
        const user = new User();
        user.username = username;
        user.email = email;
        user.password = await bcrypt.hash(password, 10);

        // kiểm tra dữ liệu
        const errors = await validate(user);
        if (errors.length > 0) {
            const errorMessages = errors.map(error => {
                if (error.property === 'email') {
                    return 'Email không hợp lệ';
                }
                return 'Dữ liệu không hợp lệ';
            });
            // Ghi log đăng ký thất bại do dữ liệu không hợp lệ
            await logActivity(req, null, 'đăng ký thất bại', { username, email, reason: "dữ liệu không hợp lệ", errors: errorMessages });
            return res.status(400).json({ errors: errorMessages });
        }

        // lưu user
        await userRepository.save(user);
        // Ghi log đăng ký thành công
        await logActivity(req, user.id, 'đăng ký thành công', { username: user.username, email: user.email });

        // tạo token
        const payload = { id: user.id , role: 'user'};
        const secret = process.env.JWT_SECRET || "secret";
        const options = { expiresIn: "24h" as const, issuer: "web-user" };
        const token = jwt.sign(payload, secret, options);

        return res.status(201).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        await logActivity(req, null, 'lỗi máy chủ', { error: (error as Error).message });
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;

        // tìm user
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            // Ghi log đăng nhập thất bại: không tìm thấy người dùng
            await logActivity(req, null, 'đăng nhập thất bại', { email, reason: 'không tìm thấy người dùng' });
            return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
        }

        // kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Ghi log đăng nhập thất bại: sai mật khẩu
            await logActivity(req, user.id, 'đăng nhập thất bại', { email, reason: 'sai mật khẩu' });
            return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
        }

        // tạo token
        const payload = { id: user.id , role: 'user'};
        const secret = process.env.JWT_SECRET || "secret";
        const options = { expiresIn: "24h" as const, issuer: "web-user" };
        const token = jwt.sign(payload, secret, options);

        // Ghi log đăng nhập thành công
        await logActivity(req, user.id, 'đăng nhập thành công', { email: user.email });
        return res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });
        
    } catch (error) {
        await logActivity(req, null, 'lỗi máy chủ', { email: req.body.email, error: (error as Error).message });
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = req.user;
        if (!user) {
            
            return res.status(401).json({ error: "Vui lòng đăng nhập" });
        }
        
        // Ghi log hành động xem thông tin cá nhân
        await logActivity(req, user.id, 'xem thông tin cá nhân', {});
        if (!(user instanceof User)) {
            return res.status(403).json({ error: "Từ chối : Không phải người dùng hợp lệ" });
        }

        return res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                so_dien_thoai: user.so_dien_thoai,
                gioi_tinh: user.gioi_tinh,
                ngay_sinh: user.ngay_sinh
            }
        });
    } catch (error) {
        await logActivity(req, req.user?.id || null, 'lỗi máy chủ', { error: (error as Error).message });
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Vui lòng đăng nhập" });
        }

        const { username, so_dien_thoai, gioi_tinh, ngay_sinh } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const userToUpdate = await userRepository.findOneBy({ id: user.id });

        if (!userToUpdate) {
            return res.status(404).json({ error: "Không tìm thấy người dùng." });
        }
        
        const oldData = {
            username: userToUpdate.username,
            so_dien_thoai: userToUpdate.so_dien_thoai,
            gioi_tinh: userToUpdate.gioi_tinh,
            ngay_sinh: userToUpdate.ngay_sinh
        };

        // Cập nhật thông tin nếu có
        if (username !== undefined) userToUpdate.username = username;
        if (so_dien_thoai !== undefined) userToUpdate.so_dien_thoai = so_dien_thoai;
        if (gioi_tinh !== undefined) userToUpdate.gioi_tinh = gioi_tinh;
        if (ngay_sinh !== undefined) userToUpdate.ngay_sinh = ngay_sinh;

        // Lưu thay đổi vào database
        await userRepository.save(userToUpdate);

        // Ghi log cập nhật, bao gồm cả dữ liệu cũ và mới để dễ truy vết
        await logActivity(req, user.id, 'cập nhật hồ sơ', { 
            updatedFields: Object.keys(req.body),
            oldData: oldData,
            newData: { username, so_dien_thoai, gioi_tinh, ngay_sinh }
        });

        return res.json({
            message: "Cập nhật hồ sơ thành công.",
            user: {
                id: userToUpdate.id,
                username: userToUpdate.username,
                email: userToUpdate.email,
                so_dien_thoai: userToUpdate.so_dien_thoai,
                gioi_tinh: userToUpdate.gioi_tinh,
                ngay_sinh: userToUpdate.ngay_sinh
            }
        });
    } catch (error) {
        await logActivity(req, req.user?.id || null, 'lỗi máy chủ', { error: (error as Error).message });
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

// Thêm hàm logout để ghi log
export const logout = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = req.user;
        if (user) {
            await logActivity(req, user.id, 'LOGOUT_SUCCESS');
        }
        // Phía client sẽ xóa token, server chỉ cần xác nhận
        return res.status(200).json({ message: "Đăng xuất thành công." });
    } catch (error) {
        await logActivity(req, req.user?.id || null, 'LOGOUT_ERROR', { error: (error as Error).message });
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const adminLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const adminRepository = AppDataSource.getRepository(Admin);

    try {
        const admin = await adminRepository.findOne({ where: { username } });

        if (!admin) {
            return res.status(401).json({ message: "Tên đăng nhập không tồn tại" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mật khẩu không chính xác" });
        }

        // Tạo JWT token cho admin
        const payload = { id: admin.id, role: 'admin' };
        const secret = process.env.JWT_SECRET || "secret";
        const options = { expiresIn: "24h" as const, issuer: "web-admin" };
        const token = jwt.sign(payload, secret, options);

        return res.json({
            user: {
                id: admin.id,
                username: admin.username,
                role: 'admin' 
            },
            token
        });

    } catch (error) {
        console.error("Lỗi đăng nhập admin:", error);
        return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};