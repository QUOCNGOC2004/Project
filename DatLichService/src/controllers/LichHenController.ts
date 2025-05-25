import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { LichHen } from '../entity/LichHen';

// Lấy danh sách lịch hẹn
export const getAllLichHen = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await AppDataSource.query('SELECT * FROM appointments ORDER BY ngay_dat_lich, gio_dat_lich');
    const lichHen: LichHen[] = result;
    res.json(lichHen);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Lấy lịch hẹn theo ID
export const getLichHenById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await AppDataSource.query('SELECT * FROM appointments WHERE id = $1', [id]);
    
    if (result.length === 0) {
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
      return;
    }

    const lichHen: LichHen = result[0];
    res.json(lichHen);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin lịch hẹn:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Tạo lịch hẹn mới
export const createLichHen = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      doctor_id,
      user_id,
      ngay_dat_lich,
      gio_dat_lich,
      ten_benh_nhan,
      email,
      gioi_tinh,
      ngay_sinh,
      so_dien_thoai,
      ly_do_kham
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!doctor_id || !ngay_dat_lich || !gio_dat_lich || !ten_benh_nhan || !email || !so_dien_thoai) {
      res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
      return;
    }

    // Kiểm tra xem bác sĩ có tồn tại không
    const doctorExists = await AppDataSource.query(
      'SELECT id FROM doctors WHERE id = $1',
      [doctor_id]
    );

    if (doctorExists.length === 0) {
      res.status(400).json({ error: 'Không tìm thấy bác sĩ' });
      return;
    }
    
    const result = await AppDataSource.query(
      `INSERT INTO appointments (
        doctor_id, user_id, ngay_dat_lich, gio_dat_lich,
        ten_benh_nhan, email, gioi_tinh, ngay_sinh,
        so_dien_thoai, ly_do_kham, trang_thai
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        doctor_id,
        user_id || null, // Cho phép user_id là null
        ngay_dat_lich,
        gio_dat_lich,
        ten_benh_nhan,
        email,
        gioi_tinh || null,
        ngay_sinh || null,
        so_dien_thoai,
        ly_do_kham || null,
        'chờ xác nhận'
      ]
    );

    const lichHen: LichHen = result[0];
    res.status(201).json(lichHen);
  } catch (error) {
    console.error('Lỗi khi tạo lịch hẹn mới:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Cập nhật lịch hẹn
export const updateLichHen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      ngay_dat_lich,
      gio_dat_lich,
      ten_benh_nhan,
      email,
      gioi_tinh,
      ngay_sinh,
      so_dien_thoai,
      ly_do_kham,
      trang_thai
    } = req.body;

    const result = await AppDataSource.query(
      `UPDATE appointments SET 
        ngay_dat_lich = $1, gio_dat_lich = $2,
        ten_benh_nhan = $3, email = $4,
        gioi_tinh = $5, ngay_sinh = $6, so_dien_thoai = $7,
        ly_do_kham = $8, trang_thai = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 RETURNING *`,
      [
        ngay_dat_lich, gio_dat_lich,
        ten_benh_nhan, email,
        gioi_tinh, ngay_sinh, so_dien_thoai,
        ly_do_kham, trang_thai, id
      ]
    );

    if (result.length === 0) {
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
      return;
    }

    const lichHen: LichHen = result[0];
    res.json(lichHen);
  } catch (error) {
    console.error('Lỗi khi cập nhật lịch hẹn:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Xóa lịch hẹn
export const deleteLichHen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await AppDataSource.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);

    if (result.length === 0) {
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
      return;
    }

    res.json({ message: 'Xóa lịch hẹn thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa lịch hẹn:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

export const getLichHenByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await AppDataSource.query(
      `SELECT 
        a.*,
        d.name as doctor_name,
        d.phone as doctor_phone,
        d.co_so_kham as co_so_kham
      FROM appointments a 
      LEFT JOIN doctors d ON a.doctor_id = d.id 
      WHERE a.user_id = $1
      ORDER BY a.ngay_dat_lich DESC, a.gio_dat_lich DESC`,
      [userId]
    );
    
    if (result.length === 0) {
      res.json([]); // Trả về mảng rỗng nếu không có lịch hẹn
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lịch hẹn theo user:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
}; 