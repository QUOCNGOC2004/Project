import React, { useState } from 'react';
import './Sidebar.css';


const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const Sidebar: React.FC = () => {

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());

  // 2. State cho các ca
  const [selectedShifts, setSelectedShifts] = useState({
    sang: false,
    chieu: false,
    toi: false,
  });

  // 3. State cho nút "Lọc lịch trống"
  const [filterAvailable, setFilterAvailable] = useState<boolean>(false);


  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSelectedShifts(prevShifts => ({
      ...prevShifts,
      [name]: checked,
    }));
  };

  const handleAvailableToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterAvailable(e.target.checked);
  };

  return (
    <div className="sidebar">

      <div className="sidebar-header">Lịch làm việc</div>


      <div className="sidebar-content">


        <div className="schedule-filter-group">
          <label htmlFor="schedule-date">Chọn ngày</label>
          <input
            type="date"
            id="schedule-date"
            value={selectedDate}
            onChange={handleDateChange}
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
                checked={selectedShifts.sang}
                onChange={handleShiftChange}
              />
              <label htmlFor="ca-sang">Ca sáng</label>
            </div>

            <div className="filter-checkbox">
              <input
                type="checkbox"
                id="ca-chieu"
                name="chieu"
                checked={selectedShifts.chieu}
                onChange={handleShiftChange}
              />
              <label htmlFor="ca-chieu">Ca chiều</label>
            </div>

            <div className="filter-checkbox">
              <input
                type="checkbox"
                id="ca-toi"
                name="toi"
                checked={selectedShifts.toi}
                onChange={handleShiftChange}
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
              checked={filterAvailable}
              onChange={handleAvailableToggle}
            />
            <label htmlFor="filter-available">Lọc lịch trống</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;