import React from 'react';
import '../../views/css/ThanhToan.css';

const ThanhToan = () => {
  return (
    <div className="thanh-toan-container">
      <div className="thanh-toan-content">
        <h1>Trang Thanh Toán</h1>
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