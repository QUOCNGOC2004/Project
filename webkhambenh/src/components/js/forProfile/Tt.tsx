import React from "react";
import "../../css/forProfile/tt.css";

const mockAppointmentHistory = [
  { id: 1, date: "2025-09-26", doctor: "GS.TS. BS. Đỗ Quyết", amount: 550000, status: "pending_payment" },
  { id: 2, date: "2025-08-15", doctor: "TS. BS Nguyễn Văn A", amount: 300000, status: "paid" },
  { id: 3, date: "2025-07-02", doctor: "ThS. BS Trần Thị B", amount: 1200000, status: "paid" },
];

const Tt: React.FC = () => {
  return (
    <div className="profile-side-column">
      <div className="profile-card">
        <div className="profile-body">
          <div className="profile-section">
            <h4>Lịch sử khám & Thanh toán</h4>
            <ul className="history-list">
              {mockAppointmentHistory.length > 0 ? (
                mockAppointmentHistory.map((item) => (
                  <li key={item.id} className="history-item">
                    <div className="history-info">
                      <span className="history-date">{item.date}</span>
                      <span className="history-doctor">BS. {item.doctor}</span>
                      <span className="history-amount">
                        {item.amount.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                    <div className="history-action">
                      {item.status === "pending_payment" ? (
                        <button className="pay-now-btn">Thanh toán</button>
                      ) : (
                        <span className="status-paid">Đã thanh toán</span>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <p className="no-history">Chưa có lịch sử khám.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tt;