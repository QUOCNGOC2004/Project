import React from 'react';
import { Calendar, Clock, ChevronDown, Info } from "lucide-react";
import '../../../components/css/forDatLich/form1.css';

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
  const danhSachBenhVien = [
    "Chọn cơ sở khám",
    "Bệnh viện Đại học Phenikaa",
    "Phòng khám Đa khoa Đại học Phenikaa",
    "Sinh viên tòa A8"
  ];

  const danhSachChuyenKhoa = ['Tất cả',
    'Y học bào thai',
    'Ung bướu',
    'Tim mạch',
    'Khoa sản',
    'Nội tổng hợp',
    'Ngoại tổng hợp',
    'Khoa Dược'];

  const danhSachBacSi = ["PGS.TS.BS Nguyễn Thanh Hồi", "TS.BS Trần Văn Nam", "BS.CKI Lê Thị Hoa", "PGS.TS Phạm Minh Tuấn"];

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
            >
              <option value="">Chọn bác sĩ</option>
              {danhSachBacSi.map((bacSi, index) => (
                <option key={index} value={bacSi}>
                  {bacSi}
                </option>
              ))}
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