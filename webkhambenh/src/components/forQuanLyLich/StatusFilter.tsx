import React from 'react';
import './StatusFilter.css';

interface StatusFilterProps {
  selectedStatus: string;
  onChange: (value: string) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatus, onChange }) => {
  return (
    <div className="filter-container">
      <label htmlFor="status-filter" className="filter-label">Hiển thị lịch hẹn:</label>
      <select 
        id="status-filter" 
        className="status-dropdown" 
        value={selectedStatus} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="chờ xác nhận">Chờ xác nhận</option>
        <option value="đã xác nhận">Đã xác nhận</option>
        <option value="chưa thanh toán">Chưa thanh toán</option>
        <option value="đã thanh toán">Đã thanh toán</option>
      </select>
    </div>
  );
};