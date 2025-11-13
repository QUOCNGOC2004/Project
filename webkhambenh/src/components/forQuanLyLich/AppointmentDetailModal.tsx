import React from 'react';
import { Appointment } from './appointmentTypes';
import './AppointmentDetailModal.css';

interface AppointmentDetailModalProps {
  appointment: Appointment;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ appointment, onClose }) => {
  return (
    <div className="modal-overlay1">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="header-title"> Chi tiết Lịch hẹn</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="status-and-price-container">
            <div className="status-container">
              <span className="status-label">Trạng thái:</span>
              <span className={`status-badge status-${appointment.trang_thai.toLowerCase().replace(/ /g, '-')}`}>
                {appointment.trang_thai}
              </span>
            </div>
            {appointment.total_amount != null && (
              <div className="price-container">
                <span className="info-label">Chi phí:</span>
                <span className="price-value">{formatCurrency(appointment.total_amount)}</span>
              </div>
            )}
          </div>

          <div className="divider"></div>

          <div className="info-section-title">Thông tin Cá nhân</div>
          <div className="appointment-info-grid">
            <div className="info-item">
              <span className="info-label">Bệnh nhân:</span>
              <span className="info-value">{appointment.ten_benh_nhan}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ngày sinh:</span>
              <span className="info-value">{formatDate(appointment.ngay_sinh)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Giới tính:</span>
              <span className="info-value">{appointment.gioi_tinh}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Điện thoại:</span>
              <span className="info-value">{appointment.so_dien_thoai}</span>
            </div>
            <div className="info-item info-full-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{appointment.email}</span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="info-section-title">Lý do Khám</div>
          <div className="reason-box">
            <p className="reason-text">{appointment.ly_do_kham || 'Không có lý do khám chi tiết.'}</p>
          </div>

          {(appointment.trang_thai === 'đã thanh toán' || appointment.trang_thai === 'chưa thanh toán') && (
            <>
              <div className="divider"></div>
              <div className="info-section-title">Bệnh lý sau khi khám</div>
              <div className="reason-box">
                <p className="reason-text">{appointment.service_details?.benhLy || 'Chưa có thông tin.'}</p>
              </div>

              <div className="divider"></div>

              <div className="info-section-title">Lời khuyên của Bác sĩ</div>
              <div className="reason-box">
                <p className="reason-text">{appointment.service_details?.loiKhuyen || 'Chưa có thông tin.'}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};