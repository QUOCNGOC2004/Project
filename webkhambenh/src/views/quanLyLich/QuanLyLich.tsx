import React, { useState, useEffect } from 'react';
import './QuanLyLich.css';
import Form3 from '../../components/forQuanLyLich/form3';
import { Appointment } from '../../components/forQuanLyLich/appointmentTypes'; 
import { StatusFilter } from '../../components/forQuanLyLich/StatusFilter'; 
import { isLoggedIn, getCurrentUser, logout } from '../../ktraLogin';

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
      setAppointments([]); 
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

      <StatusFilter 
        selectedStatus={selectedStatus}
        onChange={setSelectedStatus}
      />

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