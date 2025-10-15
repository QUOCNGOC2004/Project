import React, { useState } from 'react';
import './DoctorManagement.css';

// --- TYPE DEFINITIONS ---
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

// --- MOCK DATA ---
const MOCK_DOCTORS: Doctor[] = [
  { id: 1, name: 'PGS.TS. BS Nguyễn Thanh Hồi', email: 'hoi.nt@phenikaa-uni.edu.vn', phone: '0901234567', coSoKham: 'Bệnh viện Đại học Phenikaa', chuyenKhoa: 'Tim mạch', moTaChucVu: 'Tổng Giám đốc Bệnh viện', hocVi: 'Tiến sĩ', kinhNghiem: 20, linkAnh: 'https://placehold.co/100x100/E65103/white?text=BS', chucVu: 'Tổng giám đốc' },
  { id: 2, name: 'GS.TS. BS. Đỗ Quyết', email: 'quyet.d@phenikaa-uni.edu.vn', phone: '0987654321', coSoKham: 'Phòng khám Đa khoa', chuyenKhoa: 'Nội tổng hợp', moTaChucVu: 'Phó Tổng Giám Đốc', hocVi: 'Giáo sư', kinhNghiem: 25, linkAnh: 'https://placehold.co/100x100/E65103/white?text=BS', chucVu: 'Phó tổng giám đốc' },
  { id: 3, name: 'BSNT. Lê Thị Hương', email: 'huong.lt@phenikaa-uni.edu.vn', phone: '0911223344', coSoKham: 'Bệnh viện Đại học Phenikaa', chuyenKhoa: 'Khoa sản', moTaChucVu: 'Trưởng khoa Sản', hocVi: 'Bác sĩ nội trú', kinhNghiem: 12, linkAnh: 'https://placehold.co/100x100/E65103/white?text=BS', chucVu: 'Trưởng Khoa' },
];

// --- UTILITY COMPONENTS ---
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

// --- SUB COMPONENTS ---
const DoctorDetailModal: React.FC<{ doctor: Doctor; onClose: () => void; }> = ({ doctor, onClose }) => {
    return (
        <Modal title={`Chi tiết Bác sĩ: ${doctor.hocVi} ${doctor.name}`} onClose={onClose}>
            <div className="dm-detail-grid">
                {Object.entries(doctor).map(([key, value]) => (
                    <React.Fragment key={key}>
                        <strong className="dm-detail-key">{key.replace(/([A-Z])/g, ' $1')}:</strong>
                        <span className="dm-detail-value">{value}</span>
                    </React.Fragment>
                ))}
            </div>
             <div className="dm-modal-actions">
                <button type="button" onClick={onClose} className="dm-button dm-button-secondary">
                    Đóng
                </button>
            </div>
        </Modal>
    );
};

const DoctorFormModal: React.FC<{ doctor: Doctor | null; onClose: () => void; onSave: (doctor: Doctor) => void }> = ({ doctor, onClose, onSave }) => {
    const [formData, setFormData] = useState<Doctor>(doctor || {
        id: 0, name: '', email: '', phone: '', coSoKham: '', chuyenKhoa: '', moTaChucVu: '', hocVi: '', kinhNghiem: 0, linkAnh: '', chucVu: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'kinhNghiem' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const fields: (keyof Doctor)[] = ['name', 'email', 'phone', 'coSoKham', 'chuyenKhoa', 'moTaChucVu', 'hocVi', 'kinhNghiem', 'linkAnh', 'chucVu'];
    
    return (
        <Modal title={doctor ? 'Sửa thông tin Bác sĩ' : 'Thêm Bác sĩ mới'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="dm-form-grid">
                    {fields.map(field => (
                        <div key={field} className="dm-form-group">
                            <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</label>
                            <input
                                id={field}
                                name={field}
                                type={field === 'kinhNghiem' ? 'number' : 'text'}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
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


// --- MAIN COMPONENT ---
const DoctorManagement: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);

    const openFormModal = (doctor: Doctor | null = null) => {
        setEditingDoctor(doctor ? { ...doctor } : null);
        setIsFormModalOpen(true);
    };
    
    const openDetailModal = (doctor: Doctor) => {
        setViewingDoctor(doctor);
        setIsDetailModalOpen(true);
    }

    const closeModal = () => {
        setIsFormModalOpen(false);
        setIsDetailModalOpen(false);
        setEditingDoctor(null);
        setViewingDoctor(null);
    };

    const handleSave = (doctorData: Doctor) => {
        if (editingDoctor) {
            setDoctors(doctors.map(d => d.id === doctorData.id ? doctorData : d));
        } else {
            const newDoctor = { ...doctorData, id: Date.now() }; // Simple ID generation
            setDoctors([...doctors, newDoctor]);
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này không?')) {
            setDoctors(doctors.filter(d => d.id !== id));
        }
    };

    return (
        <div className="dm-container">
            <div className="dm-header">
                <h2>Quản lý Bác sĩ</h2>
                <button onClick={() => openFormModal()} className="dm-button dm-button-add">
                    Thêm Bác sĩ
                </button>
            </div>
            <div className="dm-table-wrapper">
                <table className="dm-table">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Chuyên khoa</th>
                            <th>Cơ sở khám</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map(doctor => (
                            <tr key={doctor.id}>
                                <td>{doctor.hocVi} {doctor.name}</td>
                                <td>{doctor.chuyenKhoa}</td>
                                <td>{doctor.coSoKham}</td>
                                <td className="dm-table-actions">
                                    <button onClick={() => openDetailModal(doctor)} className="dm-action-link dm-link-detail">Chi tiết</button>
                                    <button onClick={() => openFormModal(doctor)} className="dm-action-link dm-link-edit">Sửa</button>
                                    <button onClick={() => handleDelete(doctor.id)} className="dm-action-link dm-link-delete">Xóa</button>
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
        </div>
    );
};

export default DoctorManagement;
