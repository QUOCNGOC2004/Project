import React, { useState, useEffect } from 'react';
import './DoctorScheduleModal.css';
import { X, Loader2, CalendarX } from 'lucide-react';

interface TimeSlot {
  id: number;
  slotTime: string;
  isAvailable: boolean;
}

interface ScheduleShift {
  id: number;
  workDate: string;
  startTime: string;
  endTime: string;
  timeSlots: TimeSlot[];
}

interface ScheduleResponse {
  doctorName: string;
  hocVi: string;
  schedules: ScheduleShift[];
}

// Props của component
interface DoctorScheduleModalProps {
  doctorId: number;
  onClose: () => void;
}

const formatTime = (timeString: string) => timeString.substring(0, 5);

const formatDate = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00Z');
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC' 
  });
};


const DoctorScheduleModal: React.FC<DoctorScheduleModalProps> = ({ doctorId, onClose }) => {
  const [data, setData] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/schedules/${doctorId}/schedule`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`
          },
        });
        if (!response.ok) {
          throw new Error('Không thể tải lịch làm việc');
        }
        const result: ScheduleResponse = await response.json();
        
        result.schedules.forEach(shift => {
            shift.timeSlots.sort((a, b) => a.slotTime.localeCompare(b.slotTime));
        });

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [doctorId]);


  const renderContent = () => {
    if (loading) {
      return <div className="dsm-loading"><Loader2 className="spin-icon" /> Đang tải lịch...</div>;
    }
    if (error) {
      return <div className="dsm-error">Lỗi: {error}</div>;
    }
    if (!data || data.schedules.length === 0) {
      return (
        <div className="dsm-empty">
          <CalendarX size={48} />
          <p>Bác sĩ {data?.doctorName} hiện chưa có lịch làm việc.</p>
          <p>Vui lòng quay lại sau hoặc chọn bác sĩ khác.</p>
        </div>
      );
    }

    return (
      <div className="dsm-schedule-list">
        {data.schedules.map((shift) => (
          <div key={shift.id} className="dsm-shift-group">
            <h3 className="dsm-shift-date">{formatDate(shift.workDate)}</h3>
            <p className="dsm-shift-time">
              <strong>Ca làm việc:</strong> {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
            </p>
            <div className="dsm-slots-grid">
              {shift.timeSlots.map((slot) => {
                
                if (slot.isAvailable) {
                  // Tạo query string
                  const queryParams = new URLSearchParams({
                    doctorName: data.doctorName,
                    id: doctorId.toString(),
                    ngayHen: shift.workDate,
                    gioHen: formatTime(slot.slotTime),
                  }).toString();

                  return (
                    <a
                      key={slot.id}
                      href={`/dat-lich?${queryParams}`}
                      className="dsm-slot-btn" 
                      onClick={onClose} 
                    >
                      {formatTime(slot.slotTime)}
                    </a>
                  );
                } 
                
                else {
                  return (
                    <span
                      key={slot.id}
                      className="dsm-slot-btn disabled"
                    >
                      {formatTime(slot.slotTime)}
                      <span> (Đã đặt)</span>
                    </span>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dsm-backdrop" onClick={onClose}>
      <div className="dsm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dsm-header">
          <h2 className="dsm-title">Lịch làm việc của {data?.hocVi} {data?.doctorName}</h2>
          <button className="dsm-close-btn" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="dsm-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DoctorScheduleModal;