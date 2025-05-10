import React, { useState, useEffect } from 'react';
import '../css/Auth.css';
// import 'boxicons/css/boxicons.min.css'; // Xóa import của Boxicons

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
                        <i className="fas fa-user"></i> {/* Thay thế bxs-user */}
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Mật khẩu" required />
                        <i className="fas fa-lock"></i> {/* Thay thế bxs-lock-alt */}
                    </div>
                    <div className="forgot-link">
                        <a href="#">Quên mật khẩu?</a>
                    </div>
                    <button type="submit" className="btn">Đăng nhập</button>
                    <p>hoặc đăng nhập bằng</p>
                    <div className="social-icons">
                        <a href="#"><i className="fab fa-google"></i></a> {/* Thay thế bxl-google */}
                        <a href="#"><i className="fab fa-facebook-f"></i></a> {/* Thay thế bxl-facebook */}
                        <a href="#"><i className="fab fa-github"></i></a> {/* Thay thế bxl-github */}
                        <a href="#"><i className="fab fa-linkedin-in"></i></a> {/* Thay thế bxl-linkedin */}
                    </div>
                </form>
            </div>

            <div className="form-box register">
                <form action="#">
                    <h1>Đăng ký</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Tên đăng nhập" required />
                        <i className="fas fa-user"></i> {/* Thay thế bxs-user */}
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder="Email" required />
                        <i className="fas fa-envelope"></i> {/* Thay thế bxs-envelope */}
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Mật khẩu" required />
                        <i className="fas fa-lock"></i> {/* Thay thế bxs-lock-alt */}
                    </div>
                    <button type="submit" className="btn">Đăng ký</button>
                    <p>hoặc đăng ký bằng</p>
                    <div className="social-icons">
                        <a href="#"><i className="fab fa-google"></i></a> {/* Thay thế bxl-google */}
                        <a href="#"><i className="fab fa-facebook-f"></i></a> {/* Thay thế bxl-facebook */}
                        <a href="#"><i className="fab fa-github"></i></a> {/* Thay thế bxl-github */}
                        <a href="#"><i className="fab fa-linkedin-in"></i></a> {/* Thay thế bxl-linkedin */}
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