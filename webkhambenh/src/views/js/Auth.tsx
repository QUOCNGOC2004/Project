import React, { useState, useEffect } from 'react';
import '../css/Auth.css'; 
import 'boxicons/css/boxicons.min.css'; 

const Auth: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const containerClass = `container ${isActive ? 'active' : ''}`;

    const handleRegisterClick = () => {
        setIsActive(true);
    };

    const handleLoginClick = () => {
        setIsActive(false);
    };

    useEffect(() => {
        // Bạn có thể thêm các side effect khác ở đây nếu cần
    }, [isActive]);

    return (
        <div className={containerClass}>
            <div className="form-box login">
                <form action="#">
                    <h1>Đăng nhập</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Tên đăng nhập" required />
                        <i className='bx bxs-user'></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Mật khẩu" required />
                        <i className='bx bxs-lock-alt' ></i>
                    </div>
                    <div className="forgot-link">
                        <a href="#">Quên mật khẩu?</a>
                    </div>
                    <button type="submit" className="btn">Đăng nhập</button>
                    <p>hoặc đăng nhập bằng</p>
                    <div className="social-icons">
                        <a href="#"><i className='bx bxl-google' ></i></a>
                        <a href="#"><i className='bx bxl-facebook' ></i></a>
                        <a href="#"><i className='bx bxl-github' ></i></a>
                        <a href="#"><i className='bx bxl-linkedin' ></i></a>
                    </div>
                </form>
            </div>

            <div className="form-box register">
                <form action="#">
                    <h1>Đăng ký</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Tên đăng nhập" required />
                        <i className='bx bxs-user'></i>
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder="Email" required />
                        <i className='bx bxs-envelope' ></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Mật khẩu" required />
                        <i className='bx bxs-lock-alt' ></i>
                    </div>
                    <button type="submit" className="btn">Đăng ký</button>
                    <p>hoặc đăng ký bằng</p>
                    <div className="social-icons">
                        <a href="#"><i className='bx bxl-google' ></i></a>
                        <a href="#"><i className='bx bxl-facebook' ></i></a>
                        <a href="#"><i className='bx bxl-github' ></i></a>
                        <a href="#"><i className='bx bxl-linkedin' ></i></a>
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