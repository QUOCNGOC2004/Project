import React, { useState, useMemo, useEffect, useCallback } from 'react';
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

  doctorId: number;
  userId: number;
  email: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  lyDoKham: string;
}
interface ApiAppointment {
  id: number;
  ten_benh_nhan: string;
  doctor_name: string; 
  ngay_dat_lich: string;
  gio_dat_lich: string;
  trang_thai: AppointmentStatus;
  hasinvoice: boolean; 
  
  doctor_id: number;
  user_id: number;
  email: string;
  gioi_tinh: string;
  ngay_sinh: string;
  so_dien_thoai: string;
  ly_do_kham: string;
}
interface InvoiceService {
  name: string;
  price: number;
}
interface DoctorDetails {
    phone: string;
}
interface UserDetails {
    username: string;
    email: string;
    so_dien_thoai: string;
    gioi_tinh: string;
    ngay_sinh: string;
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5);
};

// --- UTILITY COMPONENTS ---
const Modal: React.FC<{ children: React.ReactNode; title: string; onClose: () => void }> = ({ children, title, onClose }) => (
    <div className="am-modal-overlay">
        <div className="am-modal-content">
            <div className="am-modal-header">
                <h3>{title}</h3>
                <button onClick={onClose} className="am-modal-close-btn">&times;</button>
            </div>
            {children} 
        </div>
    </div>
);
const ConfirmationModal: React.FC<{ title: string; confirmText: string; onConfirm: () => void; onCancel: () => void; children: React.ReactNode }> = ({ title, confirmText, onConfirm, onCancel, children }) => {
    return (
        <Modal title={title} onClose={onCancel}>
            <div className="am-modal-body">
                <p className="am-confirm-text">{children}</p>
                <div className="am-modal-actions">
                    <button onClick={onCancel} className="am-button am-button-secondary">Hủy</button>
                    <button onClick={onConfirm} className="am-button am-button-confirm">{confirmText}</button>
                </div>
            </div>
        </Modal>
    );
};

// hoá đơn modal
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
            <div className="am-modal-body">
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
            </div>
        </Modal>
    );
};
const AppointmentDetailModal: React.FC<{
    appointment: Appointment;
    doctor: DoctorDetails | null;
    user: UserDetails | null; 
    isLoading: boolean;
    onClose: () => void;
}> = ({ appointment, doctor, user, isLoading, onClose }) => {
    
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
            <div className="am-modal-actions" style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid #e2e8f0', background: 'white', borderRadius: '0 0 0.5rem 0.5rem' }}>
                <button type="button" onClick={onClose} className="am-button am-button-secondary">Đóng</button>
            </div>
        </Modal>
    );
};


// --- MAIN COMPONENT
const getAuthToken = (): string | null => {
    return localStorage.getItem('admin_token'); 
};

interface AppointmentManagementProps {
  userIdToFilter?: number; // Prop này là tùy chọn
  isEmbedded?: boolean;    // Prop để điều chỉnh giao diện khi bị nhúng
}


