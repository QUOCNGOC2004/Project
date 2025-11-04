import React from 'react';
import { Appointment, AppointmentStatus } from './index';
import { formatDate, formatTime } from './formatters';
import './AppointmentTable.css';
import './Table.css'; 

interface AppointmentTableProps {
    appointments: Appointment[];
    isLoading: boolean;
    error: string | null;
    onOpenDetail: (appointment: Appointment) => void;
    onPatientSeen: (e: React.MouseEvent, id: number) => void;
    onStatusChange: (e: React.MouseEvent, id: number, status: AppointmentStatus) => void;
    onOpenCreateInvoice: (e: React.MouseEvent, appointment: Appointment) => void;
    onOpenViewInvoice: (e: React.MouseEvent, appointment: Appointment) => void;
}

const getStatusClass = (status: AppointmentStatus) => {
    switch (status) {
        case 'chờ xác nhận': return 'am-status-yellow';
        case 'đã xác nhận': return 'am-status-cyan';
        case 'chưa thanh toán': return 'am-status-red';
        case 'đã thanh toán': return 'am-status-green';
        default: return 'am-status-gray';
    }
};

const AppointmentTable: React.FC<AppointmentTableProps> = ({
    appointments,
    isLoading,
    error,
    onOpenDetail,
    onPatientSeen,
    onStatusChange,
    onOpenCreateInvoice,
    onOpenViewInvoice // Không dùng
}) => {
    
    if (isLoading) {
        return <div className="common-loading">Đang tải dữ liệu...</div>;
    }
    
    if (error) {
        return <div className="common-error">Lỗi: {error}</div>;
    }

    return (
        <div className="common-table-wrapper">
            <table className="common-table">
                <thead>
                    <tr>
                        <th>Bệnh nhân</th>
                        <th>Bác sĩ</th>
                        <th>Ngày hẹn</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map(app => (
                            <tr 
                                key={app.id}
                                onClick={() => onOpenDetail(app)} 
                                style={{ cursor: 'pointer' }} 
                            >
                                <td>{app.ten_benh_nhan}</td>
                                <td>{app.doctorName || 'N/A'}</td>
                                <td>
                                    {formatDate(app.ngay_dat_lich)} @ {formatTime(app.gio_dat_lich)}
                                </td>
                                <td>
                                    <span className={`am-status-badge ${getStatusClass(app.trang_thai)}`}>
                                        {app.trang_thai}
                                    </span>
                                </td>
                                <td className="am-table-actions">
                                    {app.trang_thai === 'chờ xác nhận' && (
                                        <button onClick={(e) => onStatusChange(e, app.id, 'đã xác nhận')} className="am-action-btn am-btn-green">Xác nhận</button>
                                    )}
                                    {app.trang_thai === 'đã xác nhận' && (
                                        <>
                                            <button onClick={(e) => onPatientSeen(e, app.id)} className="am-action-btn am-btn-blue">Đã khám</button>
                                            <button onClick={(e) => onStatusChange(e, app.id, 'chờ xác nhận')} className="am-action-btn am-btn-gray">Hủy</button>
                                        </>
                                    )}
                                    
                                    {app.trang_thai === 'chưa thanh toán' && !app.hasInvoice && (
                                        <button onClick={(e) => onOpenCreateInvoice(e, app)} className="am-action-btn am-btn-purple">Tạo Hóa đơn</button>
                                    )}
                                    {app.trang_thai === 'chưa thanh toán' && app.hasInvoice && (
                                        <>
                                            <button onClick={(e) => onOpenCreateInvoice(e, app)} className="am-action-btn am-btn-yellow">Sửa Hóa đơn</button>
                                        </>
                                    )}
                                    {app.trang_thai === 'đã thanh toán' && app.hasInvoice && (
                                        <button onClick={(e) => onOpenViewInvoice(e, app)} className="am-action-btn am-btn-teal">Xem Hóa đơn</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>Không tìm thấy lịch hẹn nào.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentTable;