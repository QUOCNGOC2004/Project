import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import '../../views/css/DanhSachBs.css';
import DoctorCard from '../../components/js/forDsBs/DoctorCard';
import FilterSection from '../../components/js/forDsBs/FilterSection';
import Sidebar from '../../components/js/forDsBs/Sidebar';

interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  coSoKham: string;
  chuyenKhoa: string;
  chucVu: string;
  hocVi: string;
  kinhNghiem: string;
  linkAnh: string;
}

const DanhSachBs: React.FC = () => {
  const [activeCenter, setActiveCenter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors from:', 'http://localhost:3002/api/doctors');
      const response = await fetch('http://localhost:3002/api/doctors');
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received doctors data:', data);
      setDoctors(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching doctors');
      setLoading(false);
    }
  };

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
          {doctors.map((doctor) => (
            <DoctorCard
              name={doctor.name}
              position={doctor.chucVu}
              imageUrl={doctor.linkAnh}
              specialty={doctor.chuyenKhoa}
              experience={doctor.kinhNghiem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DanhSachBs; 