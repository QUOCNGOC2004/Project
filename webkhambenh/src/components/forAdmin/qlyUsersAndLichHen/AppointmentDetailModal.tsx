import React from 'react';
import { Appointment, DoctorDetails, UserDetails } from './index';
import { formatDate, formatTime } from './formatters';
import { Modal } from './Modal';
import './AppointmentDetailModal.css';

interface AppointmentDetailModalProps {
    appointment: Appointment;
    doctor: DoctorDetails | null;
    user: UserDetails | null; 
    isLoading: boolean;
    onClose: () => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ appointment, doctor, user, isLoading, onClose }) => {
    
    // Dữ liệu hóa đơn giả lập
    const mockInvoice = {
        benhLy: "Viêm họng cấp",
        loiKhuyen: "Uống nhiều nước ấm, tránh đồ lạnh, nghỉ ngơi.",
        services: [
            { name: "Phí khám", price: 300000 },
            { name: "Xét nghiệm nhanh COVID", price: 150000 }
        ],
        total: 450000
    };

    const renderDetailItem = (label: string, value: string | undefined | null) => (
        <p><strong>{label}:</strong> {value || '(Chưa cập nhật)'}</p>
    );

    return (
        <Modal title={`Chi tiết Lịch hẹn #${appointment.id}`} onClose={onClose}>
            <div className="am-detail-modal-body"> 
                
                {/* Phần 1: Thông tin Lịch hẹn & Bệnh nhân */}
                <div className="am-detail-section">
                    <h4 className="am-detail-header">Thông tin Lịch hẹn</h4>
                    <div className="am-detail-grid">
                        {renderDetailItem("Ngày khám", formatDate(appointment.ngay_dat_lich))}
                        {renderDetailItem("Giờ khám", formatTime(appointment.gio_dat_lich))}
                    </div>
                    {renderDetailItem("Lý do khám", appointment.lyDoKham)}
                </div>

                <div className="am-detail-section">
                    <h4 className="am-detail-header">Thông tin Bệnh nhân</h4>
                    <div className="am-detail-grid">
                        {renderDetailItem("Tên bệnh nhân", appointment.ten_benh_nhan)}
                        {renderDetailItem("SĐT Bệnh nhân", appointment.soDienThoai)}
                        {renderDetailItem("Email Bệnh nhân", appointment.email)}
                        {renderDetailItem("Giới tính", appointment.gioiTinh)}
                        {renderDetailItem("Ngày sinh", formatDate(appointment.ngaySinh))}
                    </div>
                </div>

                {/* Phần 2: Thông tin Người đặt (User) */}
                <div className="am-detail-section">
                    <h4 className="am-detail-header">Thông tin Người dùng</h4>
                    {isLoading ? (
                        <p className="am-detail-loading">Đang tải thông tin người dùng...</p>
                    ) : user ? (
                        <div className="am-detail-grid">
                            {renderDetailItem("Username", user.username)}
                            {renderDetailItem("SĐT User", user.so_dien_thoai)}
                            {renderDetailItem("Email User", user.email)}
                            {renderDetailItem("Giới tính", user.gioi_tinh)}
                            {renderDetailItem("Ngày sinh", formatDate(user.ngay_sinh))}
                        </div>
                    ) : (
                        <p className="am-detail-loading">Không thể tải thông tin người dùng.</p>
                    )}
                </div>

                {/* Phần 3: Thông tin Bác sĩ */}
                <div className="am-detail-section">
                    <h4 className="am-detail-header">Thông tin Bác sĩ</h4>
                    {isLoading ? (
                        <p className="am-detail-loading">Đang tải thông tin bác sĩ...</p>
                    ) : doctor ? (
                        <div className="am-detail-grid">
                            {renderDetailItem("Tên Bác sĩ", appointment.doctorName)}
                            {renderDetailItem("SĐT Bác sĩ", doctor.phone)}
                        </div>
                    ) : (
                        <p className="am-detail-loading">Không thể tải thông tin bác sĩ.</p>
                    )}
                </div>

                {/* Phần 4: Thông tin Hóa đơn (Giả lập) */}
                <div className="am-detail-section">
                    <h4 className="am-detail-header">Thông tin Hóa đơn (Giả lập)</h4>
                    <div className="am-detail-grid">
                        {renderDetailItem("Bệnh lý", mockInvoice.benhLy)}
                        {renderDetailItem("Lời khuyên", mockInvoice.loiKhuyen)}
                    </div>
                    <label>Chi tiết dịch vụ:</label>
                    <ul className="am-detail-service-list">
                        {mockInvoice.services.map((s, i) => (
                            <li key={i}>
                                <span>{s.name}</span>
                                <span>{new Intl.NumberFormat('vi-VN').format(s.price)} VND</span>
                            </li>
                        ))}
                    </ul>
                    <p className="am-detail-total">
                        <strong>Tổng cộng:</strong>
                        <span>{new Intl.NumberFormat('vi-VN').format(mockInvoice.total)} VND</span>
                    </p>
                </div>

            </div>
            <div className="modal-actions">
                <button type="button" onClick={onClose} className="modal-button modal-button-secondary">Đóng</button>
            </div>
        </Modal>
    );
};

export default AppointmentDetailModal;