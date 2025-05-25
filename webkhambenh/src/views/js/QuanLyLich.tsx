import React, { useState, useEffect } from 'react';
import '../../views/css/QuanLyLich.css';
import Form3 from '../../components/js/forDatLich/form3';
import { isLoggedIn, getCurrentUser } from '../../ktraLogin';

interface Appointment {
  id: number;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  doctor_name: string;
  doctor_phone: string;
  co_so_kham: string;
  ten_benh_nhan: string;
  email: string;
  gioi_tinh: string;
  ngay_sinh: string;
  so_dien_thoai: string;
  ly_do_kham: string;
  trang_thai: string;
}

const QuanLyLich: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    if (!isLoggedIn()) {
      setError('Vui lòng đăng nhập để xem lịch hẹn');
      setLoading(false);
      setAppointments([]); // Reset appointments khi chưa đăng nhập
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError('Không thể lấy thông tin người dùng');
      setLoading(false);
      setAppointments([]); // Reset appointments khi không lấy được thông tin user
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_APPOINTMENT_API_URL}/appointments/user/${currentUser.id}`);
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách lịch hẹn');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách lịch hẹn:', err);
      setError('Có lỗi xảy ra khi lấy danh sách lịch hẹn');
      setAppointments([]); // Reset appointments khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Thêm event listener cho sự kiện đăng xuất
    const handleLogout = () => {
      setAppointments([]); // Reset appointments
      setError('Vui lòng đăng nhập để xem lịch hẹn');
      setLoading(false);
    };

    document.addEventListener('loginStatusChanged', handleLogout);

    // Cleanup function
    return () => {
      document.removeEventListener('loginStatusChanged', handleLogout);
    };
  }, []);

  // Hàm tạo màu ngẫu nhiên
  const getRandomColor = () => {
    const letters = '0123456789abc'; 
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  if (loading) {
    return (
      <div className="appointment-management">
        <div className="loading">Đang tải danh sách lịch hẹn...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointment-management">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="appointment-management">
      <div className="management-title">
        <h1 className="management-title-heading">Quản Lý Lịch Hẹn</h1>
        <p className="management-title-description">Kiểm tra thông tin đặt lịch hẹn</p>
      </div>
      
      {appointments.length === 0 ? (
        <div className="no-appointments">Không có lịch khám</div>
      ) : (
        <div className="appointment-grid">
          {appointments.map((appointment) => {
            const cardColor = getRandomColor();
            return (
              <Form3 
                key={appointment.id} 
                appointment={appointment} 
                cardColor={cardColor} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuanLyLich;
