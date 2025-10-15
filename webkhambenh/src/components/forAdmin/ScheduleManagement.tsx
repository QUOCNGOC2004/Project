import React, { useState, useMemo } from 'react';
import './ScheduleManagement.css';

// --- TYPE DEFINITIONS ---
interface Doctor {
  id: number;
  name: string;
}

interface Schedule {
  id: number;
  doctorId: number;
  work_date: string;
  start_time: string;
  end_time: string;
}

// --- MOCK DATA (Reduced for this component) ---
const MOCK_DOCTORS: Doctor[] = [
  { id: 1, name: 'PGS.TS. BS Nguyễn Thanh Hồi' },
  { id: 2, name: 'GS.TS. BS. Đỗ Quyết' },
  { id: 3, name: 'BSNT. Lê Thị Hương' },
];

const MOCK_SCHEDULES: Schedule[] = [
  { id: 1, doctorId: 1, work_date: '2025-10-20', start_time: '08:00', end_time: '12:00' },
  { id: 2, doctorId: 2, work_date: '2025-10-20', start_time: '13:00', end_time: '17:00' },
  { id: 3, doctorId: 1, work_date: '2025-10-21', start_time: '08:00', end_time: '17:00' },
];

// --- SUB COMPONENTS ---
const ScheduleForm: React.FC<{ doctors: Doctor[]; onAdd: (schedule: Omit<Schedule, 'id'>) => void }> = ({ doctors, onAdd }) => {
    const [formData, setFormData] = useState({ doctorId: '', work_date: '', start_time: '', end_time: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.doctorId) {
            alert('Vui lòng chọn bác sĩ.');
            return;
        }
        onAdd({
            ...formData,
            doctorId: parseInt(formData.doctorId),
        });
        setFormData({ doctorId: formData.doctorId, work_date: formData.work_date, start_time: '', end_time: '' });
    };

    const handleShiftSelect = (shift: 'morning' | 'afternoon' | 'evening') => {
        const shifts = {
            morning: { start_time: '08:00', end_time: '12:00' },
            afternoon: { start_time: '13:00', end_time: '17:00' },
            evening: { start_time: '18:00', end_time: '21:00' },
        };
        setFormData(prev => ({ ...prev, ...shifts[shift] }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    return (
        <form onSubmit={handleSubmit} className="sm-form">
            <div className="sm-form-grid">
                <div className="sm-form-group">
                    <label>Bác sĩ</label>
                    <select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                        <option value="">Chọn bác sĩ</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div className="sm-form-group">
                    <label>Ngày</label>
                    <input type="date" name="work_date" value={formData.work_date} onChange={handleChange} required />
                </div>
                <div className="sm-form-group">
                    <label>Giờ bắt đầu</label>
                    <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
                </div>
                <div className="sm-form-group">
                    <label>Giờ kết thúc</label>
                    <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
                </div>
            </div>
            <div className="sm-form-actions">
                <div className="sm-shift-buttons">
                     <label>Chọn nhanh:</label>
                    <button type="button" onClick={() => handleShiftSelect('morning')} className="sm-shift-btn sm-shift-morning">Ca Sáng</button>
                    <button type="button" onClick={() => handleShiftSelect('afternoon')} className="sm-shift-btn sm-shift-afternoon">Ca Chiều</button>
                    <button type="button" onClick={() => handleShiftSelect('evening')} className="sm-shift-btn sm-shift-evening">Ca Tối</button>
                </div>
                <button type="submit" className="sm-button sm-button-add">Thêm Lịch</button>
            </div>
        </form>
    );
};

// --- MAIN COMPONENT ---
const ScheduleManagement: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>(MOCK_SCHEDULES);
    const [doctors] = useState<Doctor[]>(MOCK_DOCTORS);
    const [currentWeek, setCurrentWeek] = useState(new Date());

    const handleAddSchedule = (schedule: Omit<Schedule, 'id'>) => {
        setSchedules([...schedules, { ...schedule, id: Date.now() }]);
        alert('Đã thêm lịch làm việc mới!');
    };

    const weekDays = useMemo(() => {
        const startOfWeek = new Date(currentWeek);
        startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1); // Bắt đầu từ thứ 2
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            return date;
        });
    }, [currentWeek]);

    return (
        <div className="sm-container">
            <h2>Quản lý Lịch làm việc</h2>
            
            <div className="sm-form-container">
                <h3>Thêm Lịch Mới</h3>
                <ScheduleForm doctors={doctors} onAdd={handleAddSchedule} />
            </div>

            <div className="sm-calendar-container">
                <div className="sm-calendar-nav">
                    <button onClick={() => setCurrentWeek(d => new Date(d.setDate(d.getDate() - 7)))}>&lt; Tuần trước</button>
                    <h3>{`Tuần từ ${weekDays[0].toLocaleDateString('vi-VN')} - ${weekDays[6].toLocaleDateString('vi-VN')}`}</h3>
                    <button onClick={() => setCurrentWeek(d => new Date(d.setDate(d.getDate() + 7)))}>Tuần sau &gt;</button>
                </div>
                <div className="sm-calendar-grid">
                    {weekDays.map(day => <div key={day.toISOString()} className="sm-calendar-header">{day.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit' })}</div>)}
                    {weekDays.map(day => {
                        const daySchedules = schedules.filter(s => new Date(s.work_date).toDateString() === day.toDateString());
                        return (
                            <div key={day.toISOString()} className="sm-calendar-day">
                                {daySchedules.map(schedule => {
                                    const doctor = doctors.find(d => d.id === schedule.doctorId);
                                    return (
                                        <div key={schedule.id} className="sm-schedule-item">
                                            <p className="sm-schedule-doctor">{doctor?.name}</p>
                                            <p className="sm-schedule-time">{schedule.start_time} - {schedule.end_time}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ScheduleManagement;
