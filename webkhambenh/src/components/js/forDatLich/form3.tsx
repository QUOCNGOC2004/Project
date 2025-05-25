import React from 'react';
import '../../css/forDatLich/form3.css';

interface Appointment {
  id: number;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  doctor_name: string;
  ly_do_kham: string;
  trang_thai: string;
}

interface Form3Props {
  appointment: Appointment;
  cardColor: string;
}

const Form3: React.FC<Form3Props> = ({ appointment, cardColor }) => {
  return (
    <div className="appointment-card">
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
};

export default Form3;
