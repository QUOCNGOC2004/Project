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
    const requestingUser = req.user;

    if (!requestingUser) {
      res.status(401).json({ error: 'Xác thực không hợp lệ.' });
      return;
    }
    
    let query = 'SELECT * FROM appointments WHERE id = $1';
    const params: (string | number)[] = [id];
    
    // Nếu không phải admin, chỉ cho phép xem lịch hẹn của chính mình
    if (requestingUser.role !== 'admin') {
      query += ' AND user_id = $2';
      params.push(requestingUser.id);
    }

    const result = await AppDataSource.query(query, params);
    
    if (result.length === 0) {
      
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn hoặc bạn không có quyền truy cập.' });
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
  const user_id = req.user?.id; 

  if (!user_id) {
   
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
    
    res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    return;
  }

  try {
    let newAppointment: LichHen;
    await AppDataSource.transaction(async transactionalEntityManager => {
        
        const findSlotQuery = `
          SELECT ts.id
          FROM time_slots ts
          JOIN doctor_schedules ds ON ts.schedule_id = ds.id
          WHERE ds.doctor_id = $1
            AND ds.work_date = $2
            AND ts.slot_time = $3
            AND ts.is_available = TRUE
          FOR UPDATE;
        `;
        const slotResult = await transactionalEntityManager.query(findSlotQuery, [
          doctor_id,
          ngay_dat_lich,
          gio_dat_lich
        ]);

        if (slotResult.length === 0) {
          
          throw new Error('Giờ này đã kín lịch hoặc bác sĩ không có lịch làm việc.');
        }

        const timeSlotId = slotResult[0].id;

        
        const insertAppointmentQuery = `
          INSERT INTO appointments (
            doctor_id, user_id, ngay_dat_lich, gio_dat_lich,
            ten_benh_nhan, email, gioi_tinh, ngay_sinh,
            so_dien_thoai, ly_do_kham, trang_thai
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
        `;
        const appointmentResult = await transactionalEntityManager.query(insertAppointmentQuery, [
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
        ]);

        newAppointment = appointmentResult[0];

        
        const updateSlotQuery = `
          UPDATE time_slots
          SET is_available = FALSE,
              appointment_id = $1
          WHERE id = $2;
        `;
        await transactionalEntityManager.query(updateSlotQuery, [newAppointment.id, timeSlotId]);
    });

    
    res.status(201).json(newAppointment!);

  } catch (error) {
    console.error('Lỗi khi tạo lịch hẹn mới:', error);
    if (error instanceof Error && error.message.includes('kín lịch')) {
      res.status(409).json({ error: error.message });
      return; 
    }
    
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

export const updateLichHen = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user_id = req.user?.id; 

  if (!user_id) {
    res.status(401).json({ error: 'Xác thực không hợp lệ.' });
    return;
  }

  try {
    let updatedAppointment: LichHen;

    await AppDataSource.transaction(async transactionalEntityManager => {
      // 1. Lấy và khóa lịch hẹn hiện tại để kiểm tra
      const currentAppointmentResult = await transactionalEntityManager.query(
        `SELECT * FROM appointments WHERE id = $1 AND user_id = $2 FOR UPDATE`,
        [id, user_id]
      );

      if (currentAppointmentResult.length === 0) {
        throw new Error('404'); 
      }

      const currentAppointment: LichHen = currentAppointmentResult[0];

      
      const newDoctorId = req.body.doctor_id;
      const newNgayDatLich = req.body.ngay_dat_lich;
      const newGioDatLich = req.body.gio_dat_lich;

      
      const isSlotChanging = newDoctorId !== undefined || 
                             newNgayDatLich !== undefined || 
                             newGioDatLich !== undefined;

      let mustChangeSlot = false;
      let targetDoctorId = currentAppointment.doctor_id;
      let targetDate = currentAppointment.ngay_dat_lich;
      let targetTime = currentAppointment.gio_dat_lich;

      if (isSlotChanging) {
        targetDoctorId = newDoctorId || currentAppointment.doctor_id;
        targetDate = newNgayDatLich || currentAppointment.ngay_dat_lich;
        targetTime = newGioDatLich || currentAppointment.gio_dat_lich;

        
        if (targetDoctorId !== currentAppointment.doctor_id || 
            targetDate !== currentAppointment.ngay_dat_lich || 
            targetTime !== currentAppointment.gio_dat_lich) {
          mustChangeSlot = true;
        }
      }
      
      
      if (mustChangeSlot) {
        
        await transactionalEntityManager.query(
          `UPDATE time_slots 
           SET is_available = TRUE, appointment_id = NULL 
           WHERE appointment_id = $1`,
          [currentAppointment.id]
        );

        
        const findSlotQuery = `
          SELECT ts.id
          FROM time_slots ts
          JOIN doctor_schedules ds ON ts.schedule_id = ds.id
          WHERE ds.doctor_id = $1
            AND ds.work_date = $2
            AND ts.slot_time = $3
            AND ts.is_available = TRUE
          FOR UPDATE;
        `;
        const slotResult = await transactionalEntityManager.query(findSlotQuery, [
          targetDoctorId,
          targetDate,
          targetTime
        ]);

        if (slotResult.length === 0) {
          
          throw new Error('409'); 
        }

        const newTimeSlotId = slotResult[0].id;

      
        await transactionalEntityManager.query(
          `UPDATE time_slots 
           SET is_available = FALSE, appointment_id = $1 
           WHERE id = $2`,
          [currentAppointment.id, newTimeSlotId]
        );
      }

     
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      const allowedFields = [
        'doctor_id', 'ngay_dat_lich', 'gio_dat_lich', 'ten_benh_nhan', 'email',
        'gioi_tinh', 'ngay_sinh', 'so_dien_thoai', 'ly_do_kham', 'trang_thai'
      ];
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateFields.push(`${field} = $${paramIndex}`);
          updateValues.push(req.body[field]);
          paramIndex++;
        }
      }

      if (updateFields.length === 0) {
        updatedAppointment = currentAppointment;
        return;
      }

      // Luôn thêm updated_at
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

      // Thêm id và user_id vào cuối mảng giá trị cho mệnh đề WHERE
      updateValues.push(id, user_id);
      
      const updateQuery = `
        UPDATE appointments SET 
          ${updateFields.join(', ')} 
        WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *
      `;

      const updateResult = await transactionalEntityManager.query(updateQuery, updateValues);
      updatedAppointment = updateResult[0];
    });

    
    res.json(updatedAppointment!);

  } catch (error) {
    console.error('Lỗi khi cập nhật lịch hẹn:', error);
    
    // Bắt lỗi tùy chỉnh đã ném
    if (error instanceof Error) {
      if (error.message === '404') {
        
        res.status(404).json({ error: 'Không tìm thấy lịch hẹn hoặc bạn không có quyền sửa.' });
        return;
      }
      if (error.message === '409') {
        
        res.status(409).json({ error: 'Slot mới bạn chọn đã kín. Vui lòng chọn giờ khác.' });
        return;
      }
    }
    
    
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// Xóa lịch hẹn
export const deleteLichHen = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user_id = req.user?.id; 

  if (!user_id) {
      res.status(401).json({ error: 'Xác thực không hợp lệ.' });
      return;
  }

  try {
    await AppDataSource.transaction(async transactionalEntityManager => {
      const appointmentResult = await transactionalEntityManager.query(
        `SELECT id FROM appointments 
         WHERE id = $1 AND user_id = $2 
         FOR UPDATE`, 
        [id, user_id]
      );

      if (appointmentResult.length === 0) {
        throw new Error('404'); 
      }

      const appointmentId = appointmentResult[0].id;

      await transactionalEntityManager.query(
        `UPDATE time_slots 
         SET is_available = TRUE, appointment_id = NULL 
         WHERE appointment_id = $1`,
        [appointmentId]
      );
      await transactionalEntityManager.query(
        `DELETE FROM appointments 
         WHERE id = $1`, 
        [appointmentId]
      );
    });

    res.json({ message: 'Xóa lịch hẹn thành công' });

  } catch (error) {
    console.error('Lỗi khi xóa lịch hẹn:', error);

    if (error instanceof Error && error.message === '404') {
      
      res.status(404).json({ error: 'Không tìm thấy lịch hẹn hoặc bạn không có quyền xóa.' });
      return;
    }

   
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

export const getLichHenByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params; // Lấy userId từ URL
    const requestingUser = req.user;

    if (!requestingUser) {
        res.status(401).json({ error: 'Xác thực không hợp lệ.' });
        return;
    }

    // Nếu người yêu cầu là 'user', họ chỉ có thể xem lịch hẹn của chính mình
    if (requestingUser.role === 'user' && requestingUser.id.toString() !== userId) {
       
        res.status(403).json({ error: 'Bạn không có quyền truy cập tài nguyên này.' });
        return;
    }
    
    // Admin có thể xem của bất kỳ ai, user có thể xem của chính mình
    const targetUserId = parseInt(userId, 10);
    
    const result = await AppDataSource.query(
      `SELECT 
        a.*,
        d.name as doctor_name,
        d.phone as doctor_phone,
        d.mo_ta_bac_si as mo_ta_bac_si
      FROM appointments a 
      LEFT JOIN doctors d ON a.doctor_id = d.id 
      WHERE a.user_id = $1
      ORDER BY a.ngay_dat_lich DESC, a.gio_dat_lich DESC`,
      [targetUserId] // Sử dụng userId từ URL
    );
    
    
    
    if (result.length === 0) {
      res.json([]);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lịch hẹn theo user:', error);
    
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};
