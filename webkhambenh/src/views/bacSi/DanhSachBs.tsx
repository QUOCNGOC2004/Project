import React, { useState, useEffect, useCallback } from 'react';
import 'boxicons/css/boxicons.min.css';
import './DanhSachBs.css';
import DoctorCard from '../../components/forDsBs/DoctorCard';
import FilterSection from '../../components/forDsBs/FilterSection';
import Sidebar, { ScheduleFilterState } from '../../components/forDsBs/Sidebar'; 
import DoctorScheduleModal from '../../components/forDsBs/DoctorScheduleModal';

interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  gioiTinh: string; 
  moTaBacSi: string; 
  hocVi: string; 
  kinhNghiem: number;
  linkAnh: string; 
}

interface SelectedFilters {
  gender?: string;
  degree?: string;
  experience?: string;
}

// Hàm lấy ngày hôm nay
const getTodayDate = () => new Date().toISOString().split('T')[0];

const DanhSachBs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [isScheduleFilterActive, setIsScheduleFilterActive] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [scheduleFilters, setScheduleFilters] = useState<ScheduleFilterState>({
    date: getTodayDate(),
    shifts: { sang: false, chieu: false, toi: false },
    filterAvailable: false,
  });


  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };


  const fetchFilteredDoctors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();

      // 1. Thêm tiêu chí tìm kiếm Tên
      if (searchQuery.trim()) {
        queryParams.append('name', searchQuery);
      }

      // 2. Thêm tiêu chí lọc từ FilterSection 
      Object.entries(selectedFilters).forEach(([key, val]) => {
        if (val && val !== 'Tất cả') {
          queryParams.append(key, val);
        }
      });

      // 3. Thêm tiêu chí lọc từ Sidebar 
      if (isScheduleFilterActive) {
        queryParams.append('workDate', scheduleFilters.date);
        
        if (scheduleFilters.filterAvailable) {
          queryParams.append('filterAvailable', 'true');
        }

        // Thêm các ca được chọn
        Object.entries(scheduleFilters.shifts).forEach(([shift, isSelected]) => {
          if (isSelected) {
            
            queryParams.append('shifts', shift); 
          }
        });
      }
      
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/doctors/filter?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      console.error('Lỗi khi lọc/tìm kiếm bác sĩ:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lấy dữ liệu bác sĩ');
    } finally {
      setLoading(false);
    }
  };

  
  const debouncedFetch = useCallback(debounce(fetchFilteredDoctors, 500), [searchQuery, selectedFilters, isScheduleFilterActive, scheduleFilters]);

  useEffect(() => {
    debouncedFetch();
  }, [debouncedFetch]); 

 
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  
  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  
  const handleScheduleFilterChange = (newFilters: ScheduleFilterState) => {
    setScheduleFilters(newFilters);
  };

  // Xử lý bật/tắt bộ lọc lịch (chỉ cập nhật state)
  const handleToggleScheduleFilter = () => {
    setIsScheduleFilterActive(prev => !prev);
  };

  return (
    <div className="doctor-directory">
      <h1 className="directory-title">ĐỘI NGŨ CHUYÊN GIA BÁC SĨ</h1>

      <FilterSection
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      <div className="content-container">
        <Sidebar
          isScheduleFilterActive={isScheduleFilterActive}
          onToggleActive={handleToggleScheduleFilter}
          scheduleFilters={scheduleFilters}
          onScheduleChange={handleScheduleFilterChange}
        />

        <div className="doctor-grid">
          {loading ? (
            <div>Đang tải...</div>
          ) : error ? (
            <div className="error-message">Lỗi: {error}</div>
          ) : doctors.length > 0 ? (
            doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                id={doctor.id}
                name={doctor.name}
                imageUrl={doctor.linkAnh}
                experience={doctor.kinhNghiem}
                hocVi={doctor.hocVi}
                moTaBacSi={doctor.moTaBacSi}
                onViewSchedule={() => setSelectedDoctorId(doctor.id)}
              />
            ))
          ) : (
            <p>Không tìm thấy bác sĩ phù hợp với tiêu chí.</p>
          )}
        </div>
      </div>
      {selectedDoctorId && (
        <DoctorScheduleModal
          doctorId={selectedDoctorId}
          onClose={() => setSelectedDoctorId(null)}
        />
      )}
    </div>
  );
};

export default DanhSachBs;
