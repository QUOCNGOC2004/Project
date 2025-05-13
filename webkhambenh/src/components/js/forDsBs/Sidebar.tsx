import React from 'react';

interface SidebarProps {
  activeCenter: string;
  onCenterSelect: (center: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCenter, onCenterSelect }) => {
  const centers = [
    "BS Trung Tâm Y Học Bảo Thai",
    "BS Trung Tâm Ung Bướu",
    "BS Trung Tâm Tim Mạch"
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">Tất Cả</div>

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