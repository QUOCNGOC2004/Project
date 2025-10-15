import React, { useState } from 'react';
import './Admin.css';
import DoctorManagement from '../../components/forAdmin/DoctorManagement';
import ScheduleManagement from '../../components/forAdmin/ScheduleManagement';
import AppointmentManagement from '../../components/forAdmin/AppointmentManagement';
import UserManagement from '../../components/forAdmin/UserManagement';

const AdminPage: React.FC = () => {
  
    type Page = 'doctors' | 'schedules' | 'appointments' | 'users';
    const [activePage, setActivePage] = useState<Page>('doctors');
    const renderPage = () => {
        switch (activePage) {
            case 'doctors':
                return <DoctorManagement />;
            case 'schedules':
                return <ScheduleManagement />;
            case 'appointments':
                return <AppointmentManagement />;
            case 'users':
                return <UserManagement />;
            default:
                return <DoctorManagement />;
        }
    };

    const NavLink: React.FC<{ page: Page; children: React.ReactNode }> = ({ page, children }) => (
        <button
            onClick={() => setActivePage(page)}
            className={`admin-nav-link ${activePage === page ? 'active' : ''}`}
        >
            {children}
        </button>
    );

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h1>Admin Panel</h1>
                </div>
                <nav className="admin-nav">
                    <NavLink page="doctors">Quản lý Bác sĩ</NavLink>
                    <NavLink page="schedules">Quản lý Lịch làm việc</NavLink>
                    <NavLink page="appointments">Quản lý Lịch hẹn</NavLink>
                    <NavLink page="users">Quản lý Người dùng</NavLink>
                </nav>
            </aside>
            <main className="admin-main-content">
                {renderPage()}
            </main>
        </div>
    );
};

export default AdminPage;
