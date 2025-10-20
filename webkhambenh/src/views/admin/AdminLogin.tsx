import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css'; 

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/admin/login`, {
                username,
                password
            });
            localStorage.setItem('admin_token', response.data.token);
            localStorage.setItem('admin_info', JSON.stringify(response.data.user));
            history.push('/adminPanel');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h1>Đăng Nhập Admin</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Đăng Nhập</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;