import React from 'react';
import './InvoicePendingPlaceholder.css';

export const InvoicePendingPlaceholder: React.FC = () => (
  <div className="placeholder invoice-pending">
    <div className="icon">📄</div>
    <h3>Chưa có hóa đơn</h3>
    <p>Quản trị viên chưa tạo hóa đơn chi tiết cho lịch hẹn này.</p>
    <p>Vui lòng chờ hoặc liên hệ phòng khám để được hỗ trợ.</p>
  </div>
);