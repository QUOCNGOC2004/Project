import React, { useState, useEffect, useCallback } from 'react';
import './AppointmentManagement.css';
import { getAuthToken } from '../../../components/forAdmin/qlyUsersAndLichHen/hamXuLy';
import { 
    Appointment, 
    ApiAppointment, 
    AppointmentStatus, 
    DoctorDetails, 
    UserDetails,
    Invoice
} from '../../../components/forAdmin/qlyUsersAndLichHen/index';

import { Modal, ConfirmationModal } from '../../../components/forAdmin/qlyUsersAndLichHen/Modal';
import AppointmentTable from '../../../components/forAdmin/qlyUsersAndLichHen/AppointmentTable';
import InvoiceModal from '../../../components/forAdmin/qlyUsersAndLichHen/InvoiceModal';
import AppointmentDetailModal from '../../../components/forAdmin/qlyUsersAndLichHen/AppointmentDetailModal';

// --- MAIN COMPONENT
interface AppointmentManagementProps {
  userIdToFilter?: number;
  isEmbedded?: boolean;   
}


const AppointmentManagement: React.FC<AppointmentManagementProps> = ({ userIdToFilter, isEmbedded }) => {
    // State cho dữ liệu
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // State cho Modals
    const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    // State cho dữ liệu chi tiết trong Modal
    const [doctorDetail, setDoctorDetail] = useState<DoctorDetails | null>(null);
    const [userDetail, setUserDetail] = useState<UserDetails | null>(null); 
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isInvoiceLoading, setIsInvoiceLoading] = useState(false); 
    const [isModalLoading, setIsModalLoading] = useState(false); 
    const [confirmModalProps, setConfirmModalProps] = useState({
        title: '',
        message: '',
        confirmText: ''
    });

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
            const baseUrl = `${API_URL}/appointments`;
            const url = userIdToFilter 
                        ? `${baseUrl}/user/${userIdToFilter}` 
                        : baseUrl;                           

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `Lỗi ${response.status}`);
            }

            const data: ApiAppointment[] = await response.json();
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

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const fetchInvoice = async (appointmentId: number, token: string): Promise<Invoice | null> => {
        try {
            const response = await fetch(`${API_URL}/invoices/appointment/${appointmentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 404) {
                return null;
            }
            if (!response.ok) {
                throw new Error('Không thể tải thông tin hóa đơn');
            }
            const res = await response.json();
            return res.data as Invoice;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

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
            if (!response.ok) throw new Error('Cập nhật thất bại');
            await fetchAppointments(); 
        } catch (err) {
            console.error('Lỗi khi cập nhật trạng thái:', err);
            alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể cập nhật'}`);
        }
    };

    const handleDeleteAppointment = async (id: number) => {
        const token = getAuthToken();
        if (!token) {
            alert("Lỗi xác thực. Vui lòng đăng nhập lại.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/appointments/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Xóa lịch hẹn thất bại');
            }

            alert('Xóa lịch hẹn thành công.');
            setAppointments(apps => apps.filter(app => app.id !== id));
            setIsDetailModalOpen(false);
            setSelectedAppointment(null);

        } catch (err) {
            console.error('Lỗi khi xóa lịch hẹn:', err);
            alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể xóa'}`);
        }
    };

    const fetchDoctorDetails = async (doctorId: number) => {
        if (!doctorId) {
            setDoctorDetail({ phone: 'Không rõ' }); return;
        }
        try {
            const response = await fetch(`${API_URL}/doctors/${doctorId}`);
            if (!response.ok) throw new Error('Không thể tải thông tin bác sĩ');
            const doctorData = await response.json();
            setDoctorDetail({ phone: doctorData.phone || 'Chưa cập nhật' });
        } catch (err) {
            console.error(err); setDoctorDetail(null); 
        }
    };
    
    const fetchUserDetails = async (userId: number, token: string) => {
        if (!userId) {
            setUserDetail(null); return;
        }
        try {
            const response = await fetch(`${API_URL}/auth/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
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
            console.error(err); setUserDetail(null); 
        }
    };
    
    // --- LOGIC MỞ MODAL & UI ---

    const filteredAppointments = appointments.filter(a => 
        (a.ten_benh_nhan && a.ten_benh_nhan.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (a.doctorName && a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleOpenDetailModal = async (appointment: Appointment) => {
        const token = getAuthToken();
        if (!token) { alert("Lỗi xác thực Admin."); return; }
        
        setSelectedAppointment(appointment);
        setIsDetailModalOpen(true);
        setIsModalLoading(true); 
        
        setDoctorDetail(null);
        setUserDetail(null);
        setSelectedInvoice(null);
        setIsInvoiceLoading(true); 

        const doctorPromise = fetchDoctorDetails(appointment.doctorId);
        const userPromise = fetchUserDetails(appointment.userId, token);
        
        let invoicePromise: Promise<Invoice | null> = Promise.resolve(null);
        
        if (appointment.hasInvoice) {
            invoicePromise = fetchInvoice(appointment.id, token);
        }

        const [,, invoiceResult] = await Promise.allSettled([doctorPromise, userPromise, invoicePromise]);
        
        if (invoiceResult.status === 'fulfilled') {
            setSelectedInvoice(invoiceResult.value);
        }
        setIsInvoiceLoading(false); 
        
        setIsModalLoading(false); 
    };

    const handleOpenCreateInvoice = async (e: React.MouseEvent, appointment: Appointment) => {
        e.stopPropagation(); 
        const token = getAuthToken();
        if (!token) { alert("Lỗi xác thực Admin."); return; }

        setSelectedAppointment(appointment);
        setSelectedInvoice(null); 
        
        if (appointment.hasInvoice) {
            setIsModalLoading(true);
            const invoice = await fetchInvoice(appointment.id, token);
            setSelectedInvoice(invoice);
            setIsModalLoading(false);
        }
        
        setIsCreateInvoiceModalOpen(true);
    };

    const handleOpenViewInvoice = (e: React.MouseEvent, appointment: Appointment) => {
        e.stopPropagation(); 
        handleOpenDetailModal(appointment);
    };

    const handleSaveInvoice = async (invoiceData: any) => {
        if (!selectedAppointment) return;

        const token = getAuthToken();
        if (!token) {
            alert("Lỗi xác thực. Vui lòng đăng nhập lại.");
            return;
        }

        const savedAppointmentId = selectedAppointment.id;

        try {
            const response = await fetch(`${API_URL}/invoices/appointment/${savedAppointmentId}`, {
                method: 'PUT', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData) 
            });
            
            if (!response.ok) {
                 const err = await response.json();
                 throw new Error(err.message || 'Lưu hóa đơn thất bại');
            }

            setAppointments(currentApps => 
                currentApps.map(app => 
                    app.id === savedAppointmentId 
                        ? { ...app, hasInvoice: true } 
                        : app
                )
            );

            setIsCreateInvoiceModalOpen(false);
            setSelectedAppointment(null);
            setSelectedInvoice(null);
            
            alert('Hóa đơn đã được tạo/cập nhật.');

            
        } catch (err) {
             console.error('Lỗi khi lưu hóa đơn:', err);
             alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể lưu'}`);
        }
    }
    
    const handlePatientSeen = (e: React.MouseEvent, appointmentId: number) => {
        e.stopPropagation(); 
        setConfirmModalProps({
            title: "Xác nhận",
            message: "Bệnh nhân đã khám bệnh chưa?",
            confirmText: "Đã khám"
        });

        const action = () => {
            handleStatusChange(appointmentId, 'chưa thanh toán');
            setIsConfirmModalOpen(false);
        };
        setConfirmAction(() => action);
        setIsConfirmModalOpen(true);
    };

    const handleOpenDeleteConfirm = () => {
        if (!selectedAppointment) return;
        
        const appointmentIdToDelete = selectedAppointment.id;
        
        setConfirmModalProps({
            title: "Xác nhận xóa",
            message: `Bạn có chắc chắn muốn xóa lịch hẹn #${appointmentIdToDelete} của bệnh nhân ${selectedAppointment.ten_benh_nhan}? Hành động này không thể hoàn tác.`,
            confirmText: "Xóa"
        });

        const action = () => {
            handleDeleteAppointment(appointmentIdToDelete);
            setIsConfirmModalOpen(false);
        };

        setConfirmAction(() => action);
        setIsDetailModalOpen(false); 
        setIsConfirmModalOpen(true);
    };

    const handleChangeStatus = (e: React.MouseEvent, id: number, status: AppointmentStatus) => {
         e.stopPropagation(); 
         handleStatusChange(id, status);
    }
    
    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedAppointment(null);
        setSelectedInvoice(null);
    }
    
    const closeCreateInvoiceModal = () => {
        setIsCreateInvoiceModalOpen(false);
        setSelectedAppointment(null);
        setSelectedInvoice(null);
    }

    return (
        <div className={isEmbedded ? "am-container-embedded" : "am-container"}>
            
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

            <AppointmentTable
                appointments={filteredAppointments}
                isLoading={isLoading}
                error={error}
                onOpenDetail={handleOpenDetailModal}
                onPatientSeen={handlePatientSeen}
                onStatusChange={handleChangeStatus}
                onOpenCreateInvoice={handleOpenCreateInvoice}
                onOpenViewInvoice={handleOpenViewInvoice}
            />
            
            {/* --- MODALS --- */}
            {isCreateInvoiceModalOpen && selectedAppointment && (
                <InvoiceModal
                    appointment={selectedAppointment}
                    invoiceToEdit={selectedInvoice} 
                    isLoading={isModalLoading}
                    onClose={closeCreateInvoiceModal}
                    onSave={handleSaveInvoice}
                />
            )}
            
            {isConfirmModalOpen && (
                 <ConfirmationModal
                    title={confirmModalProps.title}
                    confirmText={confirmModalProps.confirmText}
                    onConfirm={() => {
                        if (confirmAction) confirmAction();
                    }}
                    onCancel={() => setIsConfirmModalOpen(false)}
                >
                    {confirmModalProps.message}
                </ConfirmationModal>
            )}
            
            {isDetailModalOpen && selectedAppointment && (
                <AppointmentDetailModal
                    appointment={selectedAppointment}
                    doctor={doctorDetail}
                    user={userDetail}
                    invoice={selectedInvoice}
                    isLoading={isModalLoading}
                    isInvoiceLoading={isInvoiceLoading}
                    onClose={closeDetailModal}
                    onDelete={handleOpenDeleteConfirm} 
                />
            )}
        </div>
    );
};

export default AppointmentManagement;