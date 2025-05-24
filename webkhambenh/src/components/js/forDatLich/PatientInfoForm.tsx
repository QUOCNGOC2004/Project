import React from 'react';
import { Calendar, ChevronDown } from "lucide-react";

interface PatientInfoData {
  fullName: string;
  email: string;
  gender: string;
  birthDate: string;
  phone: string;
  reason: string;
  agreeTerms: boolean;
}

interface PatientInfoFormProps {
  formData: PatientInfoData;
  handleInputChange: (field: keyof PatientInfoData, value: string | boolean) => void;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({ formData, handleInputChange }) => {
  const genders = ["Chọn giới tính", "Nam", "Nữ", "Khác"];

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
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
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
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Chọn giới tính <span className="required">*</span>
          </label>
          <div className="select-wrapper">
            <select
              className="form-select"
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
            >
              {genders.map((gender, index) => (
                <option key={index} value={index === 0 ? "" : gender}>
                  {gender}
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
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
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
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Lý do khám <span className="required">*</span>
        </label>
        <textarea
          className="form-textarea"
          placeholder="Tình trạng sức khỏe của bạn, các vấn đề cần khám hoặc câu hỏi dành cho bác sĩ"
          value={formData.reason}
          onChange={(e) => handleInputChange("reason", e.target.value)}
          rows={4}
        />
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={formData.agreeTerms}
            onChange={(e) => handleInputChange("agreeTerms", e.target.checked)}
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

export default PatientInfoForm; 