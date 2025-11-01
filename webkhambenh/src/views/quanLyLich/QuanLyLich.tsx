import React, { useState, useEffect } from 'react';
import './QuanLyLich.css';
import Form3 from '../../components/forQuanLyLich/form3';
import { isLoggedIn, getCurrentUser, logout } from '../../ktraLogin';

interface Appointment {
  id: number;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  doctor_name: string;
  doctor_phone: string;
  mo_ta_bac_si: string;
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
  const [selectedStatus, setSelectedStatus] = useState<string>('chờ xác nhận');

  const fetchAppointments = async () => {
    if (!isLoggedIn()) {
      setError('Vui lòng đăng nhập để xem lịch hẹn');
      setLoading(false);
      setAppointments([]);
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError('Không thể lấy thông tin người dùng');
      setLoading(false);
      setAppointments([]);
      return;
    }

    const token = localStorage.getItem('user_token');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/user/${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout(); 
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          return;
        }
        throw new Error('Không thể lấy danh sách lịch hẹn');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách lịch hẹn:', err);
      setError('Có lỗi xảy ra khi lấy danh sách lịch hẹn');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = (id: number) => {
    setAppointments(prevAppointments =>
      prevAppointments.filter(appointment => appointment.id !== id)
    );
  };

  const handleUpdateAppointment = () => {
    fetchAppointments(); // Refresh lại danh sách
  };

  useEffect(() => {
    fetchAppointments();

    const handleLogout = () => {
      setAppointments([]); // Reset appointments
      setError('Vui lòng đăng nhập để xem lịch hẹn');
      setLoading(false);
    };

    document.addEventListener('loginStatusChanged', handleLogout);

    return () => {
      document.removeEventListener('loginStatusChanged', handleLogout);
    };
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789abc';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  const filteredAppointments = appointments.filter(a => a.trang_thai === selectedStatus);


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

      {/* Dropdown lọc trạng thái */}
      <div className="filter-container">
        <label htmlFor="status-filter" className="filter-label">Hiển thị lịch hẹn:</label>
        <select 
          id="status-filter" 
          className="status-dropdown" 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="chờ xác nhận">Chờ xác nhận</option>
          <option value="đã xác nhận">Đã xác nhận</option>
          <option value="chưa thanh toán">Chưa thanh toán</option>
          <option value="đã thanh toán">Đã thanh toán</option>
        </select>
      </div>

      {/* Hiển thị lưới dựa trên kết quả lọc */}
      <div className="management-section">
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            Không có lịch hẹn nào "{selectedStatus}".
          </div>
        ) : (
          <div className="appointment-grid">
            {filteredAppointments.map((appointment) => (
              <Form3
                key={appointment.id}
                appointment={appointment}
                cardColor={getRandomColor()}
                onCancel={handleCancelAppointment}
                onUpdate={handleUpdateAppointment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuanLyLich;