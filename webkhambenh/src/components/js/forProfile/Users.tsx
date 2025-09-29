import React, { useState, useEffect } from "react";
import "../../css/forProfile/users.css";

const Users: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [originalUser, setOriginalUser] = useState<any>(null); // Lưu trữ dữ liệu gốc
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
          const userData = {
            ...data.user,
            bank_name: data.user.bank_name || "",
            account_holder: data.user.account_holder || "",
            account_number: data.user.account_number || "",
          };
          setUser(userData);
          setOriginalUser(userData); // Lưu dữ liệu gốc
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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

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
      setOriginalUser(data.user); // Cập nhật dữ liệu gốc sau khi lưu
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify(data.user));
      const event = new CustomEvent("loginStatusChanged", {
        detail: { isLoggedIn: true, username: data.user.username },
      });
      document.dispatchEvent(event);
    }
  };

  const handleCancel = () => {
    setUser(originalUser); // Khôi phục dữ liệu gốc
    setIsEditing(false);
  };

  if (!user) return <div className="loading-container">Đang tải...</div>;

  return (
    <div className="profile-main-column">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src="https://placehold.co/100x100/E65103/white?text=User"
            alt="Ảnh đại diện"
            className="profile-avatar"
          />
          <div className="profile-name-container">
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={user.username || ""}
                onChange={handleEditChange}
                className="username-input"
              />
            ) : (
              <h2 className="profile-name">{user.username ?? "N/A"}</h2>
            )}
            <p className="profile-email">{user.email ?? "N/A"}</p>
          </div>
          {!isEditing && (
            <button className="edit-btn-header" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </button>
          )}
        </div>

        <div className="profile-body">
          <form onSubmit={handleSave}>
            <div className="profile-section">
              <h4>Thông tin cá nhân</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="so_dien_thoai"
                      required
                      pattern="[0-9]{8,13}"
                      inputMode="numeric"
                      value={user.so_dien_thoai || ""}
                      onChange={handleEditChange}
                    />
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
                    <input
                      type="date"
                      name="ngay_sinh"
                      value={user.ngay_sinh || ""}
                      onChange={handleEditChange}
                    />
                  ) : (
                    <span>{user.ngay_sinh || "Chưa cập nhật"}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h4>Thông tin thanh toán</h4>
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
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
                <button type="submit" className="save-btn">
                  Lưu thay đổi
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Users;