import React, { useState, useEffect } from 'react';
import './UserManagement.css';

// --- TYPE DEFINITIONS ---
interface User {
  id: number;
  username: string;
  email: string;
}

type AppointmentStatus = 'chờ xác nhận' | 'đã xác nhận' | 'chưa thanh toán' | 'đã thanh toán';

interface Appointment {
  id: number;
  ten_benh_nhan: string;
  doctor_name: string; // Đảm bảo API trả về trường này
  ngay_dat_lich: string;
  gio_dat_lich: string;
  trang_thai: AppointmentStatus;
}

// --- HELPER FUNCTIONS ---
const getAuthToken = (): string | null => {
    return localStorage.getItem('admin_token'); 
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5);
};

const getStatusClass = (status: AppointmentStatus) => {
    switch (status) {
        case 'chờ xác nhận': return 'status-yellow';
        case 'đã xác nhận': return 'status-cyan';
        case 'chưa thanh toán': return 'status-red';
        case 'đã thanh toán': return 'status-green';
        default: return 'status-gray';
    }
};

// --- MODAL COMPONENT (Tái sử dụng từ AppointmentManagement) ---
const Modal: React.FC<{ children: React.ReactNode; title: string; onClose: () => void }> = ({ children, title, onClose }) => (
    <div className="um-modal-overlay">
        <div className="um-modal-content">
            <div className="um-modal-header">
                <h3>{title}</h3>
                <button onClick={onClose} className="um-modal-close-btn">&times;</button>
            </div>
            {children} 
        </div>
    </div>
);

// --- (MỚI) MODAL XEM LỊCH SỬ LỊCH HẸN ---
const AppointmentHistoryModal: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserAppointments = async () => {
            setIsLoading(true);
            setError(null);
            const token = getAuthToken();
            if (!token) {
                setError("Lỗi xác thực.");
                setIsLoading(false);
                return;
            }

            try {
                // Sử dụng endpoint từ LichHenRoutes.ts
                // (Giả định LichHenService được mount tại /api/appointments)
                const response = await fetch(`${API_URL}/appointments/user/${user.id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Không thể tải lịch hẹn');
                }

                const data: Appointment[] = await response.json();
                setAppointments(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Lỗi không xác định');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserAppointments();
    }, [user.id, API_URL]);

    return (
        <Modal title={`Lịch sử đặt lịch của: ${user.username}`} onClose={onClose}>
            <div className="um-modal-body">
                {isLoading && <div className="um-loading">Đang tải lịch hẹn...</div>}
                {error && <div className="um-error">Lỗi: {error}</div>}
                {!isLoading && !error && (
                    <table className="um-table">
                        <thead>
                            <tr>
                                <th>Bác sĩ</th>
                                <th>Ngày hẹn</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length > 0 ? (
                                appointments.map(app => (
                                    <tr key={app.id}>
                                        <td>{app.doctor_name || 'N/A'}</td>
                                        <td>
                                            {formatDate(app.ngay_dat_lich)} @ {formatTime(app.gio_dat_lich)}
                                        </td>
                                        <td>
                                            <span className={`um-status-badge ${getStatusClass(app.trang_thai)}`}>
                                                {app.trang_thai}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>Người dùng này chưa đặt lịch hẹn nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="um-modal-actions">
                <button onClick={onClose} className="um-button-secondary">Đóng</button>
            </div>
        </Modal>
    );
};

// --- MAIN COMPONENT ---
const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // (MỚI) State cho Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const API_URL = process.env.REACT_APP_API_URL;

    // --- API CALLS ---
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        
        const token = getAuthToken();
        if (!token) {
            setError("Bạn chưa đăng nhập hoặc không có quyền.");
            setIsLoading(false);
            return;
        }

        try {
            // (SỬA) Giả định bạn đã thêm endpoint: GET /api/auth/users
            const response = await fetch(`${API_URL}/auth/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || `Lỗi ${response.status}`);
            }

            const data: User[] = await response.json();
            setUsers(data);

        } catch (err) {
            console.error('Lỗi khi fetch users:', err);
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không? Thao tác này không thể hoàn tác.')) {
            const token = getAuthToken();
            if (!token) {
                alert("Lỗi xác thực.");
                return;
            }

            try {
                // (SỬA) Giả định bạn đã thêm endpoint: DELETE /api/auth/user/:id
                const response = await fetch(`${API_URL}/auth/user/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Xóa thất bại');
                }
                
                // Tải lại danh sách sau khi xóa
                await fetchUsers();

            } catch (err) {
                console.error('Lỗi khi xóa user:', err);
                alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể xóa'}`);
            }
        }
    };

    // (MỚI) Hàm mở/đóng modal
    const handleOpenModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };
    
    return (
        <div className="um-container">
            <div className="um-header">
                <h2>Quản lý Người dùng</h2>
            </div>
            <div className="um-table-wrapper">
                {isLoading && <div className="um-loading">Đang tải dữ liệu...</div>}
                {error && <div className="um-error">Lỗi: {error}</div>}
                {!isLoading && !error && (
                    <table className="um-table">
                        <thead>
                            <tr>
                                <th>Tên đăng nhập</th>
                                <th>Email</th>
                                <th>Xem lịch đã đặt</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleOpenModal(user)} 
                                                className="um-action-link um-link-button"
                                            >
                                                Xem lịch
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(user.id)} className="um-action-link">Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>Không tìm thấy người dùng nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* (MỚI) Render Modal */}
            {isModalOpen && selectedUser && (
                <AppointmentHistoryModal user={selectedUser} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default UserManagement;