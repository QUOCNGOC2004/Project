import React, { useState, useEffect } from 'react';
import './DoctorManagement.css';

// --- TYPE DEFINITIONS ---
interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  co_so_kham: string;
  chuyen_khoa: string;
  mo_ta_chuc_vu: string;
  hoc_vi: string;
  kinh_nghiem: number;
  link_anh: string;
  chuc_vu: string;
}

interface DoctorSchedule {
  id: number;
  work_date: string;
  start_time: string;
  end_time: string;
}

const CHUYEN_KHOA_OPTIONS = [
  'Y học bào thai',
  'Ung bướu',
  'Tim mạch',
  'Khoa sản',
  'Nội tổng hợp',
  'Ngoại tổng hợp',
  'Khoa Dược'
];

const CHUC_VU_OPTIONS = [
  'Tổng giám đốc',
  'Phó tổng giám đốc',
  'Giám đốc trung tâm',
  'Phó giám đốc trung tâm',
  'Trưởng Khoa',
  'Phó Trưởng Khoa',
  'Bác sĩ điều trị',
  'Sinh viên thực tập',
  'Không có'
];

const HOC_VI_OPTIONS = [
  'Giáo sư',
  'Phó giáo sư',
  'Tiến sĩ',
  'Bác sĩ chuyên khoa I',
  'Bác sĩ chuyên khoa II',
  'Thạc sĩ',
  'Bác sĩ nội trú',
  'Bác sĩ',
  'Sinh viên thực tập'
];

const Modal: React.FC<{ children: React.ReactNode; title: string; onClose: () => void }> = ({ children, title, onClose }) => (
  <div className="dm-modal-overlay">
    <div className="dm-modal-content">
      <div className="dm-modal-header">
        <h3>{title}</h3>
        <button onClick={onClose} className="dm-modal-close-btn">&times;</button>
      </div>
      <div className="dm-modal-body">
        {children}
      </div>
    </div>
  </div>
);

