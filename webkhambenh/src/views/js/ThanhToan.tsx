import React, { useState, useMemo, FC, SVGProps } from 'react';
import '../css/ThanhToan.css';


export interface Service {
  name: string;
  price: number;
}

export interface Appointment {
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


const CalendarIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckCircleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const initialAppointments: Appointment[] = [
  {
    id: 'TXN1001',
    patientName: 'Nguyễn Văn An',
    doctorName: 'BS. Trần Thị B',
    date: '2025-10-28',
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
    date: '2025-10-27',
    status: 'da-thanh-toan',
    transactionId: 'PAY20251027XYZ',
    paymentDate: '27/10/2025 15:30:00',
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
    date: '2025-10-26',
    status: 'chua-thanh-toan',
    services: [
      { name: 'Phí tái khám', price: 150000 },
      { name: 'Đo điện tim', price: 200000 },
      { name: 'Thuốc B và C', price: 450000 }
    ],
    totalAmount: 800000,
  }
];


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};



const AppointmentListItem: FC<{
  appointment: Appointment;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ appointment, isSelected, onSelect }) => {
  const isUnpaid = appointment.status === 'chua-thanh-toan';

  return (
    <div
      onClick={() => onSelect(appointment.id)}
      className={`appointment-list-item ${isSelected ? 'appointment-list-item--selected' : ''}`}
    >
      <div className="appointment-list-item-header">
        <span className="appointment-list-item-patient">{appointment.patientName}</span>
        <span className={`appointment-status-badge ${isUnpaid ? 'appointment-status-badge--unpaid' : 'appointment-status-badge--paid'}`}>
          {isUnpaid ? 'Chờ thanh toán' : 'Đã trả'}
        </span>
      </div>
      <div className="appointment-list-item-details">
        <p className="appointment-list-item-doctor">BS. {appointment.doctorName}</p>
        <div className="appointment-list-item-date">
          <CalendarIcon className="calendar-icon" />
          <span>{appointment.date}</span>
        </div>
      </div>
    </div>
  );
};

// Component con: Chi tiết thanh toán và form
const PaymentDetails: FC<{
  appointment: Appointment | null;
  onPaymentSuccess: (id: string) => void;
}> = ({ appointment, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!appointment) {
    return (
      <div className="payment-details-empty">
        <div className="payment-details-empty-text">
          <p>Vui lòng chọn một hóa đơn để xem chi tiết.</p>
        </div>
      </div>
    );
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onPaymentSuccess(appointment.id);
      setIsProcessing(false);
    }, 1500); // Mô phỏng API call
  }

  // View khi đã thanh toán thành công
  if (appointment.status === 'da-thanh-toan') {
    return (
      <div className="payment-success animate-fade-in">
        <div className="payment-success-header">
          <CheckCircleIcon className="check-circle-icon" />
          <h3 className="payment-success-title">Thanh Toán Thành Công</h3>
          <p className="payment-success-subtitle">Cảm ơn bạn đã hoàn tất thanh toán.</p>
        </div>
        <div className="payment-success-details">
          <div className="payment-success-row">
            <span className="payment-success-label">Mã giao dịch:</span>
            <span className="payment-success-value">{appointment.transactionId}</span>
          </div>
          <div className="payment-success-row">
            <span className="payment-success-label">Bệnh nhân:</span>
            <span className="payment-success-value">{appointment.patientName}</span>
          </div>
          <div className="payment-success-row">
            <span className="payment-success-label">Ngày thanh toán:</span>
            <span className="payment-success-value">{appointment.paymentDate}</span>
          </div>
          <div className="payment-success-total">
            <span className="payment-success-total-label">TỔNG CỘNG:</span>
            <span className="payment-success-total-value orange-text">{formatCurrency(appointment.totalAmount)}</span>
          </div>
        </div>
        <button className="payment-success-download-btn">Tải Hóa Đơn (PDF)</button>
      </div>
    )
  }

  // View form thanh toán
  return (
    <div className="payment-form animate-fade-in">
      <h3 className="payment-form-title">Chi Tiết Hóa Đơn</h3>
      <p className="payment-form-patient">Bệnh nhân: {appointment.patientName}</p>
      <div className="payment-form-services">
        {appointment.services.map((service, index) => (
          <div key={index} className="payment-form-service-row">
            <span>{service.name}</span>
            <span className="payment-form-service-price">{formatCurrency(service.price)}</span>
          </div>
        ))}
      </div>
      <div className="payment-form-total-row">
        <span className="payment-form-total-label">Tổng cộng</span>
        <span className="payment-form-total-value orange-text">{formatCurrency(appointment.totalAmount)}</span>
      </div>

      <form onSubmit={handlePaymentSubmit} className="payment-form-container">
        <div className="payment-form-fields">
          <div className="payment-form-field">
            <label htmlFor="card-holder" className="payment-form-label">Tên chủ thẻ</label>
            <input type="text" id="card-holder" defaultValue={appointment.patientName} className="payment-form-input" />
          </div>
          <div className="payment-form-field">
            <label htmlFor="card-number" className="payment-form-label">Số thẻ</label>
            <input type="text" id="card-number" placeholder="0000 0000 0000 0000" className="payment-form-input" />
          </div>
          <div className="payment-form-field-row">
            <div className="payment-form-field-half">
              <label htmlFor="expiry-date" className="payment-form-label">Ngày hết hạn</label>
              <input type="text" id="expiry-date" placeholder="MM/YY" className="payment-form-input" />
            </div>
            <div className="payment-form-field-half">
              <label htmlFor="cvv" className="payment-form-label">CVV</label>
              <input type="text" id="cvv" placeholder="123" className="payment-form-input" />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isProcessing}
          className={`payment-form-submit-btn ${isProcessing ? 'payment-form-submit-btn--disabled' : 'orange-button'}`}
        >
          {isProcessing ? 'Đang xử lý...' : `Thanh toán ${formatCurrency(appointment.totalAmount)}`}
        </button>
      </form>
    </div>
  );
};



export default function ThanhToan() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const { unpaid, paid } = useMemo(() => ({
    unpaid: appointments.filter(a => a.status === 'chua-thanh-toan'),
    paid: appointments.filter(a => a.status === 'da-thanh-toan')
  }), [appointments]);

  const handlePaymentSuccess = (id: string) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === id ? {
          ...app,
          status: 'da-thanh-toan',
          transactionId: `PAY${new Date().getTime()}`,
          paymentDate: new Date().toLocaleString('vi-VN'),
        } : app
      )
    );
  }

  const selectedAppointment = appointments.find(a => a.id === selectedAppointmentId) || null;

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">Quản lý Thanh toán</h1>
        <div className="main-grid">

          {/* Left Column: Appointment List */}
          <div className="appointment-list-section">
            <div className="section-header">
              <h2 className="section-title">Chờ thanh toán ({unpaid.length})</h2>
            </div>
            <div className="appointment-list">
              {unpaid.map(app => (
                <AppointmentListItem key={app.id} appointment={app} isSelected={selectedAppointmentId === app.id} onSelect={setSelectedAppointmentId} />
              ))}
            </div>
            <div className="section-header">
              <h2 className="section-title">Đã hoàn tất ({paid.length})</h2>
            </div>
            <div className="appointment-list">
              {paid.map(app => (
                <AppointmentListItem key={app.id} appointment={app} isSelected={selectedAppointmentId === app.id} onSelect={setSelectedAppointmentId} />
              ))}
            </div>
          </div>

          {/* Right Column: Payment Details */}
          <div className="payment-details-section">
            <PaymentDetails appointment={selectedAppointment} onPaymentSuccess={handlePaymentSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}