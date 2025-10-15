import React, { useState } from 'react';
import './ThanhToan.css';

// --- Định nghĩa kiểu dữ liệu ---
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

// --- Dữ liệu mẫu ---
const mockAppointments: Appointment[] = [
  {
    id: 'TXN1001',
    patientName: 'Nguyễn Văn An',
    doctorName: 'BS. Trần Thị B',
    date: '2025-09-28',
    status: 'chua-thanh-toan',
    services: [
      { name: 'Phí khám tổng quát', price: 300000 },
      { name: 'Xét nghiệm máu', price: 250000 },
      { name: 'Thuốc A', price: 150000 },
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
      { name: 'Siêu âm ổ bụng', price: 450000 },
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
      { name: 'Thuốc B và C', price: 450000 },
    ],
    totalAmount: 800000,
  },
];

// --- Component con ---
const PaymentSuccessView: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
  <div className="payment-success">
    <div className="icon">✅</div>
    <h3>Thanh Toán Thành Công!</h3>
    <p>
      Cảm ơn bạn đã hoàn tất thanh toán cho lịch hẹn ngày {appointment.date}.
    </p>
    <div className="transaction-id">
      Mã giao dịch: <strong>{appointment.transactionId}</strong>
    </div>
    <p>Thanh toán vào lúc: {appointment.paymentDate}</p>
    <button className="btn btn-success" style={{ marginTop: '1rem' }}>
      Tải Hóa Đơn PDF
    </button>
  </div>
);

const PaymentForm: React.FC<{
  appointment: Appointment;
  onSubmit: (id: string) => void;
  isProcessing: boolean;
  formatCurrency: (amount: number) => string;
}> = ({ appointment, onSubmit, isProcessing, formatCurrency }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(appointment.id);
  };

  return (
    <>
      <div className="invoice-details">
        <h3>Chi tiết chi phí - BN: {appointment.patientName}</h3>
        {appointment.services.map((s, i) => (
          <div className="service-item" key={i}>
            <span>{s.name}</span>
            <strong>{formatCurrency(s.price)}</strong>
          </div>
        ))}
        <div className="total-amount">
          <span>Tổng cộng</span>
          <span className="amount">{formatCurrency(appointment.totalAmount)}</span>
        </div>
      </div>

      <form className="payment-form" onSubmit={handleSubmit}>
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
            defaultValue={appointment.patientName}
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
        <div className="card-details">
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="expiry-date">Ngày hết hạn</label>
            <input type="text" id="expiry-date" placeholder="MM/YY" required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="cvv">CVV</label>
            <input type="text" id="cvv" placeholder="123" required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isProcessing}>
          {isProcessing
            ? 'Đang xử lý...'
            : `Thanh toán ${formatCurrency(appointment.totalAmount)}`}
        </button>
      </form>
    </>
  );
};

// --- Component chính ---
const ThanhToan: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const handlePaymentSubmit = (id: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated = appointments.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'da-thanh-toan' as const,
              transactionId: `PAY${Date.now()}`,
              paymentDate: new Date().toLocaleString('vi-VN'),
            }
          : a
      );
      setAppointments(updated);
      setIsProcessing(false);
    }, 1500);
  };

  const selected = appointments.find((a) => a.id === selectedAppointmentId);

  return (
    <div className="payment-page-wrapper">
      <div className="payment-container">
        <div className="appointment-list">
          <h2>Danh sách thanh toán</h2>
          <ul id="appointments-ul">
            {appointments.map((a) => (
              <li
                key={a.id}
                className={`appointment-item ${
                  selectedAppointmentId === a.id ? 'active' : ''
                }`}
                onClick={() => setSelectedAppointmentId(a.id)}
              >
                <div className="appointment-price">{formatCurrency(a.totalAmount)}</div>
                <div className="appointment-info">Ngày khám: {a.date}</div>
                <div className="appointment-info">Bác sĩ: {a.doctorName}</div>
                <span className={`status-badge status-${a.status}`}>
                  {a.status === 'chua-thanh-toan' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="payment-details">
          <h2>Chi tiết thanh toán</h2>
          {!selected ? (
            <div className="placeholder">
              <p>Vui lòng chọn một lịch hẹn để xem chi tiết</p>
            </div>
          ) : selected.status === 'da-thanh-toan' ? (
            <PaymentSuccessView appointment={selected} />
          ) : (
            <PaymentForm
              appointment={selected}
              onSubmit={handlePaymentSubmit}
              isProcessing={isProcessing}
              formatCurrency={formatCurrency}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThanhToan;
