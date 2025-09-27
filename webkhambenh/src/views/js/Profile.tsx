import React, { useState, useEffect } from "react";
import "../../views/css/profile.css"; // We will use the new CSS file

// Mock data for appointment history
const mockAppointmentHistory = [
  {
    id: 1,
    date: "2025-09-26",
    doctor: "GS.TS. BS. Đỗ Quyết",
    amount: 550000,
    status: "pending_payment", // 'pending_payment' or 'paid'
  },
  {
    id: 2,
    date: "2025-08-15",
    doctor: "TS. BS Nguyễn Văn A",
    amount: 300000,
    status: "paid",
  },
  {
    id: 3,
    date: "2025-07-02",
    doctor: "ThS. BS Trần Thị B",
    amount: 1200000,
    status: "paid",
  },
];

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_AUTH_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.user) {
          // Initialize new fields if they don't exist
          setUser({
            ...data.user,
            bank_name: data.user.bank_name || "",
            account_holder: data.user.account_holder || "",
            account_number: data.user.account_number || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // The 'user' object now includes bank details
    const res = await fetch(`${process.env.REACT_APP_AUTH_API_URL}/auth/profile`, {
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
      localStorage.setItem("user", JSON.stringify(data.user));

      const event = new CustomEvent("loginStatusChanged", {
        detail: { isLoggedIn: true, username: data.user.username },
      });
      document.dispatchEvent(event);
    }
  };

  if (!user) return <div className="loading-container">Đang tải...</div>;

  return (
    <div className="profile-page-v2">
      {/* User Profile Card */}
      <div className="profile-card-v2">
        <div className="profile-header-v2">
          <img
            src="https://placehold.co/120x120/E65103/white?text=User"
            alt="Ảnh đại diện"
            className="profile-avatar-v2"
          />
          <h2 className="profile-name-v2">{user.username ?? "N/A"}</h2>
          <p className="profile-email-v2">{user.email ?? "N/A"}</p>
        </div>

        <div className="profile-body-v2">
          {/* Section: Personal Info */}
          <div className="profile-section">
            <div className="section-header">
              <h4>Thông tin cá nhân</h4>
              {!isEditing && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
              )}
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Số điện thoại</label>
                {isEditing ? (
                  <input type="text" name="so_dien_thoai" value={user.so_dien_thoai || ""} onChange={handleEditChange} />
                ) : (
                  <span>{user.so_dien_thoai || "Chưa cập nhật"}</span>
                )}
              </div>
              <div className="info-item">
                <label>Giới tính</label>
                {isEditing ? (
                  <select name="gioi_tinh" value={user.gioi_tinh || ""} onChange={handleEditChange}>
                    <option value="">Không xác định</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                ) : (
                  <span>{user.gioi_tinh || "Chưa cập nhật"}</span>
                )}
              </div>
              <div className="info-item">
                <label>Ngày sinh</label>
                {isEditing ? (
                  <input type="date" name="ngay_sinh" value={user.ngay_sinh || ""} onChange={handleEditChange} />
                ) : (
                  <span>{user.ngay_sinh || "Chưa cập nhật"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section: Payment Info */}
          <div className="profile-section">
            <div className="section-header">
              <h4>Thông tin thanh toán (Mô phỏng)</h4>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Tên ngân hàng</label>
                {isEditing ? (
                  <input type="text" name="bank_name" value={user.bank_name || ""} onChange={handleEditChange} />
                ) : (
                  <span>{user.bank_name || "Chưa liên kết"}</span>
                )}
              </div>
              <div className="info-item">
                <label>Chủ tài khoản</label>
                {isEditing ? (
                  <input type="text" name="account_holder" value={user.account_holder || ""} onChange={handleEditChange} />
                ) : (
                  <span>{user.account_holder || "Chưa liên kết"}</span>
                )}
              </div>
              <div className="info-item">
                <label>Số tài khoản</label>
                {isEditing ? (
                  <input type="text" name="account_number" value={user.account_number || ""} onChange={handleEditChange} />
                ) : (
                  <span>{user.account_number || "Chưa liên kết"}</span>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="action-buttons">
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Hủy</button>
              <button className="save-btn" onClick={handleSave}>Lưu thay đổi</button>
            </div>
          )}
        </div>
      </div>

      {/* Appointment and Payment History Card */}
      <div className="profile-card-v2">
        <div className="profile-body-v2">
          <div className="profile-section">
            <div className="section-header">
              <h4>Lịch sử khám & Thanh toán</h4>
            </div>
            <ul className="history-list">
              {mockAppointmentHistory.map((item) => (
                <li key={item.id} className="history-item">
                  <div className="history-info">
                    <span className="history-date">{item.date}</span>
                    <span className="history-doctor">BS. {item.doctor}</span>
                    <span className="history-amount">{item.amount.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="history-action">
                    {item.status === 'pending_payment' ? (
                      <button className="pay-now-btn">Thanh toán ngay</button>
                    ) : (
                      <span className="status-paid">Đã thanh toán</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;