import React from 'react';

interface SidebarProps {
  activeCenter: string;
  onCenterSelect: (center: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCenter, onCenterSelect }) => {
  const centers = [
    "Bệnh viện Đại học Phenikaa",
    "Phòng khám Đa khoa Đại học Phenikaa",
    "Sinh viên tòa A8 "
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">Cơ sở khám</div>
      {centers.map((center, index) => (
        <div
          key={index}
          className={`sidebar-item ${activeCenter === center ? 'active' : ''}`}
          onClick={() => onCenterSelect(center)}
        >
          {activeCenter === center && <span className="active-dot"></span>}
          <h3>{center}</h3>
        </div>
      ))}
    </div>
  );
};

export default Sidebar; 