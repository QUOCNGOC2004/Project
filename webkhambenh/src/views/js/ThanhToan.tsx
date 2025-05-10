import React from 'react';
import '../../views/css/ThanhToan.css';

const ThanhToan = () => {
  return (
    <div className="thanh-toan-container">
      <div className="thanh-toan-content">
        <h1>Trang Thanh Toán</h1>
        <p>Trang đang trong quá trình phát triển</p>
        <div className="thanh-toan-message">
          <p>Chúng tôi đang nỗ lực hoàn thiện tính năng này.</p>
          <p>Vui lòng quay lại sau!</p>
        </div>
        <button 
          className="thanh-toan-button"
          onClick={() => window.history.back()}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default ThanhToan; 