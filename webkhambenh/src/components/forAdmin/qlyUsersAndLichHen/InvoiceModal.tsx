// src/components/appointments/InvoiceModal.tsx
import React, { useState, useMemo } from 'react';
import { Appointment, InvoiceService } from './index';
import { Modal } from './Modal';
import './InvoiceModal.css';

interface InvoiceModalProps {
    appointment: Appointment;
    onClose: () => void;
    onSave: () => void; // Tạm thời onSave không cần truyền data, logic lưu ở component cha
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ appointment, onClose, onSave }) => {
    const [benhLy, setBenhLy] = useState('');
    const [loiKhuyen, setLoiKhuyen] = useState('');
    const [services, setServices] = useState<InvoiceService[]>([{ name: 'Phí khám', price: 300000 }]);
    const total = useMemo(() => services.reduce((sum, service) => sum + service.price, 0), [services]);

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
        if (services.length > 1) {
            setServices(services.filter((_, i) => i !== index));
        }
    };
    return (
        <Modal title={appointment.hasInvoice ? `Sửa hóa đơn cho: ${appointment.ten_benh_nhan}`: `Tạo hóa đơn cho: ${appointment.ten_benh_nhan}`} onClose={onClose}>
            <div className="modal-body">
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
                        <button onClick={onSave} className="modal-button modal-button-success">Lưu Hóa Đơn</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default InvoiceModal;