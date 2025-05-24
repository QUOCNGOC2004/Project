import React, { useState } from 'react';
import '../../views/css/DatLich.css';
import AppointmentDetailsForm from '../../components/js/forDatLich/AppointmentDetailsForm';
import PatientInfoForm from '../../components/js/forDatLich/PatientInfoForm';

interface AppointmentDetailsData {
  hospital: string;
  specialty: string;
  doctor: string;
  date: string;
  time: string;
}

interface PatientInfoData {
  fullName: string;
  email: string;
  gender: string;
  birthDate: string;
  phone: string;
  reason: string;
  agreeTerms: boolean;
}

interface FormData extends AppointmentDetailsData, PatientInfoData {}

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
      <div className="appointment-header">
        <h1>Đặt Lịch Khám Bệnh</h1>
        <p>Đặt lịch khám bệnh trực tuyến nhanh chóng và tiện lợi. Chúng tôi sẽ liên hệ xác nhận lịch hẹn của bạn trong thời gian sớm nhất.</p>
      </div>
      <form onSubmit={handleSubmit} className="appointment-form">
        <AppointmentDetailsForm 
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <PatientInfoForm 
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <div className="submit-section">
          <button type="submit" className="submit-button">
            Gửi thông tin
            <span className="button-arrow"></span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DatLich; 