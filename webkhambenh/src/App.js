import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/js/home';
import ThanhToan from './views/js/ThanhToan';
import DatLich from './views/js/DatLich';
import DanhSachBs from './views/js/DanhSachBs';
import QuanLyLich from './views/js/QuanLyLich';
import NotFound from './views/js/not-found';
import Auth from './views/js/Auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thanh-toan" element={<ThanhToan />} />
        <Route path="/dat-lich" element={<DatLich />} />
        <Route path="/danh-sach-bs" element={<DanhSachBs />} />
        <Route path="/quan-ly-lich" element={<QuanLyLich />} />
        <Route path="/dang-nhap-dang-ky" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;