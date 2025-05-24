import React from 'react';
import { Calendar, Clock, ChevronDown, Info } from "lucide-react";

interface AppointmentDetailsData {
  hospital: string;
  specialty: string;
  doctor: string;
  date: string;
  time: string;
}

interface AppointmentDetailsFormProps {
  formData: AppointmentDetailsData;
  handleInputChange: (field: keyof AppointmentDetailsData, value: string) => void;
}

const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({ formData, handleInputChange }) => {
  const hospitals = [
    "Chọn cơ sở khám",
    "Bệnh viện Bạch Mai",
    "Bệnh viện Việt Đức",
    "Bệnh viện K",
    "Bệnh viện Đại học Y Hà Nội",
  ];

  const specialties = ["Chọn chuyên khoa", "Tim mạch", "Thần kinh", "Tiêu hóa", "Hô hấp", "Nội tiết", "Da liễu"];

  const doctors = ["PGS.TS.BS Nguyễn Thanh Hồi", "TS.BS Trần Văn Nam", "BS.CKI Lê Thị Hoa", "PGS.TS Phạm Minh Tuấn"];

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
  );
};

export default AppointmentDetailsForm; 