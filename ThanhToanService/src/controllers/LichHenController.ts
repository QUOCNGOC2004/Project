import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { LichHen } from '../entity/LichHen';
import { 
  cacheAppointments, 
  cacheAppointment, 
  cacheUserAppointments,
  invalidateAppointmentCache 
} from '../services/CacheService';

// Lấy danh sách lịch hẹn
export const getAllLichHen = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Kiểm tra cache
    const cachedData = await cacheAppointments.getAll();
    if (cachedData) {
      res.json(cachedData);
      return;
    }

    const result = await AppDataSource.query('SELECT * FROM appointments ORDER BY ngay_dat_lich, gio_dat_lich');
    const lichHen: LichHen[] = result;
    
    // Lưu vào cache
    await cacheAppointments.setAll(lichHen);
    
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
    
    // Kiểm tra cache
    const cachedData = await cacheAppointment.get(id);
    if (cachedData) {
      res.json(cachedData);
      return;
    }

    const result = await AppDataSource.query('SELECT * FROM appointments WHERE id = $1', [id]);
    
    if (result.length === 0) {
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
      return;
    }

    const lichHen: LichHen = result[0];
    
    // Lưu vào cache
    await cacheAppointment.set(id, lichHen);
    
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
        user_id || null,
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
    
    // Xóa cache liên quan
    await invalidateAppointmentCache(lichHen.id.toString(), user_id);
    
    res.status(201).json(lichHen);
  } catch (error) {
    console.error('Lỗi khi tạo lịch hẹn mới:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Cập nhật lịch hẹn
// Cập nhật lịch hẹn
export const updateLichHen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    // Lọc các trường được gửi lên trong body
    const allowedFields = [
      'ngay_dat_lich', 'gio_dat_lich', 'ten_benh_nhan', 'email',
      'gioi_tinh', 'ngay_sinh', 'so_dien_thoai', 'ly_do_kham', 'trang_thai'
    ];
    
    // Xây dựng câu lệnh UPDATE động
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        updateValues.push(req.body[field]);
        paramIndex++;
      }
    }

    // Luôn thêm updated_at
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    // Kiểm tra nếu không có trường nào để cập nhật
    if (updateFields.length === 1 && updateFields[0] === 'updated_at = CURRENT_TIMESTAMP') {
      res.status(400).json({ error: 'Không có thông tin nào để cập nhật' });
      return;
    }

    // Thêm ID vào cuối danh sách tham số
    updateValues.push(id);
    
    const updateQuery = `
      UPDATE appointments SET 
        ${updateFields.join(', ')} 
      WHERE id = $${paramIndex} RETURNING *
    `;

    const result = await AppDataSource.query(updateQuery, updateValues);

    if (result.length === 0) {
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
      return;
    }

    const lichHen: LichHen = result[0];
    
    // Xóa cache liên quan
    await invalidateAppointmentCache(id, lichHen.user_id?.toString());
    
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
    
    // Lấy thông tin lịch hẹn trước khi xóa để có user_id
    const appointment = await AppDataSource.query('SELECT user_id FROM appointments WHERE id = $1', [id]);
    
    const result = await AppDataSource.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);

    if (result.length === 0) {
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
      return;
    }

    // Xóa cache liên quan
    await invalidateAppointmentCache(id, appointment[0]?.user_id);

    res.json({ message: 'Xóa lịch hẹn thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa lịch hẹn:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

export const getLichHenByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    // Kiểm tra cache
    const cachedData = await cacheUserAppointments.get(userId);
    if (cachedData) {
      res.json(cachedData);
      return;
    }

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
      res.json([]);
      return;
    }

    // Lưu vào cache
    await cacheUserAppointments.set(userId, result);

    res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lịch hẹn theo user:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
}; 