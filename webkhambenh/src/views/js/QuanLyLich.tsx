import React from 'react';
import '../../views/css/QuanLyLich.css';

const QuanLyLich: React.FC = () => {
  // Dữ liệu mẫu để hiển thị
  const appointments = [
    {
      id: 1,
      ngay_dat_lich: '2024-03-20',
      gio_dat_lich: '09:00',
      doctor_name: 'Bác sĩ Nguyễn Văn A',
      ly_do_kham: 'Khám tổng quát',
      trang_thai: 'Chờ xác nhận'
    },
    {
      id: 2,
      ngay_dat_lich: '2024-03-21',
      gio_dat_lich: '14:30',
      doctor_name: 'Bác sĩ Trần Thị B',
      ly_do_kham: 'Tư vấn sức khỏe',
      trang_thai: 'Đã xác nhận'
    },
    {
      id: 3,
      ngay_dat_lich: '2024-03-22',
      gio_dat_lich: '10:15',
      doctor_name: 'Bác sĩ Lê Văn C',
      ly_do_kham: 'Khám chuyên khoa',
      trang_thai: 'Chờ xác nhận'
    }
  ];

  // Hàm tạo màu ngẫu nhiên (màu nhạt để chữ dễ đọc)
  const getRandomColor = () => {
    const letters = '0123456789abc'; // Sử dụng các ký tự tạo màu đậm hơn
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  return (
    <div className="appointment-management">
      <div className="management-title">
        <h1 className="management-title-heading">Quản Lý Lịch Hẹn</h1>
        <p className="management-title-description">Kiểm tra thông tin đặt lịch hẹn</p>
      </div>
      
      <div className="appointment-grid">
        {appointments.map((appointment) => {
          const cardColor = getRandomColor();
          return (
            <div key={appointment.id} className="appointment-card">
              {/* Header card with random background color */}
              <div className="appointment-card-header" style={{ backgroundColor: cardColor }}>
                <h3>Thông Tin Lịch Hẹn</h3>
              </div>
              {/* Appointment details section */}
              <div className="appointment-info">
                <p><strong>Ngày khám:</strong> {appointment.ngay_dat_lich}</p>
                <p><strong>Giờ khám:</strong> {appointment.gio_dat_lich}</p>
                <p><strong>Bác sĩ:</strong> {appointment.doctor_name}</p>
                <p><strong>Lý do khám:</strong> {appointment.ly_do_kham}</p>
                <p><strong>Trạng thái:</strong> {appointment.trang_thai}</p>
              </div>
              <div className="appointment-actions">
                <button className="edit-button">
                  Sửa
                </button>
                <button className="cancel-button">
                  Hủy
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuanLyLich;
