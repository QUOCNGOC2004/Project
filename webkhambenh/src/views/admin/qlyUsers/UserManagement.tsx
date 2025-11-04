import UserDetailModal from '../../../components/forAdmin/qlyUsersAndLichHen/UserDetailModal';
import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import '../../../components/forAdmin/qlyUsersAndLichHen/Table.css';
import AppointmentManagement from '../qlyLichHen/AppointmentManagement';
import { User } from '../../../components/forAdmin/qlyUsersAndLichHen/index';
import { getAuthToken } from '../../../components/forAdmin/qlyUsersAndLichHen/auth'; 
import { Modal } from '../../../components/forAdmin/qlyUsersAndLichHen/Modal'; 

// --- MAIN COMPONENT ---
const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State cho modal "Xem lịch"
    const [isApptModalOpen, setIsApptModalOpen] = useState(false);
    const [selectedUserForAppt, setSelectedUserForAppt] = useState<User | null>(null);

    // State cho modal "Chi tiết"
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);

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
    }, [API_URL]); 

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không? Thao tác này không thể hoàn tác.')) {
            const token = getAuthToken();
            if (!token) {
                alert("Lỗi xác thực.");
                return;
            }
            try {
                const response = await fetch(`${API_URL}/auth/user/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Xóa thất bại');
                }
                await fetchUsers();
            } catch (err) {
                console.error('Lỗi khi xóa user:', err);
                alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể xóa'}`);
            }
        }
    };

    // --- Handler cho modal "Xem lịch" ---
    const handleOpenApptModal = (user: User) => {
        setSelectedUserForAppt(user);
        setIsApptModalOpen(true);
    };
    const handleCloseApptModal = () => {
        setIsApptModalOpen(false);
        setSelectedUserForAppt(null);
    };

    // --- Handler cho modal "Chi tiết" ---
    const handleOpenDetailModal = (user: User) => {
        setSelectedUserForDetail(user);
        setIsDetailModalOpen(true);
    };
    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedUserForDetail(null);
    };
    
    return (
        <div className="um-container">
            <div className="um-header">
                <h2>Quản lý Người dùng</h2>
            </div>
            
            <div className="common-table-wrapper">
                {isLoading && <div className="common-loading">Đang tải dữ liệu...</div>}
                {error && <div className="common-error">Lỗi: {error}</div>}
                {!isLoading && !error && (
                    <table className="common-table" style={{minWidth: '600px'}}>
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
                                    <tr key={user.id}
                                        onClick={() => handleOpenDetailModal(user)}
                                        className="um-clickable-row" 
                                    >
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenApptModal(user);
                                                }} 
                                                className="um-action-link um-link-button"
                                            >
                                                Xem lịch
                                            </button>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(user.id);
                                                }} 
                                                className="um-action-link"
                                            >
                                                Xóa
                                            </button>
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

            {/* Modal "Xem lịch hẹn" */}
            {isApptModalOpen && selectedUserForAppt && (
                <Modal title={`Quản lý lịch hẹn của: ${selectedUserForAppt.username}`} onClose={handleCloseApptModal}>
                    <div style={{ padding: '0', margin: '-1.5rem' }}> 
                        <AppointmentManagement 
                            userIdToFilter={selectedUserForAppt.id} 
                            isEmbedded={true} 
                        />
                    </div>
                </Modal>
            )}

            {/* Render Modal "Chi tiết" */}
            {isDetailModalOpen && selectedUserForDetail && (
                <UserDetailModal
                    userId={selectedUserForDetail.id}
                    username={selectedUserForDetail.username}
                    onClose={handleCloseDetailModal}
                />
            )}
        </div>
    );
};

export default UserManagement;