// Modal lịch làm việc
const ScheduleModal: React.FC<{ doctorName: string; schedules: DoctorSchedule[]; onClose: () => void }> = ({ doctorName, schedules, onClose }) => {
  return (
    <Modal title={`Lịch làm việc - ${doctorName}`} onClose={onClose}>
      {schedules.length === 0 ? (
        <p className="dm-no-data">Chưa có lịch làm việc</p>
      ) : (
        <div className="dm-table-wrapper">
          <table className="dm-table dm-schedule-table">
            <thead>
              <tr>
                <th>Ngày làm việc</th>
                <th>Giờ bắt đầu</th>
                <th>Giờ kết thúc</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td>{new Date(schedule.work_date).toLocaleDateString('vi-VN')}</td>
                  <td>{schedule.start_time}</td>
                  <td>{schedule.end_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="dm-modal-actions">
        <button type="button" onClick={onClose} className="dm-button dm-button-secondary">
          Đóng
        </button>
      </div>
    </Modal>
  );
};

// Modal chi tiết bác sĩ với hiển thị ảnh đẹp mắt
const DoctorDetailModal: React.FC<{ doctor: Doctor; onClose: () => void }> = ({ doctor, onClose }) => {
  return (
    <Modal title="Thông tin chi tiết Bác sĩ" onClose={onClose}>
      <div className="dm-detail-container">
        <div className="dm-detail-image">
          <img 
            src={doctor.link_anh} 
            alt={doctor.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        </div>
        <div className="dm-detail-info">
          <div className="dm-detail-grid">
            <strong>Họ và tên:</strong>
            <span>{doctor.hoc_vi} {doctor.name}</span>
            
            <strong>Email:</strong>
            <span>{doctor.email}</span>
            
            <strong>Số điện thoại:</strong>
            <span>{doctor.phone}</span>
            
            <strong>Học vị:</strong>
            <span>{doctor.hoc_vi}</span>
            
            <strong>Chức vụ:</strong>
            <span>{doctor.chuc_vu}</span>
            
            <strong>Chuyên khoa:</strong>
            <span>{doctor.chuyen_khoa}</span>
            
            <strong>Cơ sở khám:</strong>
            <span>{doctor.co_so_kham}</span>
            
            <strong>Kinh nghiệm:</strong>
            <span>{doctor.kinh_nghiem} năm</span>
            
            <strong>Mô tả:</strong>
            <span>{doctor.mo_ta_chuc_vu}</span>
            
            <strong>Link ảnh:</strong>
            <span className="dm-link-wrap">
              <a href={doctor.link_anh} target="_blank" rel="noopener noreferrer">{doctor.link_anh}</a>
            </span>
          </div>
        </div>
      </div>
      
      <div className="dm-modal-actions">
        <button type="button" onClick={onClose} className="dm-button dm-button-secondary">
          Đóng
        </button>
      </div>
    </Modal>
  );
};

// Modal form thêm/sửa với dropdown
const DoctorFormModal: React.FC<{ 
  doctor: Partial<Doctor> | null; 
  onClose: () => void; 
  onSave: (doctor: Partial<Doctor>) => void 
}> = ({ doctor, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Doctor>>(doctor || {
    name: '', 
    email: '', 
    phone: '', 
    co_so_kham: '', 
    chuyen_khoa: CHUYEN_KHOA_OPTIONS[0], 
    mo_ta_chuc_vu: '', 
    hoc_vi: HOC_VI_OPTIONS[0], 
    kinh_nghiem: 0, 
    link_anh: '', 
    chuc_vu: CHUC_VU_OPTIONS[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'kinh_nghiem' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal title={doctor && doctor.id ? 'Sửa thông tin Bác sĩ' : 'Thêm Bác sĩ mới'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="dm-form-grid">
          <div className="dm-form-group">
            <label htmlFor="name">Họ và tên *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="dm-form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="dm-form-group">
            <label htmlFor="phone">Số điện thoại *</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="dm-form-group">
            <label htmlFor="hoc_vi">Học vị *</label>
            <select
              id="hoc_vi"
              name="hoc_vi"
              value={formData.hoc_vi || ''}
              onChange={handleChange}
              required
            >
              {HOC_VI_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="dm-form-group">
            <label htmlFor="chuc_vu">Chức vụ *</label>
            <select
              id="chuc_vu"
              name="chuc_vu"
              value={formData.chuc_vu || ''}
              onChange={handleChange}
              required
            >
              {CHUC_VU_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="dm-form-group">
            <label htmlFor="chuyen_khoa">Chuyên khoa *</label>
            <select
              id="chuyen_khoa"
              name="chuyen_khoa"
              value={formData.chuyen_khoa || ''}
              onChange={handleChange}
              required
            >
              {CHUYEN_KHOA_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="dm-form-group">
            <label htmlFor="co_so_kham">Cơ sở khám *</label>
            <input
              id="co_so_kham"
              name="co_so_kham"
              type="text"
              value={formData.co_so_kham || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="dm-form-group">
            <label htmlFor="kinh_nghiem">Kinh nghiệm (năm) *</label>
            <input
              id="kinh_nghiem"
              name="kinh_nghiem"
              type="number"
              value={formData.kinh_nghiem || 0}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          
          <div className="dm-form-group dm-full-width">
            <label htmlFor="mo_ta_chuc_vu">Mô tả chức vụ *</label>
            <textarea
              id="mo_ta_chuc_vu"
              name="mo_ta_chuc_vu"
              value={formData.mo_ta_chuc_vu || ''}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>
          
          <div className="dm-form-group dm-full-width">
            <label htmlFor="link_anh">Link ảnh *</label>
            <input
              id="link_anh"
              name="link_anh"
              type="text"
              value={formData.link_anh || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="dm-modal-actions">
          <button type="button" onClick={onClose} className="dm-button dm-button-secondary">
            Hủy
          </button>
          <button type="submit" className="dm-button dm-button-success">
            Lưu
          </button>
        </div>
      </form>
    </Modal>
  );
};

// MAIN COMPONENT
const DoctorManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Partial<Doctor> | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
  const [viewingSchedules, setViewingSchedules] = useState<DoctorSchedule[]>([]);
  const [scheduleDoctorName, setScheduleDoctorName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => localStorage.getItem('admin_token');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/doctors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized');
        throw new Error('Không thể tải dữ liệu bác sĩ');
      }
      const data: Doctor[] = await response.json();
      setDoctors(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchSchedules = async (doctorId: number, doctorName: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/doctors/${doctorId}/schedules`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Không thể tải lịch làm việc');
      const data: DoctorSchedule[] = await response.json();
      setViewingSchedules(data);
      setScheduleDoctorName(doctorName);
      setIsScheduleModalOpen(true);
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  const openFormModal = (doctor: Doctor | null = null) => {
    setEditingDoctor(doctor ? { ...doctor } : null);
    setIsFormModalOpen(true);
  };

  const openDetailModal = (doctor: Doctor) => {
    setViewingDoctor(doctor);
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsFormModalOpen(false);
    setIsDetailModalOpen(false);
    setIsScheduleModalOpen(false);
    setEditingDoctor(null);
    setViewingDoctor(null);
    setViewingSchedules([]);
  };

  const handleSave = async (doctorData: Partial<Doctor>) => {
    const method = doctorData.id ? 'PUT' : 'POST';
    const url = doctorData.id 
      ? `${process.env.REACT_APP_API_URL}/doctors/${doctorData.id}` 
      : `${process.env.REACT_APP_API_URL}/doctors`;
    const token = getAuthToken();

    if (!token) {
      setError("Lỗi xác thực. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(doctorData),
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized');
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lưu thông tin thất bại');
      }
      fetchDoctors();
    } catch (err: any) {
      setError(err.message);
      console.error("Lỗi khi lưu bác sĩ:", err);
    } finally {
      closeModal();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này không?')) {
      const token = getAuthToken();
      if (!token) {
        setError("Lỗi xác thực. Vui lòng đăng nhập lại.");
        return;
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/doctors/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          if (response.status === 401) throw new Error('Unauthorized');
          throw new Error('Xóa bác sĩ thất bại');
        }
        fetchDoctors();
      } catch (err: any) {
        setError(err.message);
        console.error("Lỗi khi xóa bác sĩ:", err);
      }
    }
  };

  if (error) {
    return <div className="dm-container error-message">Lỗi: {error}</div>;
  }

  return (
    <div className="dm-container">
      <div className="dm-header">
        <h2>Quản lý Bác sĩ</h2>
        <button onClick={() => openFormModal()} className="dm-button dm-button-add">
          + Thêm Bác sĩ
        </button>
      </div>
      
      <div className="dm-table-wrapper">
        <table className="dm-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Số điện thoại</th>
              <th>Lịch làm việc</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.id}>
                <td>{doctor.hoc_vi} {doctor.name}</td>
                <td>{doctor.phone}</td>
                <td>
                  <button 
                    onClick={() => fetchSchedules(doctor.id, doctor.name)}
                    className="dm-button dm-button-schedule"
                  >
                    Xem lịch
                  </button>
                </td>
                <td className="dm-table-actions">
                  <button onClick={() => openDetailModal(doctor)} className="dm-action-link dm-link-detail">
                    Chi tiết
                  </button>
                  <button onClick={() => openFormModal(doctor)} className="dm-action-link dm-link-edit">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(doctor.id)} className="dm-action-link dm-link-delete">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isFormModalOpen && (
        <DoctorFormModal 
          doctor={editingDoctor} 
          onClose={closeModal} 
          onSave={handleSave}
        />
      )}
      {isDetailModalOpen && viewingDoctor && (
        <DoctorDetailModal 
          doctor={viewingDoctor} 
          onClose={closeModal} 
        />
      )}
      {isScheduleModalOpen && (
        <ScheduleModal 
          doctorName={scheduleDoctorName}
          schedules={viewingSchedules}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default DoctorManagement;