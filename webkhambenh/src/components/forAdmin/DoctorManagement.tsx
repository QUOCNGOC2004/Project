import React, { useState, useEffect } from 'react';
import './DoctorManagement.css';


interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  coSoKham: string;
  chuyenKhoa: string;
  moTaChucVu: string;
  hocVi: string;
  kinhNghiem: number;
  linkAnh: string;
  chucVu: string;
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


const DoctorDetailModal: React.FC<{ doctor: Doctor; onClose: () => void }> = ({ doctor, onClose }) => {
  return (
    <Modal title="Thông tin chi tiết Bác sĩ" onClose={onClose}>
      <div className="dm-detail-container">
        <div className="dm-detail-image">
          <img 
            src={doctor.linkAnh} 
            alt={doctor.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        </div>
        <div className="dm-detail-info">
          <div className="dm-detail-grid">
            <strong>Họ và tên:</strong>
            <span>{doctor.hocVi} {doctor.name}</span>
            
            <strong>Email:</strong>
            <span>{doctor.email}</span>
            
            <strong>Số điện thoại:</strong>
            <span>{doctor.phone}</span>
            
            <strong>Học vị:</strong>
            <span>{doctor.hocVi}</span>
            
            <strong>Chức vụ:</strong>
            <span>{doctor.chucVu}</span>
            
            <strong>Chuyên khoa:</strong>
            <span>{doctor.chuyenKhoa}</span>
            
            <strong>Cơ sở khám:</strong>
            <span>{doctor.coSoKham}</span>
            
            <strong>Kinh nghiệm:</strong>
            <span>{doctor.kinhNghiem} năm</span>
            
            <strong>Mô tả:</strong>
            <span>{doctor.moTaChucVu}</span>
            
            <strong>Link ảnh:</strong>
            <span className="dm-link-wrap">
              <a href={doctor.linkAnh} target="_blank" rel="noopener noreferrer">{doctor.linkAnh}</a>
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


const DoctorFormModal: React.FC<{ 
  doctor: Partial<Doctor> | null; 
  onClose: () => void; 
  onSave: (doctor: Partial<Doctor>) => void 
}> = ({ doctor, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Doctor>>(doctor || {
    name: '', 
    email: '', 
    phone: '', 
    coSoKham: '', 
    chuyenKhoa: CHUYEN_KHOA_OPTIONS[0], 
    moTaChucVu: '', 
    hocVi: HOC_VI_OPTIONS[0], 
    kinhNghiem: 0, 
    linkAnh: '', 
    chucVu: CHUC_VU_OPTIONS[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'kinhNghiem' ? parseInt(value) || 0 : value 
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
            <label htmlFor="hocVi">Học vị *</label>
            <select
              id="hocVi"
              name="hocVi"
              value={formData.hocVi || ''}
              onChange={handleChange}
              required
            >
              {HOC_VI_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="dm-form-group">
            <label htmlFor="chucVu">Chức vụ *</label>
            <select
              id="chucVu"
              name="chucVu"
              value={formData.chucVu || ''}
              onChange={handleChange}
              required
            >
              {CHUC_VU_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="dm-form-group">
            <label htmlFor="chuyenKhoa">Chuyên khoa *</label>
            <select
              id="chuyenKhoa"
              name="chuyenKhoa"
              value={formData.chuyenKhoa || ''}
              onChange={handleChange}
              required
            >
              {CHUYEN_KHOA_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="dm-form-group">
            <label htmlFor="coSoKham">Cơ sở khám *</label>
            <input
              id="coSoKham"
              name="coSoKham"
              type="text"
              value={formData.coSoKham || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="dm-form-group">
            <label htmlFor="kinhNghiem">Kinh nghiệm (năm) *</label>
            <input
              id="kinhNghiem"
              name="kinhNghiem"
              type="number"
              value={formData.kinhNghiem || 0}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          
          <div className="dm-form-group dm-full-width">
            <label htmlFor="moTaChucVu">Mô tả chức vụ *</label>
            <textarea
              id="moTaChucVu"
              name="moTaChucVu"
              value={formData.moTaChucVu || ''}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>
          
          <div className="dm-form-group dm-full-width">
            <label htmlFor="linkAnh">Link ảnh *</label>
            <input
              id="linkAnh"
              name="linkAnh"
              type="text"
              value={formData.linkAnh || ''}
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
                <td>{doctor.hocVi} {doctor.name}</td>
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

