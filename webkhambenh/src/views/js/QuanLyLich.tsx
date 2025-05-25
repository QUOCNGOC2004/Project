import React from 'react';
import '../../views/css/QuanLyLich.css';
import Form3 from '../../components/js/forDatLich/form3'; // Import Form3 component

interface Appointment {
  id: number;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  doctor_name: string;
  ly_do_kham: string;
  trang_thai: string;
}

const QuanLyLich: React.FC = () => {
  // Dữ liệu mẫu để hiển thị
  const appointments: Appointment[] = [
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
            <Form3 
              key={appointment.id} 
              appointment={appointment} 
              cardColor={cardColor} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuanLyLich;
