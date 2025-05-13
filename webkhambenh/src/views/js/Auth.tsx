import React, { useState, useEffect } from 'react';
import '../css/Auth.css'; 
import 'boxicons/css/boxicons.min.css'; 
import axios from 'axios';

const Auth: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const containerClass = `container ${isActive ? 'active' : ''}`;

    const handleRegisterClick = () => {
        setIsActive(true);
        setError('');
    };

    const handleLoginClick = () => {
        setIsActive(false);
        setError('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            // Lưu token và thông tin user vào localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Cập nhật trạng thái đăng nhập trong navbar
            const navbar = document.querySelector('.navbar8-navbar-interactive');
            if (navbar) {
                const event = new CustomEvent('loginStatusChanged', {
                    detail: {
                        isLoggedIn: true,
                        username: formData.username
                    }
                });
                document.dispatchEvent(event);
            }

            // Chuyển hướng về trang chủ
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.error || 'Đăng ký thất bại');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                email: formData.email,
                password: formData.password
            });

            // Lưu token và thông tin user vào localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Cập nhật trạng thái đăng nhập trong navbar
            const navbar = document.querySelector('.navbar8-navbar-interactive');
            if (navbar) {
                const event = new CustomEvent('loginStatusChanged', {
                    detail: {
                        isLoggedIn: true,
                        username: response.data.user.username
                    }
                });
                document.dispatchEvent(event);
            }

            // Chuyển hướng về trang chủ
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.error || 'Đăng nhập thất bại');
        }
    };

    useEffect(() => {
        // Bạn có thể thêm các side effect khác ở đây nếu cần
    }, [isActive]);

    return (
        <div className={containerClass}>
            <div className="form-box login">
                <form onSubmit={handleLogin}>
                    <h1>Đăng nhập</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="input-box">
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email" 
                            required 
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <i className='bx bxs-envelope'></i>
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Mật khẩu" 
                            required 
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <i className='bx bxs-lock-alt'></i>
                    </div>
                    <div className="forgot-link">
                        <a href="#">Quên mật khẩu?</a>
                    </div>
                    <button type="submit" className="btn">Đăng nhập</button>
                    <p>hoặc đăng nhập bằng</p>
                    <div className="social-icons">
                        <a href="#"><i className='bx bxl-google'></i></a>
                        <a href="#"><i className='bx bxl-facebook'></i></a>
                        <a href="#"><i className='bx bxl-github'></i></a>
                        <a href="#"><i className='bx bxl-linkedin'></i></a>
                    </div>
                </form>
            </div>

            <div className="form-box register">
                <form onSubmit={handleRegister}>
                    <h1>Đăng ký</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="input-box">
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Tên đăng nhập" 
                            required 
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                        <i className='bx bxs-user'></i>
                    </div>
                    <div className="input-box">
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email" 
                            required 
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <i className='bx bxs-envelope'></i>
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Mật khẩu" 
                            required 
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <i className='bx bxs-lock-alt'></i>
                    </div>
                    <button type="submit" className="btn">Đăng ký</button>
                    <p>hoặc đăng ký bằng</p>
                    <div className="social-icons">
                        <a href="#"><i className='bx bxl-google'></i></a>
                        <a href="#"><i className='bx bxl-facebook'></i></a>
                        <a href="#"><i className='bx bxl-github'></i></a>
                        <a href="#"><i className='bx bxl-linkedin'></i></a>
                    </div>
                </form>
            </div>

            <div className="toggle-box">
                <div className="toggle-panel toggle-left">
                    <h1>Chào mừng trở lại!</h1>
                    <p>Bạn chưa có tài khoản?</p>
                    <button className="btn register-btn" onClick={handleRegisterClick}>Đăng ký</button>
                    <button type="button" className="btn back-btn" onClick={() => window.history.back()}>Quay lại</button>
                </div>

                <div className="toggle-panel toggle-right">
                    <h1>Xin chào!</h1>
                    <p>Bạn đã có tài khoản?</p>
                    <button className="btn login-btn" onClick={handleLoginClick}>Đăng nhập</button>
                    <button type="button" className="btn back-btn" onClick={() => window.history.back()}>Quay lại</button>
                </div>
            </div>
        </div>
    );
};

export default Auth;