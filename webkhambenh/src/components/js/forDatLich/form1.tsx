import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, Info } from "lucide-react";
import '../../../components/css/forDatLich/form1.css';

interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  coSoKham: string;
  chuyenKhoa: string;
  chucVu: string;
  moTaChucVu: string;
  hocVi: string;
  kinhNghiem: number;
  linkAnh: string;
}

interface DuLieuChiTietLichHen {
  benhVien: string;
  chuyenKhoa: string;
  bacSi: string;
  ngayHen: string;
  gioHen: string;
}

interface PropsForm1 {
  duLieuForm: DuLieuChiTietLichHen;
  xuLyThayDoi: (truong: keyof DuLieuChiTietLichHen, giaTri: string) => void;
}

const Form1: React.FC<PropsForm1> = ({ duLieuForm, xuLyThayDoi }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const danhSachBenhVien = [
    "Chọn cơ sở khám",
    "Bệnh viện Đại học Phenikaa",
    "Phòng khám Đa khoa Đại học Phenikaa",
    "Sinh viên tòa A8"
  ];

  const danhSachChuyenKhoa = ['Chọn chuyên khoa',
    'Y học bào thai',
    'Ung bướu',
    'Tim mạch',
    'Khoa sản',
    'Nội tổng hợp',
    'Ngoại tổng hợp',
    'Khoa Dược'];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_DOCTOR_API_URL}/doctors`);

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

  // Lọc danh sách bác sĩ theo chuyên khoa và cơ sở khám đã chọn
  const filteredDoctors = doctors.filter(doctor => {
    const matchChuyenKhoa = !duLieuForm.chuyenKhoa || doctor.chuyenKhoa === duLieuForm.chuyenKhoa;
    const matchCoSoKham = !duLieuForm.benhVien || doctor.coSoKham === duLieuForm.benhVien;
    return matchChuyenKhoa && matchCoSoKham;
  });

  // Reset lựa chọn bác sĩ khi thay đổi chuyên khoa hoặc cơ sở khám
  useEffect(() => {
    xuLyThayDoi("bacSi", "");
  }, [duLieuForm.chuyenKhoa, duLieuForm.benhVien]);

  return (
    <div className="form-section">
      <h2 className="section-title">NỘI DUNG CHI TIẾT ĐẶT LỊCH HẸN</h2>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            Bệnh viện/phòng khám <span className="required">*</span>
          </label>
          <div className="select-wrapper">
            <select
              className="form-select"
              value={duLieuForm.benhVien}
              onChange={(e) => xuLyThayDoi("benhVien", e.target.value)}
            >
              {danhSachBenhVien.map((benhVien, index) => (
                <option key={index} value={index === 0 ? "" : benhVien}>
                  {benhVien}
                </option>
              ))}
            </select>
            <ChevronDown className="select-icon" />
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
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            Chọn chuyên khoa <span className="required">*</span>
          </label>
          <div className="select-wrapper">
            <select
              className="form-select"
              value={duLieuForm.chuyenKhoa}
              onChange={(e) => xuLyThayDoi("chuyenKhoa", e.target.value)}
            >
              {danhSachChuyenKhoa.map((chuyenKhoa, index) => (
                <option key={index} value={index === 0 ? "" : chuyenKhoa}>
                  {chuyenKhoa}
                </option>
              ))}
            </select>
            <ChevronDown className="select-icon" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Chọn bác sĩ</label>
          <div className="select-wrapper">
            <select
              className="form-select"
              value={duLieuForm.bacSi}
              onChange={(e) => xuLyThayDoi("bacSi", e.target.value)}
              disabled={loading || !duLieuForm.chuyenKhoa || !duLieuForm.benhVien}
            >
              <option value="">Chọn bác sĩ</option>
              {loading ? (
                <option disabled>Đang tải...</option>
              ) : error ? (
                <option disabled>Lỗi: {error}</option>
              ) : !duLieuForm.chuyenKhoa ? (
                <option disabled>Vui lòng chọn chuyên khoa</option>
              ) : !duLieuForm.benhVien ? (
                <option disabled>Vui lòng chọn cơ sở khám</option>
              ) : filteredDoctors.length === 0 ? (
                <option disabled>Không có bác sĩ phù hợp</option>
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