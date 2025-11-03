import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../index";
import { User } from "../entity/User";
import { Admin } from "../entity/Admin";
import { validate } from "class-validator";


export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, email, password } = req.body;

        // kiểm tra xem user đã tồn tại chưa
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where: [{ email }, { username }]
        });

        if (existingUser) {


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


            return res.status(400).json({ errors: errorMessages });
        }

        // lưu user
        await userRepository.save(user);



        // tạo token
        const payload = { id: user.id, role: 'user' };
        const secret = process.env.JWT_SECRET || "secret";
        const options = { expiresIn: "24h" as const, issuer: "web-user" };
        const token = jwt.sign(payload, secret, options);

        return res.status(201).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: 'user'
            },
            token
        });
    } catch (error) {

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

            return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
        }

        // kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {

            return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
        }

        // tạo token
        const payload = { id: user.id, role: 'user' };
        const secret = process.env.JWT_SECRET || "secret";
        const options = { expiresIn: "24h" as const, issuer: "web-user" };
        const token = jwt.sign(payload, secret, options);


        return res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: 'user'
            },
            token
        });

    } catch (error) {

        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = req.user;
        if (!user) {

            return res.status(401).json({ error: "Vui lòng đăng nhập" });
        }

        
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

       

        // Cập nhật thông tin nếu có
        if (username !== undefined) userToUpdate.username = username;
        if (so_dien_thoai !== undefined) userToUpdate.so_dien_thoai = so_dien_thoai;
        if (gioi_tinh !== undefined) userToUpdate.gioi_tinh = gioi_tinh;
        if (ngay_sinh !== undefined) userToUpdate.ngay_sinh = ngay_sinh;

        // Lưu thay đổi vào database
        await userRepository.save(userToUpdate);

        

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

export const getUserProfileByIdForAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userId = parseInt(id, 10);

        if (isNaN(userId)) {
            return res.status(400).json({ error: "ID người dùng không hợp lệ" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "Không tìm thấy người dùng" });
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
        return res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        
        // Tìm tất cả người dùng và chỉ chọn các trường an toàn
        const users = await userRepository.find({
            select: ["id", "username", "email", "so_dien_thoai", "ngay_sinh", "gioi_tinh"]
        });

        return res.json(users);

    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};


export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const userId = parseInt(id, 10);

        if (isNaN(userId)) {
            return res.status(400).json({ error: "ID người dùng không hợp lệ" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "Không tìm thấy người dùng" });
        }

        await userRepository.remove(user);

        return res.status(200).json({ message: "Người dùng đã được xóa thành công" });

    } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        // Xử lý lỗi khóa ngoại (nếu người dùng có liên kết không thể xóa)
        if (error instanceof Object && 'code' in error && error.code === '23503') { // Mã lỗi 23503 của PostgreSQL cho vi phạm khóa ngoại
             return res.status(409).json({ error: "Không thể xóa người dùng này vì có dữ liệu liên quan (ví dụ: lịch hẹn). Vui lòng xử lý các dữ liệu liên quan trước." });
        }
        return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};