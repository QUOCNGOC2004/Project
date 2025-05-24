import { Request, Response } from 'express';
import pool from '../config/database';
import { Appointment } from '../entity/Appointment';

const appointmentController = {
  // Lấy danh sách lịch hẹn
  async getAllAppointments(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query('SELECT * FROM appointments ORDER BY ngay_dat_lich, gio_dat_lich');
      const appointments: Appointment[] = result.rows;
      res.json(appointments);
    } catch (error) {
      console.error('Error getting appointments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Lấy lịch hẹn theo ID
  async getAppointmentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }

      const appointment: Appointment = result.rows[0];
      res.json(appointment);
    } catch (error) {
      console.error('Error getting appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Tạo lịch hẹn mới
  async createAppointment(req: Request, res: Response): Promise<void> {
    try {
      const {
        doctor_id,
        user_id,
        ngay_dat_lich,
        gio_dat_lich,
        co_so_kham,
        chuyen_khoa,
        ten_benh_nhan,
        email,
        gioi_tinh,
        ngay_sinh,
        so_dien_thoai,
        ly_do_kham
      } = req.body;
      
      const result = await pool.query(
        `INSERT INTO appointments (
          doctor_id, user_id, ngay_dat_lich, gio_dat_lich, co_so_kham,
          chuyen_khoa, ten_benh_nhan, email, gioi_tinh, ngay_sinh,
          so_dien_thoai, ly_do_kham, trang_thai
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
          doctor_id, user_id, ngay_dat_lich, gio_dat_lich, co_so_kham,
          chuyen_khoa, ten_benh_nhan, email, gioi_tinh, ngay_sinh,
          so_dien_thoai, ly_do_kham, 'pending'
        ]
      );

      const appointment: Appointment = result.rows[0];
      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Cập nhật lịch hẹn
  async updateAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        ngay_dat_lich,
        gio_dat_lich,
        co_so_kham,
        chuyen_khoa,
        ten_benh_nhan,
        email,
        gioi_tinh,
        ngay_sinh,
        so_dien_thoai,
        ly_do_kham,
        trang_thai
      } = req.body;

      const result = await pool.query(
        `UPDATE appointments SET 
          ngay_dat_lich = $1, gio_dat_lich = $2, co_so_kham = $3,
          chuyen_khoa = $4, ten_benh_nhan = $5, email = $6,
          gioi_tinh = $7, ngay_sinh = $8, so_dien_thoai = $9,
          ly_do_kham = $10, trang_thai = $11, updated_at = CURRENT_TIMESTAMP
        WHERE id = $12 RETURNING *`,
        [
          ngay_dat_lich, gio_dat_lich, co_so_kham,
          chuyen_khoa, ten_benh_nhan, email,
          gioi_tinh, ngay_sinh, so_dien_thoai,
          ly_do_kham, trang_thai, id
        ]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }

      const appointment: Appointment = result.rows[0];
      res.json(appointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Xóa lịch hẹn
  async deleteAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }

      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default appointmentController; 