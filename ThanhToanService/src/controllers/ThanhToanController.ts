import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ThanhToan } from '../entity/ThanhToan';
import { 
  cacheThanhToans, 
  cacheThanhToan, 
  cacheUserThanhToans,
  invalidateThanhToanCache 
} from '../services/CacheService';

// Lấy danh sách thanh toán
export const getAllThanhToan = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Kiểm tra cache
    const cachedData = await cacheThanhToans.getAll();
    if (cachedData) {
      res.json(cachedData);
      return;
    }

    const result = await AppDataSource.query('SELECT * FROM thanh_toan ORDER BY invoice_created_at DESC');
    const thanhToans: ThanhToan[] = result;
    
    // Lưu vào cache
    await cacheThanhToans.setAll(thanhToans);
    
    res.json(thanhToans);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thanh toán:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Lấy thanh toán theo ID
export const getThanhToanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Kiểm tra cache
    const cachedData = await cacheThanhToan.get(id);
    if (cachedData) {
      res.json(cachedData);
      return;
    }

    const result = await AppDataSource.query('SELECT * FROM thanh_toan WHERE id = $1', [id]);
    
    if (result.length === 0) {
      res.status(404).json({ error: 'Không tìm thấy thông tin thanh toán' });
      return;
    }

    const thanhToan: ThanhToan = result[0];
    
    // Lưu vào cache
    await cacheThanhToan.set(id, thanhToan);
    
    res.json(thanhToan);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin thanh toán:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Tạo thanh toán mới (mô phỏng tạo invoice cho một lịch hẹn)
export const createThanhToan = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      user_id,
      appointment_id,
      bank_name,
      account_holder,
      account_number,
      is_default,
      invoice_code,
      total_amount,
      service_details
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!user_id || !appointment_id || !invoice_code || !total_amount) {
      res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
      return;
    }

    // Kiểm tra xem lịch hẹn có tồn tại không
    const appointmentExists = await AppDataSource.query(
      'SELECT id FROM appointments WHERE id = $1',
      [appointment_id]
    );

    if (appointmentExists.length === 0) {
      res.status(400).json({ error: 'Không tìm thấy lịch hẹn' });
      return;
    }

    // Kiểm tra xem user có tồn tại không
    const userExists = await AppDataSource.query(
      'SELECT id FROM users WHERE id = $1',
      [user_id]
    );

    if (userExists.length === 0) {
      res.status(400).json({ error: 'Không tìm thấy người dùng' });
      return;
    }
    
    const result = await AppDataSource.query(
      `INSERT INTO thanh_toan (
        user_id, bank_name, account_holder, account_number, is_default,
        appointment_id, invoice_code, total_amount, service_details
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        user_id,
        bank_name || null,
        account_holder || null,
        account_number || null,
        is_default || true,
        appointment_id,
        invoice_code,
        total_amount,
        service_details || null
      ]
    );

    const thanhToan: ThanhToan = result[0];
    
    // Xóa cache liên quan
    await invalidateThanhToanCache(thanhToan.id.toString(), user_id);
    
    res.status(201).json(thanhToan);
  } catch (error) {
    console.error('Lỗi khi tạo thanh toán mới:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Cập nhật thanh toán (ví dụ: cập nhật status sau khi mô phỏng thanh toán thành công)
export const updateThanhToan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    // Lọc các trường được gửi lên trong body
    const allowedFields = [
      'bank_name', 'account_holder', 'account_number', 'is_default',
      'invoice_code', 'total_amount', 'service_details', 'payment_date', 'transaction_id'
    ];
    
    // Xây dựng câu lệnh UPDATE động
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        updateValues.push(req.body[field]);
        paramIndex++;
      }
    }

    // Luôn thêm bank_account_updated_at (tương tự updated_at)
    updateFields.push(`bank_account_updated_at = CURRENT_TIMESTAMP`);

    // Kiểm tra nếu không có trường nào để cập nhật
    if (updateFields.length === 1 && updateFields[0] === 'bank_account_updated_at = CURRENT_TIMESTAMP') {
      res.status(400).json({ error: 'Không có thông tin nào để cập nhật' });
      return;
    }

    // Thêm ID vào cuối danh sách tham số
    updateValues.push(id);
    
    const updateQuery = `
      UPDATE thanh_toan SET 
        ${updateFields.join(', ')} 
      WHERE id = $${paramIndex} RETURNING *
    `;

    const result = await AppDataSource.query(updateQuery, updateValues);

    if (result.length === 0) {
      res.status(404).json({ error: 'Không tìm thấy thông tin thanh toán' });
      return;
    }

    const thanhToan: ThanhToan = result[0];
    
    // Xóa cache liên quan
    await invalidateThanhToanCache(id, thanhToan.user_id.toString());
    
    res.json(thanhToan);
  } catch (error) {
    console.error('Lỗi khi cập nhật thanh toán:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Xóa thanh toán
export const deleteThanhToan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Lấy thông tin thanh toán trước khi xóa để có user_id
    const thanhToanInfo = await AppDataSource.query('SELECT user_id FROM thanh_toan WHERE id = $1', [id]);
    
    const result = await AppDataSource.query('DELETE FROM thanh_toan WHERE id = $1 RETURNING *', [id]);

    if (result.length === 0) {
      res.status(404).json({ error: 'Không tìm thấy thông tin thanh toán' });
      return;
    }

    // Xóa cache liên quan
    await invalidateThanhToanCache(id, thanhToanInfo[0]?.user_id);

    res.json({ message: 'Xóa thanh toán thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa thanh toán:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Lấy danh sách thanh toán theo user ID
export const getThanhToanByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    // Kiểm tra cache
    const cachedData = await cacheUserThanhToans.get(userId);
    if (cachedData) {
      res.json(cachedData);
      return;
    }

    const result = await AppDataSource.query(
      `SELECT 
        t.*,
        a.ten_benh_nhan as patient_name,
        a.ngay_dat_lich as appointment_date,
        d.name as doctor_name
      FROM thanh_toan t 
      LEFT JOIN appointments a ON t.appointment_id = a.id 
      LEFT JOIN doctors d ON a.doctor_id = d.id 
      WHERE t.user_id = $1
      ORDER BY t.invoice_created_at DESC`,
      [userId]
    );
    
    if (result.length === 0) {
      res.json([]);
      return;
    }

    // Lưu vào cache
    await cacheUserThanhToans.set(userId, result);

    res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thanh toán theo user:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};