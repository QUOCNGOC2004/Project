import React, { useState } from 'react';
import './FilterSection.css';
import 'boxicons/css/boxicons.min.css';

interface FilterSectionProps {
  onSearch: (query: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onSearch, onFilterChange }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState({
    specialty: 'Chuyên khoa',
    position: 'Chức vụ',
    degree: 'Học vị',
    experience: 'Kinh nghiệm'
  });

  const filterOptions = {
    specialty: [
      'Tất cả',
      'Y học bào thai',
      'Ung bướu',
      'Tim mạch',
      'Khoa sản',
      'Nội tổng hợp',
      'Ngoại tổng hợp',
      'Khoa Dược'
    ],
    position: [
      'Tất cả',
      'Tổng giám đốc',
      'Phó tổng giám đốc',
      'Giám đốc trung tâm',
      'Phó giám đốc trung tâm',
      'Trưởng Khoa',
      'Phó Trưởng Khoa'
    ],
    degree: [
      'Tất cả',
      'Tiến sĩ',
      'Bác sĩ chuyên khoa',
      'Thạc sĩ',
      'Bác sĩ nội trú',
      'Bác sĩ',
      'Sinh viên thực tập'
    ],
    experience: [
      'Tất cả',
      'dưới 5 năm',
      '5-10 năm',
      '10-15 năm',
      '15-20 năm',
      'trên 20 năm'
    ]
  };

  const handleFilterClick = (filterType: string) => {
    setActiveDropdown(activeDropdown === filterType ? null : filterType);
  };

  const handleOptionSelect = (filterType: string, value: string) => {
    onFilterChange(filterType, value);
    setActiveDropdown(null);
    
    // Cập nhật nội dung hiển thị trên nút
    setSelectedOptions(prev => ({
      ...prev,
      [filterType]: value === 'Tất cả' ? 
        filterType === 'specialty' ? 'Chuyên khoa' :
        filterType === 'position' ? 'Chức vụ' :
        filterType === 'degree' ? 'Học vị' :
        'Kinh nghiệm'
        : value
    }));
  };

  return (
    <div className="filter-section">
      <div className="filter-button-container">
        <button 
          className="filter-button" 
          onClick={() => handleFilterClick('specialty')}
        >
          {selectedOptions.specialty}
          <i className='bx bx-chevron-down'></i>
        </button>
        {activeDropdown === 'specialty' && (
          <div className="dropdown-menu">
            {filterOptions.specialty.map((option, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleOptionSelect('specialty', option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="filter-button-container">
        <button 
          className="filter-button" 
          onClick={() => handleFilterClick('position')}
        >
          {selectedOptions.position}
          <i className='bx bx-chevron-down'></i>
        </button>
        {activeDropdown === 'position' && (
          <div className="dropdown-menu">
            {filterOptions.position.map((option, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleOptionSelect('position', option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="filter-button-container">
        <button 
          className="filter-button" 
          onClick={() => handleFilterClick('degree')}
        >
          {selectedOptions.degree}
          <i className='bx bx-chevron-down'></i>
        </button>
        {activeDropdown === 'degree' && (
          <div className="dropdown-menu">
            {filterOptions.degree.map((option, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleOptionSelect('degree', option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="filter-button-container">
        <button 
          className="filter-button" 
          onClick={() => handleFilterClick('experience')}
        >
          {selectedOptions.experience}
          <i className='bx bx-chevron-down'></i>
        </button>
        {activeDropdown === 'experience' && (
          <div className="dropdown-menu">
            {filterOptions.experience.map((option, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleOptionSelect('experience', option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm bác sĩ..."
          onChange={(e) => onSearch(e.target.value)}
        />
        <i className='bx bx-search'></i> {/* thẻ icon tìm kiếm */}
      </div>
    </div>
  );
};

export default FilterSection; 