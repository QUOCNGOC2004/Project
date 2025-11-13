import React from 'react';
import { Appointment } from './types';
import './BankTransferDetails.css';

interface BankTransferDetailsProps {
  appointment: Appointment;
  formatCurrency: (amount: number) => string;
}

export const BankTransferDetails: React.FC<BankTransferDetailsProps> = ({ appointment, formatCurrency }) => {

  const services = appointment.services || [];
  const totalAmount = appointment.totalAmount || 0;
  const invoiceCode = appointment.invoiceCode || 'LỖI_KHÔNG_CÓ_MÃ';

  const BANK_BIN = "970432";
  const ACCOUNT_NUMBER = "0981714085";
  const ACCOUNT_NAME = "Nguyen Quoc Ngoc";

  const encodedMemo = encodeURIComponent(invoiceCode);
  const encodedName = encodeURIComponent(ACCOUNT_NAME);

  const qrUrl = `https://api.vietqr.io/image/${BANK_BIN}-${ACCOUNT_NUMBER}-qr_only.png?amount=${totalAmount}&addInfo=${encodedMemo}&accountName=${encodedName}`;

  return (
    <>
      <div className="invoice-details">
        <h3>Chi tiết chi phí - BN: {appointment.patientName}</h3>
        {services.map((s, i) => (
          <div className="service-item" key={i}>
            <span>{s.name}</span>
            <strong>{formatCurrency(s.price)}</strong>
          </div>
        ))}
        <div className="total-amount">
          <span>Tổng cộng</span>
          <span className="amount">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <div className="bank-transfer-info">
        <h4>Chi tiết hóa đơn</h4>
        <p><strong>Mã hóa đơn:</strong> {invoiceCode}</p>
        <p><><strong>Ngày tạo hóa đơn:</strong> {appointment.invoiceCreatedAt || 'N/A'}</></p>
      </div>

      <div className="bank-transfer-info">
        <h4>Thông tin phòng khám</h4>
        <p><strong>Tên phòng khám:</strong> Phòng khám Đại học Phenikaa</p>
        <p><strong>Địa chỉ:</strong> Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội</p>
        <p><strong>SĐT:</strong> 0981714085</p>
        <p><strong>Email liên hệ:</strong> phenikaa@gmail.com</p>
      </div>

      <div className="bank-transfer-info">
        <h4>Thông tin chuyển khoản</h4>
        <p><strong>Ngân hàng:</strong> VpBank</p>
        <p><strong>Chủ tài khoản:</strong> Nguyễn Quốc Ngọc</p>
        <p><strong>Số tài khoản:</strong> 0981714085</p>
      </div>

      <div className="payment-qr-code">
        <h4>Quét mã QR để thanh toán</h4>
        <p>Mở ứng dụng ngân hàng của bạn và quét mã dưới đây:</p>
        <div className="qr-image-container">
          <img src={qrUrl} alt="Mã QR thanh toán VietQR" />
        </div>
        <p style={{ fontSize: '0.9rem', color: '#555' }}>
          Số tiền (<strong>{formatCurrency(totalAmount)}</strong>) và nội dung
          (<strong>{invoiceCode}</strong>) sẽ được tự động điền.
        </p>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1rem', color: '#6c757d' }}>
        *Vui lòng thực hiện chuyển khoản trên ứng dụng ngân hàng của bạn. Hệ thống sẽ tự động cập nhật trạng thái sau khi nhận được thanh toán.
      </p>
    </>
  );
};