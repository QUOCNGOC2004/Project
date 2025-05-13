import React, { useState } from 'react';
import 'boxicons/css/boxicons.min.css';
import '../../views/css/DanhSachBs.css';
import DoctorCard from '../../components/js/forDsBs/DoctorCard';
import FilterSection from '../../components/js/forDsBs/FilterSection';
import Sidebar from '../../components/js/forDsBs/Sidebar';

const DanhSachBs: React.FC = () => {
  const [activeCenter, setActiveCenter] = useState("BS Trung Tâm Tim Mạch");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleFilterChange = (filterType: string, value: string) => {
    // Implement filter logic here
    console.log(`Filter changed: ${filterType} - ${value}`);
  };

  const handleCenterSelect = (center: string) => {
    setActiveCenter(center);
    // Implement center selection logic here
  };

  // Sample doctor data - replace with actual data from database
  const doctors = [
    {
      name: "PGS.TS. BS Nguyễn Thanh Hồi",
      position: "Tổng Giám đốc Bệnh viện",
      imageUrl: "/placeholder.svg",
      specialty: "Tim mạch",
      experience: "20 năm"
    },
    {
      name: "GS.TS. BS. Đỗ Quyết",
      position: "Phó Tổng Giám Đốc Bệnh Viện",
      imageUrl: "/placeholder.svg",
      specialty: "Nội tổng hợp",
      experience: "25 năm"
    },
    {
      name: "PGS.TS. BSNT Vũ Hồng Thăng",
      position: "Phó Tổng Giám Đốc Bệnh Viện",
      imageUrl: "/placeholder.svg",
      specialty: "Ngoại tổng hợp",
      experience: "15 năm"
    },
    {
      name: "TS. BS Nguyễn Văn A",
      position: "Trưởng khoa Tim mạch",
      imageUrl: "/placeholder.svg",
      specialty: "Tim mạch",
      experience: "15 năm"
    },
    {
      name: "ThS. BS Trần Thị B",
      position: "Phó khoa Nội tổng hợp",
      imageUrl: "/placeholder.svg",
      specialty: "Nội tổng hợp",
      experience: "10 năm"
    },
    {
      name: "BS. Nguyễn Văn C",
      position: "Bác sĩ điều trị",
      imageUrl: "/placeholder.svg",
      specialty: "Ngoại tổng hợp",
      experience: "8 năm"
    }
  ];

  return (
    <div className="doctor-directory">
      <h1 className="directory-title">ĐỘI NGŨ CHUYÊN GIA BÁC SĨ</h1>

      <FilterSection 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      <div className="content-container">
        <Sidebar 
          activeCenter={activeCenter}
          onCenterSelect={handleCenterSelect}
        />

        <div className="doctor-grid">
          {doctors.map((doctor, index) => (
            <DoctorCard
              key={index}
              name={doctor.name}
              position={doctor.position}
              imageUrl={doctor.imageUrl}
              specialty={doctor.specialty}
              experience={doctor.experience}
            />
          ))}
        </div>
      </div>

      <div className="chat-icon">
        <div className="chat-icon-container">
          <i className='bx bx-message-dots'></i>
          <div className="notification-badge">1</div>
        </div>
      </div>
    </div>
  );
};

export default DanhSachBs; 