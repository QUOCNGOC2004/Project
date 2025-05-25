import React, { useState } from 'react';
import '../../css/forDatLich/form3.css';

interface Appointment {
  id: number;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  doctor_name: string;
  co_so_kham: string;
  doctor_phone: string;
  ly_do_kham: string;
}

interface Form3Props {
  appointment: Appointment;
  cardColor: string;
  onCancel: (id: number) => void;
}

const Form3: React.FC<Form3Props> = ({ appointment, cardColor, onCancel }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleDetailClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCancelClick = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      setIsCancelling(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_APPOINTMENT_API_URL}/appointments/${appointment.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Không thể hủy lịch hẹn');
        }

        onCancel(appointment.id);
      } catch (error) {
        console.error('Lỗi khi hủy lịch hẹn:', error);
        alert('Có lỗi xảy ra khi hủy lịch hẹn');
      } finally {
        setIsCancelling(false);
      }
    }
  };

  return (
    <>
      <div className="appointment-card">
        <div className="appointment-card-header" style={{ backgroundColor: cardColor }}>
          <h3>Thông Tin Lịch Hẹn</h3>
        </div>
        <div className="appointment-info">
          <p><strong>Ngày khám:</strong> {formatDate(appointment.ngay_dat_lich)}</p>
          <p><strong>Giờ khám:</strong> {appointment.gio_dat_lich}</p>
          <p><strong>Bác sĩ:</strong> {appointment.doctor_name}</p>
          <p><strong>Cơ sở khám:</strong> {appointment.co_so_kham}</p>
          <p><strong>SĐT bác sĩ:</strong> {appointment.doctor_phone}</p>
        </div>
        <div className="appointment-actions">
          <button className="detail-button" onClick={handleDetailClick}>
            Chi tiết
          </button>
          <button className="edit-button">
            Sửa
          </button>
          <button 
            className="cancel-button" 
            onClick={handleCancelClick}
            disabled={isCancelling}
          >
            {isCancelling ? 'Đang hủy...' : 'Hủy'}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Chi tiết lý do khám</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <p>{appointment.ly_do_kham}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Form3;
