import React, { useState } from 'react';
import './form3.css';
import { logout } from '../../ktraLogin'; 
import { useHistory } from 'react-router-dom'; 
import { Appointment } from './appointmentTypes';
import { AppointmentDetailModal } from './AppointmentDetailModal';
import { AppointmentEditModal } from './AppointmentEditModal';

import './AppointmentDetailModal.css';
import './AppointmentEditModal.css';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
  </svg>
);

interface Form3Props {
  appointment: Appointment;
  cardColor: string;
  onCancel: (id: number) => void;
  onUpdate: () => void;
}

const Form3: React.FC<Form3Props> = ({ appointment, cardColor, onCancel, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  const history = useHistory();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handlePayClick = () => {
    history.push({
      pathname: '/thanh-toan',
      state: { selectId: appointment.id }
    });
  };

  const handleCancelClick = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      setIsCancelling(true);
      const token = localStorage.getItem('user_token');
      if (!token) {
        alert('Vui lòng đăng nhập lại.');
        setIsCancelling(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/${appointment.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                history.push('/dang-nhap-dang-ky');
            }
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

  // Hàm render các nút điều khiển dựa trên trạng thái
  const renderActions = () => {
    switch (appointment.trang_thai) {
      case 'đã thanh toán':
        return (
          <>
            <button className="detail-button" onClick={() => setShowModal(true)}>
              Chi tiết
            </button>
            <button className="consulted-button">
              <CheckIcon /> Đã khám
            </button>
          </>
        );
      
      case 'chưa thanh toán':
        return (
          <>
            <button className="detail-button" onClick={() => setShowModal(true)}>
              Chi tiết
            </button>
            <button className="pay-button" onClick={handlePayClick}>
              Thanh toán
            </button>
          </>
        );

      case 'đã xác nhận':
        return (
          <>
            <button className="detail-button" onClick={() => setShowModal(true)}>
              Chi tiết
            </button>
            <button
              className="cancel-button"
              onClick={handleCancelClick}
              disabled={isCancelling}
            >
              {isCancelling ? 'Đang hủy...' : 'Hủy'}
            </button>
          </>
        );
      
      // Mặc định (chờ xác nhận)
      default:
        return (
          <>
            <button className="detail-button" onClick={() => setShowModal(true)}>
              Chi tiết
            </button>
            <button className="edit-button" onClick={() => setShowEditModal(true)}>
              Sửa
            </button>
            <button
              className="cancel-button"
              onClick={handleCancelClick}
              disabled={isCancelling}
            >
              {isCancelling ? 'Đang hủy...' : 'Hủy'}
            </button>
          </>
        );
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
          <p><strong>Cơ sở khám:</strong> Phòng khám Đại học Phenikaa</p>
          <p><strong>SĐT bác sĩ:</strong> {appointment.doctor_phone}</p>
        </div>
        <div className="appointment-actions">
          {renderActions()}
        </div>
      </div>

      {/* Modals được render có điều kiện */}
      {showModal && (
        <AppointmentDetailModal 
          appointment={appointment} 
          onClose={() => setShowModal(false)} 
        />
      )}

      {showEditModal && (
        <AppointmentEditModal 
          appointment={appointment} 
          onClose={() => setShowEditModal(false)} 
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default Form3;