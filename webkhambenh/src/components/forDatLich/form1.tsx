import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, Info } from "lucide-react";
import './form1.css';

interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  gioiTinh: string;       
  moTaBacSi: string;    
  hocVi: string;
  kinhNghiem: number;
  linkAnh: string;
}

interface DuLieuChiTietLichHen {
  benhVien: string;
  chuyenKhoa: string;
  bacSi: string;
  bacSiId: number;
  ngayHen: string;
  gioHen: string;
}

interface PropsForm1 {
  duLieuForm: DuLieuChiTietLichHen;
  xuLyThayDoi: (truong: keyof DuLieuChiTietLichHen, giaTri: string | number) => void;
}

const Form1: React.FC<PropsForm1> = ({ duLieuForm, xuLyThayDoi }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
    xuLyThayDoi("benhVien", "Số 11,Yên Nghĩa,Hà Đông,Hà Nội");
    xuLyThayDoi("chuyenKhoa", "N/A"); 
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/doctors`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      console.error('Lỗi lấy dữ liệu bác sĩ:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lấy dữ liệu bác sĩ');
    } finally {
      setLoading(false);
    }
  };


  const filteredDoctors = doctors;

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDoctorName = e.target.value;
    const selectedDoctor = doctors.find(doctor => doctor.name === selectedDoctorName);
    
    if (selectedDoctor) {
      // Cập nhật tên và ID bác sĩ
      xuLyThayDoi("bacSi", selectedDoctor.name);
      xuLyThayDoi("bacSiId", selectedDoctor.id);
      console.log("Đã chọn bác sĩ:", selectedDoctor.name, "ID:", selectedDoctor.id);
    } else {
      xuLyThayDoi("bacSi", "");
      xuLyThayDoi("bacSiId", 0);
    }
  };

  return (
    <div className="form-section">
      <h2 className="section-title">NỘI DUNG CHI TIẾT ĐẶT LỊCH HẸN</h2>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            Bệnh viện/phòng khám <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <a
              href="https://maps.app.goo.gl/nx3rGJMq5BZtK7Yu8"
              target="_blank"
              rel="noopener noreferrer"
              className="form-input"
              style={{ 
                textDecoration: 'none', 
                color: '#d78931ff', 
                cursor: 'pointer',
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'white',
                height: '35px'
              }}
            >
              Phòng khám Đại học Phenikaa
            </a>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Chọn ngày <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="date"
              className="form-input date-input"
              value={duLieuForm.ngayHen}
              onChange={(e) => xuLyThayDoi("ngayHen", e.target.value)}
              placeholder="dd/mm/yyyy"
            />
            <Calendar className="input-icon" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Chọn giờ <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="time"
              className="form-input time-input"
              value={duLieuForm.gioHen}
              onChange={(e) => xuLyThayDoi("gioHen", e.target.value)}
              placeholder="--:-- --"
            />
            <Clock className="input-icon" />
          </div>
        </div>
        
        
        <div className="form-group">
          <label className="form-label">Chọn bác sĩ <span className="required">*</span></label>
          <div className="select-wrapper">
            <select
              className="form-select"
              value={duLieuForm.bacSi}
              onChange={handleDoctorChange}
              disabled={loading}
            >
              <option value="">Chọn bác sĩ</option>
              {loading ? (
                <option disabled>Đang tải...</option>
              ) : error ? (
                <option disabled>Lỗi: {error}</option>
              ) : filteredDoctors.length === 0 ? (
                <option disabled>Không có bác sĩ</option>
              ) : (
                filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.hocVi} {doctor.name}
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="select-icon" />
          </div>
        </div>
      </div>

      <div className="note-section">
        <div className="note-content">
          <Info className="note-icon" />
          <span className="note-text">
            *Lưu ý: Thời gian trên chỉ là thời gian dự kiến, tổng đài sẽ liên hệ xác nhận thời gian chính xác tới
            quý khách sau khi quý khách đặt hẹn.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Form1;