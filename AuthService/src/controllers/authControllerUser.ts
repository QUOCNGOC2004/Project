import { Request, Response } from "express";
import { AppDataSource } from "../index";
import { User } from "../entity/User";

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