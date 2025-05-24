import React, { useState } from 'react';
import '../../views/css/DatLich.css';
import { Calendar, Clock, ChevronDown, Info } from "lucide-react";

interface FormData {
  hospital: string;
  specialty: string;
  doctor: string;
  date: string;
  time: string;
  fullName: string;
  email: string;
  gender: string;
  birthDate: string;
  phone: string;
  reason: string;
  agreeTerms: boolean;
}

const DatLich: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    hospital: "",
    specialty: "",
    doctor: "",
    date: "",
    time: "",
    fullName: "",
    email: "",
    gender: "",
    birthDate: "",
    phone: "",
    reason: "",
    agreeTerms: false,
  });

  const hospitals = [
    "Chọn cơ sở khám",
    "Bệnh viện Bạch Mai",
    "Bệnh viện Việt Đức",
    "Bệnh viện K",
    "Bệnh viện Đại học Y Hà Nội",
  ];

  const specialties = ["Chọn chuyên khoa", "Tim mạch", "Thần kinh", "Tiêu hóa", "Hô hấp", "Nội tiết", "Da liễu"];

  const doctors = ["PGS.TS.BS Nguyễn Thanh Hồi", "TS.BS Trần Văn Nam", "BS.CKI Lê Thị Hoa", "PGS.TS Phạm Minh Tuấn"];

  const genders = ["Chọn giới tính", "Nam", "Nữ", "Khác"];

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Đã gửi thông tin đặt lịch thành công!");
  };

  return (
    <div className="appointment-container">
      <form onSubmit={handleSubmit} className="appointment-form">
        {/* Phần 1: Nội dung chi tiết đặt lịch hẹn */}
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
                  value={formData.hospital}
                  onChange={(e) => handleInputChange("hospital", e.target.value)}
                >
                  {hospitals.map((hospital, index) => (
                    <option key={index} value={index === 0 ? "" : hospital}>
                      {hospital}
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
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
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
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
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
                  value={formData.specialty}
                  onChange={(e) => handleInputChange("specialty", e.target.value)}
                >
                  {specialties.map((specialty, index) => (
                    <option key={index} value={index === 0 ? "" : specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
                <ChevronDown className="select-icon" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Chọn bác sĩ</label>
            <div className="select-wrapper">
              <select
                className="form-select"
                value={formData.doctor}
                onChange={(e) => handleInputChange("doctor", e.target.value)}
              >
                <option value="">Chọn bác sĩ</option>
                {doctors.map((doctor, index) => (
                  <option key={index} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" />
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

        {/* Phần 2: Thông tin bệnh nhân */}
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

          <div className="submit-section">
            <button type="submit" className="submit-button">
              Gửi thông tin
              <span className="button-arrow">→→</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DatLich; 