import React from 'react';
import '../../views/css/DanhSachBs.css';

const DanhSachBs = () => {
  return (
    <div className="danh-sach-bs-container">
      <div className="danh-sach-bs-content">
        <h1>Trang Danh sách bác sĩ</h1>
        <p>Trang đang trong quá trình phát triển</p>
        <div className="danh-sach-bs-message">
          <p>Chúng tôi đang nỗ lực hoàn thiện tính năng này.</p>
          <p>Vui lòng quay lại sau!</p>
        </div>
        <button 
          className="danh-sach-bs-button"
          onClick={() => window.history.back()}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default DanhSachBs; 