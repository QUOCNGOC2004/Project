import React, { useState } from 'react';
import './form3.css';
import { logout } from '../../ktraLogin'; 
import { useHistory } from 'react-router-dom'; 

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
  </svg>
);


interface Appointment {
  id: number;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  doctor_name: string;
  mo_ta_bac_si: string;
  doctor_phone: string;
  ly_do_kham: string;
  ten_benh_nhan: string;
  email: string;
  gioi_tinh: string;
  ngay_sinh: string;
  so_dien_thoai: string;
  trang_thai: string;
  gia_tien?: number;
  benh_ly?: string;
  loi_khuyen?: string;
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
  const history = useHistory();

  const mockPaidData = {
    gia_tien: 500000,
    benh_ly: "Viêm họng cấp",
    loi_khuyen: "Uống nhiều nước ấm, tránh đồ lạnh và cay nóng. Súc họng bằng nước muối sinh lý 2-3 lần/ngày. Uống thuốc theo đơn và tái khám sau 5 ngày nếu không đỡ."
  };

  const currentAppointmentData = {
    ...appointment,
    ...((appointment.trang_thai === 'đã thanh toán' || appointment.trang_thai === 'chưa thanh toán') 
      ? mockPaidData 
      : {})
  };


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

  const handleDetailClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleEditClick = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  // --- THAY ĐỔI 2: Thêm hàm xử lý cho nút Thanh toán ---
  const handlePayClick = () => {
    // Logic thanh toán (ví dụ: chuyển hướng sang trang thanh toán VNPAY, Momo...)
    // Hiện tại chỉ là placeholder
    alert('Chức năng thanh toán đang được phát triển!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const token = localStorage.getItem('user_token');
    if (!token) {
        alert('Vui lòng đăng nhập lại.');
        setIsUpdating(false);
        return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        if (response.status === 401) {
            logout();
            history.push('/dang-nhap-dang-ky');
            return; 
        }


        if (response.status === 409) {
          const errorData = await response.json().catch(() => ({ error: 'Slot mới bạn chọn đã kín. Vui lòng chọn giờ khác.' }));
          const apiErrorMessage = errorData.error;
          alert(apiErrorMessage); 
          return;
        }
        
        const errorData = await response.json().catch(() => ({ error: 'Không thể cập nhật lịch hẹn' }));
        throw new Error(errorData.error);
      }

      onUpdate();
      setShowEditModal(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật lịch hẹn:', error);
      alert(`Có lỗi xảy ra: ${error instanceof Error ? error.message : 'Vui lòng thử lại.'}`);
    } finally {
      setIsUpdating(false);
    }
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
          {(() => {
            switch (appointment.trang_thai) {
              case 'đã thanh toán':
                return (
                  <>
                    <button className="detail-button" onClick={handleDetailClick}>
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
                    <button className="detail-button" onClick={handleDetailClick}>
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
                    <button className="detail-button" onClick={handleDetailClick}>
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
              
              // Mặc định (thẻ chờ xác nhận)
              default:
                return (
                  <>
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
                  </>
                );
            }
          })()}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay1">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="header-title"> Chi tiết Lịch hẹn</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="status-and-price-container">
                <div className="status-container">
                  <span className="status-label">Trạng thái:</span>
                  <span className={`status-badge status-${appointment.trang_thai.toLowerCase().replace(/ /g, '-')}`}>
                    {appointment.trang_thai}
                  </span>
                </div>
                {currentAppointmentData.gia_tien && (
                  <div className="price-container">
                    <span className="info-label">Chi phí:</span>
                    <span className="price-value">{formatCurrency(currentAppointmentData.gia_tien)}</span>
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

              {/* Chỉ hiển thị phần này cho lịch đã/chưa thanh toán */}
              {(appointment.trang_thai === 'đã thanh toán' || appointment.trang_thai === 'chưa thanh toán') && (
                <>
                  <div className="divider"></div>
                  <div className="info-section-title">Bệnh lý sau khi khám</div>
                  <div className="reason-box">
                    <p className="reason-text">{currentAppointmentData.benh_ly || 'Chưa có thông tin.'}</p>
                  </div>

                  <div className="divider"></div>

                  <div className="info-section-title">Lời khuyên của Bác sĩ</div>
                  <div className="reason-box">
                    <p className="reason-text">{currentAppointmentData.loi_khuyen || 'Chưa có thông tin.'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}


      {showEditModal && (
        <div className="modal-overlay1">
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
                  pattern="[0-9]{8,13}"
                  inputMode="numeric"
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