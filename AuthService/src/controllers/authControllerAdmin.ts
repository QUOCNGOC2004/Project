import { Request, Response } from "express";
import { AppDataSource } from "../index";
import { User } from "../entity/User";


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