import React, { useState, useEffect } from 'react';
import '../../views/css/QuanLyLich.css';
import Form3 from '../../components/js/forQuanLyLich/form3';
import { isLoggedIn, getCurrentUser,logout } from '../../ktraLogin';

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

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    try {
      // Thêm Authorization header vào yêu cầu fetch
      const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/user/${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Nếu nhận được lỗi 401, có thể token đã hết hạn
        if (response.status === 401) {
          logout(); // Đăng xuất người dùng
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
    fetchAppointments(); // Refresh lại danh sách lịch hẹn sau khi cập nhật
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

  // Lọc danh sách lịch hẹn theo trạng thái
  const pendingAppointments = appointments.filter(a => a.trang_thai === 'chờ xác nhận');
  const paidAppointments = appointments.filter(a => a.trang_thai === 'đã thanh toán');
  const otherAppointments = appointments.filter(a => a.trang_thai !== 'chờ xác nhận' && a.trang_thai !== 'đã thanh toán');

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

      {/* Phần Lịch hẹn Chờ xác nhận */}
      <div className="management-section">
        <h2 className="section-title">Chờ xác nhận</h2>
        {pendingAppointments.length === 0 ? (
          <div className="no-appointments">Không có lịch khám nào đang chờ xác nhận.</div>
        ) : (
          <div className="appointment-grid">
            {pendingAppointments.map((appointment) => (
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

      <hr className="section-divider" />

      {/* Phần Lịch hẹn Đã thanh toán */}
      <div className="management-section">
        <h2 className="section-title">Đã thanh toán</h2>
        {paidAppointments.length === 0 ? (
          <div className="no-appointments-paid">
            Chưa có lịch hẹn nào đã thanh toán, vui lòng kiểm tra mục thanh toán.
          </div>
        ) : (
          <div className="appointment-grid">
            {paidAppointments.map((appointment) => (
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

      {/* Các lịch hẹn có trạng thái khác (chưa phát triển) */}
      {otherAppointments.length > 0 && (
        <>
          <hr className="section-divider" />
          <div className="management-section">
            <h2 className="section-title">Các lịch hẹn khác</h2>
            <div className="appointment-grid">
              {otherAppointments.map((appointment) => (
                <Form3
                  key={appointment.id}
                  appointment={appointment}
                  cardColor={getRandomColor()}
                  onCancel={handleCancelAppointment}
                  onUpdate={handleUpdateAppointment}
                />
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default QuanLyLich;