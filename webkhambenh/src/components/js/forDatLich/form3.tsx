import React from 'react';
import '../../css/forDatLich/form3.css';

interface Appointment {
  id: number;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  doctor_name: string;
  co_so_kham: string;
  doctor_phone: string;
}

interface Form3Props {
  appointment: Appointment;
  cardColor: string;
}

const Form3: React.FC<Form3Props> = ({ appointment, cardColor }) => {
  return (
    <div className="appointment-card">
      <div className="appointment-card-header" style={{ backgroundColor: cardColor }}>
        <h3>Thông Tin Lịch Hẹn</h3>
      </div>
      <div className="appointment-info">
        <p><strong>Ngày khám:</strong> {appointment.ngay_dat_lich}</p>
        <p><strong>Giờ khám:</strong> {appointment.gio_dat_lich}</p>
        <p><strong>Bác sĩ:</strong> {appointment.doctor_name}</p>
        <p><strong>Cơ sở khám:</strong> {appointment.co_so_kham}</p>
        <p><strong>SĐT bác sĩ:</strong> {appointment.doctor_phone}</p>
      </div>
      <div className="appointment-actions">
        <button className="detail-button">
          Chi tiết
        </button>
        <button className="edit-button">
          Sửa
        </button>
        <button className="cancel-button">
          Hủy
        </button>
      </div>
    </div>
  );
};

export default Form3;
