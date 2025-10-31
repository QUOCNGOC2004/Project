import React from 'react';
import './Sidebar.css';
import 'boxicons/css/boxicons.min.css'; 

export interface ScheduleFilterState {
  date: string;
  shifts: {
    sang: boolean;
    chieu: boolean;
    toi: boolean;
  };
  filterAvailable: boolean;
}


interface SidebarProps {
  isScheduleFilterActive: boolean; // Trạng thái BẬT/TẮT của bộ lọc
  onToggleActive: () => void; // Hàm xử lý khi bấm nút BẬT/TẮT
  scheduleFilters: ScheduleFilterState; // State hiện tại của các bộ lọc
  onScheduleChange: (newFilters: ScheduleFilterState) => void; // Hàm cập nhật state
}

const Sidebar: React.FC<SidebarProps> = ({
  isScheduleFilterActive,
  onToggleActive,
  scheduleFilters,
  onScheduleChange
}) => {

  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onScheduleChange({ ...scheduleFilters, date: e.target.value });
  };

  
  const handleShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onScheduleChange({
      ...scheduleFilters,
      shifts: {
        ...scheduleFilters.shifts,
        [name]: checked,
      }
    });
  };

  
  const handleAvailableToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onScheduleChange({ ...scheduleFilters, filterAvailable: e.target.checked });
  };

  return (
    <div className="sidebar">

     
      <button 
        className={`sidebar-header-button ${isScheduleFilterActive ? 'active' : ''}`}
        onClick={onToggleActive}
      >
        Lịch làm việc 
        
        <i className={`bx ${isScheduleFilterActive ? 'bx-toggle-right' : 'bx-toggle-left'}`}></i>
      </button>

      
      <div className={`sidebar-content ${!isScheduleFilterActive ? 'disabled' : ''}`}>

        <div className="schedule-filter-group">
          <label htmlFor="schedule-date">Chọn ngày</label>
          <input
            type="date"
            id="schedule-date"
            value={scheduleFilters.date}
            onChange={handleDateChange}
            disabled={!isScheduleFilterActive} // Vô hiệu hóa khi filter TẮT
          />
        </div>

        <div className="schedule-filter-group">
          <label>Chọn ca làm việc</label>
          <div className="shift-options">

            <div className="filter-checkbox">
              <input
                type="checkbox"
                id="ca-sang"
                name="sang"
                checked={scheduleFilters.shifts.sang}
                onChange={handleShiftChange}
                disabled={!isScheduleFilterActive} // Vô hiệu hóa khi filter TẮT
              />
              <label htmlFor="ca-sang">Ca sáng</label>
            </div>

            <div className="filter-checkbox">
              <input
                type="checkbox"
                id="ca-chieu"
                name="chieu"
                checked={scheduleFilters.shifts.chieu}
                onChange={handleShiftChange}
                disabled={!isScheduleFilterActive} // Vô hiệu hóa khi filter TẮT
              />
              <label htmlFor="ca-chieu">Ca chiều</label>
            </div>

            <div className="filter-checkbox">
              <input
                type="checkbox"
                id="ca-toi"
                name="toi"
                checked={scheduleFilters.shifts.toi}
                onChange={handleShiftChange}
                disabled={!isScheduleFilterActive} // Vô hiệu hóa khi filter TẮT
              />
              <label htmlFor="ca-toi">Ca tối</label>
            </div>
          </div>
        </div>

        <div className="schedule-filter-group">
          <div className="filter-checkbox highlight">
            <input
              type="checkbox"
              id="filter-available"
              checked={scheduleFilters.filterAvailable}
              onChange={handleAvailableToggle}
              disabled={!isScheduleFilterActive} // Vô hiệu hóa khi filter TẮT
            />
            <label htmlFor="filter-available">Lọc lịch trống</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;