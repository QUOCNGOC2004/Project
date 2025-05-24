import React from 'react';
import '../../../components/css/forDsBs/DoctorCard.css';
import 'boxicons/css/boxicons.min.css';

interface DoctorCardProps {
  name: string;
  position: string;
  imageUrl: string;
  specialty: string;
  experience: number;
  hospital: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ name, position, imageUrl, specialty, experience, hospital }) => {
  const queryParams = new URLSearchParams({
    doctorName: name,
    specialty: specialty,
    position: position,
    hospital: hospital
  }).toString();

  return (
    <div className="doctor-card">
      <div className="doctor-image-container">
        <div className="doctor-image-background"></div>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="doctor-image"
        />
      </div>

      <h3 className="doctor-name">{name}</h3>
      <p className="doctor-position">{position}</p>
      <p className="doctor-specialty">Chuyên khoa: {specialty}</p>
      <p className="doctor-experience">Kinh nghiệm: {experience} năm</p>

      <a href={`/dat-lich?${queryParams}`}>
        <button className="appointment-button">
          <i className='bx bx-calendar-check'></i>
          Đặt lịch khám
        </button>
      </a>
    </div>
  );
};

export default DoctorCard; 