import React, { useState, useMemo } from 'react';
import './AppointmentManagement.css';

// --- TYPE DEFINITIONS ---
type AppointmentStatus = 'chờ xác nhận' | 'đã xác nhận' | 'chưa thanh toán' | 'đã thanh toán';

interface Appointment {
  id: number;
  ten_benh_nhan: string;
  doctorName: string;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  trang_thai: AppointmentStatus;
  hasInvoice?: boolean;
}

interface InvoiceService {
  name: string;
  price: number;
}

// --- MOCK DATA ---
const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 1, ten_benh_nhan: 'Trần Văn An', doctorName: 'PGS.TS. BS Nguyễn Thanh Hồi', ngay_dat_lich: '2025-10-20', gio_dat_lich: '09:00', trang_thai: 'chờ xác nhận' },
    { id: 2, ten_benh_nhan: 'Lê Thị Bình', doctorName: 'GS.TS. BS. Đỗ Quyết', ngay_dat_lich: '2025-10-20', gio_dat_lich: '14:00', trang_thai: 'đã xác nhận' },
    { id: 3, ten_benh_nhan: 'Phạm Hùng Cường', doctorName: 'BSNT. Lê Thị Hương', ngay_dat_lich: '2025-10-22', gio_dat_lich: '10:30', trang_thai: 'chưa thanh toán', hasInvoice: true },
    { id: 4, ten_benh_nhan: 'Nguyễn Thị Dung', doctorName: 'PGS.TS. BS Nguyễn Thanh Hồi', ngay_dat_lich: '2025-10-23', gio_dat_lich: '11:00', trang_thai: 'đã thanh toán', hasInvoice: true },
    { id: 5, ten_benh_nhan: 'Hoàng Văn E', doctorName: 'GS.TS. BS. Đỗ Quyết', ngay_dat_lich: '2025-10-24', gio_dat_lich: '15:00', trang_thai: 'chưa thanh toán', hasInvoice: false },
];


// --- UTILITY COMPONENTS ---
const Modal: React.FC<{ children: React.ReactNode; title: string; onClose: () => void }> = ({ children, title, onClose }) => (
    <div className="am-modal-overlay">
        <div className="am-modal-content">
            <div className="am-modal-header">
                <h3>{title}</h3>
                <button onClick={onClose} className="am-modal-close-btn">&times;</button>
            </div>
            <div className="am-modal-body">
                {children}
            </div>
        </div>
    </div>
);

const ConfirmationModal: React.FC<{ title: string; confirmText: string; onConfirm: () => void; onCancel: () => void; children: React.ReactNode }> = ({ title, confirmText, onConfirm, onCancel, children }) => {
    return (
        <Modal title={title} onClose={onCancel}>
            <p className="am-confirm-text">{children}</p>
            <div className="am-modal-actions">
                <button onClick={onCancel} className="am-button am-button-secondary">Hủy</button>
                <button onClick={onConfirm} className="am-button am-button-confirm">{confirmText}</button>
            </div>
        </Modal>
    );
};

// --- SUB COMPONENTS ---
const InvoiceModal: React.FC<{ appointment: Appointment; onClose: () => void; onSave: () => void }> = ({ appointment, onClose, onSave }) => {
    const [benhLy, setBenhLy] = useState('');
    const [loiKhuyen, setLoiKhuyen] = useState('');
    const [services, setServices] = useState<InvoiceService[]>([{ name: 'Phí khám', price: 300000 }]);
    
    const total = useMemo(() => services.reduce((sum, service) => sum + service.price, 0), [services]);

    const handleServiceChange = (index: number, field: keyof InvoiceService, value: string | number) => {
        const newServices = [...services];
        if (field === 'price') {
            newServices[index][field] = Number(value) || 0;
        } else {
            newServices[index][field] = value as string;
        }
        setServices(newServices);
    };

    const addService = () => {
        setServices([...services, { name: '', price: 0 }]);
    };

    const removeService = (index: number) => {
        if (services.length > 1) {
            setServices(services.filter((_, i) => i !== index));
        }
    };

    return (
        <Modal title={appointment.hasInvoice ? `Sửa hóa đơn cho: ${appointment.ten_benh_nhan}`: `Tạo hóa đơn cho: ${appointment.ten_benh_nhan}`} onClose={onClose}>
            <div className="am-invoice-form">
                <div className="am-form-group">
                    <label>Bệnh lý sau khi khám</label>
                    <textarea value={benhLy} onChange={(e) => setBenhLy(e.target.value)} rows={3}></textarea>
                </div>
                 <div className="am-form-group">
                    <label>Lời khuyên của Bác sĩ</label>
                    <textarea value={loiKhuyen} onChange={(e) => setLoiKhuyen(e.target.value)} rows={3}></textarea>
                </div>
                <div className="am-form-group">
                    <label>Chi tiết hóa đơn</label>
                    {services.map((service, index) => (
                        <div key={index} className="am-service-item">
                            <input type="text" placeholder="Tên dịch vụ" value={service.name} onChange={(e) => handleServiceChange(index, 'name', e.target.value)} className="am-service-name"/>
                            <input type="number" placeholder="Giá" value={service.price} onChange={(e) => handleServiceChange(index, 'price', e.target.value)} className="am-service-price"/>
                            <button onClick={() => removeService(index)} className="am-remove-btn" disabled={services.length <= 1}>-</button>
                        </div>
                    ))}
                    <button onClick={addService} className="am-add-service-btn">+ Thêm dịch vụ</button>
                </div>
                <div className="am-invoice-total">
                    Tổng cộng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                </div>
                 <div className="am-modal-actions">
                    <button type="button" onClick={onClose} className="am-button am-button-secondary">Hủy</button>
                    <button onClick={onSave} className="am-button am-button-success">Lưu Hóa Đơn</button>
                </div>
            </div>
        </Modal>
    );
};


