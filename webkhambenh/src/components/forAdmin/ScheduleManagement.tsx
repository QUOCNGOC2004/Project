import React, { useState, useMemo, useEffect } from 'react';
import './ScheduleManagement.css';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const SCHEDULES_API = `${API_URL}/schedules`;
const DOCTORS_API = `${API_URL}/doctors`; 

// --- TYPE DEFINITIONS ---
interface Doctor {
  id: number;
  name: string;
}

interface TimeSlot {
  id: number;
  slotTime: string;
  isAvailable: boolean;
  appointmentId: number | null;
}

interface Schedule {
  id: number;
  doctorId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  doctor: Doctor;
  timeSlots: TimeSlot[];
}

type NewScheduleData = Omit<Schedule, 'id' | 'doctor' | 'timeSlots'>;


interface ScheduleFormProps {
  doctors: Doctor[];
  onAdd: (scheduleData: NewScheduleData) => Promise<void>;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ doctors, onAdd }) => {
    const [formData, setFormData] = useState({
        doctorId: '',
        workDate: '',
        startTime: '',
        endTime: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.doctorId || !formData.workDate || !formData.startTime || !formData.endTime) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            await onAdd({
                ...formData,
                doctorId: parseInt(formData.doctorId),
            });
            setFormData(prev => ({ 
                ...prev, 
                startTime: '', 
                endTime: '' 
            }));
        } catch (error) {
            console.error('Lỗi khi thêm lịch:', error);
            alert(`Không thể thêm lịch: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleShiftSelect = (shift: 'morning' | 'afternoon' | 'evening') => {
        const shifts = {
            morning: { startTime: '08:00', endTime: '12:00' },
            afternoon: { startTime: '13:00', endTime: '17:00' },
            evening: { startTime: '18:00', endTime: '21:00' },
        };
        setFormData(prev => ({ ...prev, ...shifts[shift] }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
                    <input type="date" name="workDate" value={formData.workDate} onChange={handleChange} required />
                </div>
                <div className="sm-form-group">
                    <label>Giờ bắt đầu</label>
                    <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                </div>
                <div className="sm-form-group">
                    <label>Giờ kết thúc</label>
                    <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
                </div>
            </div>
            <div className="sm-form-actions">
                <div className="sm-shift-buttons">
                     <label>Chọn nhanh:</label>
                    <button type="button" onClick={() => handleShiftSelect('morning')} className="sm-shift-btn sm-shift-morning">Ca Sáng</button>
                    <button type="button" onClick={() => handleShiftSelect('afternoon')} className="sm-shift-btn sm-shift-afternoon">Ca Chiều</button>
                    <button type="button" onClick={() => handleShiftSelect('evening')} className="sm-shift-btn sm-shift-evening">Ca Tối</button>
                </div>
                <button type="submit" className="sm-button sm-button-add" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang thêm...' : 'Thêm Lịch'}
                </button>
            </div>
        </form>
    );
};


// --- MAIN COMPONENT ---
const ScheduleManagement: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Hàm fetch dữ liệu
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('admin_token'); 

        if (!token) {
            setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
            setIsLoading(false);
            return;
        }

        const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        

        try {
            // 3. Gửi headers trong cả hai yêu cầu
            const [schedulesResponse, doctorsResponse] = await Promise.all([
                fetch(SCHEDULES_API, { headers: authHeaders }), 
                fetch(DOCTORS_API, { headers: authHeaders })  
            ]);

            if (!schedulesResponse.ok) {
                if (schedulesResponse.status === 401) throw new Error('Lỗi tải lịch: Token không hợp lệ hoặc đã hết hạn.');
                throw new Error(`Lỗi tải lịch: ${schedulesResponse.statusText}`);
            }
            

            const schedulesData: Schedule[] = await schedulesResponse.json();
            const doctorsData: Doctor[] = await doctorsResponse.json();

            setSchedules(schedulesData);
            setDoctors(doctorsData);

        } catch (err) {
            console.error('Lỗi fetch dữ liệu:', err);
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    
    const handleAddSchedule = async (scheduleData: NewScheduleData) => {
        
        
        const token = localStorage.getItem('admin_token');
        if (!token) {
            throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
        }
        

        const response = await fetch(SCHEDULES_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(scheduleData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Không thể tạo lịch');
        }

        const newScheduleApi: Omit<Schedule, 'doctor'> = await response.json();
        const doctor = doctors.find(d => d.id === newScheduleApi.doctorId);
        
        const newSchedule: Schedule = {
            ...newScheduleApi,
            doctor: doctor || { id: newScheduleApi.doctorId, name: 'Không rõ' }
        };

        setSchedules(prevSchedules => [...prevSchedules, newSchedule]);
        alert('Đã thêm lịch làm việc mới!');
    };

    const weekDays = useMemo(() => {
        const startOfWeek = new Date(currentWeek);
        startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1);
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            return date;
        });
    }, [currentWeek]);

    if (isLoading) {
        return <div className="sm-container"><h2>Quản lý Lịch làm việc</h2><div>Đang tải dữ liệu...</div></div>;
    }

    if (error) {
        return <div className="sm-container"><h2>Quản lý Lịch làm việc</h2><div style={{ color: 'red' }}>Lỗi: {error}</div></div>;
    }

    
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
                        const daySchedules = schedules
                            .filter(s => new Date(s.workDate).toDateString() === day.toDateString())
                            .sort((a, b) => a.startTime.localeCompare(b.startTime));

                        const groupedSchedules = daySchedules.reduce((acc, schedule) => {
                            const timeKey = `${schedule.startTime} - ${schedule.endTime}`;
                            if (!acc[timeKey]) {
                                acc[timeKey] = [];
                            }
                            acc[timeKey].push(schedule);
                            return acc;
                        }, {} as Record<string, Schedule[]>);

                        const handleGroupClick = (schedulesInGroup: Schedule[], timeKey: string) => {
                            const doctorNames = schedulesInGroup
                                .map(s => s.doctor?.name || 'Không rõ')
                                .join('\n - ');
                            alert(`Các bác sĩ làm việc ca ${timeKey}:\n - ${doctorNames}`);
                        };

                        return (
                            <div key={day.toISOString()} className="sm-calendar-day">
                                {Object.entries(groupedSchedules).map(([timeKey, schedulesInGroup]) => {
                                    
                                    if (schedulesInGroup.length > 1) {
                                        return (
                                            <div 
                                                key={timeKey} 
                                                className="sm-schedule-item" 
                                                onClick={() => handleGroupClick(schedulesInGroup, timeKey)}
                                                style={{ cursor: 'pointer', backgroundColor: '#fed7aa' }}
                                            >
                                                <p className="sm-schedule-doctor">Nhiều bác sĩ</p>
                                                <p className="sm-schedule-time">{timeKey}</p>
                                            </div>
                                        );
                                    }

                                    const schedule = schedulesInGroup[0];
                                    const doctorName = schedule.doctor?.name || 'Không rõ';
                                    
                                    return (
                                        <div key={schedule.id} className="sm-schedule-item">
                                            <p className="sm-schedule-doctor">{doctorName}</p>
                                            <p className="sm-schedule-time">{schedule.startTime} - {schedule.endTime}</p>
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