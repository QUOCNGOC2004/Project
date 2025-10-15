import React, { useState } from 'react';
import './UserManagement.css';

// --- TYPE DEFINITIONS ---
interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

// --- MOCK DATA ---
const MOCK_USERS: User[] = [
  { id: 1, username: 'ngocquoc', email: 'ngoc@email.com', role: 'user' },
  { id: 2, username: 'admin_user', email: 'admin@email.com', role: 'admin' },
  { id: 3, username: 'benhnhan_a', email: 'benhnhan.a@email.com', role: 'user' },
];

// --- MAIN COMPONENT ---
const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    
    const handleDelete = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };
    
    return (
        <div className="um-container">
            <div className="um-header">
                <h2>Quản lý Người dùng</h2>
            </div>
            <div className="um-table-wrapper">
                <table className="um-table">
                    <thead>
                        <tr>
                            <th>Tên đăng nhập</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td className="um-role-cell">{user.role}</td>
                                <td>
                                    <button onClick={() => handleDelete(user.id)} className="um-action-link">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
