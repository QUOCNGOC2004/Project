import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';

// Lấy thông báo
export const getNotificationsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Xác thực không hợp lệ.' });
      return;
    }

    // Lấy tất cả thông báo, mới nhất lên đầu
    const notifications = await AppDataSource.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    
    res.json(notifications);

  } catch (error) {
    console.error('Lỗi khi lấy thông báo:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

//  Đánh dấu đã đọc 
export const markNotificationsAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Xác thực không hợp lệ.' });
      return;
    }

    // Đánh dấu tất cả thông báo CHƯA ĐỌC của user này thành ĐÃ ĐỌC
    await AppDataSource.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );
    
    res.json({ success: true, message: 'Đã đánh dấu đã đọc' });

  } catch (error) {
    console.error('Lỗi khi đánh dấu đã đọc:', error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};