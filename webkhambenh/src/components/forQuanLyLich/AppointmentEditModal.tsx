import React, { useState } from 'react';
import { Appointment } from './appointmentTypes';
import { logout } from '../../ktraLogin'; 
import { useHistory } from 'react-router-dom'; 
import './AppointmentEditModal.css';

interface AppointmentEditModalProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdate: () => void;
}

export const AppointmentEditModal: React.FC<AppointmentEditModalProps> = ({ appointment, onClose, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState({
    ngay_dat_lich: appointment.ngay_dat_lich,
    gio_dat_lich: appointment.gio_dat_lich,
    ten_benh_nhan: appointment.ten_benh_nhan,
    email: appointment.email,
    gioi_tinh: appointment.gioi_tinh,
    ngay_sinh: appointment.ngay_sinh,
    so_dien_thoai: appointment.so_dien_thoai,
    ly_do_kham: appointment.ly_do_kham,
  });
  const history = useHistory();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const token = localStorage.getItem('user_token');
    if (!token) {
        alert('Vui lòng đăng nhập lại.');
        setIsUpdating(false);
        return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        if (response.status === 401) {
            logout();
            history.push('/dang-nhap-dang-ky');
            return; 
        }

        if (response.status === 409) {
          const errorData = await response.json().catch(() => ({ error: 'Slot mới bạn chọn đã kín. Vui lòng chọn giờ khác.' }));
          const apiErrorMessage = errorData.error;
          alert(apiErrorMessage); 
          return;
        }
        
        const errorData = await response.json().catch(() => ({ error: 'Không thể cập nhật lịch hẹn' }));
        throw new Error(errorData.error);
      }

      onUpdate();
      onClose(); // Đóng modal sau khi update thành công
    } catch (error) {
      console.error('Lỗi khi cập nhật lịch hẹn:', error);
      alert(`Có lỗi xảy ra: ${error instanceof Error ? error.message : 'Vui lòng thử lại.'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-overlay1">
      <div className="modal-content edit-modal">
        <div className="modal-header">
          <h3>Sửa lịch hẹn</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleUpdateSubmit} className="edit-form">
          <div className="form-group">
            <label>Ngày đặt lịch:</label>
            <input
              type="date"
              name="ngay_dat_lich"
              value={editData.ngay_dat_lich}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Giờ đặt lịch:</label>
            <input
              type="time"
              name="gio_dat_lich"
              value={editData.gio_dat_lich}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tên bệnh nhân:</label>
            <input
              type="text"
              name="ten_benh_nhan"
              value={editData.ten_benh_nhan}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Giới tính:</label>
            <select
              name="gioi_tinh"
              value={editData.gioi_tinh}
              onChange={handleInputChange}
              required
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ngày sinh:</label>
            <input
              type="date"
              name="ngay_sinh"
              value={editData.ngay_sinh}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại:</label>
            <input
              type="tel"
              name="so_dien_thoai"
              value={editData.so_dien_thoai}
              onChange={handleInputChange}
              required
              pattern="[0-9]{8,13}"
              inputMode="numeric"
            />
          </div>
          <div className="form-group">
            <label>Lý do khám:</label>
            <textarea
              name="ly_do_kham"
              value={editData.ly_do_kham}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>Hủy</button>
            <button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};