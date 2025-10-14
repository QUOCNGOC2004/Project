import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { LichHen } from '../entity/LichHen';
import { logActivity } from '../utils/logger'; 

// Lấy danh sách lịch hẹn
export const getAllLichHen = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await AppDataSource.query('SELECT * FROM appointments ORDER BY ngay_dat_lich, gio_dat_lich');
    const lichHen: LichHen[] = result;
    logActivity(req, req.user?.id || null, 'lấy tất cả lịch hẹn', { count: lichHen.length });
    res.json(lichHen);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
    logActivity(req, req.user?.id || null, 'GET_ALL_APPOINTMENTS_ERROR', { error: (error as Error).message });
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Lấy lịch hẹn theo ID
export const getLichHenById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id; 

    if (!user_id) { 
      res.status(401).json({ error: 'Xác thực không hợp lệ.' });
      return;
    }
    
    
    const result = await AppDataSource.query('SELECT * FROM appointments WHERE id = $1 AND user_id = $2', [id, user_id]);
    
    if (result.length === 0) {
      logActivity(req, user_id, 'GET_APPOINTMENT_BY_ID_NOT_FOUND', { appointmentId: id });
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn hoặc bạn không có quyền truy cập.' });
      return;
    }

    const lichHen: LichHen = result[0];
    
    logActivity(req, user_id, 'GET_APPOINTMENT_BY_ID_SUCCESS', { appointmentId: id });
    res.json(lichHen);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin lịch hẹn:', error);
    logActivity(req, req.user?.id || null, 'GET_APPOINTMENT_BY_ID_ERROR', { appointmentId: req.params.id, error: (error as Error).message });
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Tạo lịch hẹn mới
export const createLichHen = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.user?.id; 

    if (!user_id) {
      logActivity(req, null, 'tạo lịch hẹn thất bại', { reason: 'Không có thông tin người dùng từ token' });
      res.status(401).json({ error: 'Xác thực không hợp lệ.' });
      return;
    }

    const {
      doctor_id,
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
      // Log cho hành động tạo lịch hẹn thất bại do thiếu thông tin
      logActivity(req, user_id, 'tạo lịch hẹn thất bại', { reason: 'Thiếu thông tin bắt buộc' });
      res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
      return;
    }

    // Kiểm tra xem bác sĩ có tồn tại không
    const doctorExists = await AppDataSource.query(
      'SELECT id FROM doctors WHERE id = $1',
      [doctor_id]
    );

    if (doctorExists.length === 0) {
      // Log cho hành động tạo lịch hẹn thất bại do bác sĩ không tồn tại
      logActivity(req, user_id, 'tạo lịch hẹn thất bại', { reason: 'Không tìm thấy bác sĩ', doctorId: doctor_id });
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
        user_id, 
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
 
    // Log cho hành động tạo lịch hẹn thành công
    logActivity(req, user_id, 'tạo lịch hẹn thành công', { appointmentId: lichHen.id, doctorId: doctor_id });
    res.status(201).json(lichHen);
  } catch (error) {
    console.error('Lỗi khi tạo lịch hẹn mới:', error);
    logActivity(req, req.user?.id || null, 'CREATE_APPOINTMENT_ERROR', { error: (error as Error).message });
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

export const updateLichHen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id; 

    if (!user_id) {
      res.status(401).json({ error: 'Xác thực không hợp lệ.' });
      return;
    }

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

    // Thêm id và user_id vào cuối mảng giá trị cho mệnh đề WHERE
    updateValues.push(id, user_id);
    
    const updateQuery = `
      UPDATE appointments SET 
        ${updateFields.join(', ')} 
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *
    `;

    const result = await AppDataSource.query(updateQuery, updateValues);

    if (result.length === 0) {
      logActivity(req, user_id, 'UPDATE_APPOINTMENT_NOT_FOUND', { appointmentId: id });
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn hoặc bạn không có quyền sửa.' });
      return;
    }

    const lichHen: LichHen = result[0];
    
    logActivity(req, user_id, 'UPDATE_APPOINTMENT_SUCCESS', { appointmentId: id, updatedFields: Object.keys(req.body) });
    res.json(lichHen);
  } catch (error) {
    console.error('Lỗi khi cập nhật lịch hẹn:', error);
    logActivity(req, req.user?.id || null, 'UPDATE_APPOINTMENT_ERROR', { appointmentId: req.params.id, error: (error as Error).message });
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Xóa lịch hẹn
export const deleteLichHen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id; 

    if (!user_id) {
        res.status(401).json({ error: 'Xác thực không hợp lệ.' });
        return;
    }
    
  
    const result = await AppDataSource.query('DELETE FROM appointments WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);

    if (result.length === 0) {
      logActivity(req, user_id, 'DELETE_APPOINTMENT_NOT_FOUND', { appointmentId: id });
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn hoặc bạn không có quyền xóa.' });
      return;
    }

    
    logActivity(req, user_id, 'xóa lịch hẹn thành công', {});
    res.json({ message: 'Xóa lịch hẹn thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa lịch hẹn:', error);
    logActivity(req, req.user?.id || null, 'DELETE_APPOINTMENT_ERROR', { appointmentId: req.params.id, error: (error as Error).message });
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

export const getLichHenByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ error: 'Xác thực không hợp lệ.' });
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
      [user_id] 
    );
    
    logActivity(req, user_id, 'lấy lịch hẹn theo user_id', { count: result.length });
    
    if (result.length === 0) {
      res.json([]);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lịch hẹn theo user:', error);
    logActivity(req, req.user?.id || null, 'GET_APPOINTMENTS_BY_USER_ID_ERROR', { error: (error as Error).message });
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};
