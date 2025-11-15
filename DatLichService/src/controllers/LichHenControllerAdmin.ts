import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';

// Lấy danh sách lịch hẹn
export const getAllLichHen = async (_req: Request, res: Response): Promise<void> => {
  try {
   
    const result = await AppDataSource.query(`
      SELECT 
        a.*,
        d.name AS doctor_name,
        CASE WHEN i.id IS NOT NULL THEN true ELSE false END AS "hasinvoice"
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN invoices i ON a.id = i.appointment_id
      ORDER BY a.ngay_dat_lich, a.gio_dat_lich
    `);
    const lichHen: any[] = result; 
    
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
    const requestingUser = req.user;

    if (!requestingUser) {
      res.status(401).json({ error: 'Xác thực không hợp lệ.' });
      return;
    }
    
    let query = `
      SELECT 
        a.*,
        d.name AS doctor_name,
        CASE WHEN i.id IS NOT NULL THEN true ELSE false END AS "hasinvoice"
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN invoices i ON a.id = i.appointment_id
      WHERE a.id = $1
    `;
    const params: (string | number)[] = [id];
    
    // Nếu không phải admin, chỉ cho phép xem lịch hẹn của chính mình
    if (requestingUser.role !== 'admin') {
      query += ' AND a.user_id = $2';
      params.push(requestingUser.id);
    }

    const result = await AppDataSource.query(query, params);
    
    if (result.length === 0) {
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn hoặc bạn không có quyền truy cập.' });
      return;
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin lịch hẹn:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// sửa trạng thái lịch hẹn
export const updateAppointmentStatusByAdmin = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { trang_thai } = req.body;
  const requestingUser = req.user;

  
  if (requestingUser?.role !== 'admin') {
      res.status(403).json({ error: 'Bạn không có quyền thực hiện hành động này.' });
      return;
  }

  //  Kiểm tra dữ liệu đầu vào
  if (!trang_thai) {
    res.status(400).json({ error: 'Thiếu trường trang_thai' });
    return;
  }

  
  const validStatuses = ['chờ xác nhận', 'đã xác nhận', 'chưa thanh toán', 'đã thanh toán'];
  if (!validStatuses.includes(trang_thai)) {
     res.status(400).json({ error: 'Giá trị trang_thai không hợp lệ' });
     return;
  }

  
  try {
    const updateResult = await AppDataSource.query(
      `UPDATE appointments 
       SET trang_thai = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [trang_thai, id]
    );

    if (updateResult.length === 0) {
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
      return;
    }
    
    
    res.json(updateResult[0]);

  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái lịch hẹn:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

