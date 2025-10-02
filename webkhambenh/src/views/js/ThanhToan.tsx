import React, { useState } from 'react';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';
import '../css/ThanhToan.css';

interface Service {
  name: string;
  price: number;
}

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: 'chua-thanh-toan' | 'da-thanh-toan';
  services: Service[];
  totalAmount: number;
  transactionId?: string;
  paymentDate?: string;
}

// Dữ liệu giả định ban đầu
const initialAppointments: Appointment[] = [
  {
    id: 'TXN1001',
    patientName: 'Nguyễn Văn An',
    doctorName: 'BS. Trần Thị B',
    date: '2025-09-28',
    status: 'chua-thanh-toan',
    services: [
      { name: 'Phí khám tổng quát', price: 300000 },
      { name: 'Xét nghiệm máu', price: 250000 },
      { name: 'Thuốc A', price: 150000 }
    ],
    totalAmount: 700000,
  },
  {
    id: 'TXN1002',
    patientName: 'Lê Thị Cẩm',
    doctorName: 'BS. Phạm Văn D',
    date: '2025-09-27',
    status: 'da-thanh-toan',
    transactionId: 'PAY20250927XYZ',
    paymentDate: '2025-09-27 15:30:00',
    services: [
      { name: 'Phí khám chuyên khoa', price: 500000 },
      { name: 'Siêu âm ổ bụng', price: 450000 }
    ],
    totalAmount: 950000,
  },
  {
    id: 'TXN1003',
    patientName: 'Hoàng Minh Khang',
    doctorName: 'BS. Trần Thị B',
    date: '2025-09-26',
    status: 'chua-thanh-toan',
    services: [
      { name: 'Phí tái khám', price: 150000 },
      { name: 'Đo điện tim', price: 200000 },
      { name: 'Thuốc B và C', price: 450000 }
    ],
    totalAmount: 800000,
  }
];

// Hàm tiện ích định dạng tiền tệ
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const ThanhToan: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const selectedAppointment = appointments.find(a => a.id === selectedAppointmentId);

  // Xử lý khi chọn một lịch hẹn
  const handleSelectAppointment = (id: string) => {
    setSelectedAppointmentId(id);
  };

  // Xử lý thanh toán (giả lập)
  const handlePaymentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!selectedAppointment || selectedAppointment.status === 'da-thanh-toan') return;

    setIsProcessing(true);

    // Giả lập cuộc gọi API
    setTimeout(() => {
      const updatedAppointments = appointments.map(appt => {
        if (appt.id === selectedAppointmentId) {
          return {
            ...appt,
            status: 'da-thanh-toan' as const,
            transactionId: `PAY${new Date().getTime()}`,
            paymentDate: new Date().toLocaleString('vi-VN'),
          };
        }
        return appt;
      });
      
      setAppointments(updatedAppointments);
      setIsProcessing(false);
    }, 1500);
  };

  // Sub-component: Hiển thị chi tiết thanh toán và form
  const PaymentDetails: React.FC = () => {
    if (!selectedAppointment) {
      return (
        <div className="empty-state">
          <p className="empty-state-title">Vui lòng chọn một lịch hẹn để xem chi tiết</p>
          <p className="empty-state-subtitle">Chi tiết thanh toán sẽ hiển thị tại đây.</p>
        </div>
      );
    }

    // View thành công
    if (selectedAppointment.status === 'da-thanh-toan') {
      return (
        <div className="payment-success">
          <CheckCircle className="success-icon" />
          <h3 className="success-title">Thanh Toán Thành Công!</h3>
          <p className="success-message">
            Cảm ơn bạn đã hoàn tất thanh toán cho lịch hẹn ngày <strong>{selectedAppointment.date}</strong>.
          </p>
          <div className="transaction-id">
            Mã giao dịch: <strong>{selectedAppointment.transactionId}</strong>
          </div>
          <p className="payment-date">Thanh toán vào lúc: {selectedAppointment.paymentDate}</p>
          <button 
            className="download-btn"
            onClick={() => console.log('Tải hóa đơn PDF')}
          >
            Tải Hóa Đơn PDF
          </button>
        </div>
      );
    }

    // View chờ thanh toán (Form)
    return (
      <div>
        {/* Chi tiết hóa đơn */}
        <div className="invoice-details">
          <h3 className="invoice-title">Chi tiết chi phí - Bệnh nhân: {selectedAppointment.patientName}</h3>
          
          {selectedAppointment.services.map((service, index) => (
            <div key={index} className="service-item">
              <span>{service.name}</span>
              <strong>{formatCurrency(service.price)}</strong>
            </div>
          ))}

          <div className="total-amount">
            <span>Tổng cộng</span>
            <span className="total-price">{formatCurrency(selectedAppointment.totalAmount)}</span>
          </div>
        </div>

        {/* Form thanh toán */}
        <form className="payment-form" onSubmit={handlePaymentSubmit}>
          <h3 className="form-title">Thông tin thanh toán</h3>
          
          <div className="form-group">
            <label htmlFor="payment-method">Phương thức thanh toán</label>
            <select id="payment-method" name="payment-method">
              <option value="credit-card">Thẻ Tín dụng / Ghi nợ</option>
              <option value="bank-transfer">Chuyển khoản ngân hàng</option>
              <option value="e-wallet">Ví điện tử</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="card-holder">Tên chủ thẻ</label>
            <input 
              type="text" 
              id="card-holder" 
              name="card-holder" 
              defaultValue={selectedAppointment.patientName} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="card-number">Số thẻ</label>
            <input 
              type="text" 
              id="card-number" 
              name="card-number" 
              placeholder="0000 0000 0000 0000" 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiry-date">Ngày hết hạn</label>
              <input 
                type="text" 
                id="expiry-date" 
                name="expiry-date" 
                placeholder="MM/YY" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input 
                type="text" 
                id="cvv" 
                name="cvv" 
                placeholder="123" 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Clock className="btn-icon spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <CreditCard className="btn-icon" />
                Thanh toán {formatCurrency(selectedAppointment.totalAmount)}
              </>
            )}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="payment-container">
        
        {/* Cột trái: Danh sách lịch hẹn */}
        <div className="appointment-list">
          <h2 className="section-title">Danh sách thanh toán</h2>
          <ul className="appointment-items">
            {appointments
              .filter(appt => appt.status === 'chua-thanh-toan' || appt.status === 'da-thanh-toan')
              .map(appointment => {
                const isActive = appointment.id === selectedAppointmentId;
                const statusText = appointment.status === 'chua-thanh-toan' ? 'Chưa thanh toán' : 'Đã thanh toán';
                const statusClass = appointment.status === 'chua-thanh-toan' ? 'pending' : 'paid';

                return (
                  <li 
                    key={appointment.id} 
                    className={`appointment-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectAppointment(appointment.id)}
                  >
                    <div className="patient-name">{appointment.patientName}</div>
                    <div className="appointment-info">Ngày khám: {appointment.date}</div>
                    <div className="appointment-info">Bác sĩ: {appointment.doctorName}</div>
                    <span className={`status-badge ${statusClass}`}>{statusText}</span>
                  </li>
                );
              })}
          </ul>
        </div>

        {/* Cột phải: Chi tiết thanh toán */}
        <div className="payment-details">
          <h2 className="section-title">Chi tiết thanh toán</h2>
          <div id="details-content">
            <PaymentDetails />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanhToan;