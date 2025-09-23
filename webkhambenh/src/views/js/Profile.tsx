import React, { useState, useEffect } from "react";
import "../../views/css/profile.css";

const API_URL = process.env.REACT_APP_AUTH_API_URL;

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Gọi API lấy profile khi load
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    };

    fetchProfile();
  }, []);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      setIsEditing(false);
    }
  };

  if (!user) return <p>Đang tải...</p>;

  return (
    <div className="profile-page">
      <h2 className="profile-page-title">Hồ sơ cá nhân</h2>

      <div className="profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-header">Menu</div>
          <div className="sidebar-item">
            <h3>Thông tin tài khoản</h3>
          </div>
          <div className="sidebar-item">
            <h3>Đổi mật khẩu</h3>
          </div>
          <div className="sidebar-item">
            <h3>Cài đặt</h3>
          </div>
        </div>

        {/* Profile content */}
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <h2 className="profile-title">Thông tin tài khoản</h2>
              <div className="profile-image-container">
                <img
                  src="https://placehold.co/100x100/E65103/white?text=User"
                  alt="Ảnh đại diện"
                  className="profile-image"
                />
              </div>
            </div>

            <div className="profile-body">
              <div className="profile-username-container">
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={user.username || ""}
                    onChange={handleEditChange}
                    className="info-value-input"
                  />
                ) : (
                  <h3 className="profile-username">{user.username}</h3>
                )}
                {!isEditing && (
                  <span
                    className="edit-icon"
                    onClick={() => setIsEditing(true)}
                  >
                    &#9998;
                  </span>
                )}
              </div>

              <div className="profile-info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>

              <div className="profile-info-item">
                <span className="info-label">Số điện thoại:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="so_dien_thoai"
                    value={user.so_dien_thoai || ""}
                    onChange={handleEditChange}
                    className="info-value-input"
                  />
                ) : (
                  <span className="info-value">{user.so_dien_thoai}</span>
                )}
              </div>

              <div className="profile-info-item">
                <span className="info-label">Giới tính:</span>
                {isEditing ? (
                  <select
                    name="gioi_tinh"
                    value={user.gioi_tinh || ""}
                    onChange={handleEditChange}
                    className="info-value-input"
                  >
                    <option value="">Không xác định</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                ) : (
                  <span className="info-value">
                    {user.gioi_tinh || "Không xác định"}
                  </span>
                )}
              </div>

              <div className="profile-info-item">
                <span className="info-label">Ngày sinh:</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="ngay_sinh"
                    value={user.ngay_sinh || ""}
                    onChange={handleEditChange}
                    className="info-value-input"
                  />
                ) : (
                  <span className="info-value">{user.ngay_sinh}</span>
                )}
              </div>

              {isEditing ? (
                <div className="edit-buttons">
                  <button className="save-btn" onClick={handleSave}>
                    Lưu
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <div className="edit-buttons">
                  <button
                    className="save-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa hồ sơ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