const AppointmentManagement: React.FC<AppointmentManagementProps> = ({ userIdToFilter, isEmbedded }) => {
    // State cho dữ liệu
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
    const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAppointmentDetail, setSelectedAppointmentDetail] = useState<Appointment | null>(null);
    const [doctorDetail, setDoctorDetail] = useState<DoctorDetails | null>(null);
    const [userDetail, setUserDetail] = useState<UserDetails | null>(null); 
    const [isModalLoading, setIsModalLoading] = useState(false); 

    const API_URL = process.env.REACT_APP_API_URL;

    // --- LOGIC GỌI API ---
    
    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        const token = getAuthToken();
        if (!token) {
            setError("Bạn chưa đăng nhập hoặc không có quyền.");
            setIsLoading(false);
            return;
        }

        try {
            // (MỚI) Quyết định URL dựa trên prop
            const baseUrl = `${API_URL}/appointments`;
            const url = userIdToFilter 
                        ? `${baseUrl}/user/${userIdToFilter}` // Endpoint lấy lịch hẹn theo user
                        : baseUrl;                           // Endpoint mặc định (lấy tất cả)

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
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
                doctorName: item.doctor_name, 
                ngay_dat_lich: item.ngay_dat_lich,
                gio_dat_lich: item.gio_dat_lich,
                trang_thai: item.trang_thai,
                hasInvoice: item.hasinvoice, 
                
                doctorId: item.doctor_id,
                userId: item.user_id,
                email: item.email,
                gioiTinh: item.gioi_tinh,
                ngaySinh: item.ngay_sinh,
                soDienThoai: item.so_dien_thoai,
                lyDoKham: item.ly_do_kham,
            }));
            
            setAppointments(mappedData);

        } catch (err) {
            console.error('Lỗi khi fetch lịch hẹn:', err);
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setIsLoading(false);
        }
    }, [userIdToFilter, API_URL]); 

    // useEffect phụ thuộc vào fetchAppointments
    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // handleStatusChange cần gọi lại fetchAppointments
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
            // Gọi lại fetchAppointments để làm mới danh sách
            await fetchAppointments(); 

        } catch (err) {
            console.error('Lỗi khi cập nhật trạng thái:', err);
            alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể cập nhật'}`);
        }
    };

    const fetchDoctorDetails = async (doctorId: number) => {
        if (!doctorId) {
            setDoctorDetail({ phone: 'Không rõ' });
            return;
        }
        try {
            const response = await fetch(`${API_URL}/doctors/${doctorId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Không thể tải thông tin bác sĩ');
            const doctorData = await response.json();
            setDoctorDetail({ phone: doctorData.phone || 'Chưa cập nhật' });
        } catch (err) {
            console.error(err);
            setDoctorDetail(null); 
        }
    };
    const fetchUserDetails = async (userId: number, token: string) => {
        if (!userId) {
            setUserDetail(null);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/auth/user/${userId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Không thể tải thông tin người dùng');
            const userData = await response.json();
            setUserDetail({
                username: userData.user.username,
                email: userData.user.email,
                so_dien_thoai: userData.user.so_dien_thoai,
                gioi_tinh: userData.user.gioi_tinh,
                ngay_sinh: userData.user.ngay_sinh
            });
        } catch (err) {
            console.error(err);
            setUserDetail(null); 
        }
    };
    
    // --- LOGIC MOCK & UI ---

    const filteredAppointments = appointments.filter(a => 
        (a.ten_benh_nhan && a.ten_benh_nhan.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (a.doctorName && a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const handleOpenDetailModal = async (appointment: Appointment) => {
        const token = getAuthToken();
        if (!token) {
            alert("Lỗi xác thực Admin.");
            return;
        }
        
        setSelectedAppointmentDetail(appointment);
        setIsDetailModalOpen(true);
        setIsModalLoading(true);
        
        // Reset state
        setDoctorDetail(null);
        setUserDetail(null);

        const doctorPromise = fetchDoctorDetails(appointment.doctorId);
        const userPromise = fetchUserDetails(appointment.userId, token);

        await Promise.allSettled([doctorPromise, userPromise]);
        
        setIsModalLoading(false);
    };

    const handleOpenCreateInvoice = (e: React.MouseEvent, appointment: Appointment) => {
        e.stopPropagation(); 
        setSelectedAppointment(appointment);
        setIsCreateInvoiceModalOpen(true);
    };

    const handleOpenViewInvoice = (e: React.MouseEvent, appointment: Appointment) => {
        e.stopPropagation(); 
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
    
    const handlePatientSeen = (e: React.MouseEvent, appointmentId: number) => {
        e.stopPropagation(); 
        const action = () => {
            handleStatusChange(appointmentId, 'chưa thanh toán');
            setIsConfirmModalOpen(false);
        };
        setConfirmAction(() => action);
        setIsConfirmModalOpen(true);
    };
    const handleChangeStatus = (e: React.MouseEvent, id: number, status: AppointmentStatus) => {
         e.stopPropagation(); 
         handleStatusChange(id, status);
    }
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
        <div className={isEmbedded ? "am-container-embedded" : "am-container"}>
            
            {/* Chỉ hiển thị header nếu KHÔNG bị nhúng */}
            {!isEmbedded && (
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
            )}

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
                                    <tr 
                                        key={app.id}
                                        onClick={() => handleOpenDetailModal(app)} 
                                        style={{ cursor: 'pointer' }} 
                                    >
                                        <td>{app.ten_benh_nhan}</td>
                                        <td>{app.doctorName || 'N/A'}</td>
                                        <td>
                                            {formatDate(app.ngay_dat_lich)} @ {formatTime(app.gio_dat_lich)}
                                        </td>
                                        <td>
                                            <span className={`am-status-badge ${getStatusClass(app.trang_thai)}`}>
                                                {app.trang_thai}
                                            </span>
                                        </td>
                                        <td className="am-table-actions">
                                            {app.trang_thai === 'chờ xác nhận' && (
                                                <button onClick={(e) => handleChangeStatus(e, app.id, 'đã xác nhận')} className="am-action-btn am-btn-green">Xác nhận</button>
                                            )}
                                            {app.trang_thai === 'đã xác nhận' && (
                                                <>
                                                    <button onClick={(e) => handlePatientSeen(e, app.id)} className="am-action-btn am-btn-blue">Đã khám</button>
                                                    <button onClick={(e) => handleChangeStatus(e, app.id, 'chờ xác nhận')} className="am-action-btn am-btn-gray">Hủy</button>
                                                </>
                                            )}
                                            
                                            {app.trang_thai === 'chưa thanh toán' && !app.hasInvoice && (
                                                <button onClick={(e) => handleOpenCreateInvoice(e, app)} className="am-action-btn am-btn-purple">Tạo Hóa đơn</button>
                                            )}
                                            {app.trang_thai === 'chưa thanh toán' && app.hasInvoice && (
                                                <>
                                                    <button onClick={(e) => handleOpenViewInvoice(e, app)} className="am-action-btn am-btn-blue">Xem Hóa đơn</button>
                                                    <button onClick={(e) => handleOpenCreateInvoice(e, app)} className="am-action-btn am-btn-yellow">Sửa Hóa đơn</button>
                                                </>
                                            )}
                                            {app.trang_thai === 'đã thanh toán' && app.hasInvoice && (
                                                <button onClick={(e) => handleOpenViewInvoice(e, app)} className="am-action-btn am-btn-teal">Xem Hóa đơn</button>
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
            
            {/* --- MODALS --- */}
            {isCreateInvoiceModalOpen && selectedAppointment && (
                <InvoiceModal
                    appointment={selectedAppointment}
                    onClose={() => setIsCreateInvoiceModalOpen(false)}
                    onSave={handleSaveInvoice} 
                />
            )}
             {isViewInvoiceModalOpen && selectedAppointment && (
                <Modal title={`Hóa đơn cho: ${selectedAppointment.ten_benh_nhan}`} onClose={() => setIsViewInvoiceModalOpen(false)}>
                    <div className="am-modal-body">
                        <p>Chi tiết hóa đơn sẽ được hiển thị ở đây (GIẢ LẬP).</p>
                        <p>Bệnh nhân: {selectedAppointment.ten_benh_nhan}</p>
                        <p>Ngày khám: {selectedAppointment.ngay_dat_lich}</p>
                    </div>
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
            
            {isDetailModalOpen && selectedAppointmentDetail && (
                <AppointmentDetailModal
                    appointment={selectedAppointmentDetail}
                    doctor={doctorDetail}
                    user={userDetail}
                    isLoading={isModalLoading}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AppointmentManagement;