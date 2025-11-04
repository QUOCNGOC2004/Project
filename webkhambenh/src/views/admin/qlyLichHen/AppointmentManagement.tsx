import React, { useState, useEffect, useCallback } from 'react';
import './AppointmentManagement.css';
import { getAuthToken } from '../../../components/forAdmin/qlyUsersAndLichHen/auth';
import { formatDate, formatTime } from '../../../components/forAdmin/qlyUsersAndLichHen/formatters';
import { 
    Appointment, 
    ApiAppointment, 
    AppointmentStatus, 
    DoctorDetails, 
    UserDetails 
} from '../../../components/forAdmin/qlyUsersAndLichHen/index';

import { Modal, ConfirmationModal } from '../../../components/forAdmin/qlyUsersAndLichHen/Modal';
import AppointmentTable from '../../../components/forAdmin/qlyUsersAndLichHen/AppointmentTable';
import InvoiceModal from '../../../components/forAdmin/qlyUsersAndLichHen/InvoiceModal';
import AppointmentDetailModal from '../../../components/forAdmin/qlyUsersAndLichHen/AppointmentDetailModal';

// --- MAIN COMPONENT
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
    
    // State cho Modals
    const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
    const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAppointmentDetail, setSelectedAppointmentDetail] = useState<Appointment | null>(null);
    
    // State cho dữ liệu chi tiết trong Modal
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
        
        setSelectedAppointmentDetail(appointment);
        setIsDetailModalOpen(true);
        setIsModalLoading(true);
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

            {/* Component Bảng đã được tách ra */}
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
                    onClose={() => setIsCreateInvoiceModalOpen(false)}
                    onSave={handleSaveInvoice} 
                />
            )}
             {isViewInvoiceModalOpen && selectedAppointment && (
                <Modal title={`Hóa đơn cho: ${selectedAppointment.ten_benh_nhan}`} onClose={() => setIsViewInvoiceModalOpen(false)}>
                    <div className="modal-body">
                        <p>Chi tiết hóa đơn sẽ được hiển thị ở đây (GIẢ LẬP).</p>
                        <p>Bệnh nhân: {selectedAppointment.ten_benh_nhan}</p>
                        <p>Ngày khám: {formatDate(selectedAppointment.ngay_dat_lich)}</p>
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