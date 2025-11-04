import React, { useState, useMemo, useEffect } from 'react';
import { Appointment, Invoice, InvoiceService } from './index';
import { Modal } from './Modal';
import './InvoiceModal.css';

interface InvoiceModalProps {
    appointment: Appointment;
    invoiceToEdit: Invoice | null; 
    isLoading: boolean;
    onClose: () => void;
    onSave: (payload: { 
        benhLy: string, 
        loiKhuyen: string, 
        services: InvoiceService[], 
        total_amount: number 
    }) => void; 
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ appointment, invoiceToEdit, isLoading, onClose, onSave }) => {
    
    // State nội bộ của form
    const [benhLy, setBenhLy] = useState('');
    const [loiKhuyen, setLoiKhuyen] = useState('');
    const [services, setServices] = useState<InvoiceService[]>([{ name: 'Phí khám', price: 300000 }]);
    
    // Tính tổng
    const total = useMemo(() => services.reduce((sum, service) => sum + (service.price || 0), 0), [services]);

    // Tự động điền form nếu là "Sửa Hóa đơn"
    useEffect(() => {
        if (invoiceToEdit && invoiceToEdit.service_details) {
            const details = invoiceToEdit.service_details;
            setBenhLy(details.benhLy || '');
            setLoiKhuyen(details.loiKhuyen || '');
            
            if (details.services && details.services.length > 0) {
                setServices(details.services);
            }
        }
    }, [invoiceToEdit]); // Chạy khi prop invoiceToEdit thay đổi

    const handleServiceChange = (index: number, field: keyof InvoiceService, value: string | number) => {
        const newServices = [...services];
        if (field === 'price') {
            newServices[index][field] = Number(value) || 0;
        } else {
            newServices[index][field] = value as string;
        }
        setServices(newServices);
    };
    const addService = () => {
        setServices([...services, { name: '', price: 0 }]);
    };
    const removeService = (index: number) => {
        if (services.length > 1) { // Chỉ cho xóa nếu còn nhiều hơn 1
            setServices(services.filter((_, i) => i !== index));
        } else {
            alert("Phải có ít nhất một dịch vụ.");
        }
    };
    
    // Xử lý khi nhấn nút Lưu
    const handleSaveClick = () => {
        // Validation cơ bản
        if (services.some(s => !s.name || s.price <= 0)) {
            alert("Tên dịch vụ không được để trống và giá phải lớn hơn 0.");
            return;
        }

        // Tạo payload khớp với yêu cầu của API (InvoiceController.ts)
        const payload = {
            benhLy: benhLy,
            loiKhuyen: loiKhuyen,
            services: services,
            total_amount: total
        };
        
        onSave(payload); // Gửi payload lên component cha
    };

    return (
        <Modal title={appointment.hasInvoice ? `Sửa hóa đơn cho: ${appointment.ten_benh_nhan}`: `Tạo hóa đơn cho: ${appointment.ten_benh_nhan}`} onClose={onClose}>
            <div className="modal-body">
                {isLoading ? (
                    <div className="common-loading">Đang tải dữ liệu hóa đơn...</div>
                ) : (
                    <div className="am-invoice-form">
                        <div className="am-form-group">
                            <label>Bệnh lý sau khi khám</label>
                            <textarea value={benhLy} onChange={(e) => setBenhLy(e.target.value)} rows={3}></textarea>
                        </div>
                        <div className="am-form-group">
                            <label>Lời khuyên của Bác sĩ</label>
                            <textarea value={loiKhuyen} onChange={(e) => setLoiKhuyen(e.target.value)} rows={3}></textarea>
                        </div>
                        <div className="am-form-group">
                            <label>Chi tiết hóa đơn</label>
                            {services.map((service, index) => (
                                <div key={index} className="am-service-item">
                                    <input type="text" placeholder="Tên dịch vụ" value={service.name} onChange={(e) => handleServiceChange(index, 'name', e.target.value)} className="am-service-name"/>
                                    <input type="number" placeholder="Giá" value={service.price} onChange={(e) => handleServiceChange(index, 'price', e.target.value)} className="am-service-price"/>
                                    <button onClick={() => removeService(index)} className="am-remove-btn" disabled={services.length <= 1}>-</button>
                                </div>
                            ))}
                            <button onClick={addService} className="am-add-service-btn">+ Thêm dịch vụ</button>
                        </div>
                        <div className="am-invoice-total">
                            Tổng cộng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                        </div>
                        <div className="modal-actions">
                            <button type="button" onClick={onClose} className="modal-button modal-button-secondary">Hủy</button>
                            <button onClick={handleSaveClick} className="modal-button modal-button-success">Lưu Hóa Đơn</button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default InvoiceModal;