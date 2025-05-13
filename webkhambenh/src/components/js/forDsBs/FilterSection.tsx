import React from 'react';
import '../../../components/css/forDsBs/FilterSection.css';
import 'boxicons/css/boxicons.min.css';

interface FilterSectionProps {
  onSearch: (query: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onSearch, onFilterChange }) => {
  return (
    <div className="filter-section">
      <button className="filter-button" onClick={() => onFilterChange('facility', '')}>
        Cơ sở khám
        <i className='bx bx-chevron-down'></i>
      </button>

      <button className="filter-button" onClick={() => onFilterChange('position', '')}>
        Chức vụ
        <i className='bx bx-chevron-down'></i>
      </button>

      <button className="filter-button" onClick={() => onFilterChange('specialty', '')}>
        Chuyên khoa
        <i className='bx bx-chevron-down'></i>
      </button>

      <button className="filter-button" onClick={() => onFilterChange('experience', '')}>
        Kinh nghiệm
        <i className='bx bx-chevron-down'></i>
      </button>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm bác sĩ..."
          onChange={(e) => onSearch(e.target.value)}
        />
        <i className='bx bx-search'></i>
      </div>
    </div>
  );
};

export default FilterSection; 