import React from 'react';
import { Appointment } from './types';
import './PaymentSuccessView.css';

interface PaymentSuccessViewProps {
  appointment: Appointment;
}

export const PaymentSuccessView: React.FC<PaymentSuccessViewProps> = ({ appointment }) => (
  <div className="payment-success">
    <div className="icon">✅</div>
    <h3>Thanh Toán Thành Công!</h3>
    <p>
      Cảm ơn bạn đã hoàn tất thanh toán cho lịch hẹn ngày {appointment.date}.
    </p>
    <div className="transaction-id">
      Mã giao dịch: <strong>{appointment.invoiceCode}</strong>
    </div>
    <button className="btn btn-success" style={{ marginTop: '1rem' }}>
      Tải Hóa Đơn PDF
    </button>
  </div>
);