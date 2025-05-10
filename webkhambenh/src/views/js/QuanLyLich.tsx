import React from 'react';
import '../../views/css/QuanLyLich.css';

const QuanLyLich = () => {
  return (
    <div className="quan-ly-lich-container">
      <div className="quan-ly-lich-content">
        <h1>Trang Quản lý lịch hẹn</h1>
        <p>Trang đang trong quá trình phát triển</p>
        <div className="quan-ly-lich-message">
          <p>Chúng tôi đang nỗ lực hoàn thiện tính năng này.</p>
          <p>Vui lòng quay lại sau!</p>
        </div>
        <button 
          className="quan-ly-lich-button"
          onClick={() => window.history.back()}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default QuanLyLich; 