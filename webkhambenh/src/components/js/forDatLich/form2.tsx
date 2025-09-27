import React from 'react';
import { Calendar, ChevronDown } from "lucide-react";
import '../../../components/css/forDatLich/form2.css';

interface DuLieuBenhNhan {
  hoTen: string;
  email: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  lyDoKham: string;
  dongYDieuKhoan: boolean;
}

interface PropsForm2 {
  duLieuForm: DuLieuBenhNhan;
  xuLyThayDoi: (truong: keyof DuLieuBenhNhan, giaTri: string | boolean) => void;
}

const Form2: React.FC<PropsForm2> = ({ duLieuForm, xuLyThayDoi }) => {
  const danhSachGioiTinh = ["Chọn giới tính", "Nam", "Nữ", "Khác"];

  return (
    <div className="form-section">
      <h2 className="section-title">THÔNG TIN BỆNH NHÂN</h2>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            Họ và tên <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Họ và tên"
            value={duLieuForm.hoTen}
            onChange={(e) => xuLyThayDoi("hoTen", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            className="form-input"
            placeholder="Email"
            value={duLieuForm.email}
            onChange={(e) => xuLyThayDoi("email", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Chọn giới tính <span className="required">*</span>
          </label>
          <div className="select-wrapper">
            <select
              className="form-select"
              value={duLieuForm.gioiTinh}
              onChange={(e) => xuLyThayDoi("gioiTinh", e.target.value)}
            >
              {danhSachGioiTinh.map((gioiTinh, index) => (
                <option key={index} value={index === 0 ? "" : gioiTinh}>
                  {gioiTinh}
                </option>
              ))}
            </select>
            <ChevronDown className="select-icon" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Ngày tháng năm sinh <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="date"
              className="form-input date-input"
              value={duLieuForm.ngaySinh}
              onChange={(e) => xuLyThayDoi("ngaySinh", e.target.value)}
              placeholder="dd/mm/yyyy"
            />
            <Calendar className="input-icon" />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Số điện thoại <span className="required">*</span>
        </label>
        <input
          type="tel"
          className="form-input"
          placeholder="Số điện thoại"
          pattern="[0-9]{8,15}" 
          inputMode="numeric" 
          value={duLieuForm.soDienThoai}
          onChange={(e) => xuLyThayDoi("soDienThoai", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Lý do khám <span className="required">*</span>
        </label>
        <textarea
          className="form-textarea"
          placeholder="Tình trạng sức khỏe của bạn, các vấn đề cần khám hoặc câu hỏi dành cho bác sĩ"
          value={duLieuForm.lyDoKham}
          onChange={(e) => xuLyThayDoi("lyDoKham", e.target.value)}
          rows={4}
        />
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={duLieuForm.dongYDieuKhoan}
            onChange={(e) => xuLyThayDoi("dongYDieuKhoan", e.target.checked)}
          />
          <span className="checkbox-custom"></span>
          <span className="checkbox-text">
            Tôi đã đọc và xác nhận điều khoản dịch vụ của bệnh viện <span className="required">*</span>
          </span>
        </label>
      </div>
    </div>
  );
};

export default Form2; 