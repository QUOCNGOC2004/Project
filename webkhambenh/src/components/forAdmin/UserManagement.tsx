import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import AppointmentManagement from './AppointmentManagement';

// --- TYPE DEFINITIONS ---
interface User {
  id: number;
  username: string;
  email: string;
}


// --- HELPER FUNCTIONS ---
const getAuthToken = (): string | null => {
    return localStorage.getItem('admin_token'); 
};

// MODAL COMPONENT
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


// --- MAIN COMPONENT ---
const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                
                await fetchUsers();

            } catch (err) {
                console.error('Lỗi khi xóa user:', err);
                alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể xóa'}`);
            }
        }
    };

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

            {/*Render AppointmentManagement bên trong Modal */}
            {isModalOpen && selectedUser && (
                <Modal title={`Quản lý lịch hẹn của: ${selectedUser.username}`} onClose={handleCloseModal}>
                    <div className="um-modal-body" style={{ padding: '0' }}> 
                        <AppointmentManagement 
                            userIdToFilter={selectedUser.id} 
                            isEmbedded={true} 
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UserManagement;