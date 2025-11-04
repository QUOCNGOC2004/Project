import React from 'react';
import { Appointment, DoctorDetails, UserDetails, Invoice } from './index'; 
import { formatDate, formatTime } from './formatters';
import { Modal } from './Modal';
import './AppointmentDetailModal.css';

interface AppointmentDetailModalProps {
    appointment: Appointment;
    doctor: DoctorDetails | null;
    user: UserDetails | null; 
    invoice: Invoice | null; 
    isLoading: boolean; 
    isInvoiceLoading: boolean; 
    onClose: () => void;
    onDelete: () => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ 
    appointment, 
    doctor, 
    user, 
    invoice, 
    isLoading, 
    isInvoiceLoading, 
    onClose,
    onDelete
}) => {

    const renderDetailItem = (label: string, value: string | undefined | null) => (
        <p><strong>{label}:</strong> {value || '(Chưa cập nhật)'}</p>
    );

    // Function render chi tiết hóa đơn (mới)
    const renderInvoiceDetails = () => {
        if (isInvoiceLoading) {
            return <p className="am-detail-loading">Đang tải thông tin hóa đơn...</p>;
        }
        
        if (!invoice || !invoice.service_details) {
            return <p className="am-detail-loading">Chưa có thông tin hóa đơn chi tiết.</p>;
        }

        const { service_details, total_amount, status } = invoice;
        
        return (
            <>
                <div className="am-detail-grid">
                    {renderDetailItem("Mã HĐ", invoice.invoice_code)}
                    {renderDetailItem("Trạng thái", status === 'pending' ? 'Chưa thanh toán' : 'Đã thanh toán')}
                    {renderDetailItem("Bệnh lý", service_details.benhLy)}
                    {renderDetailItem("Lời khuyên", service_details.loiKhuyen)}
                </div>
                <label>Chi tiết dịch vụ:</label>
                <ul className="am-detail-service-list">
                    {service_details.services.map((s, i) => (
                        <li key={i}>
                            <span>{s.name}</span>
                            <span>{new Intl.NumberFormat('vi-VN').format(s.price)} VND</span>
                        </li>
                    ))}
                </ul>
                <p className="am-detail-total">
                    <strong>Tổng cộng:</strong>
                    <span>{new Intl.NumberFormat('vi-VN').format(total_amount)} VND</span>
                </p>
            </>
        );
    };


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

                {/* Phần 4: Thông tin Hóa đơn */}
                <div className="am-detail-section">
                    <h4 className="am-detail-header">Thông tin Hóa đơn</h4>
                    {renderInvoiceDetails()}
                </div>

            </div>
            <div className="modal-actions modal-actions-split">
                <button 
                    type="button" 
                    onClick={onDelete} 
                    className="modal-button modal-button-danger"
                >
                    Xóa Lịch Hẹn
                </button>
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="modal-button modal-button-secondary"
                >
                    Đóng
                </button>
            </div>
        </Modal>
    );
};

export default AppointmentDetailModal;