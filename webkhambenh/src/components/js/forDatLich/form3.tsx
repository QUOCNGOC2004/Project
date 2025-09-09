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
  ten_benh_nhan: string;
  email: string;
  gioi_tinh: string;
  ngay_sinh: string;
  so_dien_thoai: string;
  trang_thai: string;
}

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState({
    ngay_dat_lich: appointment.ngay_dat_lich,
    gio_dat_lich: appointment.gio_dat_lich,
    ten_benh_nhan: appointment.ten_benh_nhan,
    email: appointment.email,
    gioi_tinh: appointment.gioi_tinh,
    ngay_sinh: appointment.ngay_sinh,
    so_dien_thoai: appointment.so_dien_thoai,
    ly_do_kham: appointment.ly_do_kham,
  });

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

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_APPOINTMENT_API_URL}/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật lịch hẹn');
      }

      onUpdate();
      setShowEditModal(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật lịch hẹn:', error);
      alert('Có lỗi xảy ra khi cập nhật lịch hẹn');
    } finally {
      setIsUpdating(false);
    }
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
          <button className="edit-button" onClick={handleEditClick}>
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

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content edit-modal">
            <div className="modal-header">
              <h3>Sửa lịch hẹn</h3>
              <button className="modal-close" onClick={handleCloseEditModal}>×</button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="edit-form">
              <div className="form-group">
                <label>Ngày đặt lịch:</label>
                <input
                  type="date"
                  name="ngay_dat_lich"
                  value={editData.ngay_dat_lich}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Giờ đặt lịch:</label>
                <input
                  type="time"
                  name="gio_dat_lich"
                  value={editData.gio_dat_lich}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tên bệnh nhân:</label>
                <input
                  type="text"
                  name="ten_benh_nhan"
                  value={editData.ten_benh_nhan}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Giới tính:</label>
                <select
                  name="gioi_tinh"
                  value={editData.gioi_tinh}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ngày sinh:</label>
                <input
                  type="date"
                  name="ngay_sinh"
                  value={editData.ngay_sinh}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="tel"
                  name="so_dien_thoai"
                  value={editData.so_dien_thoai}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Lý do khám:</label>
                <textarea
                  name="ly_do_kham"
                  value={editData.ly_do_kham}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCloseEditModal}>Hủy</button>
                <button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Form3;