// --- MAIN COMPONENT ---
const AppointmentManagement: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
    const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

    const filteredAppointments = appointments.filter(a => 
        a.ten_benh_nhan.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreateInvoice = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsCreateInvoiceModalOpen(true);
    };

    const handleOpenViewInvoice = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsViewInvoiceModalOpen(true);
    };

    const handleSaveInvoice = () => {
        if(selectedAppointment) {
            setAppointments(apps => apps.map(a => 
                a.id === selectedAppointment.id ? {...a, hasInvoice: true } : a
            ));
            setIsCreateInvoiceModalOpen(false);
            setSelectedAppointment(null);
            alert('Hóa đơn đã được tạo/cập nhật.');
        }
    }
    
    const handleStatusChange = (id: number, newStatus: AppointmentStatus) => {
        setAppointments(apps => apps.map(app => app.id === id ? { ...app, trang_thai: newStatus } : app));
    };
    
    const handlePatientSeen = (appointmentId: number) => {
        const action = () => {
            handleStatusChange(appointmentId, 'chưa thanh toán');
            setIsConfirmModalOpen(false);
        };
        setConfirmAction(() => action);
        setIsConfirmModalOpen(true);
    };

    const getStatusClass = (status: AppointmentStatus) => {
        switch (status) {
            case 'chờ xác nhận': return 'am-status-yellow';
            case 'đã xác nhận': return 'am-status-cyan';
            case 'chưa thanh toán': return 'am-status-red';
            case 'đã thanh toán': return 'am-status-green';
            default: return 'am-status-gray';
        }
    };

    return (
        <div className="am-container">
            <div className="am-header">
                <h2>Quản lý Lịch hẹn</h2>
                <input 
                    type="text" 
                    placeholder="Tìm bệnh nhân hoặc bác sĩ..." 
                    className="am-search-input"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
             <div className="am-table-wrapper">
                <table className="am-table">
                    <thead>
                        <tr>
                            <th>Bệnh nhân</th>
                            <th>Bác sĩ</th>
                            <th>Ngày hẹn</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map(app => (
                            <tr key={app.id}>
                                <td>{app.ten_benh_nhan}</td>
                                <td>{app.doctorName}</td>
                                <td>{app.ngay_dat_lich} @ {app.gio_dat_lich}</td>
                                <td>
                                    <span className={`am-status-badge ${getStatusClass(app.trang_thai)}`}>
                                        {app.trang_thai}
                                    </span>
                                </td>
                                <td className="am-table-actions">
                                    {app.trang_thai === 'chờ xác nhận' && (
                                        <button onClick={() => handleStatusChange(app.id, 'đã xác nhận')} className="am-action-btn am-btn-green">Xác nhận</button>
                                    )}
                                    {app.trang_thai === 'đã xác nhận' && (
                                        <>
                                            <button onClick={() => handlePatientSeen(app.id)} className="am-action-btn am-btn-blue">Đã khám</button>
                                            <button onClick={() => handleStatusChange(app.id, 'chờ xác nhận')} className="am-action-btn am-btn-gray">Hủy xác nhận</button>
                                        </>
                                    )}
                                    {app.trang_thai === 'chưa thanh toán' && !app.hasInvoice && (
                                        <button onClick={() => handleOpenCreateInvoice(app)} className="am-action-btn am-btn-purple">Tạo Hóa đơn</button>
                                    )}
                                    {app.trang_thai === 'chưa thanh toán' && app.hasInvoice && (
                                        <>
                                            <button onClick={() => handleOpenViewInvoice(app)} className="am-action-btn am-btn-blue">Xem Hóa đơn</button>
                                            <button onClick={() => handleOpenCreateInvoice(app)} className="am-action-btn am-btn-yellow">Sửa Hóa đơn</button>
                                        </>
                                    )}
                                    {app.trang_thai === 'đã thanh toán' && (
                                        <button onClick={() => handleOpenViewInvoice(app)} className="am-action-btn am-btn-teal">Xem Hóa đơn</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isCreateInvoiceModalOpen && selectedAppointment && (
                <InvoiceModal
                    appointment={selectedAppointment}
                    onClose={() => setIsCreateInvoiceModalOpen(false)}
                    onSave={handleSaveInvoice}
                />
            )}
             {isViewInvoiceModalOpen && selectedAppointment && (
                <Modal title={`Hóa đơn cho: ${selectedAppointment.ten_benh_nhan}`} onClose={() => setIsViewInvoiceModalOpen(false)}>
                    <p>Chi tiết hóa đơn sẽ được hiển thị ở đây.</p>
                    <p>Bệnh nhân: {selectedAppointment.ten_benh_nhan}</p>
                     <p>Ngày khám: {selectedAppointment.ngay_dat_lich}</p>
                </Modal>
            )}
            {isConfirmModalOpen && (
                 <ConfirmationModal
                    title="Xác nhận"
                    confirmText="Đã khám"
                    onConfirm={() => {
                        if (confirmAction) confirmAction();
                    }}
                    onCancel={() => setIsConfirmModalOpen(false)}
                >
                    Bệnh nhân đã khám bệnh chưa?
                </ConfirmationModal>
            )}
        </div>
    );
};

export default AppointmentManagement;
