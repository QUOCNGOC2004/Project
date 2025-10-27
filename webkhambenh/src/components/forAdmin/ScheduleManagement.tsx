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

const formatTime = (timeString: string): string => {
    if (typeof timeString !== 'string' || timeString.length < 5) {
        return timeString;
    }
    return timeString.substring(0, 5);
};

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


    const [openGroupKey, setOpenGroupKey] = useState<string | null>(null);

    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
            return null;
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Hàm fetch dữ liệu
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        const authHeaders = getAuthHeaders();
        if (!authHeaders) return;

        try {
            const [schedulesResponse, doctorsResponse] = await Promise.all([
                fetch(SCHEDULES_API, { headers: authHeaders }),
                fetch(DOCTORS_API, { headers: authHeaders })
            ]);

            if (!schedulesResponse.ok) throw new Error(`Lỗi tải lịch: ${schedulesResponse.statusText}`);
            if (!doctorsResponse.ok) throw new Error(`Lỗi tải bác sĩ: ${doctorsResponse.statusText}`);

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
        const authHeaders = getAuthHeaders();
        if (!authHeaders) {
            alert('Lỗi xác thực, vui lòng đăng nhập lại.');
            return;
        }

        try {
            const response = await fetch(SCHEDULES_API, {
                method: 'POST',
                headers: authHeaders,
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

        } catch (error) {
            console.error('Lỗi khi thêm lịch:', error);
            alert(`Không thể thêm lịch: ${error instanceof Error ? error.message : String(error)}`);

            throw error;
        }
    };

    // --- HÀM XỬ LÝ XÓA LỊCH ---
    const handleDeleteSchedule = async (scheduleId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa lịch làm việc này?')) {
            return;
        }

        const authHeaders = getAuthHeaders();
        if (!authHeaders) {
            alert('Lỗi xác thực, vui lòng đăng nhập lại.');
            return;
        }

        try {
            const response = await fetch(`${SCHEDULES_API}/${scheduleId}`, {
                method: 'DELETE',
                headers: authHeaders
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (response.status === 409) {
                    throw new Error(errorData.error || 'Lịch này đã có hẹn, không thể xóa.');
                }
                throw new Error(errorData.error || 'Không thể xóa lịch');
            }


            setSchedules(prevSchedules => prevSchedules.filter(s => s.id !== scheduleId));
            alert('Đã xóa lịch làm việc thành công.');


            setOpenGroupKey(null);
            setSelectedScheduleId(null);

        } catch (error) {
            console.error('Lỗi khi xóa lịch:', error);
            alert(`Không thể xóa lịch: ${error instanceof Error ? error.message : String(error)}`);
        }
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
                        const dayString = day.toISOString().split('T')[0];

                        const daySchedules = schedules
                            .filter(s => new Date(s.workDate).toDateString() === day.toDateString())
                            .sort((a, b) => a.startTime.localeCompare(b.startTime));

                        const groupedSchedules = daySchedules.reduce((acc, schedule) => {

                            const timeKey = `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`;
                            if (!acc[timeKey]) {
                                acc[timeKey] = [];
                            }
                            acc[timeKey].push(schedule);
                            return acc;
                        }, {} as Record<string, Schedule[]>);


                        return (
                            <div key={dayString} className="sm-calendar-day">
                                {Object.entries(groupedSchedules).map(([timeKey, schedulesInGroup]) => {


                                    const groupKey = `${dayString}_${timeKey}`;
                                    const isGroupOpen = openGroupKey === groupKey;


                                    if (schedulesInGroup.length > 1) {
                                        return (
                                            <div key={groupKey} className="sm-schedule-item-wrapper">
                                                <div
                                                    className="sm-schedule-item"
                                                    onClick={() => setOpenGroupKey(isGroupOpen ? null : groupKey)} // Toggle
                                                    style={{ cursor: 'pointer', backgroundColor: '#fed7aa' }}
                                                >
                                                    <p className="sm-schedule-doctor">Nhiều bác sĩ ({schedulesInGroup.length})</p>
                                                    <p className="sm-schedule-time">{timeKey}</p>
                                                </div>


                                                {isGroupOpen && (
                                                    <div className="sm-group-popup">
                                                        <div className="sm-group-popup-header">
                                                            <h4>Ca {timeKey}</h4>
                                                            <button
                                                                onClick={() => setOpenGroupKey(null)}
                                                                className="sm-group-popup-close"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                        <div className="sm-group-popup-list">
                                                            {schedulesInGroup.map(sch => (
                                                                <div key={sch.id} className="sm-group-popup-item">
                                                                    <span>{sch.doctor?.name || 'Không rõ'}</span>
                                                                    <button
                                                                        className="sm-delete-btn"
                                                                        onClick={() => handleDeleteSchedule(sch.id)}
                                                                    >
                                                                        Xóa
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    }

                                    // 
                                    const schedule = schedulesInGroup[0];
                                    const isSelected = selectedScheduleId === schedule.id;

                                    return (
                                        <div key={schedule.id} className="sm-schedule-item-wrapper">
                                            <div
                                                className="sm-schedule-item"
                                                onClick={() => setSelectedScheduleId(isSelected ? null : schedule.id)} // Toggle
                                            >

                                                {isSelected && (
                                                    <button
                                                        className="sm-delete-btn sm-delete-btn-single"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteSchedule(schedule.id);
                                                        }}
                                                    >
                                                        Xóa
                                                    </button>
                                                )}


                                                <p className="sm-schedule-doctor">{schedule.doctor?.name || 'Không rõ'}</p>

                                                <p className="sm-schedule-time">{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</p>
                                            </div>
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