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

// GHI CHÚ: Tối ưu lại Modal chi tiết bác sĩ để hiển thị đẹp hơn
const DoctorDetailModal: React.FC<{ doctor: Doctor; onClose: () => void; }> = ({ doctor, onClose }) => {
    // Định nghĩa các trường và nhãn hiển thị tương ứng
    const doctorDetails: { key: keyof Doctor; label: string }[] = [
        { key: 'name', label: 'Họ và tên' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Số điện thoại' },
        { key: 'hoc_vi', label: 'Học vị' },
        { key: 'chuc_vu', label: 'Chức vụ' },
        { key: 'chuyen_khoa', label: 'Chuyên khoa' },
        { key: 'co_so_kham', label: 'Cơ sở khám' },
        { key: 'kinh_nghiem', label: 'Kinh nghiệm' },
        { key: 'mo_ta_chuc_vu', label: 'Mô tả' },
    ];

    return (
        <Modal title={`Chi tiết Bác sĩ: ${doctor.hoc_vi} ${doctor.name}`} onClose={onClose}>
            <div className="dm-detail-grid">
                {doctorDetails.map(({ key, label }) => (
                    <React.Fragment key={key}>
                        <strong className="dm-detail-key">{label}:</strong>
                        <span className="dm-detail-value">
                            {key === 'kinh_nghiem' ? `${doctor[key]} năm` : doctor[key]}
                        </span>
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

// GHI CHÚ: Cập nhật DoctorFormModal để khớp với CSDL (Không thay đổi nhiều)
const DoctorFormModal: React.FC<{ doctor: Partial<Doctor> | null; onClose: () => void; onSave: (doctor: Partial<Doctor>) => void }> = ({ doctor, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Doctor>>(doctor || {
        name: '', email: '', phone: '', co_so_kham: '', chuyen_khoa: '', mo_ta_chuc_vu: '', hoc_vi: '', kinh_nghiem: 0, link_anh: '', chuc_vu: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'kinh_nghiem' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const fields: { key: keyof Doctor; label: string; type: string }[] = [
      { key: 'name', label: 'Họ và tên', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Số điện thoại', type: 'text' },
      { key: 'hoc_vi', label: 'Học vị', type: 'text' },
      { key: 'chuc_vu', label: 'Chức vụ', type: 'text' },
      { key: 'chuyen_khoa', label: 'Chuyên khoa', type: 'text' },
      { key: 'co_so_kham', label: 'Cơ sở khám', type: 'text' },
      { key: 'mo_ta_chuc_vu', label: 'Mô tả chức vụ', type: 'text' },
      { key: 'kinh_nghiem', label: 'Kinh nghiệm (năm)', type: 'number' },
      { key: 'link_anh', label: 'Link ảnh', type: 'text' },
    ];
    
    return (
        <Modal title={doctor && doctor.id ? 'Sửa thông tin Bác sĩ' : 'Thêm Bác sĩ mới'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="dm-form-grid">
                    {fields.map(field => (
                        <div key={field.key} className="dm-form-group">
                            <label htmlFor={field.key}>{field.label}</label>
                            <input
                                id={field.key}
                                name={field.key}
                                type={field.type}
                                value={formData[field.key as keyof Doctor] as string || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                </div>
                <div className="dm-modal-actions">
                    <button type="button" onClick={onClose} className="dm-button dm-button-secondary">Hủy</button>
                    <button type="submit" className="dm-button dm-button-success">Lưu</button>
                </div>
            </form>
        </Modal>
    );
};


// --- MAIN COMPONENT ---
const DoctorManagement: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Partial<Doctor> | null>(null);
    const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
    const [error, setError] = useState<string | null>(null);

    // GHI CHÚ: Hàm để lấy token từ localStorage
    const getAuthToken = () => {
        return localStorage.getItem('admin_token'); // Giả sử bạn lưu token với key là 'token'
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${process.env.REACT_APP_API_URL}/doctors`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Gửi token
                }
            }); 
            if (!response.ok) {
                if (response.status === 401) throw new Error('Unauthorized - Vui lòng đăng nhập lại.');
                throw new Error('Không thể tải dữ liệu bác sĩ');
            }
            const data: Doctor[] = await response.json();
            setDoctors(data);
        } catch (err: any) {
            setError(err.message);
            console.error("Lỗi khi fetch bác sĩ:", err);
        }
    };

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

    const handleSave = async (doctorData: Partial<Doctor>) => {
        const method = doctorData.id ? 'PUT' : 'POST';
        const url = doctorData.id ? `${process.env.REACT_APP_API_URL}/doctors/${doctorData.id}` : `${process.env.REACT_APP_API_URL}/doctors`;
        const token = getAuthToken(); // GHI CHÚ: Lấy token

        if (!token) {
            setError("Lỗi xác thực. Vui lòng đăng nhập lại.");
            return;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // GHI CHÚ: Thêm header Authorization vào đây
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(doctorData),
            });
            if (!response.ok) {
                // GHI CHÚ: Bắt lỗi cụ thể từ server
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
            const token = getAuthToken(); // GHI CHÚ: Lấy token
            if (!token) {
                setError("Lỗi xác thực. Vui lòng đăng nhập lại.");
                return;
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/doctors/${id}`, {
                    method: 'DELETE',
                    headers: {
                         // GHI CHÚ: Thêm header Authorization
                        'Authorization': `Bearer ${token}`
                    }
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
                                <td>{doctor.hoc_vi} {doctor.name}</td>
                                <td>{doctor.chuyen_khoa}</td>
                                <td>{doctor.co_so_kham}</td>
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