import React from 'react';
import { Appointment } from './types';
import './AppointmentList.css';
import { Placeholder } from  './Placeholder';

interface AppointmentListProps {
  appointments: Appointment[];
  selectedAppointmentId: number | null;
  onSelect: (id: number) => void;
  formatCurrency: (amount: number) => string;
  isLoading: boolean;
  error: string | null;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  selectedAppointmentId,
  onSelect,
  formatCurrency,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return <Placeholder>Đang tải danh sách thanh toán...</Placeholder>;
  }
  if (error) {
    return <Placeholder style={{ color: 'red' }}>{error}</Placeholder>;
  }
  if (appointments.length === 0) {
    return <Placeholder>Bạn không có lịch hẹn nào cần thanh toán hoặc đã thanh toán.</Placeholder>;
  }

  return (
    <ul id="appointments-ul">
      {appointments.map((a) => (
        <li
          key={a.id}
          className={`appointment-item ${selectedAppointmentId === a.id ? 'active' : ''
            }`}
          onClick={() => onSelect(a.id)}
        >
          <div className="appointment-price">
            {a.totalAmount !== null
              ? formatCurrency(a.totalAmount)
              : (a.status === 'chưa thanh toán' ? "Chờ Hóa Đơn" : "N/A")}
          </div>
          <div className="appointment-info">Ngày khám: {a.date}</div>
          <div className="appointment-info">Bác sĩ: {a.doctorName}</div>

          <span className={`status-badge ${a.status === 'chưa thanh toán' ? 'status-chua-thanh-toan' : 'status-da-thanh-toan'
            }`}>
            {a.status}
          </span>
        </li>
      ))}
    </ul>
  );
};