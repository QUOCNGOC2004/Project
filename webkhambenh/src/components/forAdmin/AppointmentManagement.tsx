import React, { useState, useMemo, useEffect } from 'react';
import './AppointmentManagement.css';

// --- TYPE DEFINITIONS ---
type AppointmentStatus = 'chờ xác nhận' | 'đã xác nhận' | 'chưa thanh toán' | 'đã thanh toán';

interface Appointment {
  id: number;
  ten_benh_nhan: string;
  doctorName: string; // Frontend dùng camelCase
  ngay_dat_lich: string;
  gio_dat_lich: string;
  trang_thai: AppointmentStatus;
  hasInvoice?: boolean;
}


interface ApiAppointment {
  id: number;
  ten_benh_nhan: string;
  doctor_name: string; // Backend gửi snake_case
  ngay_dat_lich: string;
  gio_dat_lich: string;
  trang_thai: AppointmentStatus;
  hasinvoice: boolean; 
  
}

interface InvoiceService {
  name: string;
  price: number;
}

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


// --- MAIN COMPONENT
const getAuthToken = (): string | null => {
    
    return localStorage.getItem('admin_token'); 
};

const AppointmentManagement: React.FC = () => {
    // State cho dữ liệu
    const [appointments, setAppointments] = useState<Appointment[]>([]); // Khởi tạo mảng rỗng
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State cho UI
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
    const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

    const API_URL = process.env.REACT_APP_API_URL;

    // --- LOGIC GỌI API ---
    
    // Hàm fetch dữ liệu (gọi GET /api/appointments)
    const fetchAppointments = async () => {
        setIsLoading(true);
        setError(null);
        
        const token = getAuthToken();
        if (!token) {
            setError("Bạn chưa đăng nhập hoặc không có quyền.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/appointments`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `Lỗi ${response.status}`);
            }

            const data: ApiAppointment[] = await response.json();

            // Map dữ liệu từ backend (snake_case) sang frontend (camelCase)
            const mappedData: Appointment[] = data.map(item => ({
                id: item.id,
                ten_benh_nhan: item.ten_benh_nhan,
                doctorName: item.doctor_name, // Map
                ngay_dat_lich: item.ngay_dat_lich,
                gio_dat_lich: item.gio_dat_lich,
                trang_thai: item.trang_thai,
                hasInvoice: item.hasinvoice // Map
            }));
            
            setAppointments(mappedData);

        } catch (err) {
            console.error('Lỗi khi fetch lịch hẹn:', err);
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setIsLoading(false);
        }
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusChange = async (id: number, newStatus: AppointmentStatus) => {
    const token = getAuthToken();
    if (!token) {
        alert("Lỗi xác thực. Vui lòng đăng nhập lại.");
        return;
    }

    try {
        
        const response = await fetch(`${API_URL}/appointments/${id}/status`, {
            method: 'PATCH', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trang_thai: newStatus })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Cập nhật thất bại');
        }
        await fetchAppointments();

    } catch (err) {
        console.error('Lỗi khi cập nhật trạng thái:', err);
        alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể cập nhật'}`);
        
    }
};

    // --- LOGIC MOCK & UI ---

    const filteredAppointments = appointments.filter(a => 
        (a.ten_benh_nhan && a.ten_benh_nhan.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (a.doctorName && a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()))
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
                {isLoading && <div className="am-loading">Đang tải dữ liệu...</div>}
                {error && <div className="am-error">Lỗi: {error}</div>}
                {!isLoading && !error && (
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
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map(app => (
                                    <tr key={app.id}>
                                        <td>{app.ten_benh_nhan}</td>
                                        <td>{app.doctorName || 'N/A'}</td>
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
                                            {app.trang_thai === 'đã thanh toán' && app.hasInvoice && (
                                                <button onClick={() => handleOpenViewInvoice(app)} className="am-action-btn am-btn-teal">Xem Hóa đơn</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>Không tìm thấy lịch hẹn nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            
            {/* --- MODALS (GIỮ NGUYÊN) --- */}
            {isCreateInvoiceModalOpen && selectedAppointment && (
                <InvoiceModal
                    appointment={selectedAppointment}
                    onClose={() => setIsCreateInvoiceModalOpen(false)}
                    onSave={handleSaveInvoice} // Vẫn gọi hàm mock
                />
            )}
             {isViewInvoiceModalOpen && selectedAppointment && (
                <Modal title={`Hóa đơn cho: ${selectedAppointment.ten_benh_nhan}`} onClose={() => setIsViewInvoiceModalOpen(false)}>
                    <p>Chi tiết hóa đơn sẽ được hiển thị ở đây (GIẢ LẬP).</p>
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
