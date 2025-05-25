import React from 'react';
import '../../views/css/QuanLyLich.css';
import Form3 from '../../components/js/forDatLich/form3';

interface Appointment {
  id: number;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  doctor_name: string;
  co_so_kham: string;
  doctor_phone: string;
}

const QuanLyLich: React.FC = () => {
  // Dữ liệu mẫu để hiển thị
  const appointments: Appointment[] = [
    {
      id: 1,
      ngay_dat_lich: '2024-03-20',
      gio_dat_lich: '09:00',
      doctor_name: 'PGS.TS. BS Nguyễn Thanh Hồi',
      co_so_kham: 'Bệnh viện Đại học Phenikaa',
      doctor_phone: '0901234567'
    },
    {
      id: 2,
      ngay_dat_lich: '2024-03-21',
      gio_dat_lich: '14:30',
      doctor_name: 'GS.TS. BS. Đỗ Quyết',
      co_so_kham: 'Phòng khám Đa khoa Đại học Phenikaa',
      doctor_phone: '0987654321'
    },
    {
      id: 3,
      ngay_dat_lich: '2024-03-22',
      gio_dat_lich: '10:15',
      doctor_name: 'PGS.TS. BSNT Vũ Hồng Thăng',
      co_so_kham: 'Bệnh viện Đại học Phenikaa',
      doctor_phone: '0912345678'
    }
  ];

  // Hàm tạo màu ngẫu nhiên
  const getRandomColor = () => {
    const letters = '0123456789abc'; 
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
