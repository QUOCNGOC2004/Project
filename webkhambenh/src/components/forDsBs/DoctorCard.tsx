import React from 'react';
import './DoctorCard.css';
import 'boxicons/css/boxicons.min.css';

interface DoctorCardProps {
  name: string;
  imageUrl: string;
  experience: number;
  id: number;
  hocVi: string;      
  moTaBacSi: string;  
}


const DoctorCard: React.FC<DoctorCardProps> = ({ name, imageUrl, experience, id, hocVi, moTaBacSi }) => {
  const queryParams = new URLSearchParams({
    doctorName: name,
    id: id.toString()
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
      <p className="doctor-position">{moTaBacSi}</p>
      <p className="doctor-specialty">Học vị: {hocVi}</p>
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