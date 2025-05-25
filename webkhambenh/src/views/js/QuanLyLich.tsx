import React, { useState, useEffect } from 'react';
import { isLoggedIn, getCurrentUser } from '../../ktraLogin';
import '../../views/css/QuanLyLich.css';

interface Appointment {
  id: number;
  doctor_id: number;
  user_id: number;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  ten_benh_nhan: string;
  email: string;
  gioi_tinh: string;
  ngay_sinh: string;
  so_dien_thoai: string;
  ly_do_kham: string;
  trang_thai: string;
  doctor_name?: string;
}

const QuanLyLich: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      setError('Vui lòng đăng nhập để xem lịch hẹn');
      setLoading(false);
      return;
    }

    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('Không thể lấy thông tin người dùng');
      }

      // Sử dụng API mới để lấy lịch hẹn theo user_id
      const response = await fetch(`${process.env.REACT_APP_APPOINTMENT_API_URL}/api/appointments/user/${currentUser.id}`);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách lịch hẹn');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách lịch hẹn:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lấy danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_APPOINTMENT_API_URL}/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể hủy lịch hẹn');
      }

      // Cập nhật lại danh sách sau khi hủy
      setAppointments(appointments.filter(app => app.id !== appointmentId));
      alert('Đã hủy lịch hẹn thành công');
    } catch (err) {
      console.error('Lỗi khi hủy lịch hẹn:', err);
      alert('Có lỗi xảy ra khi hủy lịch hẹn. Vui lòng thử lại sau.');
    }
  };

  const handleEdit = (appointmentId: number) => {
    // TODO: Implement edit functionality
    alert('Chức năng sửa lịch hẹn đang được phát triển');
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="appointment-management">
      <h1 className="management-title">Quản Lý Lịch Hẹn</h1>
      
      {appointments.length === 0 ? (
        <p className="no-appointments">Bạn chưa có lịch hẹn nào</p>
      ) : (
        <div className="appointment-grid">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-info">
                <h3>Thông Tin Lịch Hẹn</h3>
                <p><strong>Ngày khám:</strong> {appointment.ngay_dat_lich}</p>
                <p><strong>Giờ khám:</strong> {appointment.gio_dat_lich}</p>
                <p><strong>Bác sĩ:</strong> {appointment.doctor_name || 'Đang cập nhật'}</p>
                <p><strong>Lý do khám:</strong> {appointment.ly_do_kham}</p>
                <p><strong>Trạng thái:</strong> {appointment.trang_thai}</p>
              </div>
              <div className="appointment-actions">
                <button 
                  className="edit-button"
                  onClick={() => handleEdit(appointment.id)}
                >
                  Sửa
                </button>
                <button 
                  className="cancel-button"
                  onClick={() => handleCancel(appointment.id)}
                >
                  Hủy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuanLyLich; 