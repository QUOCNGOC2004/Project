import React from 'react';
import '../../views/css/DatLich.css';

const DatLich = () => {
  return (
    <div className="dat-lich-container">
      <div className="dat-lich-content">
        <h1>Trang Đặt lịch</h1>
        <p>Trang đang trong quá trình phát triển</p>
        <div className="dat-lich-message">
          <p>Chúng tôi đang nỗ lực hoàn thiện tính năng này.</p>
          <p>Vui lòng quay lại sau!</p>
        </div>
        <button 
          className="dat-lich-button"
          onClick={() => window.history.back()}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default DatLich; 